#!/usr/bin/env node
/**
 * Seeds Supabase with every country in REST Countries + a Wikipedia
 * "Constitution of <Country>" overview article for each.
 *
 * After running this, every country in the Explorer will be `indexed: true`
 * (i.e. has at least one article) and the AI Assistant's TF-IDF retriever
 * will have ~200 documents to search instead of ~30.
 *
 * Prerequisites:
 *   1. supabase/schema.sql + supabase/seed.sql have been run.
 *   2. You have your Supabase Service Role key (Dashboard → Settings → API).
 *      NEVER commit it; service role bypasses RLS.
 *
 * Usage (PowerShell):
 *   $env:SUPABASE_SERVICE_ROLE_KEY="ey..."; npm run seed:supabase
 *
 * Usage (bash):
 *   SUPABASE_SERVICE_ROLE_KEY=ey... npm run seed:supabase
 */

import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// ---------- Load .env so we can pick up VITE_SUPABASE_URL ----------
try {
  const dotenv = fs.readFileSync('.env', 'utf-8');
  for (const line of dotenv.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) {
      // Strip surrounding quotes if present
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch {
  /* no .env file — fall through */
}

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('\n  Missing credentials.\n');
  console.error('  Need:');
  console.error('    SUPABASE_URL  (or VITE_SUPABASE_URL in .env)');
  console.error('    SUPABASE_SERVICE_ROLE_KEY  (NEVER commit this)\n');
  console.error(
    '  Get the service role key from Supabase Dashboard → Project Settings → API.\n',
  );
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ---------- Region mapping ----------
const MIDEAST_SUBREGIONS = new Set(['Western Asia', 'Middle East']);
const mapRegion = (region, subregion) => {
  if (region === 'Asia' && subregion && MIDEAST_SUBREGIONS.has(subregion)) {
    return 'mideast';
  }
  switch (region) {
    case 'Africa':    return 'africa';
    case 'Asia':      return 'asia';
    case 'Europe':    return 'europe';
    case 'Americas':  return 'americas';
    case 'Oceania':   return 'oceania';
    case 'Antarctic': return 'arctic';
    default:          return 'asia';
  }
};

// ---------- Bundled IDs (don't overwrite their richer text) ----------
const BUNDLED = new Set(['us', 'ng', 'in', 'de', 'za', 'br', 'jp', 'au']);

// ---------- Helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchCountries() {
  const fields =
    'name,cca2,cca3,region,subregion,flag,flags,capital,population,languages';
  const res = await fetch(
    `https://restcountries.com/v3.1/all?fields=${fields}`,
  );
  if (!res.ok) throw new Error(`REST Countries ${res.status}`);
  return await res.json();
}

const WIKI_HEADERS = {
  'User-Agent': 'LexIntell/1.0 (educational; contact via repo)',
  Accept: 'application/json',
};

async function fetchWikipediaSummary(countryName) {
  // Try a few title variants because Wikipedia is inconsistent.
  const variants = [
    `Constitution of ${countryName}`,
    `Constitution of the ${countryName}`,
    `${countryName} Constitution`,
  ];
  for (const title of variants) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\s+/g, '_'))}`,
        { headers: WIKI_HEADERS },
      );
      if (!res.ok) continue;
      const json = await res.json();
      if (json.type === 'standard' && json.extract && json.extract.length > 80) {
        return {
          title: json.title,
          extract: json.extract,
          url: json.content_urls?.desktop?.page ?? '',
        };
      }
    } catch {
      /* try next variant */
    }
  }
  return null;
}

// ---------- Main ----------
async function main() {
  console.log('\nFetching country list from REST Countries…');
  const countries = await fetchCountries();
  console.log(`Got ${countries.length} countries.\n`);

  let inserted = 0;
  let withOverview = 0;
  let skipped = 0;
  let failed = 0;
  let total = 0;

  for (const c of countries) {
    total++;
    const id = c.cca2.toLowerCase();
    const country = c.name.common;
    const region = mapRegion(c.region, c.subregion);

    if (BUNDLED.has(id)) {
      skipped++;
      console.log(
        `[${total}/${countries.length}] ${c.flag} ${country.padEnd(28)} — skipped (bundled)`,
      );
      continue;
    }

    process.stdout.write(
      `[${total}/${countries.length}] ${c.flag} ${country.padEnd(28)} `,
    );

    const wiki = await fetchWikipediaSummary(country);

    const constitutionRow = {
      id,
      country,
      country_code: c.cca2,
      flag: c.flag,
      region,
      title: `Constitution of ${country}`,
      adopted: '',
      summary: wiki ? wiki.extract.slice(0, 480) : '',
    };

    const { error: cErr } = await sb
      .from('constitutions')
      .upsert(constitutionRow);
    if (cErr) {
      console.log(`✗ ${cErr.message}`);
      failed++;
      await sleep(250);
      continue;
    }
    inserted++;

    if (wiki) {
      const articleRow = {
        id: `${id}-overview`,
        constitution_id: id,
        chapter: 'Overview',
        article_number: 'Overview',
        title: 'Constitutional overview',
        content: `${wiki.extract}\n\nSource: ${wiki.url}`,
        ord: 0,
      };
      const { error: aErr } = await sb.from('articles').upsert(articleRow);
      if (aErr) {
        console.log(`profile ✓  article ✗ (${aErr.message})`);
      } else {
        console.log('✓ overview');
        withOverview++;
      }
    } else {
      console.log('— (no Wikipedia article)');
    }

    // Be polite to Wikipedia.
    await sleep(220);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Total countries processed:        ${total}`);
  console.log(`Constitution profiles upserted:   ${inserted}`);
  console.log(`Wikipedia overviews added:        ${withOverview}`);
  console.log(`Skipped (already bundled):        ${skipped}`);
  console.log(`Failed:                           ${failed}`);
  console.log('='.repeat(60));
  console.log(
    '\nThe app will pick these up automatically — no rebuild needed.',
  );
  console.log(
    'Countries with at least one article will show the green "Indexed" badge.\n',
  );
}

main().catch((err) => {
  console.error('\nFatal:', err);
  process.exit(1);
});

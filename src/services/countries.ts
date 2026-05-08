// REST Countries integration — pulls the full sovereign-country catalogue
// (~250 entries) and normalizes it to our Constitution shape so the
// Explorer can list every country, not just the ones with bundled text.
//
// Cached in localStorage for 7 days. Free, no API key.
//
// Docs: https://restcountries.com/

import type { Region } from '../data/constitutions';

interface RestCountry {
  name: { common: string; official: string };
  cca2: string;
  cca3: string;
  region: 'Africa' | 'Asia' | 'Europe' | 'Americas' | 'Oceania' | 'Antarctic' | string;
  subregion?: string;
  flag: string;
  flags: { png: string; svg: string };
  capital?: string[];
  population: number;
  languages?: Record<string, string>;
  independent?: boolean;
}

export interface CountryProfile {
  id: string;
  country: string;
  country_code: string;
  flag: string;
  flag_image_url: string;
  region: Region;
  subregion: string;
  capital: string;
  population: number;
  languages: string[];
}

const CACHE_KEY = 'lex-rest-countries-v2';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const FIELDS = [
  'name',
  'cca2',
  'cca3',
  'region',
  'subregion',
  'flag',
  'flags',
  'capital',
  'population',
  'languages',
  'independent',
].join(',');

const MIDEAST_SUBREGIONS = new Set(['Western Asia', 'Middle East']);

const mapRegion = (region: string, subregion?: string): Region => {
  if (region === 'Asia' && subregion && MIDEAST_SUBREGIONS.has(subregion)) {
    return 'mideast';
  }
  switch (region) {
    case 'Africa':
      return 'africa';
    case 'Asia':
      return 'asia';
    case 'Europe':
      return 'europe';
    case 'Americas':
      return 'americas';
    case 'Oceania':
      return 'oceania';
    case 'Antarctic':
      return 'arctic';
    default:
      return 'asia';
  }
};

const normalize = (c: RestCountry): CountryProfile => ({
  id: c.cca2.toLowerCase(),
  country: c.name.common,
  country_code: c.cca2,
  flag: c.flag,
  flag_image_url: c.flags.svg ?? c.flags.png,
  region: mapRegion(c.region, c.subregion),
  subregion: c.subregion ?? '',
  capital: c.capital?.[0] ?? '',
  population: c.population,
  languages: c.languages ? Object.values(c.languages) : [],
});

const readCache = (): CountryProfile[] | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw) as { ts: number; data: CountryProfile[] };
    if (Date.now() - ts < CACHE_TTL_MS && Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch {
    /* ignore corrupted cache */
  }
  return null;
};

const writeCache = (data: CountryProfile[]) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* quota exceeded — non-fatal */
  }
};

export const fetchAllCountries = async (): Promise<CountryProfile[]> => {
  const cached = readCache();
  if (cached) return cached;

  const url = `https://restcountries.com/v3.1/all?fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`REST Countries ${res.status}`);
  const raw = (await res.json()) as RestCountry[];

  // Include every country REST Countries returns — sovereign states AND
  // dependent territories (Greenland, Hong Kong, French Polynesia, etc.).
  const profiles = raw
    .map(normalize)
    .sort((a, b) => a.country.localeCompare(b.country));

  writeCache(profiles);
  return profiles;
};

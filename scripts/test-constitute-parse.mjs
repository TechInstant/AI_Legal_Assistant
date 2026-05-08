// One-off parse smoke test — fetches one Constitute Project constitution
// and prints what the seed script would write to Supabase. No DB writes.
//
// Usage:
//   node scripts/test-constitute-parse.mjs              # default: Albania_2016
//   node scripts/test-constitute-parse.mjs Brazil_2017  # any cons_id

import { parse as parseHtml } from 'node-html-parser';

const consId = process.argv[2] || 'Albania_2016';
const URL = `https://www.constituteproject.org/service/html?cons_id=${encodeURIComponent(consId)}&lang=en`;

const res = await fetch(URL, {
  headers: {
    'User-Agent': 'LexIntell/1.0 (educational; contact via repo)',
    Accept: 'application/json',
  },
});
if (!res.ok) {
  console.error(`HTTP ${res.status} — is "${consId}" a valid cons_id?`);
  process.exit(1);
}
const json = await res.json();
const html = json.html;
console.log(`Fetched HTML for ${consId}: ${html.length} chars\n`);

// Same parser as seed-supabase.mjs
const root = parseHtml(html);
const articles = [];
let currentChapter = '';
let pendingHeading = null;
let pendingParas = [];
let ord = 0;

function flush() {
  if (pendingHeading && pendingParas.length > 0) {
    const heading = pendingHeading.replace(/\s+/g, ' ').trim();
    const m = heading.match(/^Article\s+([\d.IVXLCMivxlcm]+\w*)\s*[\-—.:]?\s*(.*)$/i);
    const article_number = m ? `Article ${m[1]}` : heading;
    const explicitTitle = m && m[2] && m[2].trim();
    const fallbackTitle = pendingParas[0]
      ? pendingParas[0].split(/[.!?](?:\s|$)/)[0].slice(0, 70).trim()
      : '';
    const title = explicitTitle || fallbackTitle || article_number;
    articles.push({ ord: ord++, chapter: currentChapter || 'General Provisions', article_number, title, content: pendingParas.join('\n\n') });
  }
  pendingHeading = null;
  pendingParas = [];
}
function classOf(node) { return (node.attributes && node.attributes.class) || ''; }
function walk(node) {
  if (!node) return;
  const tag = node.tagName ? node.tagName.toLowerCase() : '';
  if (tag === 'h2') {
    flush();
    const text = (node.text || '').trim();
    currentChapter = text;
    if (/^preamble$/i.test(text)) pendingHeading = 'Preamble';
    return;
  }
  if (tag === 'h3') {
    flush();
    const text = (node.text || '').trim();
    if (/^Article\b/i.test(text)) pendingHeading = text;
    else currentChapter = text;
    return;
  }
  if (tag === 'p' && classOf(node).includes('content')) {
    const t = (node.text || '').trim();
    if (t) pendingParas.push(t);
    return;
  }
  if (node.childNodes) for (const ch of node.childNodes) walk(ch);
}
walk(root);
flush();

console.log(`Parsed ${articles.length} articles.\n`);
console.log('--- First 3 articles ---\n');
for (const a of articles.slice(0, 3)) {
  console.log(`[${a.ord}] ${a.chapter}`);
  console.log(`    ${a.article_number} — ${a.title}`);
  console.log(`    ${a.content.slice(0, 160).replace(/\n+/g, ' ')}${a.content.length > 160 ? '…' : ''}\n`);
}
console.log('--- Last article ---\n');
const last = articles[articles.length - 1];
if (last) {
  console.log(`[${last.ord}] ${last.chapter}`);
  console.log(`    ${last.article_number} — ${last.title}`);
  console.log(`    ${last.content.slice(0, 200).replace(/\n+/g, ' ')}${last.content.length > 200 ? '…' : ''}`);
}

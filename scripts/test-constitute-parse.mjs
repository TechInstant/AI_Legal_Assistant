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
  if (!pendingHeading) { pendingParas = []; return; }
  if (pendingParas.length === 0) {
    currentChapter = pendingHeading.replace(/\s+/g, ' ').trim();
    pendingHeading = null;
    return;
  }
  const heading = pendingHeading.replace(/\s+/g, ' ').trim();
  const m = heading.match(/^(Article|Art\.?|Section|Sec\.?|§)\s*([\d.IVXLCMivxlcm]+\w*)\s*[\-—.:]?\s*(.*)$/i);
  let article_number, explicitTitle = '';
  if (m) {
    const label = m[1].replace(/\.$/, '');
    const canonical = /^art/i.test(label) ? 'Article' : /^sec/i.test(label) ? 'Section' : '§';
    article_number = `${canonical} ${m[2]}`;
    explicitTitle = (m[3] || '').trim();
  } else {
    article_number = heading;
  }
  const firstSent = pendingParas[0] ? pendingParas[0].split(/[.!?](?:\s|$)/)[0].trim() : '';
  let fallbackTitle = firstSent;
  if (firstSent.length > 70) {
    const cut = firstSent.slice(0, 67);
    const lastSpace = cut.lastIndexOf(' ');
    fallbackTitle = (lastSpace > 30 ? cut.slice(0, lastSpace) : cut).trim() + '…';
  }
  const title = explicitTitle || fallbackTitle || article_number;
  articles.push({ ord: ord++, chapter: currentChapter || 'General Provisions', article_number, title, content: pendingParas.join('\n\n') });
  pendingHeading = null;
  pendingParas = [];
}
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
  if (tag === 'h3' || tag === 'h4') {
    flush();
    pendingHeading = (node.text || '').trim();
    return;
  }
  if (tag === 'p') {
    const text = (node.text || '').trim();
    if (!text) return;
    if (/^(\d{1,4}|[IVXLCDM]{1,8})\.?$/.test(text) && text.length <= 8) {
      flush();
      pendingHeading = `Section ${text.replace(/\.$/, '')}`;
      return;
    }
    pendingParas.push(text);
    return;
  }
  if ((tag === 'ol' || tag === 'ul') && pendingHeading) {
    const parentHeading = pendingHeading;
    flush();
    const liChildren = (node.childNodes || []).filter(
      (ch) => ch.tagName?.toLowerCase() === 'li',
    );
    let idx = 0;
    const pm = parentHeading.match(/^(Article|Art\.?|Section|Sec\.?|§)\s*([\d.IVXLCMivxlcm]+\w*)/i);
    const baseLabel = pm ? (/^art/i.test(pm[1]) ? 'Article' : /^sec/i.test(pm[1]) ? 'Section' : '§') : null;
    const baseNum = pm ? pm[2] : null;
    for (const li of liChildren) {
      idx++;
      const style = li.attributes?.style || '';
      const styleMatch = style.match(/list-style-type:\s*['"]([^'"]+)['"]/);
      const label = styleMatch?.[1]?.trim() || String(idx);
      const liText = (li.text || '').trim();
      if (!liText) continue;
      const article_number = baseLabel && baseNum
        ? `${baseLabel} ${baseNum}.${label}`
        : `${parentHeading} (${label})`;
      const firstSent = liText.split(/[.!?](?:\s|$)/)[0].trim();
      let title = firstSent;
      if (firstSent.length > 70) {
        const cut = firstSent.slice(0, 67);
        const lastSpace = cut.lastIndexOf(' ');
        title = (lastSpace > 30 ? cut.slice(0, lastSpace) : cut).trim() + '…';
      }
      articles.push({ ord: ord++, chapter: currentChapter || 'General Provisions', article_number, title: title || article_number, content: liText });
    }
    pendingHeading = null;
    pendingParas = [];
    return;
  }
  if (tag === 'li') {
    const text = (node.text || '').trim();
    if (text) pendingParas.push(text);
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

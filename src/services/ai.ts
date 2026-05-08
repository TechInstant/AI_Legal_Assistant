// Local retrieval-based "Constitutional Intelligence" engine.
// Indexes the bundled corpus with TF-IDF and answers user questions by
// returning the top-matching articles with cited sources. This deliberately
// never invents law — it only quotes from the indexed corpus.

import {
  articles as bundledArticles,
  constitutions as bundledConstitutions,
  type BundledArticle,
  type BundledConstitution,
} from '../data/constitutions';

export interface CitedAnswer {
  reply: string;
  hits: ScoredArticle[];
  confidence: 'high' | 'medium' | 'low';
}

export interface ScoredArticle {
  article: BundledArticle;
  constitution: BundledConstitution;
  score: number;
}

const STOPWORDS = new Set([
  'a','an','the','and','or','but','if','then','of','in','on','at','for','to','from','by','with','as',
  'is','are','was','were','be','been','being','do','does','did','have','has','had','will','would',
  'shall','should','can','could','may','might','must','this','that','these','those','it','its',
  'about','what','which','who','whom','whose','how','why','where','when','say','says','said',
  'i','me','my','we','our','you','your','they','them','their','there','here','than','also','any',
  'all','some','no','not','so','too','very','more','most','such','only','own','same','just',
  'me','please','tell','explain','give','show','want','need','know','question','article','section',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

interface IndexEntry {
  article: BundledArticle;
  constitution: BundledConstitution;
  termFreq: Map<string, number>;
  length: number;
}

let indexCache: {
  entries: IndexEntry[];
  idf: Map<string, number>;
} | null = null;

function buildIndex() {
  if (indexCache) return indexCache;
  const cById = new Map(bundledConstitutions.map((c) => [c.id, c]));
  const entries: IndexEntry[] = bundledArticles.map((a) => {
    const tokens = tokenize(`${a.title} ${a.content} ${a.chapter}`);
    const tf = new Map<string, number>();
    tokens.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
    return {
      article: a,
      constitution: cById.get(a.constitution_id)!,
      termFreq: tf,
      length: tokens.length || 1,
    };
  });

  const df = new Map<string, number>();
  entries.forEach((e) => {
    for (const t of e.termFreq.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  });
  const N = entries.length;
  const idf = new Map<string, number>();
  for (const [term, freq] of df) {
    idf.set(term, Math.log(1 + N / freq));
  }

  indexCache = { entries, idf };
  return indexCache;
}

const COUNTRY_BOOSTS: Array<{ pattern: RegExp; id: string }> = [
  { pattern: /\b(united states|usa|u\.s\.|america|american)\b/i, id: 'us' },
  { pattern: /\bnigeria(n)?\b/i, id: 'ng' },
  { pattern: /\bindia(n)?\b/i, id: 'in' },
  { pattern: /\bgerman(y|an)?\b/i, id: 'de' },
  { pattern: /\bsouth africa(n)?\b/i, id: 'za' },
  { pattern: /\bbrazil(ian)?\b/i, id: 'br' },
  { pattern: /\bjapan(ese)?\b/i, id: 'jp' },
  { pattern: /\baustralia(n)?\b/i, id: 'au' },
];

export function searchCorpus(query: string, k = 4): ScoredArticle[] {
  const { entries, idf } = buildIndex();
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];

  const targetCountry = COUNTRY_BOOSTS.find((c) => c.pattern.test(query))?.id;

  const scored: ScoredArticle[] = entries.map((e) => {
    let score = 0;
    for (const t of qTokens) {
      const tf = e.termFreq.get(t);
      if (!tf) continue;
      score += (tf / e.length) * (idf.get(t) ?? 0);
    }
    if (targetCountry && e.constitution.id === targetCountry) score *= 1.6;
    return { article: e.article, constitution: e.constitution, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

function snippet(text: string, query: string, max = 280): string {
  const qTokens = tokenize(query);
  const lower = text.toLowerCase();
  let bestIdx = -1;
  for (const t of qTokens) {
    const i = lower.indexOf(t);
    if (i !== -1 && (bestIdx === -1 || i < bestIdx)) bestIdx = i;
  }
  if (bestIdx === -1) return text.slice(0, max) + (text.length > max ? '…' : '');
  const start = Math.max(0, bestIdx - 60);
  const end = Math.min(text.length, start + max);
  return (
    (start > 0 ? '…' : '') +
    text.slice(start, end).trim() +
    (end < text.length ? '…' : '')
  );
}

const COMPARE_TRIGGER = /\b(compare|vs|versus|difference|differ)\b/i;

function compareAcrossCountries(query: string): CitedAnswer | null {
  if (!COMPARE_TRIGGER.test(query)) return null;
  const mentioned = COUNTRY_BOOSTS.filter((c) => c.pattern.test(query)).map(
    (c) => c.id,
  );
  if (mentioned.length < 2) return null;

  const { entries, idf } = buildIndex();
  const qTokens = tokenize(query);

  const perCountry: ScoredArticle[] = [];
  for (const id of mentioned) {
    const candidates = entries.filter((e) => e.constitution.id === id);
    if (candidates.length === 0) continue;
    let best: IndexEntry | null = null;
    let bestScore = 0;
    for (const e of candidates) {
      let s = 0;
      for (const t of qTokens) {
        const tf = e.termFreq.get(t);
        if (!tf) continue;
        s += (tf / e.length) * (idf.get(t) ?? 0);
      }
      if (s > bestScore) {
        bestScore = s;
        best = e;
      }
    }
    if (best && bestScore > 0) {
      perCountry.push({
        article: best.article,
        constitution: best.constitution,
        score: bestScore,
      });
    }
  }

  if (perCountry.length < 2) return null;

  const intro = `Here is a side-by-side comparison drawn directly from each constitution:`;
  const blocks = perCountry
    .map(
      (h) =>
        `• **${h.constitution.country}** — ${h.article.article_number}, "${h.article.title}":\n   ${snippet(h.article.content, query, 240)}`,
    )
    .join('\n\n');

  return {
    reply: `${intro}\n\n${blocks}\n\n_Note: this is a quotation-only comparison from the indexed corpus, not legal advice._`,
    hits: perCountry,
    confidence: 'medium',
  };
}

export function answer(query: string): CitedAnswer {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      reply: 'Please ask a question about constitutional law and I will cite the most relevant articles I have indexed.',
      hits: [],
      confidence: 'low',
    };
  }

  const cmp = compareAcrossCountries(trimmed);
  if (cmp) return cmp;

  const hits = searchCorpus(trimmed, 4);
  if (hits.length === 0) {
    return {
      reply: `I don't have a clearly matching passage in my indexed corpus for that question. The corpus currently covers: ${bundledConstitutions
        .map((c) => `${c.flag} ${c.country}`)
        .join(', ')}. Try asking about a specific right (e.g. "freedom of speech in Nigeria") or compare two countries.`,
      hits: [],
      confidence: 'low',
    };
  }

  const top = hits[0];
  const confidence: CitedAnswer['confidence'] =
    top.score > 0.25 ? 'high' : top.score > 0.08 ? 'medium' : 'low';

  const lead =
    confidence === 'high'
      ? `The closest provision in my indexed corpus is from **${top.constitution.country}**, **${top.article.article_number} — ${top.article.title}**:`
      : `The most relevant passage I could find (lower confidence) is from **${top.constitution.country}**, **${top.article.article_number} — ${top.article.title}**:`;

  const quote = `> ${snippet(top.article.content, trimmed, 360)}`;

  const more =
    hits.length > 1
      ? `\n\nRelated provisions you may want to read:\n` +
        hits
          .slice(1)
          .map(
            (h) =>
              `• ${h.constitution.flag} **${h.constitution.country}** — ${h.article.article_number} (${h.article.title})`,
          )
          .join('\n')
      : '';

  return {
    reply: `${lead}\n\n${quote}${more}\n\n_AI responses are informational and not legal advice._`,
    hits,
    confidence,
  };
}

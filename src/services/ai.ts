// Constitutional Intelligence engine.
//
// The local TF-IDF index is always used as the retriever. When an OpenRouter
// API key is configured, the retrieved articles are also fed to Llama 3.3
// as RAG context for a generated, cited answer. Otherwise we return the
// best-matching quotation directly — no model required.
//
// Corpus sources, in priority order:
//   1. Supabase (every country fetched by the seed script — ~250 covered)
//   2. Bundled fallback (29 countries shipped in the binary, used while the
//      Supabase preload is still in flight or if Supabase is unreachable)

import {
  articles as bundledArticles,
  constitutions as bundledConstitutions,
  type BundledArticle,
  type BundledConstitution,
} from '../data/constitutions';
import {
  fetchAllArticles,
  fetchConstitutions,
  type Article,
  type Constitution,
} from './api';
import {
  isOpenRouterConfigured,
  openRouterModel,
  streamRAG,
} from './openrouter';

export interface CitedAnswer {
  reply: string;
  hits: ScoredArticle[];
  confidence: 'high' | 'medium' | 'low';
}

export interface ScoredArticle {
  article: BundledArticle | Article;
  constitution: BundledConstitution | Constitution;
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
  article: BundledArticle | Article;
  constitution: BundledConstitution | Constitution;
  termFreq: Map<string, number>;
  length: number;
}

interface CorpusIndex {
  entries: IndexEntry[];
  idf: Map<string, number>;
  boosts: Array<{ pattern: RegExp; id: string }>;
  source: 'bundled' | 'supabase';
}

let indexCache: CorpusIndex | null = null;
let preloadPromise: Promise<void> | null = null;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Build a fresh country-name boost list from the live constitutions array,
// so any country mentioned in a question gets ranked higher.
function buildBoosts(
  cs: Array<BundledConstitution | Constitution>,
): Array<{ pattern: RegExp; id: string }> {
  const out: Array<{ pattern: RegExp; id: string }> = [];
  for (const c of cs) {
    if (!c.country) continue;
    out.push({
      pattern: new RegExp(`\\b${escapeRegex(c.country)}\\b`, 'i'),
      id: c.id,
    });
  }
  // Common nicknames that are unambiguous.
  const aliases: Array<[RegExp, string]> = [
    [/\b(united states|usa|u\.s\.|america|american)\b/i, 'us'],
    [/\bbritain|british|uk\b/i, 'gb'],
    [/\b(czech republic|czechia)\b/i, 'cz'],
    [/\bholland\b/i, 'nl'],
    [/\bburma\b/i, 'mm'],
    [/\bivory coast\b/i, 'ci'],
  ];
  for (const [pattern, id] of aliases) out.push({ pattern, id });
  return out;
}

function buildIndexFrom(
  articleList: Array<BundledArticle | Article>,
  constitutionList: Array<BundledConstitution | Constitution>,
  source: 'bundled' | 'supabase',
): CorpusIndex {
  const cById = new Map(constitutionList.map((c) => [c.id, c]));
  const entries: IndexEntry[] = articleList
    .map((a) => {
      const constitution = cById.get(a.constitution_id);
      if (!constitution) return null;
      const tokens = tokenize(`${a.title} ${a.content} ${a.chapter}`);
      const tf = new Map<string, number>();
      tokens.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
      return {
        article: a,
        constitution,
        termFreq: tf,
        length: tokens.length || 1,
      };
    })
    .filter((e): e is IndexEntry => e !== null);

  const df = new Map<string, number>();
  entries.forEach((e) => {
    for (const t of e.termFreq.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  });
  const N = entries.length || 1;
  const idf = new Map<string, number>();
  for (const [term, freq] of df) {
    idf.set(term, Math.log(1 + N / freq));
  }

  return { entries, idf, boosts: buildBoosts(constitutionList), source };
}

function buildIndex(): CorpusIndex {
  if (indexCache) return indexCache;
  // Synchronous fallback while preloadCorpus() is in flight.
  indexCache = buildIndexFrom(bundledArticles, bundledConstitutions, 'bundled');
  return indexCache;
}

/**
 * Loads every constitution + article from Supabase (or returns immediately
 * if already loaded). Call once at app start; subsequent calls are no-ops.
 * Failures are non-fatal — the bundled corpus stays in place.
 */
export async function preloadCorpus(): Promise<void> {
  if (preloadPromise) return preloadPromise;
  preloadPromise = (async () => {
    try {
      const [allCons, allArticles] = await Promise.all([
        fetchConstitutions(),
        fetchAllArticles(),
      ]);
      if (allArticles.length === 0 || allCons.length === 0) return;
      indexCache = buildIndexFrom(allArticles, allCons, 'supabase');
      console.info(
        `[ai] corpus loaded: ${allArticles.length} articles across ${allCons.length} countries (Supabase).`,
      );
    } catch (err) {
      console.warn('[ai] corpus preload failed; using bundled fallback.', err);
    }
  })();
  return preloadPromise;
}

export const corpusSize = (): number => buildIndex().entries.length;

export function searchCorpus(query: string, k = 4): ScoredArticle[] {
  const { entries, idf, boosts } = buildIndex();
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];

  const targetCountry = boosts.find((c) => c.pattern.test(query))?.id;

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
  const { entries, idf, boosts } = buildIndex();
  const mentioned = boosts.filter((c) => c.pattern.test(query)).map((c) => c.id);
  if (mentioned.length < 2) return null;
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
    const { entries, source } = buildIndex();
    const sizeNote =
      source === 'supabase'
        ? `My corpus indexes ${entries.length} articles across every country with available text.`
        : `My corpus is still loading; only the offline bundle is ready right now.`;
    return {
      reply: `I couldn't find a passage that clearly matches that question. ${sizeNote} Try rephrasing — e.g. mention the country by name ("freedom of expression in Kenya"), the right itself ("right to a fair trial"), or ask me to compare two countries.`,
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

// =========================================================================
// RAG — Retrieval-Augmented Generation via OpenRouter / Llama 3.3
// =========================================================================

/**
 * Build the RAG context: top-matching articles overall, plus at least one
 * from each country mentioned by name in the query (so comparison questions
 * get cross-country evidence even if one country dominates the ranking).
 */
function retrieveForRAG(query: string, k = 6): ScoredArticle[] {
  const top = searchCorpus(query, k);
  const { boosts } = buildIndex();
  const mentioned = boosts.filter((c) => c.pattern.test(query)).map((c) => c.id);
  if (mentioned.length < 2) return top;

  // Search a deeper window so we can pull a country-specific best for each.
  const deep = searchCorpus(query, 50);
  const seen = new Set<string>();
  const out: ScoredArticle[] = [];

  for (const id of mentioned) {
    const best = deep.find((s) => s.constitution.id === id);
    if (best && !seen.has(best.article.id)) {
      out.push(best);
      seen.add(best.article.id);
    }
  }
  for (const s of top) {
    if (out.length >= k) break;
    if (!seen.has(s.article.id)) {
      out.push(s);
      seen.add(s.article.id);
    }
  }
  return out;
}

const confidenceFromScore = (score: number): CitedAnswer['confidence'] =>
  score > 0.25 ? 'high' : score > 0.08 ? 'medium' : 'low';

export interface SmartAnswerOptions {
  query: string;
  signal?: AbortSignal;
  /** Streamed tokens. For local fallback the full reply is delivered once. */
  onToken?: (token: string) => void;
  /** Notified when retrieval completes, before generation starts. */
  onSources?: (sources: ScoredArticle[]) => void;
}

export const ragEnabled = (): boolean => isOpenRouterConfigured();
export const ragModelLabel = (): string => openRouterModel();

/**
 * Returns a final CitedAnswer. When RAG is enabled and retrieval returns
 * sources, this calls Llama 3.3 with the retrieved articles as context and
 * streams the response. Otherwise it returns the local quotation answer.
 */
export const answerSmart = async (
  opts: SmartAnswerOptions,
): Promise<CitedAnswer> => {
  const { query, signal, onToken, onSources } = opts;
  const trimmed = query.trim();

  if (!trimmed) {
    const empty: CitedAnswer = {
      reply:
        'Please ask a question about constitutional law and I will cite the most relevant articles I have indexed.',
      hits: [],
      confidence: 'low',
    };
    onToken?.(empty.reply);
    return empty;
  }

  if (isOpenRouterConfigured()) {
    const sources = retrieveForRAG(trimmed, 6);
    onSources?.(sources);

    if (sources.length === 0) {
      const fallback = answer(trimmed);
      onToken?.(fallback.reply);
      return fallback;
    }

    let accumulated = '';
    try {
      await streamRAG({
        question: trimmed,
        sources,
        signal,
        onToken: (t) => {
          accumulated += t;
          onToken?.(t);
        },
      });
      return {
        reply: accumulated.trim() || answer(trimmed).reply,
        hits: sources,
        confidence: confidenceFromScore(sources[0]?.score ?? 0),
      };
    } catch (err) {
      // If aborted, surface as-is so the caller can show partial output.
      if ((err as Error).name === 'AbortError') {
        return {
          reply: accumulated || '_(generation cancelled)_',
          hits: sources,
          confidence: confidenceFromScore(sources[0]?.score ?? 0),
        };
      }
      console.warn('[ai] RAG call failed; falling back to local.', err);
      const fallback = answer(trimmed);
      onToken?.(fallback.reply);
      return fallback;
    }
  }

  // No OpenRouter — local quotation engine, simulated as a single token batch.
  const local = answer(trimmed);
  onSources?.(local.hits);
  onToken?.(local.reply);
  return local;
};

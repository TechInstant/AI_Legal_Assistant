// OpenRouter streaming client — used to call Llama 3.3 (or any other model)
// for retrieval-augmented answers.

import type { ScoredArticle } from './ai';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Currently-live free models (check openrouter.ai/models?max_price=0 for fresh list):
//   google/gemma-4-31b-it:free                       — Google Gemma 4, 31B, instruction-tuned
//   nvidia/nemotron-3-super-120b-a12b:free           — NVIDIA Nemotron, 120B
//   meta-llama/llama-3.3-70b-instruct:free           — Llama 3.3 (often rate-limited)
const DEFAULT_MODEL = 'google/gemma-4-31b-it:free';
// Tried in order when the configured model 429s. Less popular first — these
// tend to have free-tier quota left when Llama/Gemma are saturated.
const FALLBACK_MODELS = [
  'nvidia/nemotron-3-super-120b-a12b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
];

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
const model =
  (import.meta.env.VITE_OPENROUTER_MODEL as string | undefined) || DEFAULT_MODEL;

export const isOpenRouterConfigured = (): boolean => !!apiKey;
export const openRouterModel = (): string => model;

const SYSTEM_PROMPT = `You are LexIntell, a constitutional intelligence assistant.

STRICT RULES:
1. Answer ONLY using the SOURCES provided in the user message. Never use any outside knowledge of constitutions or laws.
2. Cite every factual claim inline with [Source N] where N is the source number.
3. If the sources do not contain the answer, say so plainly and recommend the closest related source from the list.
4. Quote exact constitutional text where it makes the answer clearer; place quotations on a new line prefixed with "> ".
5. Be concise — at most 3-5 short paragraphs. Do not pad or repeat the question.
6. End every reply with this disclaimer on its own line:
_AI responses are informational and not legal advice._`;

const buildContext = (sources: ScoredArticle[]): string =>
  sources
    .map(
      (s, i) =>
        `[Source ${i + 1}] ${s.constitution.country} — ${s.article.article_number} — ${s.article.title} (${s.article.chapter})\n${s.article.content}`,
    )
    .join('\n\n');

export interface RagOptions {
  question: string;
  sources: ScoredArticle[];
  signal?: AbortSignal;
  onToken: (token: string) => void;
}

interface StreamChunk {
  choices?: Array<{ delta?: { content?: string } }>;
}

async function postWithRetry(
  body: string,
  signal: AbortSignal | undefined,
): Promise<Response> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer':
      typeof window !== 'undefined' ? window.location.origin : 'https://lexintell.app',
    'X-Title': 'LexIntell',
  };

  // Retry-once on 429 — handles brief upstream rate-limit blips on the
  // free Llama tier. The fallback to local quotation answers handles
  // longer-lived rate limits.
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(API_URL, { method: 'POST', headers, body, signal });
    if (res.status !== 429) return res;
    if (attempt === 1) return res;
    // Honour Retry-After when present, capped at 4s; otherwise 1.5s.
    const retryAfter = Number(res.headers.get('Retry-After')) * 1000;
    const wait = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter, 4000)
      : 1500;
    await new Promise((r) => setTimeout(r, wait));
  }
  // Unreachable — the loop always returns.
  throw new Error('OpenRouter retry loop exhausted');
}

function buildBody(modelId: string, opts: RagOptions): string {
  const userMessage =
    `Question: ${opts.question}\n\nSOURCES:\n${buildContext(opts.sources)}`;
  return JSON.stringify({
    model: modelId,
    stream: true,
    temperature: 0.2,
    max_tokens: 800,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
  });
}

// Drains the streaming SSE response, calling onToken for each text delta.
async function streamFromResponse(
  res: Response,
  onToken: (t: string) => void,
): Promise<void> {
  if (!res.body) throw new Error('OpenRouter response had no body');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (!data || data === '[DONE]') {
          if (data === '[DONE]') return;
          continue;
        }
        try {
          const json = JSON.parse(data) as StreamChunk;
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) onToken(delta);
        } catch {
          /* keep-alive comment — ignore */
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export const streamRAG = async (opts: RagOptions): Promise<void> => {
  if (!apiKey) throw new Error('OpenRouter API key not configured.');

  // Try the configured model first, then rotate through fallbacks on 429.
  // De-dupe in case the configured model also appears in the fallback list.
  const candidates = Array.from(new Set([model, ...FALLBACK_MODELS]));

  let lastErr;
  for (let i = 0; i < candidates.length; i++) {
    const m = candidates[i];
    try {
      const res = await postWithRetry(buildBody(m, opts), opts.signal);

      if (res.status === 429) {
        // Persistent rate limit on this model — try the next one.
        const detail = await res.text().catch(() => '');
        lastErr = new Error(`OpenRouter 429 on ${m} — ${detail.slice(0, 200)}`);
        if (i < candidates.length - 1) {
          console.info(`[openrouter] ${m} rate-limited; trying next model.`);
          continue;
        }
        throw lastErr;
      }

      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        throw new Error(`OpenRouter ${res.status} on ${m} — ${detail.slice(0, 240)}`);
      }

      // Streaming starts; commit to this model — no further rotation.
      await streamFromResponse(res, opts.onToken);
      return;
    } catch (err) {
      const e = err as Error;
      // AbortError propagates immediately so the caller can show partial output.
      if (e.name === 'AbortError') throw err;
      lastErr = err;
      // Only rotate on rate-limit errors; surface other failures right away.
      const msg = e.message || '';
      if (!msg.includes('429')) throw err;
    }
  }
  throw lastErr ?? new Error('OpenRouter: all fallback models exhausted');
};


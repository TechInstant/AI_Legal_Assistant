// OpenRouter streaming client — used to call Llama 3.3 (or any other model)
// for retrieval-augmented answers.

import type { ScoredArticle } from './ai';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

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

export const streamRAG = async (opts: RagOptions): Promise<void> => {
  if (!apiKey) throw new Error('OpenRouter API key not configured.');

  const userMessage =
    `Question: ${opts.question}\n\nSOURCES:\n${buildContext(opts.sources)}`;

  const body = JSON.stringify({
    model,
    stream: true,
    temperature: 0.2,
    max_tokens: 800,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
  });

  const res = await postWithRetry(body, opts.signal);

  if (!res.ok || !res.body) {
    let detail = '';
    try {
      detail = (await res.text()).slice(0, 240);
    } catch {
      /* ignore */
    }
    throw new Error(`OpenRouter ${res.status} — ${detail || 'no body'}`);
  }

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
          if (delta) opts.onToken(delta);
        } catch {
          // OpenRouter occasionally interleaves keep-alive comments — ignore.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
};

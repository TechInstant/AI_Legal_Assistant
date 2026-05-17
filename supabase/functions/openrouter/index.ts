// Supabase Edge Function — proxies chat completions to OpenRouter so the
// API key never ships to the browser. Deploy with:
//
//   npx supabase functions deploy openrouter --no-verify-jwt
//   npx supabase secrets set OPENROUTER_API_KEY=sk-or-v1-...
//
// Then in your frontend env (Netlify + local .env):
//
//   VITE_OPENROUTER_PROXY_URL=https://<project-ref>.supabase.co/functions/v1/openrouter
//
// CORS is permissive ('*') because this endpoint is meant to be called
// from your Netlify-hosted SPA. Tighten to your specific domain for
// production by returning a fixed Access-Control-Allow-Origin.

// deno-lint-ignore-file no-explicit-any
// @ts-ignore — Deno globals only resolve at runtime, not in local TS check.
declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: { get: (k: string) => string | undefined };
};

const ALLOWED_ORIGIN = '*';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  // Wildcard isn't honoured for credentialed requests, so list the real
  // headers we accept. Includes OpenRouter attribution headers in case
  // a client (or future code path) still sends them.
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-title, http-referer, x-requested-with',
  'Access-Control-Max-Age': '86400',
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    // CORS preflight — return empty 204 with the allow-headers spelled out.
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders,
    });
  }

  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'OPENROUTER_API_KEY secret not set on the function',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  let body: string;
  try {
    body = await req.text();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Could not read request body' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://constitution-assistant.netlify.app',
        'X-Title': 'Constitution Assistant',
      },
      body,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'Upstream fetch failed',
        detail: (err as Error).message,
      }),
      {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }

  const upstreamCT = upstream.headers.get('content-type') ?? '';

  // Streaming response (SSE) — pass straight through. Add CORS headers and
  // strip hop-by-hop headers that confuse fetch in the browser.
  if (upstreamCT.includes('event-stream')) {
    const passthroughHeaders = new Headers();
    for (const [k, v] of upstream.headers) {
      const lower = k.toLowerCase();
      if (
        lower === 'content-encoding' ||
        lower === 'transfer-encoding' ||
        lower === 'connection'
      ) {
        continue;
      }
      passthroughHeaders.set(k, v);
    }
    for (const [k, v] of Object.entries(corsHeaders)) {
      passthroughHeaders.set(k, v);
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: passthroughHeaders,
    });
  }

  // Non-streaming response. OpenRouter often wraps provider errors as
  // HTTP 200 with body { error: { code: 429, ... } }. Surface that as the
  // actual HTTP status so the frontend's model-rotation logic can react.
  const text = await upstream.text();
  let status = upstream.status;
  try {
    const j = JSON.parse(text);
    const innerCode = j?.error?.code;
    if (typeof innerCode === 'number' && innerCode >= 400 && innerCode < 600) {
      status = innerCode;
    }
  } catch {
    // not JSON — keep upstream status as-is
  }

  return new Response(text, {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': upstreamCT || 'application/json',
    },
  });
});

# LexIntell — Data, Supabase & Deployment Guide

Three things this guide covers:

1. **Free APIs / data sources** that can give you real constitutional & country data
2. **Wiring your Supabase project** (schema + seed + auth)
3. **Deploying to Netlify or Vercel**

---

## 1. Free APIs & data sources

There is no single free API that returns the *full text of every country's constitution*. The realistic strategy is a **mix**: use a free API for country metadata, use bulk-downloadable open-license corpora for constitutional text, and use a free LLM endpoint for the assistant. Here are the concrete options that work with this codebase.

### 1.a Country metadata (free, no key)

| Source | What you get | Endpoint |
|---|---|---|
| **REST Countries** | Names, flags, capitals, regions, languages, populations | `https://restcountries.com/v3.1/all` |
| **World Bank Open Data** | Country codes, indicators | `https://api.worldbank.org/v2/country?format=json` |
| **GeoNames** (free with username) | Geographic data | `https://api.geonames.org/...` |

REST Countries is the easiest fit — drop-in, no auth, returns flags as PNG/SVG URLs. Useful if you want to expand beyond the 8 bundled countries to all 195.

### 1.b Constitutional text (open, but bulk download — no clean API)

| Source | License | How to ingest |
|---|---|---|
| **Constitute Project** (`constituteproject.org`) | Free academic use | Download per-country PDFs/HTML; parse and import |
| **Wikisource** | CC-BY-SA / public domain | Use the [MediaWiki API](https://en.wikisource.org/w/api.php) — e.g. `?action=parse&page=Constitution_of_the_United_States_of_America&format=json&prop=wikitext` |
| **Wikipedia** | CC-BY-SA | Same MediaWiki API; great for summaries |
| **Project Gutenberg** | Public domain | Bulk download |

Recommended: keep your curated bundled corpus in `src/data/constitutions.ts` for AI accuracy, and use Wikipedia / REST Countries to enrich the country listing on demand.

### 1.c AI / RAG — already wired with OpenRouter + Llama 3.3

The Assistant has two modes, switched automatically:

- **Local mode** (no API key): TF-IDF retrieves the best-matching article from the bundled corpus and quotes it with a confidence badge. No external calls.
- **RAG mode** (key configured): the same retriever picks top-k sources, then **Llama 3.3 70B** is called via **OpenRouter** with a strict "answer only from these sources, cite [Source N]" system prompt. The response streams token-by-token.

To enable RAG, add to your `.env`:

```bash
VITE_OPENROUTER_API_KEY=sk-or-v1-...
# Optional — defaults to the free Llama 3.3 variant:
VITE_OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
```

Get a free key at [openrouter.ai/keys](https://openrouter.ai/keys). The default model is the **`:free` variant** of Llama 3.3 70B — generous quota, no billing surprise.

Other models you can drop into `VITE_OPENROUTER_MODEL` without code changes:

| Model | OpenRouter ID |
|---|---|
| Llama 3.3 70B (free) | `meta-llama/llama-3.3-70b-instruct:free` |
| Llama 3.3 70B (paid, faster) | `meta-llama/llama-3.3-70b-instruct` |
| DeepSeek Chat (free) | `deepseek/deepseek-chat:free` |
| Mistral 7B (free) | `mistralai/mistral-7b-instruct:free` |
| Gemini Flash 1.5 | `google/gemini-flash-1.5` |

#### How RAG works in this codebase

1. User question → `retrieveForRAG()` in [`src/services/ai.ts`](src/services/ai.ts) runs the TF-IDF search (top 6 articles), with extra logic to ensure each country mentioned in the question gets at least one source.
2. `streamRAG()` in [`src/services/openrouter.ts`](src/services/openrouter.ts) formats the sources as numbered context and sends them to OpenRouter with a strict citation-only system prompt.
3. The response streams back as Server-Sent Events; tokens are appended live to the chat bubble. The user can hit **Stop** to abort.
4. Citations are shown as flag-prefixed chips below every answer, plus a confidence indicator.

#### Security note

A `VITE_*` env var is **embedded in the client bundle** — anyone visiting the site can extract the key from DevTools. Using the `:free` model variant means the worst case is rate-limit consumption, not billing. **For production, proxy the OpenRouter call through a Supabase Edge Function** and remove the key from the frontend.

### 1.d Other free options if you want to swap providers

| Provider | Free tier |
|---|---|
| **Groq** (`groq.com`) | Llama 3.3 + Gemma 2, fastest tokens/sec |
| **Hugging Face Inference API** | Free with daily quota |
| **Google Gemini** | gemini-1.5-flash free tier at `aistudio.google.com` |
| **Cohere** | Free trial keys |

The RAG layer in `src/services/ai.ts` is provider-agnostic — only `openrouter.ts` is OpenAI-shaped. To swap, replace the fetch in `streamRAG()`.

---

## 2. Supabase setup

Your `.env` already has working credentials. The app falls back to bundled data when tables don't exist yet (see the warnings in dev — that's the fallback firing). Here's how to make Supabase the source of truth.

### 2.a Create the tables

1. Open your Supabase project → **SQL Editor** → **New query**.
2. Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and run.
3. New query → paste [`supabase/seed.sql`](supabase/seed.sql) and run.

You should now see `constitutions`, `articles`, and `bookmarks` in the **Table Editor**.

The schema includes Row Level Security:
- `constitutions` and `articles` are **publicly readable**
- `bookmarks` are **per-user** (each user can only see their own)

### 2.b Verify the app reads from Supabase

Restart `npm run dev`. The dev console warnings (`PGRST205 Could not find the table 'public.constitutions'…`) should be gone. The Explorer now reads live from Supabase, with the bundled corpus only used if the network fails.

### 2.c Enable email auth

Supabase Dashboard → **Authentication** → **Providers** → **Email**:

- ✅ Enable
- For local dev convenience: turn **Confirm email** OFF (so signup logs you in immediately). Turn it back on for production.

The app's signup flow already handles both modes — when email confirmation is required, [`Signup.tsx`](src/pages/Signup.tsx) shows the "check your inbox" message.

### 2.d Bulk-seed every country (one command)

To get every country in REST Countries marked as **indexed**, run the seed script. It walks the full ~250-country catalogue, fetches each country's Wikipedia "Constitution of X" summary, and writes both the country profile and an Overview article to your Supabase `constitutions` and `articles` tables.

**Steps:**

1. Run `supabase/schema.sql` and `supabase/seed.sql` first (see §2.a).
2. Grab your **Service Role key** from the Supabase Dashboard → Project Settings → API. (This bypasses RLS — never commit it.)
3. Run the seed script:

   PowerShell:
   ```powershell
   $env:SUPABASE_SERVICE_ROLE_KEY = "ey..."
   npm run seed:supabase
   ```

   bash / zsh:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=ey... npm run seed:supabase
   ```

The script will print one line per country (`✓ overview`, `— (no Wikipedia article)`, `✗ error`), and finish with a summary of how many were inserted.

**What you get afterwards:**
- ~250 country profiles in `public.constitutions`
- ~200 Overview articles in `public.articles` (one per country that has a "Constitution of X" Wikipedia entry)
- Every country with an article shows the green **Indexed** badge in the Explorer
- The AI Assistant's TF-IDF retriever now searches across the entire global corpus
- Your bundled 8 are skipped — their richer per-article text stays authoritative

**Source quality:** Wikipedia summaries are short (~3–5 sentences) and high-level. For richer per-article text on specific countries, manually add rows or write a follow-up script that pulls full constitutional text from [Wikisource](https://en.wikisource.org/) (which has full machine-readable text for ~50 constitutions).

**Re-running:** the script uses upserts, so re-running is safe — newer Wikipedia content overwrites older.

---

### 2.e (Optional) Add more constitutions manually

To add countries beyond the 8 bundled, run inserts directly:

```sql
insert into public.constitutions (id, country, country_code, flag, region, title, adopted, summary)
values ('ke', 'Kenya', 'KE', '🇰🇪', 'africa',
        'Constitution of Kenya', '2010',
        'Promulgated after the post-election crisis…');

insert into public.articles (id, constitution_id, chapter, article_number, title, content, ord)
values ('ke-art27', 'ke', 'Chapter Four — Bill of Rights', 'Article 27',
        'Equality and freedom from discrimination',
        'Every person is equal before the law…', 1);
```

The app will pick them up immediately — no redeploy needed.

### 2.f (Advanced) Pulling full constitutional text from Wikisource

The bulk script in §2.d uses Wikipedia summaries (short, ~3–5 sentences). For richer per-article text, [Wikisource](https://en.wikisource.org/) hosts full constitutions for ~50 countries (US, UK, Germany, etc.). Adapt the script with the MediaWiki `parse` API:

```js
const wiki = await fetch(
  'https://en.wikisource.org/w/api.php?' +
  new URLSearchParams({
    action: 'parse',
    page: 'Constitution_of_the_United_States_of_America',
    prop: 'wikitext',
    format: 'json',
    formatversion: '2',
  })
).then(r => r.json());

// Parse wiki.parse.wikitext (it's wikitext markup) into your article rows,
// then upsert into the `articles` table.
await sb.from('articles').upsert(rows);
```

⚠️ Use the **service-role** key on the server side only. Never ship it to the browser.

---

## 3. Deploy

The repo includes both `netlify.toml` and `vercel.json` so you can pick either.

### 3.a Vercel (recommended for Vite)

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import the repo.
3. Vercel auto-detects Vite. Confirm:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables** — add these from your `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENROUTER_API_KEY` (optional — enables RAG with Llama 3.3)
   - `VITE_OPENROUTER_MODEL` (optional — override default model)
5. Deploy. The included [`vercel.json`](vercel.json) handles SPA fallback so deep links like `/explorer/ng` work.

CLI alternative:

```bash
npm i -g vercel
vercel              # first run links the project
vercel --prod       # subsequent deploys
```

### 3.b Netlify

1. [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**.
2. Build settings (auto-detected from [`netlify.toml`](netlify.toml)):
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Site settings** → **Environment variables** — add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OPENROUTER_API_KEY` (optional — enables RAG)
   - `VITE_OPENROUTER_MODEL` (optional)
4. Trigger a deploy. The included `netlify.toml` + `public/_redirects` provides SPA fallback.

CLI alternative:

```bash
npm i -g netlify-cli
netlify init
netlify deploy --prod
```

### 3.c Post-deploy Supabase config

In the Supabase Dashboard → **Authentication** → **URL Configuration**, add your deployed URL to:

- **Site URL**: e.g. `https://lexintell.vercel.app`
- **Redirect URLs**: same URL

Without this, password-recovery and email-confirmation links will fail.

### 3.d Custom domain (optional)

Both Vercel and Netlify offer free custom domains via DNS records. After pointing your domain, **add it to the Supabase allowed redirects too** so auth still works.

---

## Common issues

| Symptom | Fix |
|---|---|
| White page after deploy when navigating to `/explorer` | SPA fallback missing — confirm `vercel.json` / `netlify.toml` were committed and the deploy picked them up. |
| "Invalid login credentials" on signup | Email confirmation is on but the user hasn't clicked the link yet. Check the Supabase Auth logs. |
| `PGRST205 ... table 'public.constitutions'` warning in console | Schema not applied. Run `supabase/schema.sql` then `supabase/seed.sql`. |
| Auth works locally but not on the deployed URL | Add the deployed URL to Supabase → Auth → URL Configuration. |
| Build runs locally, fails on Vercel/Netlify | The host doesn't have your `.env`. Re-add the `VITE_*` vars in the dashboard and redeploy. |

---

## File map

```
.
├── netlify.toml             ← Netlify build + SPA redirect
├── vercel.json              ← Vercel build + SPA rewrite
├── public/_redirects        ← Netlify fallback (also handled by toml)
├── supabase/
│   ├── schema.sql           ← Tables + RLS — run once
│   └── seed.sql             ← Bundled corpus inserts — safe to re-run
└── DEPLOY.md                ← This guide
```

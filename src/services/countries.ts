// REST Countries integration — pulls the full country catalogue (~250)
// and normalizes it to our Constitution shape so the Explorer can list
// every country, not just the ones with bundled text.
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

const CACHE_KEY = 'lex-rest-countries-v3';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 12_000;

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
].join(',');

// Try the primary endpoint first, then a couple of mirrors if it fails.
const ENDPOINTS = [
  `https://restcountries.com/v3.1/all?fields=${FIELDS}`,
  `https://restcountries.com/v3.1/independent?status=true&fields=${FIELDS}`,
];

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
  flag_image_url: c.flags?.svg ?? c.flags?.png ?? '',
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
    const { ts, data } = JSON.parse(raw) as {
      ts: number;
      data: CountryProfile[];
    };
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

// =========================================================================
// Status — exposed so the UI can show whether the catalogue loaded.
// =========================================================================

export type CountriesStatus =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'ok'; count: number; source: 'cache' | 'network' }
  | { state: 'error'; message: string };

let currentStatus: CountriesStatus = { state: 'idle' };
const listeners = new Set<(s: CountriesStatus) => void>();

export const getCountriesStatus = (): CountriesStatus => currentStatus;
export const subscribeCountriesStatus = (fn: (s: CountriesStatus) => void) => {
  listeners.add(fn);
  fn(currentStatus);
  return () => listeners.delete(fn);
};
const setStatus = (s: CountriesStatus) => {
  currentStatus = s;
  listeners.forEach((l) => l(s));
};

// =========================================================================

const fetchWithTimeout = async (url: string, ms: number): Promise<Response> => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
};

export const fetchAllCountries = async (): Promise<CountryProfile[]> => {
  const cached = readCache();
  if (cached) {
    setStatus({ state: 'ok', count: cached.length, source: 'cache' });
    return cached;
  }

  setStatus({ state: 'loading' });

  let lastError: unknown = null;
  for (const url of ENDPOINTS) {
    try {
      const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);
      if (!res.ok) {
        lastError = new Error(`${url} → HTTP ${res.status}`);
        continue;
      }
      const raw = (await res.json()) as RestCountry[];
      if (!Array.isArray(raw) || raw.length === 0) {
        lastError = new Error(`${url} → empty payload`);
        continue;
      }
      const profiles = raw
        .map(normalize)
        .filter((c) => c.id && c.country)
        .sort((a, b) => a.country.localeCompare(b.country));

      writeCache(profiles);
      setStatus({ state: 'ok', count: profiles.length, source: 'network' });
      console.info(
        `[countries] loaded ${profiles.length} countries from REST Countries`,
      );
      return profiles;
    } catch (err) {
      lastError = err;
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : 'unknown error';
  console.error('[countries] REST Countries fetch failed:', message);
  setStatus({ state: 'error', message });
  throw lastError ?? new Error('REST Countries fetch failed');
};

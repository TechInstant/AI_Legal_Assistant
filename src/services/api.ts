import { supabase } from '../lib/supabase';
import {
  constitutions as bundledConstitutions,
  articles as bundledArticles,
  type BundledArticle,
  type BundledConstitution,
  type Region,
} from '../data/constitutions';
import { fetchAllCountries, type CountryProfile } from './countries';

export interface Constitution extends BundledConstitution {
  /** True when we have indexed constitutional articles for this country. */
  indexed?: boolean;
  flag_image_url?: string;
  capital?: string;
  population?: number;
  languages?: string[];
  subregion?: string;
}
export interface Article extends BundledArticle {}
export type { Region };

const isPlaceholderEnv = !import.meta.env.VITE_SUPABASE_URL;

const profileToConstitution = (p: CountryProfile): Constitution => ({
  id: p.id,
  country: p.country,
  country_code: p.country_code,
  flag: p.flag,
  flag_image_url: p.flag_image_url,
  region: p.region,
  subregion: p.subregion,
  capital: p.capital,
  population: p.population,
  languages: p.languages,
  title: '',
  adopted: '',
  summary: '',
  indexed: false,
});

/**
 * Returns the merged catalogue:
 *   1. REST Countries (all sovereign nations, with rich metadata)
 *   2. Bundled constitutions (overrides REST data and marks indexed: true)
 *   3. Supabase rows (overrides everything)
 *
 * If REST Countries fails (offline, etc.), we still return bundled + Supabase.
 */
export const fetchConstitutions = async (): Promise<Constitution[]> => {
  // Start with bundled — these always have full text + summary.
  const byId = new Map<string, Constitution>(
    bundledConstitutions.map((c) => [c.id, { ...c, indexed: true }]),
  );

  // Layer in REST Countries (don't overwrite existing bundled fields).
  try {
    const profiles = await fetchAllCountries();
    for (const p of profiles) {
      const existing = byId.get(p.id);
      if (existing) {
        // Enrich the bundled entry with extra metadata from REST Countries.
        byId.set(p.id, {
          ...existing,
          flag_image_url: p.flag_image_url,
          capital: p.capital,
          population: p.population,
          languages: p.languages,
          subregion: p.subregion,
        });
      } else {
        byId.set(p.id, profileToConstitution(p));
      }
    }
  } catch (err) {
    console.warn('[api] REST Countries fetch failed, continuing without it.', err);
  }

  // Layer in Supabase if available (its rows take precedence).
  if (!isPlaceholderEnv) {
    try {
      const { data, error } = await supabase.from('constitutions').select('*');
      if (error) throw error;
      if (data) {
        for (const row of data as Constitution[]) {
          const existing = byId.get(row.id);
          byId.set(row.id, { ...existing, ...row, indexed: true });
        }
      }
    } catch (err) {
      console.warn('[api] Supabase constitutions fetch failed; using merged bundled + REST.', err);
    }
  }

  return Array.from(byId.values()).sort((a, b) => {
    // Indexed countries float to the top, then alphabetical.
    if (!!a.indexed !== !!b.indexed) return a.indexed ? -1 : 1;
    return a.country.localeCompare(b.country);
  });
};

export const fetchArticles = async (
  constitutionId: string,
): Promise<Article[]> => {
  const bundled = bundledArticles.filter(
    (a) => a.constitution_id === constitutionId,
  );

  if (isPlaceholderEnv) return bundled;
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('constitution_id', constitutionId);
    if (error) throw error;
    if (!data || data.length === 0) return bundled;
    return data as Article[];
  } catch (err) {
    console.warn('[api] articles fetch failed, using bundled.', err);
    return bundled;
  }
};

export const fetchAllArticles = async (): Promise<Article[]> => {
  if (isPlaceholderEnv) return bundledArticles;
  try {
    const { data, error } = await supabase.from('articles').select('*');
    if (error) throw error;
    if (!data || data.length === 0) return bundledArticles;
    return data as Article[];
  } catch (err) {
    console.warn('[api] all-articles fetch failed, using bundled.', err);
    return bundledArticles;
  }
};

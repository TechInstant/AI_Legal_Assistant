import { supabase } from '../lib/supabase';
import {
  constitutions as bundledConstitutions,
  articles as bundledArticles,
  type BundledArticle,
  type BundledConstitution,
  type Region,
} from '../data/constitutions';

export interface Constitution extends BundledConstitution {}
export interface Article extends BundledArticle {}
export type { Region };

const isPlaceholderEnv = !import.meta.env.VITE_SUPABASE_URL;

export const fetchConstitutions = async (): Promise<Constitution[]> => {
  if (isPlaceholderEnv) return bundledConstitutions;
  try {
    const { data, error } = await supabase.from('constitutions').select('*');
    if (error) throw error;
    if (!data || data.length === 0) return bundledConstitutions;
    // Merge: any Supabase rows override bundled by id, missing bundled rows are appended
    const byId = new Map<string, Constitution>(
      bundledConstitutions.map((c) => [c.id, c]),
    );
    for (const row of data as Constitution[]) byId.set(row.id, row);
    return Array.from(byId.values());
  } catch (err) {
    console.warn('[api] constitutions fetch failed, using bundled.', err);
    return bundledConstitutions;
  }
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

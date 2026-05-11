
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  fetchAllArticles,
  fetchArticles,
  fetchConstitutions,
  type Article,
  type Constitution,
} from '../services/api';

interface DataContextValue {
  constitutions: Constitution[];
  constitutionsLoading: boolean;
  /** Returns cached articles for a country; fetches once then memoises. */
  getArticles: (constitutionId: string) => Promise<Article[]>;
  /** Returns every article across every country (used by Bookmarks). */
  getAllArticles: () => Promise<Article[]>;
}

const DataContext = createContext<DataContextValue | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [constitutions, setConstitutions] = useState<Constitution[]>([]);
  const [constitutionsLoading, setConstitutionsLoading] = useState(true);

  // Per-country article cache. Two refs because we want to dedupe IN-FLIGHT
  // promises too, not just resolved data.
  const articlesCache = useRef<Map<string, Article[]>>(new Map());
  const articlesPromise = useRef<Map<string, Promise<Article[]>>>(new Map());
  const allArticlesPromise = useRef<Promise<Article[]> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchConstitutions().then((data) => {
      if (cancelled) return;
      setConstitutions(data);
      setConstitutionsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const getArticles = useCallback(async (id: string): Promise<Article[]> => {
    const hit = articlesCache.current.get(id);
    if (hit) return hit;
    const pending = articlesPromise.current.get(id);
    if (pending) return pending;
    const p = fetchArticles(id).then((rows) => {
      articlesCache.current.set(id, rows);
      articlesPromise.current.delete(id);
      return rows;
    });
    articlesPromise.current.set(id, p);
    return p;
  }, []);

  const getAllArticles = useCallback(async (): Promise<Article[]> => {
    if (allArticlesPromise.current) return allArticlesPromise.current;
    allArticlesPromise.current = fetchAllArticles();
    return allArticlesPromise.current;
  }, []);

  return (
    <DataContext.Provider
      value={{
        constitutions,
        constitutionsLoading,
        getArticles,
        getAllArticles,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextValue => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
};

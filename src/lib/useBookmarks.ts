import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Bookmarks (and recently-viewed) are stored in localStorage, keyed per
 * user. Anonymous visitors get a shared 'anon' key. This avoids requiring
 * the Supabase bookmarks table and works fully offline.
 *
 * Simple useState + custom event-bus pattern so changes propagate across
 * components in the same tab. Avoids the useSyncExternalStore "snapshot
 * must be referentially stable" pitfall.
 */

export interface BookmarkRecord {
  article_id: string;
  constitution_id: string;
  saved_at: number;
}

export interface RecentRecord {
  constitution_id: string;
  visited_at: number;
}

const BOOKMARKS_KEY = (uid: string) => `lex-bookmarks:${uid}`;
const RECENT_KEY = (uid: string) => `lex-recent:${uid}`;
const RECENT_MAX = 6;

// ---- module-level event bus so updates from one hook ripple to others ----
type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach((fn) => fn());

const subscribe = (fn: Listener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

// ---- localStorage helpers ----
const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
  } catch {
    /* quota — non-fatal */
  }
};

// =========================================================================
// useBookmarks
// =========================================================================

export const useBookmarks = () => {
  const { user } = useAuth();
  const uid = user?.id ?? 'anon';

  const [items, setItems] = useState<BookmarkRecord[]>(() =>
    readJson<BookmarkRecord[]>(BOOKMARKS_KEY(uid), []),
  );

  useEffect(() => {
    // When the user changes, reload from the new key.
    setItems(readJson<BookmarkRecord[]>(BOOKMARKS_KEY(uid), []));

    const handler = () => {
      setItems(readJson<BookmarkRecord[]>(BOOKMARKS_KEY(uid), []));
    };
    const off = subscribe(handler);
    window.addEventListener('storage', handler);
    return () => {
      off();
      window.removeEventListener('storage', handler);
    };
  }, [uid]);

  const isBookmarked = useCallback(
    (articleId: string) => items.some((b) => b.article_id === articleId),
    [items],
  );

  const toggle = useCallback(
    (articleId: string, constitutionId: string) => {
      const current = readJson<BookmarkRecord[]>(BOOKMARKS_KEY(uid), []);
      const exists = current.some((b) => b.article_id === articleId);
      const next = exists
        ? current.filter((b) => b.article_id !== articleId)
        : [
            ...current,
            {
              article_id: articleId,
              constitution_id: constitutionId,
              saved_at: Date.now(),
            },
          ];
      writeJson(BOOKMARKS_KEY(uid), next);
    },
    [uid],
  );

  const remove = useCallback(
    (articleId: string) => {
      const current = readJson<BookmarkRecord[]>(BOOKMARKS_KEY(uid), []);
      writeJson(
        BOOKMARKS_KEY(uid),
        current.filter((b) => b.article_id !== articleId),
      );
    },
    [uid],
  );

  return { items, isBookmarked, toggle, remove };
};

// =========================================================================
// useRecentlyViewed
// =========================================================================

export const useRecentlyViewed = () => {
  const { user } = useAuth();
  const uid = user?.id ?? 'anon';

  const [items, setItems] = useState<RecentRecord[]>(() =>
    readJson<RecentRecord[]>(RECENT_KEY(uid), []),
  );

  useEffect(() => {
    setItems(readJson<RecentRecord[]>(RECENT_KEY(uid), []));

    const handler = () => {
      setItems(readJson<RecentRecord[]>(RECENT_KEY(uid), []));
    };
    const off = subscribe(handler);
    window.addEventListener('storage', handler);
    return () => {
      off();
      window.removeEventListener('storage', handler);
    };
  }, [uid]);

  const visit = useCallback(
    (constitutionId: string) => {
      const current = readJson<RecentRecord[]>(RECENT_KEY(uid), []);
      const filtered = current.filter(
        (r) => r.constitution_id !== constitutionId,
      );
      const next: RecentRecord[] = [
        { constitution_id: constitutionId, visited_at: Date.now() },
        ...filtered,
      ].slice(0, RECENT_MAX);
      writeJson(RECENT_KEY(uid), next);
    },
    [uid],
  );

  return { items, visit };
};

/** Hook that triggers `visit` once when a constitution id becomes truthy. */
export const useTrackVisit = (constitutionId: string | null | undefined) => {
  const { visit } = useRecentlyViewed();
  useEffect(() => {
    if (constitutionId) visit(constitutionId);
  }, [constitutionId, visit]);
};

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useBookmarks } from '../lib/useBookmarks';
import { type Article, type Constitution } from '../services/api';
import { regionLabel, regionColorClass } from '../data/constitutions';
import { useData } from '../context/DataContext';

export const Bookmarks: React.FC = () => {
  const { items, remove } = useBookmarks();
  const { constitutions, constitutionsLoading, getAllArticles } = useData();
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  const loading = constitutionsLoading || articlesLoading;

  useEffect(() => {
    let cancelled = false;
    getAllArticles().then((all) => {
      if (cancelled) return;
      setArticles(all);
      setArticlesLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [getAllArticles]);

  const articlesById = useMemo(() => {
    const m = new Map<string, Article>();
    for (const a of articles) m.set(a.id, a);
    return m;
  }, [articles]);

  const constitutionsById = useMemo(() => {
    const m = new Map<string, Constitution>();
    for (const c of constitutions) m.set(c.id, c);
    return m;
  }, [constitutions]);

  const sorted = [...items].sort((a, b) => b.saved_at - a.saved_at);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
      <div className="on-map mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bookmark className="w-6 h-6 sm:w-7 sm:h-7 text-honey-500 fill-current" />
          <h1 className="m-0 text-2xl sm:text-3xl md:text-4xl">My Bookmarks</h1>
        </div>
        <p className="text-sm sm:text-base text-slate dark:text-mist max-w-2xl">
          Articles you've saved across the world's constitutions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-iris-500/60" />
        </div>
      ) : sorted.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center">
          <Bookmark className="w-12 h-12 mx-auto mb-4 text-slate/40 dark:text-mist/40" />
          <h3 className="m-0 mb-2">No bookmarks yet</h3>
          <p className="text-sm text-slate dark:text-mist mb-6">
            Open any constitutional article and tap{' '}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate/30 text-xs">
              <Bookmark className="w-3 h-3" /> Save
            </span>{' '}
            to keep it here for later.
          </p>
          <Link to="/explorer">
            <Button>Browse constitutions</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {sorted.map((b) => {
            const article = articlesById.get(b.article_id);
            const constitution = constitutionsById.get(b.constitution_id);
            if (!article || !constitution) {
              return (
                <Card key={b.article_id} className="p-4 flex items-center gap-3">
                  <span className="flex-1 text-sm text-slate">
                    Saved item not found ({b.article_id})
                  </span>
                  <button
                    onClick={() => remove(b.article_id)}
                    className="text-rose-500 p-2 rounded hover:bg-rose-500/10"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              );
            }
            return (
              <Card
                key={b.article_id}
                className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:border-iris-500/40 transition-colors"
              >
                <Link
                  to={`/explorer/${constitution.id}#${article.id}`}
                  className="flex-1 flex items-center gap-3 sm:gap-4 min-w-0"
                >
                  <span className="text-2xl sm:text-3xl shrink-0">
                    {constitution.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${regionColorClass[constitution.region]}`}
                      >
                        {regionLabel[constitution.region]}
                      </span>
                      <span className="text-[11px] text-slate dark:text-mist truncate">
                        {constitution.country}
                      </span>
                    </div>
                    <p className="m-0 text-sm sm:text-base font-medium truncate text-ink-100 dark:text-paper">
                      {article.article_number} — {article.title}
                    </p>
                    <p className="text-[11px] text-slate dark:text-mist truncate">
                      {article.chapter}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate dark:text-mist shrink-0" />
                </Link>
                <button
                  onClick={() => remove(b.article_id)}
                  className="p-2 rounded-lg text-slate dark:text-mist hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
                  aria-label="Remove bookmark"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

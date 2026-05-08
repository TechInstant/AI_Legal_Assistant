import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import {
  Play,
  Pause,
  Loader2,
  ChevronLeft,
  Search,
  Globe,
  ChevronRight,
} from 'lucide-react';
import {
  fetchArticles,
  fetchConstitutions,
  type Article,
  type Constitution,
} from '../services/api';
import { regionLabel, regionColorClass } from '../data/constitutions';

const ListenButton: React.FC<{ text: string }> = ({ text }) => {
  const [playing, setPlaying] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Your browser does not support voice narration.');
      return;
    }
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.onend = () => setPlaying(false);
    u.onerror = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(u);
  };

  return (
    <button
      onClick={speak}
      className="flex items-center gap-2 text-world-forest hover:text-world-deep-ocean dark:hover:text-world-sand transition-colors text-sm font-medium bg-world-forest/10 px-3 py-2 rounded-lg"
    >
      {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
      {playing ? 'Stop' : 'Listen'}
    </button>
  );
};

const CountryGrid: React.FC<{ items: Constitution[] }> = ({ items }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((c) => (
      <Link key={c.id} to={`/explorer/${c.id}`} className="group">
        <Card className="p-6 h-full bg-white/70 dark:bg-brand-carbon/40 hover:border-world-ocean transition-colors">
          <div className="flex items-start justify-between gap-4 mb-4">
            <span className="text-4xl leading-none">{c.flag}</span>
            <span
              className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${regionColorClass[c.region]}`}
            >
              {regionLabel[c.region]}
            </span>
          </div>
          <h3 className="text-xl font-serif text-world-deep-ocean dark:text-world-sand mb-1 group-hover:text-world-ocean transition-colors">
            {c.country}
          </h3>
          <p className="text-xs text-brand-slate dark:text-brand-mist mb-3">
            {c.title} · Adopted {c.adopted}
          </p>
          <p className="text-sm text-brand-slate dark:text-brand-mist line-clamp-3">
            {c.summary}
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-world-ocean">
            Read constitution <ChevronRight className="w-4 h-4" />
          </div>
        </Card>
      </Link>
    ))}
  </div>
);

export const Explorer: React.FC = () => {
  const { constitutionId } = useParams<{ constitutionId?: string }>();
  const navigate = useNavigate();

  const [constitutions, setConstitutions] = useState<Constitution[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // Load list of constitutions
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchConstitutions().then((data) => {
      if (!cancelled) {
        setConstitutions(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load articles when a constitution is selected
  useEffect(() => {
    if (!constitutionId) {
      setArticles([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchArticles(constitutionId).then((data) => {
      if (cancelled) return;
      setArticles(data);
      setActiveArticleId(data[0]?.id ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [constitutionId]);

  const activeConstitution = useMemo(
    () => constitutions.find((c) => c.id === constitutionId) ?? null,
    [constitutions, constitutionId],
  );

  const filteredCountries = useMemo(() => {
    if (!query.trim()) return constitutions;
    const q = query.toLowerCase();
    return constitutions.filter(
      (c) =>
        c.country.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        regionLabel[c.region].toLowerCase().includes(q),
    );
  }, [constitutions, query]);

  // ---------- Country list view ----------
  if (!constitutionId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-3">
          <Globe className="w-7 h-7 text-world-ocean" />
          <h1 className="font-serif text-world-deep-ocean dark:text-world-sand m-0">
            Constitutional Explorer
          </h1>
        </div>
        <p className="text-brand-slate dark:text-brand-mist mb-8 max-w-2xl">
          Browse the supreme legal texts of nations around the world. Each
          jurisdiction is colour-coded by continent.
        </p>

        <Card className="p-2 pl-6 flex items-center gap-4 mb-10 bg-white/70 dark:bg-brand-carbon/40">
          <Search className="w-5 h-5 text-brand-slate" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by country, region, or constitution name…"
            className="flex-1 bg-transparent border-none outline-none text-base text-world-deep-ocean dark:text-world-sand placeholder:text-brand-slate py-3"
          />
        </Card>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-world-ocean/60" />
          </div>
        ) : filteredCountries.length === 0 ? (
          <p className="text-center text-brand-slate py-12">
            No constitutions match that search.
          </p>
        ) : (
          <CountryGrid items={filteredCountries} />
        )}
      </div>
    );
  }

  // ---------- Reading view ----------
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/explorer')}
        className="flex items-center gap-1 text-sm text-brand-slate dark:text-brand-mist hover:text-world-ocean transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> All constitutions
      </button>

      {activeConstitution && (
        <div className="flex items-start gap-4 mb-8">
          <span className="text-5xl leading-none">{activeConstitution.flag}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${regionColorClass[activeConstitution.region]}`}
              >
                {regionLabel[activeConstitution.region]}
              </span>
              <span className="text-xs text-brand-slate">
                Adopted {activeConstitution.adopted}
              </span>
            </div>
            <h1 className="font-serif text-world-deep-ocean dark:text-world-sand m-0">
              {activeConstitution.country}
            </h1>
            <p className="text-sm text-brand-slate dark:text-brand-mist mt-1">
              {activeConstitution.title}
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4 lg:sticky lg:top-28 bg-white/70 dark:bg-brand-carbon/40">
            <h3 className="text-base mb-4 text-world-deep-ocean dark:text-world-sand font-semibold">
              Table of Contents
            </h3>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-brand-slate">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : articles.length === 0 ? (
              <p className="text-sm text-brand-slate">
                No articles available for this constitution yet.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {articles.map((a) => (
                  <li key={a.id}>
                    <a
                      href={`#${a.id}`}
                      onClick={() => setActiveArticleId(a.id)}
                      className={`block py-1 transition-colors ${
                        activeArticleId === a.id
                          ? 'text-world-ocean font-medium'
                          : 'text-brand-slate dark:text-brand-mist hover:text-world-deep-ocean dark:hover:text-world-sand'
                      }`}
                    >
                      <span className="text-xs uppercase tracking-wider block">
                        {a.chapter}
                      </span>
                      {a.article_number} — {a.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Main reading area */}
        <div className="lg:col-span-3 space-y-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-world-ocean/60" />
            </div>
          ) : (
            articles.map((a) => (
              <Card
                key={a.id}
                id={a.id}
                className="p-8 md:p-12 bg-white/80 dark:bg-brand-carbon/40 scroll-mt-28"
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-brand-slate dark:text-brand-mist">
                      {a.chapter}
                    </p>
                    <h2 className="font-serif text-2xl md:text-3xl m-0 text-world-deep-ocean dark:text-world-sand">
                      {a.article_number} — {a.title}
                    </h2>
                  </div>
                  <ListenButton text={`${a.title}. ${a.content}`} />
                </div>

                <p className="text-base md:text-lg leading-relaxed text-brand-slate dark:text-brand-mist whitespace-pre-line">
                  {a.content}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

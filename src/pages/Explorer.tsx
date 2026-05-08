import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import {
  Play,
  Pause,
  Loader2,
  ChevronLeft,
  Globe,
  ChevronRight,
} from 'lucide-react';
import {
  fetchArticles,
  fetchConstitutions,
  type Article,
  type Constitution,
} from '../services/api';
import { regionLabel, regionColorClass, type Region } from '../data/constitutions';
import { ContinentSelector } from '../components/ContinentSelector';
import { CountryDropdown } from '../components/CountryDropdown';

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
      className="flex items-center gap-2 text-sage-500 hover:text-sage-700 transition-colors text-sm font-medium bg-sage-500/10 px-3 py-2 rounded-lg"
    >
      {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
      {playing ? 'Stop' : 'Listen'}
    </button>
  );
};

const CountryFlag: React.FC<{ c: Constitution; size?: 'sm' | 'lg' }> = ({
  c,
  size = 'sm',
}) => {
  const dims = size === 'lg' ? 'w-12 h-9' : 'w-9 h-6';
  if (c.flag_image_url) {
    return (
      <img
        src={c.flag_image_url}
        alt={`${c.country} flag`}
        className={`${dims} object-cover rounded-sm shadow-sm`}
        loading="lazy"
      />
    );
  }
  return (
    <span className={size === 'lg' ? 'text-5xl leading-none' : 'text-3xl leading-none'}>
      {c.flag}
    </span>
  );
};

const CountryGrid: React.FC<{ items: Constitution[] }> = ({ items }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {items.map((c) => (
      <Link key={c.id} to={`/explorer/${c.id}`} className="group">
        <Card className="p-6 h-full hover:border-iris-500 transition-colors flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-4">
            <CountryFlag c={c} />
            <div className="flex flex-col items-end gap-1">
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${regionColorClass[c.region]}`}
              >
                {regionLabel[c.region]}
              </span>
              {c.indexed ? (
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-sage-500/40 text-sage-500 bg-sage-500/5">
                  Indexed
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-slate/30 text-slate dark:text-mist bg-slate/5">
                  Profile only
                </span>
              )}
            </div>
          </div>
          <h3 className="text-lg font-serif group-hover:text-iris-500 transition-colors">
            {c.country}
          </h3>
          {c.indexed ? (
            <>
              <p className="text-xs text-slate dark:text-mist mb-3">
                {c.title} · Adopted {c.adopted}
              </p>
              <p className="text-sm text-slate dark:text-mist line-clamp-3">
                {c.summary}
              </p>
            </>
          ) : (
            <p className="text-xs text-slate dark:text-mist mb-3 space-y-0.5">
              {c.capital && <span className="block">Capital: {c.capital}</span>}
              {c.population != null && (
                <span className="block">
                  Population: {c.population.toLocaleString()}
                </span>
              )}
              {c.languages && c.languages.length > 0 && (
                <span className="block">Languages: {c.languages.slice(0, 3).join(', ')}</span>
              )}
            </p>
          )}
          <div className="mt-auto pt-4 flex items-center gap-1 text-sm font-medium text-iris-500">
            {c.indexed ? 'Read constitution' : 'Country profile'}{' '}
            <ChevronRight className="w-4 h-4" />
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
  const [continent, setContinent] = useState<Region | 'all'>('all');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // Load constitutions
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

  // When viewing a country, fetch its articles
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

  // When viewing a country, lock the continent selector to that country's region.
  const activeConstitution = useMemo(
    () => constitutions.find((c) => c.id === constitutionId) ?? null,
    [constitutions, constitutionId],
  );
  useEffect(() => {
    if (activeConstitution) setContinent(activeConstitution.region);
  }, [activeConstitution]);

  const filteredCountries = useMemo(
    () =>
      continent === 'all'
        ? constitutions
        : constitutions.filter((c) => c.region === continent),
    [continent, constitutions],
  );

  // ============ Country list view ============
  if (!constitutionId) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Globe className="w-6 h-6 sm:w-7 sm:h-7 text-iris-500" />
          <h1 className="m-0 text-2xl sm:text-3xl md:text-4xl">
            Constitutional Explorer
          </h1>
        </div>
        <p className="text-sm sm:text-base text-slate dark:text-mist mb-6 sm:mb-8 max-w-2xl">
          Browse the supreme legal texts of nations around the world. Filter by
          continent or jump straight to a country.
        </p>

        <Card className="p-4 sm:p-6 mb-8 sm:mb-10 space-y-4 sm:space-y-5 bg-paper-soft/95 dark:bg-ink-800/80">
          <ContinentSelector value={continent} onChange={setContinent} />
          <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-center">
            <CountryDropdown
              countries={filteredCountries}
              value={null}
              onChange={(id) => navigate(`/explorer/${id}`)}
              placeholder={
                continent === 'all'
                  ? 'Search and select any country'
                  : `Search countries in ${regionLabel[continent]}`
              }
            />
            <div className="text-xs sm:text-sm text-slate dark:text-mist text-left">
              {filteredCountries.length} constitution
              {filteredCountries.length === 1 ? '' : 's'}
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center py-16 sm:py-20">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-iris-500/60" />
          </div>
        ) : filteredCountries.length === 0 ? (
          <p className="text-center text-slate dark:text-mist py-12">
            No constitutions indexed for this continent yet.
          </p>
        ) : (
          <CountryGrid items={filteredCountries} />
        )}
      </div>
    );
  }

  // ============ Reading view ============
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <button
        onClick={() => navigate('/explorer')}
        className="flex items-center gap-1 text-xs sm:text-sm text-slate dark:text-mist hover:text-iris-500 transition-colors mb-4 sm:mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> All constitutions
      </button>

      {activeConstitution && (
        <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="shrink-0">
            <CountryFlag c={activeConstitution} size="lg" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${regionColorClass[activeConstitution.region]}`}
              >
                {regionLabel[activeConstitution.region]}
              </span>
              {activeConstitution.indexed && activeConstitution.adopted && (
                <span className="text-xs text-slate dark:text-mist">
                  Adopted {activeConstitution.adopted}
                </span>
              )}
              {!activeConstitution.indexed && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-slate/30 text-slate dark:text-mist">
                  Profile only
                </span>
              )}
            </div>
            <h1 className="m-0 text-2xl sm:text-3xl md:text-4xl">
              {activeConstitution.country}
            </h1>
            {activeConstitution.indexed && activeConstitution.title && (
              <p className="text-xs sm:text-sm text-slate dark:text-mist mt-1">
                {activeConstitution.title}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Non-indexed country: show profile + suggestion */}
      {!loading && activeConstitution && !activeConstitution.indexed && (
        <Card className="p-6 sm:p-8 mb-6">
          <h2 className="m-0 mb-3 text-xl sm:text-2xl">Country profile</h2>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            {activeConstitution.capital && (
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate dark:text-mist">
                  Capital
                </dt>
                <dd className="text-ink-100 dark:text-paper">
                  {activeConstitution.capital}
                </dd>
              </div>
            )}
            {activeConstitution.population != null && (
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate dark:text-mist">
                  Population
                </dt>
                <dd className="text-ink-100 dark:text-paper">
                  {activeConstitution.population.toLocaleString()}
                </dd>
              </div>
            )}
            {activeConstitution.subregion && (
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate dark:text-mist">
                  Sub-region
                </dt>
                <dd className="text-ink-100 dark:text-paper">
                  {activeConstitution.subregion}
                </dd>
              </div>
            )}
            {activeConstitution.languages &&
              activeConstitution.languages.length > 0 && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate dark:text-mist">
                    Languages
                  </dt>
                  <dd className="text-ink-100 dark:text-paper">
                    {activeConstitution.languages.join(', ')}
                  </dd>
                </div>
              )}
          </dl>
          <div className="mt-6 p-4 rounded-xl bg-honey-500/10 border border-honey-500/30 text-sm text-ink-100 dark:text-paper">
            Constitutional text for{' '}
            <strong>{activeConstitution.country}</strong> is not yet indexed.{' '}
            <a
              className="text-iris-500 underline hover:no-underline"
              href={`https://en.wikipedia.org/wiki/Constitution_of_${encodeURIComponent(activeConstitution.country.replace(/\s+/g, '_'))}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read on Wikipedia →
            </a>
          </div>
        </Card>
      )}

      <div
        className={`grid lg:grid-cols-4 gap-6 lg:gap-8 ${
          activeConstitution && !activeConstitution.indexed ? 'hidden' : ''
        }`}
      >
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="p-4 lg:sticky lg:top-28">
            <h3 className="text-base mb-3 sm:mb-4 font-semibold">
              Table of Contents
            </h3>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-slate">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </div>
            ) : articles.length === 0 ? (
              <p className="text-sm text-slate">No articles available yet.</p>
            ) : (
              <ul className="space-y-2 text-sm max-h-72 lg:max-h-none overflow-y-auto">
                {articles.map((a) => (
                  <li key={a.id}>
                    <a
                      href={`#${a.id}`}
                      onClick={() => setActiveArticleId(a.id)}
                      className={`block py-1 transition-colors ${
                        activeArticleId === a.id
                          ? 'text-iris-500 font-medium'
                          : 'text-slate dark:text-mist hover:text-iris-500'
                      }`}
                    >
                      <span className="text-[10px] sm:text-xs uppercase tracking-wider block">
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

        <div className="lg:col-span-3 order-1 lg:order-2 space-y-5 sm:space-y-8">
          {loading ? (
            <div className="flex justify-center py-16 sm:py-20">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-iris-500/60" />
            </div>
          ) : (
            articles.map((a) => (
              <Card
                key={a.id}
                id={a.id}
                className="p-5 sm:p-8 md:p-12 scroll-mt-28"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-3">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate dark:text-mist">
                      {a.chapter}
                    </p>
                    <h2 className="m-0 text-xl sm:text-2xl md:text-3xl">
                      {a.article_number} — {a.title}
                    </h2>
                  </div>
                  <ListenButton text={`${a.title}. ${a.content}`} />
                </div>

                <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate dark:text-mist whitespace-pre-line break-words">
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

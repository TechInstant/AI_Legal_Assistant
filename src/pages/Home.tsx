import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Search,
  Globe,
  Shield,
  Sparkles,
  BookOpen,
  Bookmark,
  Clock,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Link, useNavigate } from 'react-router-dom';
import { fetchConstitutions, type Constitution } from '../services/api';
import { regionLabel, regionColorClass, type Region } from '../data/constitutions';
import { ContinentSelector } from '../components/ContinentSelector';
import { CountryDropdown } from '../components/CountryDropdown';
import { useAuth } from '../context/AuthContext';
import { useBookmarks, useRecentlyViewed } from '../lib/useBookmarks';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: bookmarks } = useBookmarks();
  const { items: recent } = useRecentlyViewed();
  const [constitutions, setConstitutions] = useState<Constitution[]>([]);
  const [continent, setContinent] = useState<Region | 'all'>('all');
  const [countryId, setCountryId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const fullName = (user?.user_metadata?.full_name as string | undefined) ?? '';
  const firstName = fullName.split(/\s+/)[0] || user?.email?.split('@')[0] || '';
  const initials =
    fullName
      .split(/\s+/)
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    'U';

  useEffect(() => {
    fetchConstitutions().then(setConstitutions);
  }, []);

  // When continent changes, clear any country selection that no longer fits.
  useEffect(() => {
    if (!countryId) return;
    const c = constitutions.find((x) => x.id === countryId);
    if (continent !== 'all' && c && c.region !== continent) setCountryId(null);
  }, [continent, countryId, constitutions]);

  const filteredCountries = useMemo(
    () =>
      continent === 'all'
        ? constitutions
        : constitutions.filter((c) => c.region === continent),
    [continent, constitutions],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/assistant?q=${encodeURIComponent(q)}`);
    else navigate('/explorer');
  };

  const goToCountry = (id: string) => {
    setCountryId(id);
    navigate(`/explorer/${id}`);
  };

  const featured = constitutions.filter((c) => c.indexed).slice(0, 6);

  const recentCountries = useMemo(() => {
    const byId = new Map(constitutions.map((c) => [c.id, c]));
    return recent
      .map((r) => byId.get(r.constitution_id))
      .filter((c): c is Constitution => !!c)
      .slice(0, 5);
  }, [recent, constitutions]);

  return (
    <div className="flex flex-col min-h-full">
      {/* ==== HERO ==== */}
      <section className="on-map relative px-4 py-14 sm:py-20 md:py-24 flex flex-col items-center text-center overflow-hidden">
        {/* Soft warm/cool wash on top of the global world map */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-60">
          <div className="absolute top-1/4 left-1/4 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-iris-500/15 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-honey-500/15 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-7 md:space-y-8 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate/30 dark:border-ink-700 text-[10px] sm:text-xs uppercase tracking-wider text-slate dark:text-mist bg-paper-soft/60 dark:bg-ink-800/60 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-iris-500" />
            Global Legal Intelligence
          </div>

          <h1 className="leading-tight text-3xl sm:text-4xl md:text-5xl">
            The World&apos;s Constitutions,{' '}
            <br className="hidden sm:block" />
            <span className="gradient-world">Cited &amp; Understood</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate dark:text-mist max-w-2xl mx-auto font-light px-2">
            Browse, listen to, and ask questions about constitutional law from
            every continent. Every answer carries an exact source.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-1 px-2">
            <Link to="/explorer" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-6 py-2.5 sm:px-7 sm:py-3">
                Explore Constitutions
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link to="/assistant" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto px-6 py-2.5 sm:px-7 sm:py-3">
                Ask AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==== Welcome panel (only when logged in) ==== */}
      {user && (
        <section className="px-3 sm:px-4 -mt-6 sm:-mt-8 mb-6 sm:mb-8">
          <Card className="max-w-4xl mx-auto p-5 sm:p-6 bg-paper-soft/95 dark:bg-ink-800/85">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="w-12 h-12 rounded-full bg-gradient-to-br from-iris-500 to-sage-500 text-white flex items-center justify-center text-base font-semibold shrink-0">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wider text-slate dark:text-mist mb-0.5">
                  Welcome back
                </p>
                <h2 className="m-0 text-xl sm:text-2xl truncate">
                  {firstName ? `Hello, ${firstName}` : 'Hello'}
                </h2>
              </div>
              <Link to="/bookmarks" className="shrink-0">
                <Button variant="secondary" className="px-4 py-2">
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Bookmarks</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-honey-500/15 text-honey-500 ml-1">
                    {bookmarks.length}
                  </span>
                </Button>
              </Link>
            </div>

            {recentCountries.length > 0 && (
              <div className="mt-5 pt-5 border-t border-slate/10 dark:border-ink-700">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate dark:text-mist mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  Continue reading
                </div>
                <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
                  {recentCountries.map((c) => (
                    <Link
                      key={c.id}
                      to={`/explorer/${c.id}`}
                      className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border border-slate/20 dark:border-ink-700 hover:border-iris-500 hover:bg-iris-500/5 transition-colors"
                    >
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className="text-sm font-medium truncate max-w-[140px]">
                        {c.country}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </section>
      )}

      {/* ==== Continent + country picker ==== */}
      <section className={`px-3 sm:px-4 ${user ? '' : '-mt-6 sm:-mt-8'}`}>
        <Card className="max-w-4xl mx-auto p-4 sm:p-6 md:p-7 space-y-4 sm:space-y-5 bg-paper-soft/95 dark:bg-ink-800/80 backdrop-blur-md">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.18em] text-slate dark:text-mist">
            <Globe className="w-3.5 h-3.5 text-iris-500" />
            Pick a continent, then a country
          </div>

          <ContinentSelector value={continent} onChange={setContinent} />

          <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-stretch">
            <CountryDropdown
              countries={filteredCountries}
              value={countryId}
              onChange={goToCountry}
              placeholder={
                continent === 'all'
                  ? 'Select any country'
                  : `Select a country in ${regionLabel[continent]}`
              }
            />
            <Button
              onClick={() => countryId && navigate(`/explorer/${countryId}`)}
              disabled={!countryId}
              className="sm:px-6 w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4" />
              Read constitution
            </Button>
          </div>

          {filteredCountries.length === 0 && (
            <p className="text-sm text-slate dark:text-mist">
              No constitutions are indexed for this continent yet.
            </p>
          )}
        </Card>
      </section>

      {/* ==== AI Search ==== */}
      <section className="px-3 sm:px-4 mt-6 sm:mt-10">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <Card className="p-2 pl-4 sm:pl-5 flex items-center gap-2 sm:gap-3 bg-paper-soft/95 dark:bg-ink-800/80 border-slate/15 dark:border-ink-700">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate dark:text-mist shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask: 'right to life in Nigeria'…"
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm md:text-base text-ink-100 dark:text-paper placeholder:text-slate dark:placeholder:text-mist py-2.5 sm:py-3"
            />
            <Button type="submit" className="py-2 px-4 sm:px-5 shrink-0">
              Ask
            </Button>
          </Card>
        </form>
      </section>

      {/* ==== Featured ==== */}
      {featured.length > 0 && (
        <section className="px-3 sm:px-4 py-10 sm:py-14 max-w-7xl mx-auto w-full">
          <div className="flex items-end justify-between mb-5 sm:mb-6">
            <h2 className="m-0 text-2xl sm:text-3xl">Featured constitutions</h2>
            <Link
              to="/explorer"
              className="text-xs sm:text-sm text-iris-500 hover:underline flex items-center gap-1 shrink-0"
            >
              View all <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featured.map((c) => (
              <Link key={c.id} to={`/explorer/${c.id}`}>
                <Card className="p-4 sm:p-6 h-full hover:border-iris-500/50 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-2xl sm:text-3xl">{c.flag}</span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${regionColorClass[c.region]}`}
                    >
                      {regionLabel[c.region]}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif">{c.country}</h3>
                  <p className="text-xs text-slate dark:text-mist mb-2">
                    Adopted {c.adopted}
                  </p>
                  <p className="text-sm text-slate dark:text-mist line-clamp-2">
                    {c.summary}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ==== Features ==== */}
      <section className="px-3 sm:px-4 pb-16 sm:pb-24 max-w-7xl mx-auto w-full">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          <Card className="p-4 sm:p-6 space-y-3 hover:border-iris-500/40 transition-colors">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-iris-500/10 text-iris-500 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg">Global Coverage</h3>
            <p className="text-sm text-slate dark:text-mist">
              Foundational texts from every continent, fully indexed and searchable.
            </p>
          </Card>

          <Card className="p-4 sm:p-6 space-y-3 hover:border-sage-500/40 transition-colors">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-sage-500/10 text-sage-500 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg">Cited AI Answers</h3>
            <p className="text-sm text-slate dark:text-mist">
              The assistant only quotes from indexed articles, with confidence and
              voice readout.
            </p>
          </Card>

          <Card className="p-4 sm:p-6 space-y-3 hover:border-honey-500/40 transition-colors sm:col-span-2 md:col-span-1">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-honey-500/10 text-honey-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg text-honey-500">Voice First</h3>
            <p className="text-sm text-slate dark:text-mist">
              Listen to any article, ask by voice, hear the answer back —
              accessible by design.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

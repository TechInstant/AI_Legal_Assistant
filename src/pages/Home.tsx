import React, { useEffect, useState } from 'react';
import { ArrowRight, Search, Globe, Shield, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Link, useNavigate } from 'react-router-dom';
import { fetchConstitutions, type Constitution } from '../services/api';
import { regionLabel, regionColorClass } from '../data/constitutions';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [constitutions, setConstitutions] = useState<Constitution[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchConstitutions().then(setConstitutions);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) navigate(`/assistant?q=${encodeURIComponent(q)}`);
    else navigate('/explorer');
  };

  const featured = constitutions.slice(0, 6);

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <section className="relative px-4 py-24 sm:py-32 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-region-americas/30 blur-3xl" />
          <div className="absolute top-10 right-1/3 w-72 h-72 rounded-full bg-world-ocean/30 blur-3xl" />
          <div className="absolute bottom-1/4 right-20 w-72 h-72 rounded-full bg-region-asia/30 blur-3xl" />
          <div className="absolute bottom-10 left-1/3 w-72 h-72 rounded-full bg-region-europe/20 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-slate/30 text-xs uppercase tracking-wider text-brand-slate dark:text-brand-mist bg-white/40 dark:bg-brand-carbon/40">
            <Sparkles className="w-3.5 h-3.5 text-world-ocean" />
            Global Legal Intelligence
          </div>

          <h1 className="leading-tight">
            The World&apos;s Constitutions, <br className="hidden sm:block" />
            <span className="gradient-world">Cited &amp; Understood</span>
          </h1>

          <p className="text-lg md:text-xl text-brand-slate dark:text-brand-mist max-w-2xl mx-auto font-light">
            Browse, listen to, and ask questions about constitutional law from
            every continent. Every answer carries an exact source.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/explorer">
              <Button className="w-full sm:w-auto text-base px-8 py-3">
                Explore Constitutions
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/assistant">
              <Button variant="secondary" className="w-full sm:w-auto text-base px-8 py-3">
                Ask AI Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="px-4 -mt-12">
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <Card className="p-2 pl-6 flex items-center gap-4 bg-white/80 dark:bg-brand-carbon/60">
            <Search className="w-5 h-5 text-brand-slate" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything: 'right to life in Nigeria', 'compare US and India'…"
              className="flex-1 bg-transparent border-none outline-none text-base text-world-deep-ocean dark:text-world-sand placeholder:text-brand-slate py-3"
            />
            <Button type="submit" className="py-2 px-6 rounded-xl hidden sm:flex">
              Ask
            </Button>
          </Card>
        </form>
      </section>

      {/* Continental palette legend */}
      <section className="px-4 py-12 max-w-7xl mx-auto w-full">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-brand-slate mb-4">
          Colour-coded by continent
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {(['americas','europe','africa','mideast','asia','oceania','arctic'] as const).map((r) => (
            <span
              key={r}
              className={`text-xs px-3 py-1 rounded-full border ${regionColorClass[r]}`}
            >
              {regionLabel[r]}
            </span>
          ))}
        </div>
      </section>

      {/* Featured constitutions */}
      {featured.length > 0 && (
        <section className="px-4 pb-16 max-w-7xl mx-auto w-full">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-serif text-world-deep-ocean dark:text-world-sand m-0">
              Featured constitutions
            </h2>
            <Link
              to="/explorer"
              className="text-sm text-world-ocean hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((c) => (
              <Link key={c.id} to={`/explorer/${c.id}`}>
                <Card className="p-6 h-full bg-white/70 dark:bg-brand-carbon/40 hover:border-world-ocean transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-3xl">{c.flag}</span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${regionColorClass[c.region]}`}
                    >
                      {regionLabel[c.region]}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif text-world-deep-ocean dark:text-world-sand">
                    {c.country}
                  </h3>
                  <p className="text-xs text-brand-slate dark:text-brand-mist mb-2">
                    Adopted {c.adopted}
                  </p>
                  <p className="text-sm text-brand-slate dark:text-brand-mist line-clamp-2">
                    {c.summary}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="px-4 pb-24 max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4 bg-white/70 dark:bg-brand-carbon/40 hover:border-world-ocean/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-world-ocean/10 flex items-center justify-center text-world-ocean">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Global Coverage</h3>
            <p className="text-brand-slate dark:text-brand-mist text-sm">
              Foundational texts from every continent, fully indexed and searchable, with continent-coded navigation.
            </p>
          </Card>

          <Card className="p-6 space-y-4 bg-white/70 dark:bg-brand-carbon/40 hover:border-world-forest/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-world-forest/10 flex items-center justify-center text-world-forest">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">Cited AI Answers</h3>
            <p className="text-brand-slate dark:text-brand-mist text-sm">
              The assistant only quotes from indexed articles and shows confidence — it never invents law.
            </p>
          </Card>

          <Card className="p-6 space-y-4 bg-white/70 dark:bg-brand-carbon/40 hover:border-world-earth/50 border-world-earth/20 relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 px-3 py-1 bg-world-earth/20 text-world-earth text-xs font-bold rounded-bl-lg">
              ACCESSIBLE
            </div>
            <div className="w-12 h-12 rounded-full bg-world-earth/10 flex items-center justify-center text-world-earth">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-world-earth">Voice Narration</h3>
            <p className="text-brand-slate dark:text-brand-mist text-sm">
              Listen to any constitutional article using your browser&apos;s built-in speech engine.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

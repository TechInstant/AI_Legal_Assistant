import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, UserPlus, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const Signup: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    const { error: err, needsConfirmation } = await signUp(
      email.trim(),
      password,
      fullName.trim() || undefined,
    );
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    if (needsConfirmation) {
      setInfo(
        'Check your inbox to confirm your email, then sign in. (If your Supabase project disables email confirmation, you can sign in directly.)',
      );
      return;
    }
    navigate('/explorer', { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white/80 dark:bg-brand-carbon/40">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-region-africa via-world-earth to-region-asia flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-world-deep-ocean dark:text-world-sand">
            Join LexIntell
          </h1>
          <p className="text-sm text-brand-slate dark:text-brand-mist">
            Create an account to save research, get AI explanations, and follow constitutions worldwide.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm space-y-1">
            <span className="text-brand-slate dark:text-brand-mist">Full name</span>
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white dark:bg-world-navy/60 border border-brand-slate/30 rounded-xl py-3 px-4 outline-none focus:border-world-ocean transition-colors"
              placeholder="Ada Lovelace"
            />
          </label>

          <label className="block text-sm space-y-1">
            <span className="text-brand-slate dark:text-brand-mist">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-world-navy/60 border border-brand-slate/30 rounded-xl py-3 px-4 outline-none focus:border-world-ocean transition-colors"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm space-y-1">
            <span className="text-brand-slate dark:text-brand-mist">
              Password{' '}
              <span className="text-xs text-brand-slate/70">(min 6 characters)</span>
            </span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-world-navy/60 border border-brand-slate/30 rounded-xl py-3 px-4 outline-none focus:border-world-ocean transition-colors"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="text-sm text-region-americas bg-region-americas/10 border border-region-americas/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {info && (
            <p className="text-sm text-world-forest bg-world-forest/10 border border-world-forest/30 rounded-lg px-3 py-2">
              {info}
            </p>
          )}

          <Button type="submit" disabled={busy} className="w-full py-3">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {busy ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="text-sm text-center text-brand-slate dark:text-brand-mist">
          Already have an account?{' '}
          <Link to="/login" className="text-world-ocean hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
};

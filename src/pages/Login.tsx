import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, LogIn, ShieldCheck } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/explorer';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: err } = await signIn(email.trim(), password);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 md:p-10 space-y-6 bg-white/80 dark:bg-brand-carbon/40">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-world-ocean to-world-forest flex items-center justify-center text-white shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-world-deep-ocean dark:text-world-sand">
            Welcome back
          </h1>
          <p className="text-sm text-brand-slate dark:text-brand-mist">
            Sign in to bookmark articles, save notes, and chat with the legal AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <span className="text-brand-slate dark:text-brand-mist">Password</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
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

          <Button type="submit" disabled={busy} className="w-full py-3">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-sm text-center text-brand-slate dark:text-brand-mist">
          New here?{' '}
          <Link to="/signup" className="text-world-ocean hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
};

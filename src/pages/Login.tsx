import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, LogIn, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/explorer';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
            {t('auth.welcome_back')}
          </h1>
          <p className="text-sm text-brand-slate dark:text-brand-mist">
            {t('auth.login_subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm space-y-1">
            <span className="text-brand-slate dark:text-brand-mist">{t('auth.email')}</span>
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
            <span className="text-brand-slate dark:text-brand-mist">{t('auth.password')}</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-world-navy/60 border border-brand-slate/30 rounded-xl py-3 pl-4 pr-12 outline-none focus:border-world-ocean transition-colors"
                placeholder="*************"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-brand-slate hover:text-world-ocean dark:text-brand-mist dark:hover:text-world-ocean transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>

          {error && (
            <p className="text-sm text-region-americas bg-region-americas/10 border border-region-americas/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="w-full py-3">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {busy ? t('auth.signing_in') : t('auth.sign_in')}
          </Button>
          <p className="text-[11px] text-center text-brand-slate dark:text-brand-mist/80 pt-2">
            {t('auth.terms_agree_login').split('<terms>')[0]}
            <Link to="/terms" className="underline hover:text-world-ocean">{t('footer.terms')}</Link>
            {' '}&{' '}
            <Link to="/privacy" className="underline hover:text-world-ocean">{t('footer.privacy')}</Link>.
          </p>
        </form>

        <p className="text-sm text-center text-brand-slate dark:text-brand-mist">
          {t('auth.new_here')}{' '}
          <Link to="/signup" className="text-world-ocean hover:underline font-medium">
            {t('auth.create_account')}
          </Link>
        </p>
      </Card>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Scale,
  MessageSquare,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Home,
  LogIn,
  UserPlus,
  Bookmark,
  User as UserIcon,
} from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { WorldMap } from './WorldMap';
import { useTranslation } from 'react-i18next';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const navItems = [
    { name: t('nav.home'), path: '/', icon: Home, exact: true, authOnly: false },
    { name: t('nav.explorer'), path: '/explorer', icon: BookOpen, exact: false, authOnly: false },
    { name: t('nav.assistant'), path: '/assistant', icon: MessageSquare, exact: false, authOnly: false },
    { name: t('nav.bookmarks'), path: '/bookmarks', icon: Bookmark, exact: false, authOnly: true },
    { name: t('nav.blog'), path: '/blog', icon: BookOpen, exact: false, authOnly: false },
  ];

  const visibleNavItems = navItems.filter((i) => !i.authOnly || !!user);

  // Lock body scroll while the side drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // Close drawer when navigating.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const initials =
    (user?.user_metadata?.full_name as string | undefined)
      ?.split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    '';

  const handleSignOut = async () => {
    setAccountOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative isolate">
      {/* ===== Background stack (fixed, behind everything) =====
          Layered, from bottom to top:
            1. The body's base colour (paper / ink-950)
            2. The world map watermark, gently floating
            3. A radial vignette so text near the centre stays crisp
      */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none flex items-center justify-center overflow-hidden"
      >
        <WorldMap
          variant="silhouette"
          fade
          className="world-float w-[140%] max-w-[1800px] -translate-y-[3%] opacity-[0.20] dark:opacity-[0.22] dark:invert text-iris-500/30 dark:text-iris-300/25"
        />
      </div>
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none page-vignette"
      />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-paper/85 dark:bg-ink-950/80 backdrop-blur-md border-b border-slate/15 dark:border-ink-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-region-americas via-world-earth to-region-asia flex items-center justify-center text-white shadow-lg group-hover:shadow-world-ocean/20 transition-all">
                <Scale className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-xl tracking-wide text-world-deep-ocean dark:text-world-sand hidden sm:block">
                Juri<span className="gradient-world">Sphere</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {visibleNavItems.filter((i) => i.path !== '/').map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-iris-500'
                        : 'text-slate dark:text-mist hover:text-ink-100 dark:hover:text-paper'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <select 
                value={i18n.resolvedLanguage || 'en'} 
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium text-brand-slate dark:text-brand-mist hover:text-world-ocean outline-none border-none cursor-pointer px-1"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
              </select>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-brand-slate dark:text-brand-mist hover:text-world-ocean transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {loading ? (
                <div className="h-9 w-24 rounded-xl bg-brand-slate/10 animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-brand-slate/30 hover:border-world-ocean transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-world-ocean to-world-forest text-white flex items-center justify-center text-xs font-semibold">
                      {initials || <UserIcon className="w-4 h-4" />}
                    </span>
                    <span className="text-sm text-brand-slate dark:text-brand-mist max-w-[140px] truncate">
                      {user.email}
                    </span>
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate/20 dark:border-ink-700 bg-paper-soft dark:bg-ink-800 shadow-xl py-2">
                      <div className="px-4 py-2 text-xs text-slate dark:text-mist border-b border-slate/15 dark:border-ink-700">
                        Signed in as
                        <div className="truncate font-medium text-ink-100 dark:text-paper">
                          {user.email}
                        </div>
                      </div>
                      <Link
                        to="/bookmarks"
                        onClick={() => setAccountOpen(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-ink-100 dark:text-paper hover:bg-iris-500/5 hover:text-iris-500 transition-colors"
                      >
                        <Bookmark className="w-4 h-4" /> Bookmarks
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate dark:text-mist hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-sm px-4 py-2">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="text-sm px-5 py-2">Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-slate dark:text-mist hover:text-iris-500 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 text-slate dark:text-mist hover:text-iris-500 transition-colors"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ===== Mobile slide-in side drawer ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            className="md:hidden fixed inset-0 z-[60]"
            initial={{ pointerEvents: 'none' }}
            animate={{ pointerEvents: 'auto' }}
            exit={{ pointerEvents: 'none' }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer panel — slides from the right */}
            <motion.aside
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm
                         bg-paper-soft dark:bg-ink-900
                         border-l border-slate/15 dark:border-ink-700
                         shadow-2xl shadow-ink-900/30 dark:shadow-black/60
                         flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Main navigation"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between h-20 px-5 border-b border-slate/15 dark:border-ink-700">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-region-americas via-honey-500 to-region-asia flex items-center justify-center text-white shadow">
                    <Scale className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-lg">
                    Juri<span className="gradient-world">Sphere</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg text-slate dark:text-mist hover:bg-slate/10"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User card */}
              {user && (
                <div className="px-5 py-4 border-b border-slate/15 dark:border-ink-700">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-iris-500 to-sage-500 text-white flex items-center justify-center text-sm font-semibold">
                      {initials || <UserIcon className="w-4 h-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs uppercase tracking-wider text-slate dark:text-mist">
                        Signed in as
                      </div>
                      <div className="text-sm font-medium truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {visibleNavItems.map((item) => {
                  const isActive = item.exact
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] transition-colors ${
                        isActive
                          ? 'bg-iris-500/10 text-iris-500 font-medium'
                          : 'text-ink-100 dark:text-paper hover:bg-slate/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" /> {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Auth actions */}
              <div className="border-t border-slate/15 dark:border-ink-700 p-4 space-y-2">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-rose-500 border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block"
                    >
                      <Button variant="secondary" className="w-full">
                        <LogIn className="w-4 h-4" /> Log in
                      </Button>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="block"
                    >
                      <Button className="w-full">
                        <UserPlus className="w-4 h-4" /> Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area — flex column so child pages can use flex-1 */}
      <main className="flex-1 flex flex-col bg-gradient-dark">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate/15 dark:border-ink-700 bg-paper/60 dark:bg-ink-950/70 backdrop-blur-sm py-6 md:py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs md:text-sm text-slate dark:text-mist space-y-4">
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-region-americas" />
            <span className="w-2 h-2 rounded-full bg-region-oceania" />
            <span className="w-2 h-2 rounded-full bg-honey-500" />
            <span className="w-2 h-2 rounded-full bg-region-asia" />
            <span className="w-2 h-2 rounded-full bg-iris-500" />
            <span className="w-2 h-2 rounded-full bg-region-europe" />
          </div>
          
          <div className="flex justify-center gap-4 text-xs font-medium">
            <Link to="/privacy" className="hover:text-iris-500 transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-iris-500 transition-colors">{t('footer.terms')}</Link>
          </div>

          <p className="max-w-2xl mx-auto text-[10px] sm:text-xs opacity-80">
            <strong>Disclaimer:</strong> {t('footer.disclaimer')}
          </p>

          <p>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-[11px] md:text-xs text-slate/80 dark:text-mist/80">
            Powered by{' '}
            <span className="font-semibold tracking-wide gradient-world">
              Techinstant
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

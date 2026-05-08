import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Scale,
  MessageSquare,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { user, signOut, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const navItems = [
    { name: 'Explorer', path: '/explorer', icon: BookOpen },
    { name: 'Assistant', path: '/assistant', icon: MessageSquare },
  ];

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
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-world-navy/80 backdrop-blur-md border-b border-brand-slate/20 dark:border-brand-slate/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-region-americas via-world-earth to-region-asia flex items-center justify-center text-white shadow-lg group-hover:shadow-world-ocean/20 transition-all">
                <Scale className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-xl tracking-wide text-world-deep-ocean dark:text-world-sand hidden sm:block">
                Lex<span className="gradient-world">Intell</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-world-ocean'
                        : 'text-brand-slate dark:text-brand-mist hover:text-world-deep-ocean dark:hover:text-world-sand'
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
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-brand-slate/30 bg-white dark:bg-brand-carbon shadow-xl py-2">
                      <div className="px-4 py-2 text-xs text-brand-slate dark:text-brand-mist border-b border-brand-slate/20">
                        Signed in as
                        <div className="truncate font-medium text-world-deep-ocean dark:text-world-sand">
                          {user.email}
                        </div>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-brand-slate dark:text-brand-mist hover:bg-region-americas/10 hover:text-region-americas transition-colors"
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
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 text-brand-slate dark:text-brand-mist"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-2 text-brand-slate dark:text-brand-mist"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          {menuOpen && (
            <div className="md:hidden border-t border-brand-slate/20 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-brand-slate dark:text-brand-mist hover:bg-brand-slate/10"
                  >
                    <Icon className="w-4 h-4" /> {item.name}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-brand-slate/20 flex flex-col gap-2 px-3">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 py-2 text-sm text-region-americas"
                  >
                    <LogOut className="w-4 h-4" /> Sign out ({user.email})
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)}>
                      <Button variant="ghost" className="w-full">
                        Log in
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-gradient-dark">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-slate/20 dark:border-brand-slate/30 bg-world-sand/50 dark:bg-[#0A0F1A] py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-brand-slate space-y-2">
          <div className="flex justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-region-americas" />
            <span className="w-2 h-2 rounded-full bg-region-oceania" />
            <span className="w-2 h-2 rounded-full bg-world-earth" />
            <span className="w-2 h-2 rounded-full bg-region-asia" />
            <span className="w-2 h-2 rounded-full bg-world-ocean" />
            <span className="w-2 h-2 rounded-full bg-region-europe" />
          </div>
          <p>&copy; {new Date().getFullYear()} LexIntell — Global Constitutional Intelligence.</p>
        </div>
      </footer>
    </div>
  );
};

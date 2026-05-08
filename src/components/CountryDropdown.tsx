import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search } from 'lucide-react';
import type { Constitution } from '../services/api';

/**
 * The dropdown menu is rendered via a portal so that ancestor stacking
 * contexts (cards using `backdrop-blur`, sections with their own z-index,
 * etc.) cannot clip or paint over it. The portal position is recomputed
 * on open, on scroll, and on resize so it tracks the trigger.
 */

interface CountryDropdownProps {
  countries: Constitution[];
  value: string | null;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
}

interface MenuRect { top: number; left: number; width: number; }

export const CountryDropdown: React.FC<CountryDropdownProps> = ({
  countries,
  value,
  onChange,
  placeholder = 'Select a country',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [rect, setRect] = useState<MenuRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const selected = countries.find((c) => c.id === value) ?? null;
  const filtered = query.trim()
    ? countries.filter((c) =>
        c.country.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : countries;

  // Recompute menu position relative to the trigger.
  const reposition = () => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setRect({
      top: r.bottom + window.scrollY + 8,
      left: r.left + window.scrollX,
      width: r.width,
    });
  };

  useLayoutEffect(() => {
    if (open) reposition();
  }, [open]);

  // Close + reposition handlers.
  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
      setQuery('');
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    const onWindowChange = () => reposition();

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onWindowChange);
    window.addEventListener('scroll', onWindowChange, true);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onWindowChange);
      window.removeEventListener('scroll', onWindowChange, true);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-[12px]
                   bg-paper-soft dark:bg-ink-800
                   border border-slate/30 dark:border-ink-700
                   text-ink-100 dark:text-paper text-sm
                   hover:border-iris-500 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-iris-500/40"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 truncate">
          {selected ? (
            <>
              <span className="text-xl leading-none">{selected.flag}</span>
              <span className="truncate font-medium">{selected.country}</span>
            </>
          ) : (
            <span className="text-slate dark:text-mist">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate dark:text-mist transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && rect && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            zIndex: 70,
          }}
          className="rounded-[12px] overflow-hidden
                     bg-paper-soft dark:bg-ink-800
                     border border-slate/20 dark:border-ink-700
                     shadow-2xl shadow-ink-900/15 dark:shadow-black/60"
          role="listbox"
        >
          <div className="p-2 border-b border-slate/15 dark:border-ink-700">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-paper dark:bg-ink-900/60">
              <Search className="w-3.5 h-3.5 text-slate dark:text-mist" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate/70 text-ink-100 dark:text-paper"
              />
            </div>
          </div>

          <ul className="max-h-72 overflow-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate dark:text-mist">
                No countries match.
              </li>
            ) : (
              filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(c.id);
                      setOpen(false);
                      setQuery('');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                              ${value === c.id ? 'bg-iris-500/10 text-iris-500' : 'text-ink-100 dark:text-paper hover:bg-iris-500/5'}`}
                  >
                    <span className="text-xl leading-none shrink-0">{c.flag}</span>
                    <span className="flex-1 text-left truncate min-w-0">
                      <span className="font-medium block truncate">{c.country}</span>
                      <span className="block text-[11px] text-slate dark:text-mist truncate">
                        {c.indexed
                          ? c.title || 'Constitutional text indexed'
                          : c.capital
                            ? `${c.capital} · ${c.subregion || 'Country profile'}`
                            : 'Country profile'}
                      </span>
                    </span>
                    {c.indexed && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-sage-500/40 text-sage-500 bg-sage-500/5 shrink-0">
                        Indexed
                      </span>
                    )}
                    {value === c.id && (
                      <Check className="w-4 h-4 text-iris-500 shrink-0" />
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>,
        document.body,
      )}
    </div>
  );
};

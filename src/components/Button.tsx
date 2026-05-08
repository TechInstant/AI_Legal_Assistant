import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[12px] font-medium ' +
    'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40';

  const variants = {
    primary:
      'bg-brand-500 text-white shadow-sm hover:bg-brand-600 hover:shadow-lg ' +
      'hover:-translate-y-[1px] active:translate-y-0 active:bg-brand-700',
    secondary:
      'bg-transparent text-ink-100 dark:text-paper ' +
      'border border-slate/40 dark:border-ink-700 ' +
      'hover:border-brand-500 hover:text-brand-500 ' +
      'hover:shadow-[0_0_0_4px_rgba(36,119,45,0.10)]',
    ghost:
      'bg-transparent text-slate dark:text-mist ' +
      'hover:text-brand-500 hover:bg-brand-500/5',
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

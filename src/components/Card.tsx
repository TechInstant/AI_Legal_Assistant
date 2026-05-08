import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        // More opaque surface so text reads crisply over the world map watermark.
        'bg-paper-soft/95 dark:bg-ink-800/85 backdrop-blur-xl',
        'border border-slate/15 dark:border-ink-700',
        'rounded-card p-6',
        'shadow-[0_4px_24px_rgba(15,18,30,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55)]',
        'transition-colors duration-300',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-paper-soft/90 dark:bg-ink-800/70 backdrop-blur-md',
        'border border-slate/15 dark:border-ink-700',
        'rounded-[18px] p-6',
        'shadow-[0_2px_8px_rgba(15,18,30,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
        'transition-colors duration-300',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

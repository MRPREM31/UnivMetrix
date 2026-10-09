import React from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'silver' | 'platinum' | 'palladium' | 'up' | 'down' | 'neutral' | 'warning';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface-elevated text-text-secondary border-border',
    gold: 'bg-gold-500/15 text-gold-500 dark:text-gold-400 border-gold-500/30',
    silver: 'bg-slate-400/15 text-slate-700 dark:text-slate-300 border-slate-400/30',
    platinum: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30',
    palladium: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30',
    up: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    down: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
    neutral: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

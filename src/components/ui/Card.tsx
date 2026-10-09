import React from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'outline';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hoverable = false,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface border border-border shadow-card',
    elevated: 'bg-surface-elevated border border-border shadow-panel',
    subtle: 'bg-surface-subtle border border-border/70',
    outline: 'bg-transparent border border-border',
  };

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        variantStyles[variant],
        hoverable && 'hover:border-border-strong hover:shadow-card-hover hover:-translate-y-[1px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('p-4 sm:p-5 border-b border-border/80 flex items-center justify-between', className)} {...props}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('p-4 sm:p-5', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('p-4 sm:p-5 border-t border-border/80 bg-surface-subtle/50 rounded-b-xl', className)} {...props}>
    {children}
  </div>
);

import React from 'react';
import { cn } from '../../lib/cn';

export interface TabItem {
  id: string;
  label: string;
  badge?: string;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'pill' | 'underline' | 'buttons';
  size?: 'sm' | 'md';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  size = 'md',
  className,
}) => {
  const isSmall = size === 'sm';

  if (variant === 'pill') {
    return (
      <div
        className={cn(
          'inline-flex items-center bg-surface-elevated rounded-lg border border-border',
          isSmall ? 'p-0.5' : 'p-1',
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative font-medium rounded-md transition-all duration-150 cursor-pointer select-none',
                isSmall ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm',
                isActive
                  ? 'bg-surface text-text-primary shadow-sm font-semibold border border-border/60'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle/50'
              )}
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded font-mono',
                      isActive ? 'bg-gold-500/20 text-gold-500' : 'bg-surface-subtle text-text-muted'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex border-b border-border', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'border-b-2 transition-colors -mb-px flex items-center gap-2 cursor-pointer',
              isSmall ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm font-medium',
              isActive
                ? 'border-gold-500 text-gold-500 font-semibold'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong'
            )}
          >
            {tab.label}
            {tab.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

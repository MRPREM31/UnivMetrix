import React from 'react';
import { AlertTriangle, Database } from 'lucide-react';
import { cn } from '../../lib/cn';

interface DisclaimerBannerProps {
  variant?: 'info' | 'warning' | 'subtle';
  isDemo?: boolean;
  className?: string;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  variant = 'info',
  isDemo = true,
  className,
}) => {
  if (!isDemo) {
    return (
      <div
        className={cn(
          'rounded-xl border p-3.5 sm:p-4 transition-colors text-xs sm:text-sm flex items-start gap-3 bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200',
          className
        )}
      >
        <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
          <Database className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary text-xs uppercase tracking-wider">
              Supabase PostgreSQL Storage Active &middot; Published Records
            </span>
          </div>
          <p className="leading-relaxed text-xs text-text-secondary">
            Precious metal quotes and historical archives are streaming from your Supabase PostgreSQL observation repository.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-3.5 sm:p-4 transition-colors text-xs sm:text-sm flex items-start gap-3',
        variant === 'warning'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
          : variant === 'subtle'
          ? 'bg-surface-subtle border-border text-text-secondary'
          : 'bg-surface-elevated border-border text-text-secondary',
        className
      )}
    >
      <div className="p-1 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
        <AlertTriangle className="w-4 h-4" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary text-xs uppercase tracking-wider">
            Phase 2 Prototype &middot; Demo Data Fallback Mode
          </span>
        </div>
        <p className="leading-relaxed text-xs text-text-secondary">
          PostgreSQL schema & data access layer ready. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code> to connect real Supabase storage.
        </p>
      </div>
    </div>
  );
};

export const LiveDataStatusChip: React.FC<{ isDemo?: boolean }> = ({ isDemo = true }) => {
  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-elevated border border-border text-xs font-medium">
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            isDemo ? 'bg-amber-400' : 'bg-emerald-400'
          )}
        ></span>
        <span
          className={cn(
            'relative inline-flex rounded-full h-2 w-2',
            isDemo ? 'bg-amber-500' : 'bg-emerald-500'
          )}
        ></span>
      </span>
      <span className="text-text-secondary">
        {isDemo ? 'Demo Fallback — DB Disconnected' : 'Supabase PostgreSQL Active'}
      </span>
    </div>
  );
};

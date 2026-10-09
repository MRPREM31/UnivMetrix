import React, { useState, useEffect } from 'react';
import { RotateCw, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { getKolkataDateString, getKolkataTimeString } from '../../lib/time';

interface OverviewHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastRefreshedAt?: string;
  isDemo?: boolean;
}

export const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  onRefresh,
  isRefreshing,
  isDemo = true,
}) => {
  const [dateStr, setDateStr] = useState<string>(getKolkataDateString());
  const [timeStr, setTimeStr] = useState<string>(getKolkataTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateStr(getKolkataDateString());
      setTimeStr(getKolkataTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-border/60">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary">
            Precious Metals Overview
          </h1>
          <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-gold-500/10 text-gold-500 border border-gold-500/20">
            India Spot Benchmark
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-text-muted">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gold-500" />
            <span className="text-text-secondary font-medium">{dateStr}</span>
            <span>({timeStr} IST)</span>
          </div>
          <span className="hidden sm:inline">&bull;</span>
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isDemo
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDemo ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            ></span>
            <span>
              {isDemo
                ? 'Demo fallback — Supabase unconfigured'
                : 'Supabase PostgreSQL DB Connected'}
            </span>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            className="text-xs"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Demo Prices</span>
          </Button>
        </div>
      )}
    </div>
  );
};

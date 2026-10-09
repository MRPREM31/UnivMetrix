import React from 'react';
import type { PriceHistoryPoint } from '../../types/metal';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { formatINR, formatPercent } from '../../lib/formatters';
import { formatISTDateOnly, formatISTDateTime } from '../../lib/time';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/cn';

interface HistoricalTableProps {
  data: PriceHistoryPoint[];
  loading?: boolean;
  unitLabel?: string;
  multiplier?: number;
  title?: string;
}

export const HistoricalTable: React.FC<HistoricalTableProps> = ({
  data,
  loading = false,
  unitLabel = '1g',
  multiplier = 1,
  title = 'Recent Historical Records',
}) => {
  if (loading) {
    return (
      <Card className="p-5 space-y-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </Card>
    );
  }

  // Display top 10 most recent points (reversed chronologically)
  const recentRecords = [...data].reverse().slice(0, 10);

  return (
    <Card className="overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-text-primary">{title}</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Rates per {unitLabel} &middot; Deterministic demonstration fixtures
          </p>
        </div>
        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-surface-elevated text-text-muted border border-border">
          {recentRecords.length} Entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-surface-elevated/60 text-text-secondary border-b border-border font-semibold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4 sm:px-6">Date / Timestamp</th>
              <th className="py-2.5 px-4">Closing Rate</th>
              <th className="py-2.5 px-4">Daily Change</th>
              <th className="py-2.5 px-4 hidden sm:table-cell">Day High</th>
              <th className="py-2.5 px-4 hidden sm:table-cell">Day Low</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {recentRecords.map((item, idx) => {
              const prevItem = recentRecords[idx + 1];
              const scaledPrice = item.price * multiplier;
              const scaledHigh = item.high * multiplier;
              const scaledLow = item.low * multiplier;

              const diff = prevItem ? item.price - prevItem.price : 0;
              const diffPercent = prevItem ? (diff / prevItem.price) * 100 : 0;
              const isPositive = diff > 0;
              const isNegative = diff < 0;

              return (
                <tr key={item.timestamp || idx} className="hover:bg-surface-elevated/40 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-medium text-text-primary">
                    <div>{formatISTDateOnly(item.timestamp)}</div>
                    <div className="text-[10px] font-mono text-text-muted">
                      {formatISTDateTime(item.timestamp)}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-text-primary">
                    {formatINR(scaledPrice)}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <div
                      className={cn(
                        'inline-flex items-center gap-1 font-semibold text-xs',
                        isPositive && 'text-emerald-500',
                        isNegative && 'text-rose-500',
                        !isPositive && !isNegative && 'text-text-muted'
                      )}
                    >
                      {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
                      {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
                      {!isPositive && !isNegative && <Minus className="w-3.5 h-3.5" />}
                      <span>{formatPercent(diffPercent)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell font-mono text-text-secondary">
                    {formatINR(scaledHigh)}
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell font-mono text-text-secondary">
                    {formatINR(scaledLow)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

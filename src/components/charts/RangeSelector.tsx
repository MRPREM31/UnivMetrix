import React from 'react';
import type { ChartRange } from '../../types/metal';
import { cn } from '../../lib/cn';

interface RangeSelectorProps {
  selectedRange: ChartRange;
  onSelectRange: (range: ChartRange) => void;
  className?: string;
  disabled?: boolean;
}

const ranges: { id: ChartRange; label: string }[] = [
  { id: '1D', label: '1D' },
  { id: '1W', label: '1W' },
  { id: '1M', label: '1M' },
  { id: '6M', label: '6M' },
  { id: '1Y', label: '1Y' },
  { id: 'ALL', label: 'ALL' },
];

export const RangeSelector: React.FC<RangeSelectorProps> = ({
  selectedRange,
  onSelectRange,
  className,
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center p-1 bg-surface-elevated rounded-lg border border-border',
        className
      )}
    >
      {ranges.map((range) => {
        const isActive = range.id === selectedRange;
        return (
          <button
            key={range.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectRange(range.id)}
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer select-none',
              isActive
                ? 'bg-surface text-gold-500 dark:text-gold-400 shadow-sm border border-border/80'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle/70'
            )}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
};

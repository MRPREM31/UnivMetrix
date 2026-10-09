import React from 'react';
import type { GoldPurity } from '../../types/metal';
import { cn } from '../../lib/cn';

interface PuritySelectorProps {
  selectedPurity: GoldPurity;
  onSelectPurity: (purity: GoldPurity) => void;
  className?: string;
}

const purities: { id: GoldPurity; title: string; subtitle: string; tag: string }[] = [
  {
    id: '24K',
    title: '24 Karat (999)',
    subtitle: '99.9% Pure Gold',
    tag: 'Investment / Bullion',
  },
  {
    id: '22K',
    title: '22 Karat (916)',
    subtitle: '91.6% Pure Gold',
    tag: 'Jewelry Standard',
  },
  {
    id: '18K',
    title: '18 Karat (750)',
    subtitle: '75.0% Pure Gold',
    tag: 'Diamond & Daily Wear',
  },
];

export const PuritySelector: React.FC<PuritySelectorProps> = ({
  selectedPurity,
  onSelectPurity,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-3 gap-3', className)}>
      {purities.map((item) => {
        const isSelected = item.id === selectedPurity;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectPurity(item.id)}
            className={cn(
              'p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer select-none',
              isSelected
                ? 'bg-gold-500/10 border-gold-500 shadow-sm ring-1 ring-gold-500/40'
                : 'bg-surface border-border hover:border-border-strong hover:bg-surface-elevated'
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={cn(
                  'font-bold text-sm',
                  isSelected ? 'text-gold-500' : 'text-text-primary'
                )}
              >
                {item.title}
              </span>
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded font-medium',
                  isSelected
                    ? 'bg-gold-500/20 text-gold-600 dark:text-gold-400'
                    : 'bg-surface-elevated text-text-muted'
                )}
              >
                {item.id}
              </span>
            </div>
            <div className="text-xs text-text-secondary">{item.subtitle}</div>
            <div className="text-[11px] text-text-muted mt-1">{item.tag}</div>
          </button>
        );
      })}
    </div>
  );
};

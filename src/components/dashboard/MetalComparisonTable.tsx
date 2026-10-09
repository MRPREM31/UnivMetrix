import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';
import type { PriceQuote } from '../../types/metal';
import { Card } from '../ui/Card';
import { formatINR, formatPercent } from '../../lib/formatters';
import { cn } from '../../lib/cn';

interface MetalComparisonTableProps {
  quotes: Record<string, PriceQuote>;
  loading?: boolean;
}

export const MetalComparisonTable: React.FC<MetalComparisonTableProps> = ({
  quotes,
}) => {
  const metalsList = [
    { key: 'gold-24k', path: '/gold', name: 'Gold 24K', benchmark: 'Pure 99.9%' },
    { key: 'gold-22k', path: '/gold', name: 'Gold 22K', benchmark: 'Jewelry 91.6%' },
    { key: 'gold-18k', path: '/gold', name: 'Gold 18K', benchmark: 'Ornamental 75%' },
    { key: 'silver', path: '/silver', name: 'Silver 999', benchmark: 'Fine Silver' },
    { key: 'platinum', path: '/platinum', name: 'Platinum 950', benchmark: 'Noble Metal' },
    { key: 'palladium', path: '/palladium', name: 'Palladium 950', benchmark: 'Industrial PGM' },
  ];

  return (
    <Card className="overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-bold text-base text-text-primary">Precious Metals Comparative Table</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Key rates in INR per gram and standard 10g/1kg benchmarks
          </p>
        </div>
        <span className="text-[11px] font-mono text-text-muted hidden sm:inline">
          Currency: INR (₹)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-surface-elevated/70 text-text-secondary border-b border-border font-semibold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 sm:px-6">Metal & Purity</th>
              <th className="py-3 px-4">Rate (1g)</th>
              <th className="py-3 px-4 hidden md:table-cell">Standard Unit</th>
              <th className="py-3 px-4">24h Change</th>
              <th className="py-3 px-4 hidden sm:table-cell">24h High / Low</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {metalsList.map(({ key, path, name, benchmark }) => {
              const quote = quotes[key];
              if (!quote) return null;

              const isPositive = quote.change > 0;
              const isNegative = quote.change < 0;

              // Calculate 10g or 1kg standard benchmark
              const standardMultiplier = quote.metalGroup === 'silver' ? 1000 : 10;
              const standardLabel = quote.metalGroup === 'silver' ? '₹ / 1 kg' : '₹ / 10g';
              const standardPrice = quote.currentPrice * standardMultiplier;

              return (
                <tr
                  key={key}
                  className="hover:bg-surface-elevated/50 transition-colors group"
                >
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="font-bold text-text-primary flex items-center gap-2">
                      <Link to={path} className="hover:text-gold-500 transition-colors">
                        {name}
                      </Link>
                      <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-surface-elevated text-text-muted border border-border">
                        {benchmark}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-text-primary text-sm">
                    {formatINR(quote.currentPrice)}
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell font-mono text-text-secondary">
                    <div>{formatINR(standardPrice)}</div>
                    <div className="text-[10px] text-text-muted">{standardLabel}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
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
                      <span>{formatPercent(quote.changePercent)}</span>
                    </div>
                    <div className="text-[10px] text-text-muted hidden xs:block">
                      {formatINR(quote.change, { showSign: true })}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell font-mono text-xs text-text-muted">
                    <div>H: {formatINR(quote.high24h)}</div>
                    <div>L: {formatINR(quote.low24h)}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={path}
                      className="inline-flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-gold-500 transition-colors"
                    >
                      <span>View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
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

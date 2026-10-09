import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, ArrowRight, Coins, Layers, Sparkles } from 'lucide-react';
import type { PriceQuote, MetalGroup } from '../../types/metal';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { formatINR, formatPercent } from '../../lib/formatters';
import { cn } from '../../lib/cn';

interface MarketSummaryCardProps {
  quote?: PriceQuote;
  loading?: boolean;
  error?: string | null;
  href?: string;
  customUnitMultiplier?: number;
  customUnitLabel?: string;
}

const METAL_ICONS: Record<MetalGroup, React.ComponentType<{ className?: string }>> = {
  gold: Coins,
  silver: Layers,
  platinum: Sparkles,
  palladium: Sparkles,
};

export const MarketSummaryCard: React.FC<MarketSummaryCardProps> = ({
  quote,
  loading = false,
  error,
  href,
  customUnitMultiplier = 1,
  customUnitLabel,
}) => {
  if (loading) {
    return (
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-9 w-36" />
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      </Card>
    );
  }

  if (error || !quote) {
    return (
      <Card className="p-5 border-rose-500/20 bg-rose-500/5">
        <p className="text-xs text-rose-500 font-medium">Price data unavailable</p>
        <p className="text-[11px] text-text-muted mt-1">{error || 'Unable to retrieve metal quote.'}</p>
      </Card>
    );
  }

  const isPositive = quote.change > 0;
  const isNegative = quote.change < 0;
  const IconComponent = METAL_ICONS[quote.metalGroup] || Coins;

  // Calculate scaled price if a custom unit multiplier is passed (e.g. 10g or 1kg)
  const displayPrice = quote.currentPrice * customUnitMultiplier;
  const displayChange = quote.change * customUnitMultiplier;
  const displayUnit = customUnitLabel || quote.unitLabel;

  const cardContent = (
    <Card hoverable className="p-5 flex flex-col justify-between h-full group">
      <div>
        {/* Card Header: Metal name, purity badge, icon */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold',
                quote.metalGroup === 'gold' && 'bg-gold-500/15 text-gold-500',
                quote.metalGroup === 'silver' && 'bg-slate-400/15 text-slate-400',
                quote.metalGroup === 'platinum' && 'bg-sky-500/15 text-sky-400',
                quote.metalGroup === 'palladium' && 'bg-purple-500/15 text-purple-400'
              )}
            >
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary group-hover:text-gold-500 transition-colors">
                {quote.name}
              </h3>
              <p className="text-[11px] text-text-muted">{quote.purityPercentage || displayUnit}</p>
            </div>
          </div>

          {quote.purity && (
            <Badge variant="gold" size="sm">
              {quote.purity}
            </Badge>
          )}
        </div>

        {/* Price display */}
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-text-primary">
            {formatINR(displayPrice)}
          </div>
          <div className="text-[11px] text-text-muted mt-0.5">{displayUnit}</div>
        </div>
      </div>

      {/* Movement & 24h Range */}
      <div className="pt-3 mt-3 border-t border-border/80 flex items-center justify-between text-xs">
        {/* Change indicator */}
        <div
          className={cn(
            'flex items-center gap-1 font-semibold text-xs',
            isPositive && 'text-emerald-500',
            isNegative && 'text-rose-500',
            !isPositive && !isNegative && 'text-text-muted'
          )}
        >
          {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
          {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
          {!isPositive && !isNegative && <Minus className="w-3.5 h-3.5" />}
          <span>{formatINR(displayChange, { showSign: true })}</span>
          <span>({formatPercent(quote.changePercent)})</span>
        </div>

        {/* Link arrow if href present */}
        {href && (
          <div className="text-text-muted group-hover:text-text-primary flex items-center gap-1 text-[11px] transition-colors">
            <span>Details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        )}
      </div>
    </Card>
  );

  if (href) {
    return <Link to={href} className="block h-full">{cardContent}</Link>;
  }

  return cardContent;
};

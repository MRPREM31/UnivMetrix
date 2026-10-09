import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { PriceHistoryPoint, ChartRange, MetalGroup } from '../../types/metal';
import { formatINR, formatNumber } from '../../lib/formatters';
import { formatChartTime, formatISTDateTime } from '../../lib/time';
import { Skeleton } from '../ui/Skeleton';
import { cn } from '../../lib/cn';

interface PriceChartProps {
  data: PriceHistoryPoint[];
  metalGroup: MetalGroup;
  range: ChartRange;
  height?: number;
  loading?: boolean;
  unitLabel?: string;
  className?: string;
}

const METAL_COLORS: Record<MetalGroup, { stroke: string; fill: string; gradientId: string }> = {
  gold: {
    stroke: '#d4aa3b',
    fill: '#d4aa3b',
    gradientId: 'goldGradient',
  },
  silver: {
    stroke: '#94a3b8',
    fill: '#94a3b8',
    gradientId: 'silverGradient',
  },
  platinum: {
    stroke: '#38bdf8',
    fill: '#38bdf8',
    gradientId: 'platinumGradient',
  },
  palladium: {
    stroke: '#a855f7',
    fill: '#a855f7',
    gradientId: 'palladiumGradient',
  },
};

const CustomTooltip: React.FC<any> = ({ active, payload, unitLabel }) => {
  if (active && payload && payload.length) {
    const point: PriceHistoryPoint = payload[0].payload;
    return (
      <div className="bg-surface/95 backdrop-blur-md p-3 rounded-lg border border-border-strong shadow-xl text-xs space-y-1.5 min-w-[170px] z-50">
        <div className="text-[11px] text-text-muted pb-1 border-b border-border/80 font-mono">
          {formatISTDateTime(point.timestamp)}
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-text-secondary">Price:</span>
          <span className="font-bold text-text-primary text-sm font-mono">
            {formatINR(point.price)}
          </span>
        </div>
        {point.high && point.low && (
          <div className="pt-1 flex items-center justify-between text-[10px] text-text-muted">
            <span>H: {formatNumber(point.high, 2)}</span>
            <span>L: {formatNumber(point.low, 2)}</span>
          </div>
        )}
        <div className="text-[9px] text-amber-500/80 uppercase font-semibold">
          Demo Record &middot; {unitLabel || '1g'}
        </div>
      </div>
    );
  }
  return null;
};

export const PriceChart: React.FC<PriceChartProps> = ({
  data,
  metalGroup,
  range,
  height = 320,
  loading = false,
  unitLabel = '1g',
  className,
}) => {
  if (loading) {
    return (
      <div className={cn('w-full flex flex-col justify-center gap-4', className)} style={{ height }}>
        <Skeleton className="w-full h-full rounded-xl" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={cn('w-full flex flex-col items-center justify-center border border-dashed border-border rounded-xl text-text-muted text-xs p-6', className)}
        style={{ height }}
      >
        <p>No historical data available for this selection.</p>
      </div>
    );
  }

  const colorConfig = METAL_COLORS[metalGroup] || METAL_COLORS.gold;

  // Calculate min and max for Y-Axis with slight padding
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1 || minPrice * 0.02;
  const yDomain = [Math.floor(minPrice - padding), Math.ceil(maxPrice + padding)];

  return (
    <div className={cn('w-full relative', className)}>
      {/* Demo watermark in corner */}
      <div className="absolute top-2 right-3 z-10 pointer-events-none">
        <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-text-muted/60 bg-surface/80 px-2 py-0.5 rounded border border-border/40 backdrop-blur-xs">
          Simulated Demo Data
        </span>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={colorConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorConfig.fill} stopOpacity={0.25} />
                <stop offset="95%" stopColor={colorConfig.fill} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(tick) => formatChartTime(tick, range)}
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              minTickGap={30}
            />
            <YAxis
              domain={yDomain}
              tickFormatter={(val) => `₹${val >= 1000 ? (val / 1000).toFixed(val % 1000 === 0 ? 0 : 1) + 'k' : val}`}
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              width={52}
            />
            <Tooltip content={<CustomTooltip unitLabel={unitLabel} />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={colorConfig.stroke}
              strokeWidth={2.2}
              fillOpacity={1}
              fill={`url(#${colorConfig.gradientId})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: colorConfig.stroke,
                stroke: 'var(--bg-surface)',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

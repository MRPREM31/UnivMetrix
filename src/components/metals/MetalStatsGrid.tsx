import React from 'react';
import { Factory, TrendingUp, Sparkles } from 'lucide-react';
import type { MetalMeta } from '../../types/metal';
import { Card } from '../ui/Card';

interface MetalStatsGridProps {
  meta: MetalMeta;
}

export const MetalStatsGrid: React.FC<MetalStatsGridProps> = ({ meta }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Characteristics */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gold-500/15 text-gold-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-text-primary">Key Standards & Purity</h4>
        </div>
        <ul className="space-y-2 text-xs text-text-secondary">
          {meta.characteristics.map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-gold-500 font-bold">&bull;</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Industrial Demand */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400">
            <Factory className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-text-primary">Industrial & Commercial Applications</h4>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {meta.industrialUses.map((use, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-md bg-surface-elevated text-text-secondary border border-border"
            >
              {use}
            </span>
          ))}
        </div>
      </Card>

      {/* Investment Profile */}
      <Card className="p-5 space-y-3 md:col-span-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-500">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-text-primary">Market & Investment Profile</h4>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {meta.investmentProfile}
        </p>
      </Card>
    </div>
  );
};

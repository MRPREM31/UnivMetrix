import React from 'react';
import { Database, Clock, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatISTDateTime } from '../../lib/time';

interface RecentMarketInfoProps {
  lastUpdated: string;
}

export const RecentMarketInfo: React.FC<RecentMarketInfoProps> = ({ lastUpdated }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Tile 1: Last Updated Status */}
      <Card className="p-4 flex items-start gap-3 bg-surface">
        <div className="p-2 rounded-lg bg-gold-500/10 text-gold-500 shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-text-primary">Demo Dataset Synchronized</h4>
          <p className="text-text-muted">
            Last evaluated: <span className="font-mono text-text-secondary">{formatISTDateTime(lastUpdated)}</span>
          </p>
          <p className="text-[11px] text-text-muted">Local tick simulation active with deterministic seed.</p>
        </div>
      </Card>

      {/* Tile 2: Benchmark Source Note */}
      <Card className="p-4 flex items-start gap-3 bg-surface">
        <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
          <Database className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-text-primary">Indian Market Benchmarks</h4>
          <p className="text-text-muted leading-relaxed">
            Standard precious metal rates in India exclude GST (3%) and local jeweler making charges.
          </p>
          <p className="text-[11px] text-text-secondary">IBJA Opening & Closing rates target for Phase 2.</p>
        </div>
      </Card>

      {/* Tile 3: Phase 2 API Roadmap */}
      <Card className="p-4 flex items-start gap-3 bg-surface">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-text-primary">Phase 2 Backend Roadmap</h4>
          <p className="text-text-muted leading-relaxed">
            Next milestone will connect Supabase, verified Indian price providers, and cron background scrapers.
          </p>
          <p className="text-[11px] text-text-muted">Frontend ready for instant API drop-in.</p>
        </div>
      </Card>
    </div>
  );
};

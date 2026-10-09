import React from 'react';
import {
  ShieldAlert,
  Database,
  Layers,
  Server,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { usePriceData } from '../hooks/usePriceData';

export const AboutPage: React.FC = () => {
  const { isDemo } = usePriceData();

  const phases = [
    {
      number: 'Phase 1',
      title: 'Frontend Foundation & Design System',
      status: 'Completed',
      statusVariant: 'up' as const,
      description:
        'Full React 19 + TypeScript + Vite + Tailwind CSS architecture with reusable components, responsive layout, Recharts data visualization, deterministic simulation fixtures, and light/dark themes.',
    },
    {
      number: 'Phase 2',
      title: 'Supabase PostgreSQL Data Layer',
      status: 'Current Phase (Completed)',
      statusVariant: 'up' as const,
      description:
        'Normalized PostgreSQL schema, Row Level Security (RLS) public read restrictions, UTC timestamps, query optimization indexes, idempotent upsert rules, and typed data-access repository.',
    },
    {
      number: 'Phase 3',
      title: 'Vercel Edge Functions & Real-Time Price Ingestion',
      status: 'Planned Next',
      statusVariant: 'warning' as const,
      description:
        'Automated background cron scrapers for official IBJA & MCX price feeds, secure service_role ingestion pipeline, and cached edge API endpoints.',
    },
    {
      number: 'Phase 4',
      title: 'Native Android Home-Screen Widget',
      status: 'Future Milestone',
      statusVariant: 'neutral' as const,
      description:
        'Android Glance / Jetpack Compose lightweight companion app and real-time live price widget for Indian investors and jewelers.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              About MetalPrice & Data Sources
            </h1>
            <Badge variant="gold">Platform Architecture</Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Architectural overview, roadmap milestones, and data disclosure policies
          </p>
        </div>
      </div>

      <DisclaimerBanner variant={isDemo ? 'warning' : 'info'} isDemo={isDemo} />

      {/* Mission & Overview */}
      <Card className="p-6 space-y-3">
        <h2 className="font-bold text-lg text-text-primary">Mission & Product Vision</h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          <strong>MetalPrice</strong> is built to provide transparent, accurate, and lightning-fast precious metal pricing benchmarks for Indian consumers, jewelers, and investors. From traditional 22K jewelry bullion to renewable-energy silver and hydrogen-catalyst platinum, we deliver institutional-grade market visualization with zero clutter.
        </p>
      </Card>

      {/* Development Roadmap */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold-500" />
            <h3 className="font-bold text-base text-text-primary">Engineering Roadmap</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phases.map((phase) => (
              <div
                key={phase.number}
                className="p-5 rounded-xl bg-surface-elevated border border-border flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-gold-500 uppercase tracking-wider">
                      {phase.number}
                    </span>
                    <Badge variant={phase.statusVariant} size="sm">
                      {phase.status}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-text-primary">{phase.title}</h4>
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Security & Schema Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PostgreSQL Schema Spec */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base text-text-primary">Supabase PostgreSQL Schema</h3>
          </div>
          <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <p>
              Persistent price observations table: <code>metal_price_observations</code>
            </p>
            <ul className="space-y-1.5 text-text-muted font-mono text-[11px]">
              <li>&bull; metal (VARCHAR), purity (VARCHAR), currency (INR), unit (1g)</li>
              <li>&bull; price, high_price, low_price, change_amount (NUMERIC)</li>
              <li>&bull; observed_at (TIMESTAMPTZ UTC), provider (IBJA/MCX)</li>
              <li>&bull; Unique index: (metal, purity, currency, unit, provider, observed_at)</li>
            </ul>
          </div>
        </Card>

        {/* Security & RLS Policy */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-base text-text-primary">Security & Row Level Security</h3>
          </div>
          <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <p>
              Zero Trust client architecture:
            </p>
            <ul className="space-y-1.5 text-text-muted">
              <li>&bull; <strong>Public RLS Policy</strong>: Anonymous users can only <code>SELECT</code> records where <code>is_published = true</code>.</li>
              <li>&bull; <strong>Restricted Writes</strong>: No browser client can insert, modify, or delete observations.</li>
              <li>&bull; <strong>Key Isolation</strong>: <code>service_role</code> is never bundled or exposed in client code.</li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Data Benchmark Disclaimers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IBJA & MCX Standards */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-gold-500" />
            <h3 className="font-bold text-base text-text-primary">Indian Market Benchmarks</h3>
          </div>
          <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <p>
              In India, physical bullion rates are referenced against:
            </p>
            <ul className="space-y-1.5 text-text-muted">
              <li>&bull; <strong>IBJA (India Bullion and Jewellers Association)</strong>: Standard daily opening & closing rates utilized across physical retail jewelers.</li>
              <li>&bull; <strong>MCX (Multi Commodity Exchange of India)</strong>: Futures contract trading prices influenced by global COMEX/LBMA pricing and USD/INR exchange rates.</li>
            </ul>
          </div>
        </Card>

        {/* Taxes & Making Charges */}
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-text-primary">Taxes & Retail Pricing Notice</h3>
          </div>
          <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
            <p>
              All rates displayed on MetalPrice represent pure spot metal benchmarks excluding:
            </p>
            <ul className="space-y-1.5 text-text-muted">
              <li>&bull; <strong>GST (Goods and Services Tax)</strong>: Currently 3% applied on gold and silver in India.</li>
              <li>&bull; <strong>Jewelry Making Charges / Wastage</strong>: Varies between 6% to 25% depending on artisan complexity.</li>
              <li>&bull; <strong>TCS</strong>: Applicable on cash transactions above statutory thresholds.</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

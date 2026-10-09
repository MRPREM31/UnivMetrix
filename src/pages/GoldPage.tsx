import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coins, History, ShieldCheck } from 'lucide-react';
import { usePriceData } from '../hooks/usePriceData';
import { useMetalHistory } from '../hooks/useMetalHistory';
import type { GoldPurity, ChartRange, WeightUnit } from '../types/metal';
import { priceRepository } from '../data/priceRepository';
import { PuritySelector } from '../components/metals/PuritySelector';
import { HistoricalTable } from '../components/metals/HistoricalTable';
import { MetalStatsGrid } from '../components/metals/MetalStatsGrid';
import { PriceChart } from '../components/charts/PriceChart';
import { RangeSelector } from '../components/charts/RangeSelector';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { formatINR, formatPercent, getWeightMultiplier, getUnitDisplayLabel } from '../../src/lib/formatters';

export const GoldPage: React.FC = () => {
  const { quotes } = usePriceData();
  const [selectedPurity, setSelectedPurity] = useState<GoldPurity>('24K');
  const [selectedRange, setSelectedRange] = useState<ChartRange>('1M');
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>('1g');

  const meta = priceRepository.getMetalMetadata('gold')!;
  const quoteKey = `gold-${selectedPurity.toLowerCase()}`;
  const currentQuote = quotes[quoteKey];

  const { data: chartData, loading: chartLoading } = useMetalHistory({
    metalGroup: 'gold',
    range: selectedRange,
    purity: selectedPurity,
  });

  const multiplier = getWeightMultiplier(selectedUnit);

  const unitsList: { id: WeightUnit; label: string }[] = [
    { id: '1g', label: '1 Gram' },
    { id: '8g', label: '8g (1 Pavan)' },
    { id: '10g', label: '10 Grams' },
    { id: '100g', label: '100 Grams' },
    { id: '1kg', label: '1 Kilogram' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-500 flex items-center justify-center font-bold text-lg border border-gold-500/20">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                Gold Price India
              </h1>
              <Badge variant="gold">Au &middot; Atomic 79</Badge>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Benchmark rates for 24K, 22K (916 Hallmarked), and 18K Gold in INR
            </p>
          </div>
        </div>

        <Link to="/history">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <History className="w-3.5 h-3.5" />
            <span>Multi-Year History</span>
          </Button>
        </Link>
      </div>

      <DisclaimerBanner variant="subtle" />

      {/* Gold Purity Tabs (24K, 22K, 18K) */}
      <PuritySelector
        selectedPurity={selectedPurity}
        onSelectPurity={setSelectedPurity}
      />

      {/* Hero Pricing & Conversion Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Price Card */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-secondary">
                  Gold {selectedPurity} Spot Rate ({currentQuote?.purityPercentage || 'Pure'})
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-surface-elevated text-text-muted border border-border">
                  Excl. 3% GST
                </span>
              </div>
              <span className="text-xs text-text-muted font-mono">
                {getUnitDisplayLabel(selectedUnit)}
              </span>
            </div>

            <div className="my-3 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-text-primary">
                {formatINR((currentQuote?.currentPrice || 0) * multiplier)}
              </span>
              <span className="text-xs text-text-muted">
                ({formatINR(currentQuote?.currentPrice || 0)} / 1g)
              </span>
            </div>

            {/* Movement */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span
                className={
                  (currentQuote?.change || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }
              >
                {formatINR((currentQuote?.change || 0) * multiplier, { showSign: true })} (
                {formatPercent(currentQuote?.changePercent)})
              </span>
              <span className="text-text-muted">&bull;</span>
              <span className="text-text-muted font-normal">24h Movement vs Prev Close</span>
            </div>
          </div>

          {/* Unit selection row */}
          <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-medium text-text-secondary">Weight Unit:</span>
            <div className="flex flex-wrap gap-1.5">
              {unitsList.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit.id)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                    selectedUnit === unit.id
                      ? 'bg-gold-500 text-slate-950 font-bold'
                      : 'bg-surface-elevated text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* BIS Hallmark Standard Box */}
        <Card className="p-6 flex flex-col justify-between bg-surface-elevated/40">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-gold-500/20 text-gold-500">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-text-primary">BIS Hallmarking Standards</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              In India, hallmarking is mandatory for gold jewelry. A standard BIS hallmark consists of 3 distinct marks:
            </p>
            <ul className="space-y-1.5 text-xs text-text-muted">
              <li>1. BIS Triangle Logo</li>
              <li>2. Purity Grade (916 for 22K, 750 for 18K, 585 for 14K)</li>
              <li>3. 6-digit alphanumeric HUID (Hallmark Unique Identification)</li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-border text-[11px] text-text-muted">
            Check your jeweler’s BIS registration before physical purchase.
          </div>
        </Card>
      </div>

      {/* Historical Chart */}
      <Card>
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-text-primary">
              Gold {selectedPurity} Historical Performance
            </h3>
            <p className="text-xs text-text-muted">
              Rate per gram over selected time horizon
            </p>
          </div>
          <RangeSelector selectedRange={selectedRange} onSelectRange={setSelectedRange} />
        </CardHeader>
        <CardContent>
          <PriceChart
            data={chartData}
            metalGroup="gold"
            range={selectedRange}
            loading={chartLoading}
            height={320}
            unitLabel={`1g (${selectedPurity})`}
          />
        </CardContent>
      </Card>

      {/* Historical Records Table */}
      <HistoricalTable
        data={chartData}
        loading={chartLoading}
        unitLabel={getUnitDisplayLabel(selectedUnit)}
        multiplier={multiplier}
        title={`Gold ${selectedPurity} Recent Pricing Log`}
      />

      {/* Metal Characteristics & Industrial Meta */}
      <MetalStatsGrid meta={meta} />
    </div>
  );
};

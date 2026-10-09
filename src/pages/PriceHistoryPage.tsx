import React, { useState } from 'react';
import { Filter, Layers, Coins, Sparkles } from 'lucide-react';
import { useMetalHistory } from '../hooks/useMetalHistory';
import type { MetalGroup, GoldPurity, ChartRange, WeightUnit } from '../types/metal';
import { PriceChart } from '../components/charts/PriceChart';
import { RangeSelector } from '../components/charts/RangeSelector';
import { HistoricalTable } from '../components/metals/HistoricalTable';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { getWeightMultiplier, getUnitDisplayLabel } from '../lib/formatters';

const metalOptions = [
  { id: 'gold', label: 'Gold (Au)', icon: Coins },
  { id: 'silver', label: 'Silver (Ag)', icon: Layers },
  { id: 'platinum', label: 'Platinum (Pt)', icon: Sparkles },
  { id: 'palladium', label: 'Palladium (Pd)', icon: Sparkles },
];

const goldPurityOptions: { id: GoldPurity; label: string }[] = [
  { id: '24K', label: '24K (99.9% Pure)' },
  { id: '22K', label: '22K (91.6% 916)' },
  { id: '18K', label: '18K (75.0% 750)' },
];

export const PriceHistoryPage: React.FC = () => {
  const [selectedMetal, setSelectedMetal] = useState<MetalGroup>('gold');
  const [selectedPurity, setSelectedPurity] = useState<GoldPurity>('24K');
  const [selectedRange, setSelectedRange] = useState<ChartRange>('1Y');
  const [selectedUnit, setSelectedUnit] = useState<WeightUnit>('1g');

  const { data, loading } = useMetalHistory({
    metalGroup: selectedMetal,
    range: selectedRange,
    purity: selectedPurity,
  });

  const multiplier = getWeightMultiplier(selectedUnit);

  const unitsList: { id: WeightUnit; label: string }[] = [
    { id: '1g', label: '1g' },
    { id: '8g', label: '8g (Pavan)' },
    { id: '10g', label: '10g' },
    { id: '100g', label: '100g' },
    { id: '1kg', label: '1kg' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Price History Explorer
            </h1>
            <Badge variant="gold">Historical Archives</Badge>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Explore multi-horizon precious metal price movements in India (INR)
          </p>
        </div>
      </div>

      <DisclaimerBanner variant="warning" />

      {/* Control Panel / Filter Bar */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border/70">
          <Filter className="w-4 h-4 text-gold-500" />
          <h3 className="font-bold text-sm text-text-primary">Exploration Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metal Group Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">Select Commodity:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {metalOptions.map((metal) => (
                <button
                  key={metal.id}
                  onClick={() => setSelectedMetal(metal.id as MetalGroup)}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    selectedMetal === metal.id
                      ? 'bg-gold-500/15 border-gold-500 text-gold-500 font-bold'
                      : 'bg-surface-elevated border-border text-text-secondary hover:border-border-strong'
                  }`}
                >
                  <metal.icon className="w-3.5 h-3.5" />
                  <span>{metal.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gold Purity Selector (conditional) */}
          {selectedMetal === 'gold' ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Gold Purity Grade:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {goldPurityOptions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPurity(p.id)}
                    className={`p-2 rounded-lg border text-xs text-center transition-all cursor-pointer ${
                      selectedPurity === p.id
                        ? 'bg-gold-500/20 border-gold-500 text-gold-500 font-bold'
                        : 'bg-surface-elevated border-border text-text-secondary hover:border-border-strong'
                    }`}
                  >
                    <div className="font-bold">{p.id}</div>
                    <div className="text-[10px] text-text-muted mt-0.5">
                      {p.id === '24K' ? '99.9%' : p.id === '22K' ? '91.6%' : '75.0%'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">Standard Benchmark:</label>
              <div className="p-3 rounded-lg bg-surface-elevated border border-border text-xs text-text-muted">
                <span className="font-bold text-text-primary">
                  {selectedMetal === 'silver' ? '999 Fine Bullion Grade' : '950 Standard Noble Alloy'}
                </span>
                <p className="text-[11px] mt-0.5">Single standard benchmark for {selectedMetal}.</p>
              </div>
            </div>
          )}

          {/* Weight Unit Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">Display Weight Unit:</label>
            <div className="grid grid-cols-5 gap-1">
              {unitsList.map((unit) => (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit.id)}
                  className={`p-2 rounded-lg border text-xs text-center font-mono font-medium transition-all cursor-pointer ${
                    selectedUnit === unit.id
                      ? 'bg-gold-500 text-slate-950 font-bold'
                      : 'bg-surface-elevated border-border text-text-secondary hover:border-border-strong'
                  }`}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Interactive Chart */}
      <Card>
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-text-primary">
              {selectedMetal.toUpperCase()} {selectedMetal === 'gold' ? `(${selectedPurity})` : ''} Historical Curve
            </h3>
            <p className="text-xs text-text-muted">
              {getUnitDisplayLabel(selectedUnit)} in INR
            </p>
          </div>
          <RangeSelector selectedRange={selectedRange} onSelectRange={setSelectedRange} />
        </CardHeader>
        <CardContent>
          <PriceChart
            data={data}
            metalGroup={selectedMetal}
            range={selectedRange}
            loading={loading}
            height={360}
            unitLabel={selectedUnit}
          />
        </CardContent>
      </Card>

      {/* Full Historical Records Table */}
      <HistoricalTable
        data={data}
        loading={loading}
        unitLabel={getUnitDisplayLabel(selectedUnit)}
        multiplier={multiplier}
        title={`${selectedMetal.toUpperCase()} ${selectedMetal === 'gold' ? selectedPurity : ''} Full Historical Price Table`}
      />
    </div>
  );
};

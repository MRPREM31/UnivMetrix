import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { OverviewHeader } from '../components/dashboard/OverviewHeader';
import { MarketSummaryCard } from '../components/dashboard/MarketSummaryCard';
import { MetalComparisonTable } from '../components/dashboard/MetalComparisonTable';
import { RecentMarketInfo } from '../components/dashboard/RecentMarketInfo';
import { PriceChart } from '../components/charts/PriceChart';
import { RangeSelector } from '../components/charts/RangeSelector';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { DisclaimerBanner } from '../components/ui/DisclaimerBanner';
import { Tabs } from '../components/ui/Tabs';
import { usePriceData } from '../hooks/usePriceData';
import { useMetalHistory } from '../hooks/useMetalHistory';
import type { ChartRange, MetalGroup } from '../types/metal';
import { ArrowRight, BarChart3 } from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { quotes, loading, isRefreshing, isDemo, error, lastRefreshed, refreshPrices } =
    usePriceData();

  const [selectedChartMetal, setSelectedChartMetal] = useState<MetalGroup>('gold');
  const [selectedRange, setSelectedRange] = useState<ChartRange>('1M');

  const { data: chartData, loading: chartLoading, isDemo: chartIsDemo } = useMetalHistory({
    metalGroup: selectedChartMetal,
    range: selectedRange,
    purity: '24K',
  });

  const chartMetalTabs = [
    { id: 'gold', label: 'Gold 24K' },
    { id: 'silver', label: 'Silver' },
    { id: 'platinum', label: 'Platinum' },
    { id: 'palladium', label: 'Palladium' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <OverviewHeader
        onRefresh={refreshPrices}
        isRefreshing={isRefreshing}
        lastRefreshedAt={lastRefreshed}
        isDemo={isDemo}
      />

      {/* Dynamic Data Source Disclaimer Banner */}
      <DisclaimerBanner variant={isDemo ? 'warning' : 'info'} isDemo={isDemo} />

      {/* Market Summary Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
            {isDemo ? 'Spot Rates (Demo Fixtures)' : 'Live Published Observations (Supabase)'}
          </h2>
          <span className="text-xs text-text-muted">Rates in Indian Rupee (INR)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <MarketSummaryCard
            quote={quotes['gold-24k']}
            loading={loading}
            error={error}
            href="/gold"
          />
          <MarketSummaryCard
            quote={quotes['gold-22k']}
            loading={loading}
            error={error}
            href="/gold"
          />
          <MarketSummaryCard
            quote={quotes['silver']}
            loading={loading}
            error={error}
            href="/silver"
          />
          <MarketSummaryCard
            quote={quotes['platinum']}
            loading={loading}
            error={error}
            href="/platinum"
          />
          <MarketSummaryCard
            quote={quotes['palladium']}
            loading={loading}
            error={error}
            href="/palladium"
          />
        </div>
      </div>

      {/* Main Interactive Price Chart */}
      <Card>
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold-500/10 text-gold-500">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-text-primary">
                Benchmark Price Trend
              </h2>
              <p className="text-xs text-text-muted">
                {chartIsDemo
                  ? 'Historical demonstration curve for Indian precious metals'
                  : 'Historical records from Supabase PostgreSQL database'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <Tabs
              tabs={chartMetalTabs}
              activeTab={selectedChartMetal}
              onChange={(id) => setSelectedChartMetal(id as MetalGroup)}
              size="sm"
            />
            <RangeSelector
              selectedRange={selectedRange}
              onSelectRange={setSelectedRange}
            />
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <PriceChart
            data={chartData}
            metalGroup={selectedChartMetal}
            range={selectedRange}
            loading={chartLoading}
            height={340}
            unitLabel="1g"
          />

          <div className="mt-4 pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold-500"></span>
              <span>Range: {selectedRange} Horizon</span>
              <span>&bull;</span>
              <span>Source: {chartIsDemo ? 'Demo Fixtures' : 'Supabase PG'}</span>
            </div>
            <Link
              to="/history"
              className="inline-flex items-center gap-1 text-gold-500 hover:underline font-medium"
            >
              <span>Explore Full Multi-Year Price History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Metal Comparison Table */}
      <MetalComparisonTable quotes={quotes} loading={loading} />

      {/* Recent Market Info & Disclaimers */}
      <RecentMarketInfo lastUpdated={lastRefreshed} />
    </div>
  );
};

import { supabase, isSupabaseConfigured, type MetalPriceObservationRow } from '../lib/supabase';
import type {
  PriceQuote,
  PriceHistoryPoint,
  MetalGroup,
  GoldPurity,
  ChartRange,
  MetalId,
  WeightUnit,
} from '../types/metal';

/**
 * Calculate UTC cutoff timestamp based on range selection
 */
function getRangeStartDate(range: ChartRange): string | null {
  const now = new Date();
  switch (range) {
    case '1D':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case '1W':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '1M':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case '6M':
      return new Date(now.getTime() - 182 * 24 * 60 * 60 * 1000).toISOString();
    case '1Y':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    case 'ALL':
      return null;
  }
}

/**
 * Convert raw Supabase observation row to frontend PriceQuote
 */
export function mapRowToPriceQuote(row: MetalPriceObservationRow): PriceQuote {
  const metalGroup = row.metal.toLowerCase() as MetalGroup;
  const purity = (row.purity as GoldPurity) || undefined;

  const id: MetalId = metalGroup === 'gold' && purity
    ? (`gold-${purity.toLowerCase()}` as MetalId)
    : (metalGroup as MetalId);

  const nameMap: Record<string, string> = {
    'gold-24k': 'Gold 24K (999)',
    'gold-22k': 'Gold 22K (916)',
    'gold-18k': 'Gold 18K (750)',
    silver: 'Silver 999',
    platinum: 'Platinum 950',
    palladium: 'Palladium 950',
  };

  const symbolMap: Record<string, string> = {
    'gold-24k': 'AU24K',
    'gold-22k': 'AU22K',
    'gold-18k': 'AU18K',
    silver: 'AG999',
    platinum: 'PT950',
    palladium: 'PD950',
  };

  const purityPercentMap: Record<string, string> = {
    '24K': '99.9%',
    '22K': '91.6%',
    '18K': '75.0%',
  };

  const priceNum = Number(row.price);
  const changeNum = row.change_amount ? Number(row.change_amount) : 0;
  const changePctNum = row.change_percent ? Number(row.change_percent) : 0;
  const prevClose = priceNum - changeNum;

  return {
    id,
    name: nameMap[id] || `${row.metal.toUpperCase()} ${purity || ''}`,
    symbol: symbolMap[id] || row.metal.toUpperCase(),
    metalGroup,
    purity,
    purityPercentage: purity ? purityPercentMap[purity] : '99.9%',
    currentPrice: priceNum,
    previousClose: prevClose > 0 ? prevClose : priceNum,
    change: changeNum,
    changePercent: changePctNum,
    high24h: row.high_price ? Number(row.high_price) : priceNum,
    low24h: row.low_price ? Number(row.low_price) : priceNum,
    unit: (row.unit as WeightUnit) || '1g',
    unitLabel: `per ${row.unit}`,
    currency: 'INR',
    lastUpdated: row.observed_at,
    isDemo: row.source_status === 'demo',
    provider: row.provider,
    sourceStatus: row.source_status,
    marketStatus: 'open',
  };
}

/**
 * Supabase Data Access Service Layer
 */
export const supabasePriceRepository = {
  /**
   * Fetch latest price quotes from Supabase
   */
  async getLatestPrices(): Promise<Record<string, PriceQuote> | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    try {
      // Query published observations ordered by observed_at DESC
      const { data, error } = await supabase
        .from('metal_price_observations')
        .select('*')
        .eq('is_published', true)
        .order('observed_at', { ascending: false })
        .limit(50);

      if (error) {
        console.warn('[Supabase] Error querying latest prices:', error.message);
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      // Group latest row per metal & purity
      const latestQuotes: Record<string, PriceQuote> = {};
      for (const rawRow of data) {
        const row = rawRow as MetalPriceObservationRow;
        const quote = mapRowToPriceQuote(row);
        if (!latestQuotes[quote.id]) {
          latestQuotes[quote.id] = quote;
        }
      }

      return latestQuotes;
    } catch (err) {
      console.warn('[Supabase] Unexpected error fetching latest prices:', err);
      return null;
    }
  },

  /**
   * Fetch historical records for metal and time range
   */
  async getPriceHistory(
    metalGroup: MetalGroup,
    range: ChartRange = '1M',
    purity?: GoldPurity,
    options?: { limit?: number; offset?: number }
  ): Promise<PriceHistoryPoint[] | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    try {
      const { limit = 200, offset = 0 } = options || {};
      const startDate = getRangeStartDate(range);

      let query = supabase
        .from('metal_price_observations')
        .select('observed_at, price, high_price, low_price, change_amount, change_percent')
        .eq('is_published', true)
        .eq('metal', metalGroup)
        .order('observed_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (metalGroup === 'gold' && purity) {
        query = query.eq('purity', purity);
      }

      if (startDate) {
        query = query.gte('observed_at', startDate);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('[Supabase] Error querying price history:', error.message);
        return null;
      }

      if (!data || data.length === 0) {
        return null;
      }

      return data.map((item: any) => {
        const p = Number(item.price);
        const h = item.high_price ? Number(item.high_price) : p;
        const l = item.low_price ? Number(item.low_price) : p;
        return {
          timestamp: item.observed_at,
          date: item.observed_at,
          price: p,
          high: h,
          low: l,
          open: p,
          close: p,
        };
      });
    } catch (err) {
      console.warn('[Supabase] Unexpected error fetching price history:', err);
      return null;
    }
  },
};

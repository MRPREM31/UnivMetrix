import type {
  PriceQuote,
  PriceHistoryPoint,
  MetalGroup,
  GoldPurity,
  ChartRange,
  MetalId,
} from '../types/metal';
import { INITIAL_DEMO_QUOTES, METALS_METADATA } from './demoData';
import { supabasePriceRepository } from './supabasePriceRepository';
import { isSupabaseConfigured } from '../lib/supabase';

/**
 * In-memory state for demo dataset fallback
 */
let currentQuotesState: Record<string, PriceQuote> = { ...INITIAL_DEMO_QUOTES };
let lastRefreshedAt: string = new Date().toISOString();

/**
 * Pseudo-random deterministic noise based on seed
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate historical price curve deterministically
 */
function generateHistoricalData(
  basePrice: number,
  range: ChartRange,
  seedModifier: number = 1
): PriceHistoryPoint[] {
  const now = new Date();

  let count = 24;
  let stepMs = 60 * 60 * 1000; // 1 hour for 1D
  let volatility = 0.003;
  let trend = 0.0005;

  switch (range) {
    case '1D':
      count = 24;
      stepMs = 60 * 60 * 1000;
      volatility = 0.002;
      trend = 0.0003;
      break;
    case '1W':
      count = 7;
      stepMs = 24 * 60 * 60 * 1000;
      volatility = 0.007;
      trend = 0.002;
      break;
    case '1M':
      count = 30;
      stepMs = 24 * 60 * 60 * 1000;
      volatility = 0.01;
      trend = 0.003;
      break;
    case '6M':
      count = 26; // 26 weekly points
      stepMs = 7 * 24 * 60 * 60 * 1000;
      volatility = 0.018;
      trend = 0.008;
      break;
    case '1Y':
      count = 52; // 52 weekly points
      stepMs = 7 * 24 * 60 * 60 * 1000;
      volatility = 0.025;
      trend = 0.012;
      break;
    case 'ALL':
      count = 60; // 5 years, monthly
      stepMs = 30.5 * 24 * 60 * 60 * 1000;
      volatility = 0.035;
      trend = 0.018;
      break;
  }

  // Generate backwards from current date
  let walkingPrice = basePrice;
  const tempPoints: PriceHistoryPoint[] = [];

  for (let i = 0; i < count; i++) {
    const pointTime = new Date(now.getTime() - i * stepMs);
    const seed = pointTime.getTime() / 100000 + seedModifier;
    const rnd = seededRandom(seed) - 0.48; // slight upward drift
    const changeFactor = 1 + rnd * volatility - (i > 0 ? trend : 0);
    
    // As we go back in time, apply inverse trend
    if (i > 0) {
      walkingPrice = walkingPrice / changeFactor;
    }

    const highFactor = 1 + Math.abs(seededRandom(seed + 11)) * (volatility * 0.8);
    const lowFactor = 1 - Math.abs(seededRandom(seed + 22)) * (volatility * 0.8);

    tempPoints.push({
      timestamp: pointTime.toISOString(),
      date: pointTime.toISOString(),
      price: Math.round(walkingPrice * 100) / 100,
      open: Math.round(walkingPrice * (1 - rnd * 0.002) * 100) / 100,
      close: Math.round(walkingPrice * 100) / 100,
      high: Math.round(walkingPrice * highFactor * 100) / 100,
      low: Math.round(walkingPrice * lowFactor * 100) / 100,
    });
  }

  // Reverse so chronological order (oldest to newest)
  return tempPoints.reverse();
}

/**
 * Unified Price Data Access Layer
 * Checks Supabase PostgreSQL first; falls back gracefully to demo fixtures
 */
export const priceRepository = {
  /**
   * Check if Supabase backend is configured and active
   */
  isSupabaseActive(): boolean {
    return isSupabaseConfigured();
  },

  /**
   * Get all latest quotes (from Supabase if configured, otherwise demo)
   */
  async getLatestPrices(): Promise<{ quotes: Record<string, PriceQuote>; isDemo: boolean }> {
    if (isSupabaseConfigured()) {
      const supabaseQuotes = await supabasePriceRepository.getLatestPrices();
      if (supabaseQuotes && Object.keys(supabaseQuotes).length > 0) {
        // Merge with any missing metals from demo to ensure complete UI coverage
        const merged = { ...currentQuotesState, ...supabaseQuotes };
        return { quotes: merged, isDemo: false };
      }
    }

    // Fallback to local demo state
    await new Promise((res) => setTimeout(res, 40));
    return { quotes: { ...currentQuotesState }, isDemo: true };
  },

  /**
   * Get single quote by ID
   */
  async getPriceQuote(id: MetalId): Promise<PriceQuote | null> {
    const { quotes } = await this.getLatestPrices();
    return quotes[id] || null;
  },

  /**
   * Get price history for a given metal, range, and optional gold purity
   */
  async getPriceHistory(
    metalGroup: MetalGroup,
    range: ChartRange = '1M',
    purity: GoldPurity = '24K',
    options?: { limit?: number; offset?: number }
  ): Promise<{ data: PriceHistoryPoint[]; isDemo: boolean }> {
    if (isSupabaseConfigured()) {
      const history = await supabasePriceRepository.getPriceHistory(
        metalGroup,
        range,
        purity,
        options
      );
      if (history && history.length > 0) {
        return { data: history, isDemo: false };
      }
    }

    // Fallback to deterministic demo generator
    await new Promise((res) => setTimeout(res, 60));
    const key: MetalId =
      metalGroup === 'gold'
        ? (`gold-${purity.toLowerCase()}` as MetalId)
        : (metalGroup as MetalId);
    const quote = currentQuotesState[key] || currentQuotesState['gold-24k'];

    const seedMap: Record<MetalGroup, number> = {
      gold: 101,
      silver: 202,
      platinum: 303,
      palladium: 404,
    };

    const data = generateHistoricalData(
      quote.currentPrice,
      range,
      seedMap[metalGroup] +
        (purity === '22K' ? 10 : purity === '18K' ? 20 : 0)
    );

    return { data, isDemo: true };
  },

  /**
   * Get metal metadata
   */
  getMetalMetadata(metalGroup: MetalGroup) {
    return METALS_METADATA[metalGroup] || null;
  },

  /**
   * Refresh local demo dataset with simulated tick fluctuations
   */
  async refreshDemoData(): Promise<Record<string, PriceQuote>> {
    await new Promise((res) => setTimeout(res, 200));

    const updated: Record<string, PriceQuote> = {};
    const nowIso = new Date().toISOString();

    for (const [key, quote] of Object.entries(currentQuotesState)) {
      const jitter = (Math.random() - 0.49) * 0.008;
      const newPrice = Math.round(quote.currentPrice * (1 + jitter) * 100) / 100;
      const change = Math.round((newPrice - quote.previousClose) * 100) / 100;
      const changePercent = Math.round((change / quote.previousClose) * 10000) / 100;

      updated[key] = {
        ...quote,
        currentPrice: newPrice,
        change,
        changePercent,
        high24h: Math.max(quote.high24h, newPrice),
        low24h: Math.min(quote.low24h, newPrice),
        lastUpdated: nowIso,
      };
    }

    currentQuotesState = updated;
    lastRefreshedAt = nowIso;
    return { ...currentQuotesState };
  },

  /**
   * Get timestamp of last local refresh
   */
  getLastRefreshedAt(): string {
    return lastRefreshedAt;
  },
};

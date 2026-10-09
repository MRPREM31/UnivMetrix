export type MetalGroup = 'gold' | 'silver' | 'platinum' | 'palladium';

export type GoldPurity = '24K' | '22K' | '18K';

export type MetalId =
  | 'gold-24k'
  | 'gold-22k'
  | 'gold-18k'
  | 'silver'
  | 'platinum'
  | 'palladium';

export type ChartRange = '1D' | '1W' | '1M' | '6M' | '1Y' | 'ALL';

export type WeightUnit = '1g' | '8g' | '10g' | '100g' | '1kg' | '1oz';

export interface PriceQuote {
  id: MetalId;
  name: string;
  symbol: string;
  metalGroup: MetalGroup;
  purity?: GoldPurity;
  purityPercentage?: string;
  currentPrice: number; // in INR
  previousClose: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  unit: WeightUnit;
  unitLabel: string;
  currency: 'INR';
  lastUpdated: string;
  isDemo: boolean;
  provider?: string;
  sourceStatus?: 'verified' | 'preliminary' | 'demo';
  marketStatus: 'open' | 'closed';
}

export interface PriceHistoryPoint {
  timestamp: string;
  date: string;
  time?: string;
  price: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export interface MetalMeta {
  id: MetalGroup;
  name: string;
  symbol: string;
  color: string;
  badgeBg: string;
  description: string;
  characteristics: string[];
  industrialUses: string[];
  investmentProfile: string;
  supportedPurities?: GoldPurity[];
  supportedUnits: WeightUnit[];
}

export interface Diamond4CGuide {
  carat: { title: string; description: string; tips: string[] };
  cut: { title: string; description: string; grades: string[] };
  color: { title: string; description: string; grades: string[] };
  clarity: { title: string; description: string; grades: string[] };
  certification: { title: string; description: string; labs: string[] };
}

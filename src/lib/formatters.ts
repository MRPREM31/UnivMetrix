import type { WeightUnit } from '../types/metal';

/**
 * Format a number as Indian Rupee (INR) currency
 */
export function formatINR(
  amount: number | null | undefined,
  options?: {
    decimals?: number;
    showSign?: boolean;
    compact?: boolean;
  }
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹—';
  }

  const { decimals = 2, showSign = false, compact = false } = options || {};

  const sign = showSign && amount > 0 ? '+' : '';

  if (compact && Math.abs(amount) >= 100000) {
    // Indian numbering format compact (Lakhs / Crores)
    if (Math.abs(amount) >= 10000000) {
      return `${sign}₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    return `${sign}₹${(amount / 100000).toFixed(2)} L`;
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  if (showSign && amount > 0) {
    return `+${formatted}`;
  }

  return formatted;
}

/**
 * Format percentage change with + / - signs
 */
export function formatPercent(
  percent: number | null | undefined,
  options?: { decimals?: number; showSign?: boolean }
): string {
  if (percent === null || percent === undefined || isNaN(percent)) {
    return '0.00%';
  }

  const { decimals = 2, showSign = true } = options || {};
  const sign = showSign && percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(decimals)}%`;
}

/**
 * Format generic numbers with Indian thousands grouping
 */
export function formatNumber(
  value: number | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Get multiplier for weight conversion relative to base 1g
 */
export function getWeightMultiplier(unit: WeightUnit): number {
  switch (unit) {
    case '1g':
      return 1;
    case '8g':
      return 8; // 1 Sovereign / Pavan
    case '10g':
      return 10;
    case '100g':
      return 100;
    case '1kg':
      return 1000;
    case '1oz':
      return 31.1034768; // 1 Troy Ounce
    default:
      return 1;
  }
}

/**
 * Format unit label for display
 */
export function getUnitDisplayLabel(unit: WeightUnit): string {
  switch (unit) {
    case '1g':
      return 'per gram (1g)';
    case '8g':
      return 'per 8g (1 Pavan)';
    case '10g':
      return 'per 10 grams (10g)';
    case '100g':
      return 'per 100 grams (100g)';
    case '1kg':
      return 'per kilogram (1 kg)';
    case '1oz':
      return 'per troy ounce (oz)';
    default:
      return `per ${unit}`;
  }
}

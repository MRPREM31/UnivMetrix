import { useState, useEffect, useCallback } from 'react';
import type { PriceHistoryPoint, MetalGroup, ChartRange, GoldPurity } from '../types/metal';
import { priceRepository } from '../data/priceRepository';

interface UseMetalHistoryOptions {
  metalGroup: MetalGroup;
  range: ChartRange;
  purity?: GoldPurity;
  limit?: number;
  offset?: number;
}

export function useMetalHistory({
  metalGroup,
  range,
  purity = '24K',
  limit,
  offset,
}: UseMetalHistoryOptions) {
  const [data, setData] = useState<PriceHistoryPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: history, isDemo: demoFlag } =
        await priceRepository.getPriceHistory(metalGroup, range, purity, {
          limit,
          offset,
        });
      setData(history);
      setIsDemo(demoFlag);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load historical data');
    } finally {
      setLoading(false);
    }
  }, [metalGroup, range, purity, limit, offset]);

  useEffect(() => {
    let isSubscribed = true;

    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: history, isDemo: demoFlag } =
          await priceRepository.getPriceHistory(metalGroup, range, purity, {
            limit,
            offset,
          });
        if (isSubscribed) {
          setData(history);
          setIsDemo(demoFlag);
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : 'Failed to load historical data');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      isSubscribed = false;
    };
  }, [metalGroup, range, purity, limit, offset]);

  return {
    data,
    loading,
    isDemo,
    error,
    refetch: fetchHistory,
  };
}

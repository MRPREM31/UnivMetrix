import { useState, useEffect, useCallback } from 'react';
import type { PriceQuote } from '../types/metal';
import { priceRepository } from '../data/priceRepository';

export function usePriceData() {
  const [quotes, setQuotes] = useState<Record<string, PriceQuote>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>(
    priceRepository.getLastRefreshedAt()
  );

  const fetchQuotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { quotes: data, isDemo: demoFlag } = await priceRepository.getLatestPrices();
      setQuotes(data);
      setIsDemo(demoFlag);
      setLastRefreshed(priceRepository.getLastRefreshedAt());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metal price quotes');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPrices = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      const data = await priceRepository.refreshDemoData();
      setQuotes(data);
      setIsDemo(true);
      setLastRefreshed(priceRepository.getLastRefreshedAt());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh prices');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { quotes: data, isDemo: demoFlag } = await priceRepository.getLatestPrices();
        if (isSubscribed) {
          setQuotes(data);
          setIsDemo(demoFlag);
          setLastRefreshed(priceRepository.getLastRefreshedAt());
        }
      } catch (err) {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : 'Failed to fetch metal price quotes');
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isSubscribed = false;
    };
  }, []);

  return {
    quotes,
    loading,
    isRefreshing,
    isDemo,
    error,
    lastRefreshed,
    refreshPrices,
    refetch: fetchQuotes,
  };
}

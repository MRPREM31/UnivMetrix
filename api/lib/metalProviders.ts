export interface NormalizedObservation {
  metal: string;
  purity: string | null;
  currency: string;
  unit: string;
  price: number;
  high_price: number | null;
  low_price: number | null;
  change_amount: number | null;
  change_percent: number | null;
  observed_at: string;
  provider: string;
  source_status: 'verified' | 'preliminary' | 'demo';
  is_published: boolean;
  metadata: Record<string, any>;
}

const TROY_OZ_TO_GRAMS = 31.1034768;

/**
 * Fetch from GoldAPI.io (Authenticated API)
 */
export async function fetchFromGoldApi(apiKey: string): Promise<NormalizedObservation[]> {
  const metals = [
    { code: 'XAU', metal: 'gold' },
    { code: 'XAG', metal: 'silver' },
    { code: 'XPT', metal: 'platinum' },
    { code: 'XPD', metal: 'palladium' },
  ];

  const results: NormalizedObservation[] = [];
  const now = new Date();

  for (const { code, metal } of metals) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`https://www.goldapi.io/api/price/${code}/INR`, {
        headers: {
          'x-access-token': apiKey,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        console.warn(`[GoldAPI] Error response for ${code}: ${res.status} ${res.statusText}`);
        continue;
      }

      const data = await res.json();
      const observedAt = data.timestamp
        ? new Date(data.timestamp * 1000).toISOString()
        : now.toISOString();

      if (metal === 'gold') {
        const p24k = data.price_gram_24k || (data.price ? data.price / TROY_OZ_TO_GRAMS : 0);
        const p22k = data.price_gram_22k || p24k * (22 / 24);
        const p18k = data.price_gram_18k || p24k * (18 / 24);

        const changePerGram = data.ch ? data.ch / TROY_OZ_TO_GRAMS : null;
        const changePct = data.chp || null;

        results.push({
          metal: 'gold',
          purity: '24K',
          currency: 'INR',
          unit: '1g',
          price: Math.round(p24k * 100) / 100,
          high_price: data.high_price ? Math.round((data.high_price / TROY_OZ_TO_GRAMS) * 100) / 100 : null,
          low_price: data.low_price ? Math.round((data.low_price / TROY_OZ_TO_GRAMS) * 100) / 100 : null,
          change_amount: changePerGram ? Math.round(changePerGram * 100) / 100 : null,
          change_percent: changePct,
          observed_at: observedAt,
          provider: 'GoldAPI.io',
          source_status: 'verified',
          is_published: true,
          metadata: {
            market: 'international_spot_inr',
            ask: data.ask,
            bid: data.bid,
            purity_percent: '99.9%',
            disclaimer: 'Spot benchmark rate in INR. Excludes 3% GST and local making charges.',
          },
        });

        results.push({
          metal: 'gold',
          purity: '22K',
          currency: 'INR',
          unit: '1g',
          price: Math.round(p22k * 100) / 100,
          high_price: data.high_price ? Math.round(((data.high_price / TROY_OZ_TO_GRAMS) * (22 / 24)) * 100) / 100 : null,
          low_price: data.low_price ? Math.round(((data.low_price / TROY_OZ_TO_GRAMS) * (22 / 24)) * 100) / 100 : null,
          change_amount: changePerGram ? Math.round((changePerGram * (22 / 24)) * 100) / 100 : null,
          change_percent: changePct,
          observed_at: observedAt,
          provider: 'GoldAPI.io',
          source_status: 'verified',
          is_published: true,
          metadata: {
            market: 'international_spot_inr',
            purity_percent: '91.6%',
            disclaimer: 'Calculated 22K (916) benchmark rate in INR. Excludes 3% GST.',
          },
        });

        results.push({
          metal: 'gold',
          purity: '18K',
          currency: 'INR',
          unit: '1g',
          price: Math.round(p18k * 100) / 100,
          high_price: data.high_price ? Math.round(((data.high_price / TROY_OZ_TO_GRAMS) * (18 / 24)) * 100) / 100 : null,
          low_price: data.low_price ? Math.round(((data.low_price / TROY_OZ_TO_GRAMS) * (18 / 24)) * 100) / 100 : null,
          change_amount: changePerGram ? Math.round((changePerGram * (18 / 24)) * 100) / 100 : null,
          change_percent: changePct,
          observed_at: observedAt,
          provider: 'GoldAPI.io',
          source_status: 'verified',
          is_published: true,
          metadata: {
            market: 'international_spot_inr',
            purity_percent: '75.0%',
            disclaimer: 'Calculated 18K (750) benchmark rate in INR. Excludes 3% GST.',
          },
        });
      } else {
        const pricePerGram = data.price_gram_24k || (data.price ? data.price / TROY_OZ_TO_GRAMS : 0);
        const changePerGram = data.ch ? data.ch / TROY_OZ_TO_GRAMS : null;

        results.push({
          metal,
          purity: null,
          currency: 'INR',
          unit: '1g',
          price: Math.round(pricePerGram * 100) / 100,
          high_price: data.high_price ? Math.round((data.high_price / TROY_OZ_TO_GRAMS) * 100) / 100 : null,
          low_price: data.low_price ? Math.round((data.low_price / TROY_OZ_TO_GRAMS) * 100) / 100 : null,
          change_amount: changePerGram ? Math.round(changePerGram * 100) / 100 : null,
          change_percent: data.chp || null,
          observed_at: observedAt,
          provider: 'GoldAPI.io',
          source_status: 'verified',
          is_published: true,
          metadata: {
            market: 'international_spot_inr',
            ask: data.ask,
            bid: data.bid,
            disclaimer: `${metal.toUpperCase()} spot rate in INR per gram. Excludes local taxes.`,
          },
        });
      }
    } catch (err) {
      clearTimeout(timeout);
      console.warn(`[GoldAPI] Failed fetching ${code}:`, err instanceof Error ? err.message : String(err));
    }
  }

  return results;
}

/**
 * Fetch from Gold-API.com (Free open REST API with native INR spot prices for Gold, Silver, Platinum, Palladium)
 */
export async function fetchFromGoldApiCom(): Promise<NormalizedObservation[]> {
  const metals = [
    { code: 'XAU', metal: 'gold' },
    { code: 'XAG', metal: 'silver' },
    { code: 'XPT', metal: 'platinum' },
    { code: 'XPD', metal: 'palladium' },
  ];

  const results: NormalizedObservation[] = [];

  for (const { code, metal } of metals) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(`https://api.gold-api.com/price/${code}/INR`, {
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        console.warn(`[Gold-API.com] Error response for ${code}: ${res.status}`);
        continue;
      }

      const data = await res.json();
      if (!data || typeof data.price !== 'number' || data.price <= 0) {
        continue;
      }

      const pricePerOz = data.price;
      const pricePerGram = pricePerOz / TROY_OZ_TO_GRAMS;
      const observedAt = data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString();

      if (metal === 'gold') {
        const p24k = pricePerGram;
        const p22k = p24k * (22 / 24);
        const p18k = p24k * (18 / 24);

        results.push({
          metal: 'gold',
          purity: '24K',
          currency: 'INR',
          unit: '1g',
          price: Math.round(p24k * 100) / 100,
          high_price: null,
          low_price: null,
          change_amount: null,
          change_percent: null,
          observed_at: observedAt,
          provider: 'Gold-API.com',
          source_status: 'verified',
          is_published: true,
          metadata: {
            market: 'international_spot_inr',
            exchange_rate_usd_inr: data.exchangeRate,
            purity_percent: '99.9%',
            disclaimer: 'Spot benchmark rate in INR per gram. Excludes 3% GST and local making charges.',
          },
        });

        results.push({
          metal: 'gold',
          purity: '22K',
          currency: 'INR',
          unit: '1g',
          price: Math.round(p22k * 100) / 100,
          high_price: null,
          low_price: null,
          change_amount: null,
          change_percent: null,
          observed_at: observedAt,
          provider: 'Gold-API.com',
          source_status: 'verified',
          is_published: true,
          metadata: {
            market: 'international_spot_inr',
            purity_percent: '91.6%',
            disclaimer: 'Calculated 22K (916) benchmark rate in INR. Excludes 3% GST.',
          },
        });

        results.push({
          metal: 'gold',
          purity: '18K',
          currency: 'INR',
          unit: '1g',
          price: Math.round(p18k * 100) / 100,
          high_price: null,
          low_price: null,
          change_amount: null,
          change_percent: null,
          observed_at: observedAt,
          provider: 'Gold-API.com',
          source_status: 'verified',
          is_published: true,
          metadata: {
            market: 'international_spot_inr',
            purity_percent: '75.0%',
            disclaimer: 'Calculated 18K (750) benchmark rate in INR. Excludes 3% GST.',
          },
        });
      } else {
        results.push({
          metal,
          purity: null,
          currency: 'INR',
          unit: '1g',
          price: Math.round(pricePerGram * 100) / 100,
          high_price: null,
          low_price: null,
          change_amount: null,
          change_percent: null,
          observed_at: observedAt,
          provider: 'Gold-API.com',
          source_status: 'verified',
          is_published: true,
          metadata: {
            market: 'international_spot_inr',
            exchange_rate_usd_inr: data.exchangeRate,
            disclaimer: `${metal.toUpperCase()} spot rate in INR per gram. Excludes local taxes.`,
          },
        });
      }
    } catch (err) {
      clearTimeout(timeout);
      console.warn(`[Gold-API.com] Failed fetching ${code}:`, err instanceof Error ? err.message : String(err));
    }
  }

  return results;
}

/**
 * Fetch from MetalpriceAPI (Alternative / Fallback provider)
 */
export async function fetchFromMetalPriceApi(apiKey: string): Promise<NormalizedObservation[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=INR&currencies=XAU,XAG,XPT,XPD`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[MetalpriceAPI] Error response: ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data.success || !data.rates) {
      return [];
    }

    const observedAt = data.timestamp
      ? new Date(data.timestamp * 1000).toISOString()
      : new Date().toISOString();

    const results: NormalizedObservation[] = [];

    const calcInrPerGram = (rate: number | undefined) => {
      if (!rate || rate <= 0) return 0;
      const inrPerOz = 1 / rate;
      return inrPerOz / TROY_OZ_TO_GRAMS;
    };

    const goldPerGram = calcInrPerGram(data.rates.XAU);
    if (goldPerGram > 0) {
      results.push({
        metal: 'gold',
        purity: '24K',
        currency: 'INR',
        unit: '1g',
        price: Math.round(goldPerGram * 100) / 100,
        high_price: null,
        low_price: null,
        change_amount: null,
        change_percent: null,
        observed_at: observedAt,
        provider: 'MetalpriceAPI',
        source_status: 'verified',
        is_published: true,
        metadata: { market: 'international_spot_inr' },
      });
      results.push({
        metal: 'gold',
        purity: '22K',
        currency: 'INR',
        unit: '1g',
        price: Math.round(goldPerGram * (22 / 24) * 100) / 100,
        high_price: null,
        low_price: null,
        change_amount: null,
        change_percent: null,
        observed_at: observedAt,
        provider: 'MetalpriceAPI',
        source_status: 'verified',
        is_published: true,
        metadata: { market: 'international_spot_inr' },
      });
      results.push({
        metal: 'gold',
        purity: '18K',
        currency: 'INR',
        unit: '1g',
        price: Math.round(goldPerGram * (18 / 24) * 100) / 100,
        high_price: null,
        low_price: null,
        change_amount: null,
        change_percent: null,
        observed_at: observedAt,
        provider: 'MetalpriceAPI',
        source_status: 'verified',
        is_published: true,
        metadata: { market: 'international_spot_inr' },
      });
    }

    const silverPerGram = calcInrPerGram(data.rates.XAG);
    if (silverPerGram > 0) {
      results.push({
        metal: 'silver',
        purity: null,
        currency: 'INR',
        unit: '1g',
        price: Math.round(silverPerGram * 100) / 100,
        high_price: null,
        low_price: null,
        change_amount: null,
        change_percent: null,
        observed_at: observedAt,
        provider: 'MetalpriceAPI',
        source_status: 'verified',
        is_published: true,
        metadata: { market: 'international_spot_inr' },
      });
    }

    const platPerGram = calcInrPerGram(data.rates.XPT);
    if (platPerGram > 0) {
      results.push({
        metal: 'platinum',
        purity: null,
        currency: 'INR',
        unit: '1g',
        price: Math.round(platPerGram * 100) / 100,
        high_price: null,
        low_price: null,
        change_amount: null,
        change_percent: null,
        observed_at: observedAt,
        provider: 'MetalpriceAPI',
        source_status: 'verified',
        is_published: true,
        metadata: { market: 'international_spot_inr' },
      });
    }

    const pallPerGram = calcInrPerGram(data.rates.XPD);
    if (pallPerGram > 0) {
      results.push({
        metal: 'palladium',
        purity: null,
        currency: 'INR',
        unit: '1g',
        price: Math.round(pallPerGram * 100) / 100,
        high_price: null,
        low_price: null,
        change_amount: null,
        change_percent: null,
        observed_at: observedAt,
        provider: 'MetalpriceAPI',
        source_status: 'verified',
        is_published: true,
        metadata: { market: 'international_spot_inr' },
      });
    }

    return results;
  } catch (err) {
    clearTimeout(timeout);
    console.warn('[MetalpriceAPI] Failed fetching rates:', err instanceof Error ? err.message : String(err));
    return [];
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getServerSupabase } from '../lib/serverSupabase';
import {
  fetchFromGoldApi,
  fetchFromGoldApiCom,
  fetchFromMetalPriceApi,
  type NormalizedObservation,
} from '../lib/metalProviders';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow GET (for Vercel Cron) and POST (for manual ingestion triggers)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Authenticate Request via CRON_SECRET or Vercel header
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  const querySecret = req.query.secret || req.query.key;
  const isVercelCron = req.headers['x-vercel-cron'] === '1';

  const isAuthorized =
    !cronSecret || // If no secret configured (local dev)
    isVercelCron ||
    querySecret === cronSecret ||
    (authHeader && authHeader.replace(/^Bearer\s+/i, '') === cronSecret);

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized: Invalid cron secret' });
  }

  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return res.status(503).json({
        error: 'Database connection unconfigured (Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)',
        status: 'unconfigured',
      });
    }

    const goldApiKey = process.env.GOLDAPI_KEY || process.env.METAL_PROVIDER_API_KEY;
    const metalPriceApiKey = process.env.METALPRICE_API_KEY;

    let observations: NormalizedObservation[] = [];
    let activeProvider = 'None';

    // 2. Fetch from available provider in prioritized order
    if (goldApiKey) {
      activeProvider = 'GoldAPI.io';
      observations = await fetchFromGoldApi(goldApiKey);
    } else if (metalPriceApiKey) {
      activeProvider = 'MetalpriceAPI';
      observations = await fetchFromMetalPriceApi(metalPriceApiKey);
    }

    // If no paid key is set or key failed, try open live provider
    if (observations.length === 0) {
      activeProvider = 'Gold-API.com';
      observations = await fetchFromGoldApiCom();
    }

    if (observations.length === 0) {
      return res.status(502).json({
        error: 'All price providers returned no valid price observations',
        provider: activeProvider,
      });
    }

    // 3. Idempotent Upsert into Supabase metal_price_observations
    const { data, error } = await supabase
      .from('metal_price_observations')
      .upsert(observations, {
        onConflict: 'metal,purity,currency,unit,provider,observed_at',
        ignoreDuplicates: false,
      })
      .select('id, metal, purity, price, observed_at');

    if (error) {
      console.error('[Cron Update] Supabase upsert error:', error.message);
      return res.status(500).json({
        error: 'Database insertion error',
        details: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      provider: activeProvider,
      recordsProcessed: observations.length,
      recordsUpserted: data ? data.length : observations.length,
      timestamp: new Date().toISOString(),
      summary: observations.map((o) => ({
        metal: o.metal,
        purity: o.purity,
        priceInr: o.price,
        unit: o.unit,
      })),
    });
  } catch (err) {
    console.error('[Cron Update] Internal failure:', err instanceof Error ? err.message : String(err));
    return res.status(500).json({ error: 'Internal server error during price ingestion' });
  }
}

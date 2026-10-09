import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getServerSupabase } from './lib/serverSupabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return res.status(503).json({
        error: 'Database connection not configured',
        status: 'unconfigured',
        isDemo: true,
      });
    }

    const { metal, currency = 'INR' } = req.query;

    let query = supabase
      .from('metal_price_observations')
      .select('id, metal, purity, currency, unit, price, high_price, low_price, change_amount, change_percent, observed_at, provider, source_status, metadata')
      .eq('is_published', true)
      .eq('currency', String(currency).toUpperCase())
      .order('observed_at', { ascending: false })
      .limit(50);

    if (metal && typeof metal === 'string') {
      query = query.eq('metal', metal.toLowerCase());
    }

    const { data, error } = await query;

    if (error) {
      console.error('[API /api/prices] Database query error:', error.message);
      return res.status(500).json({ error: 'Failed to query prices' });
    }

    // Group latest unique entry per metal + purity
    const latest: Record<string, any> = {};
    if (data) {
      for (const row of data) {
        const key = row.purity ? `${row.metal}-${row.purity.toLowerCase()}` : row.metal;
        if (!latest[key]) {
          latest[key] = row;
        }
      }
    }

    // Cache headers: 60s edge cache, 5min stale-while-revalidate
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({
      success: true,
      data: latest,
      count: Object.keys(latest).length,
      timestamp: new Date().toISOString(),
      disclaimer: 'Spot precious metal rates in INR. Excludes 3% Indian GST and retail jeweler making charges.',
    });
  } catch (err) {
    console.error('[API /api/prices] Internal error:', err instanceof Error ? err.message : String(err));
    return res.status(500).json({ error: 'Internal server error' });
  }
}

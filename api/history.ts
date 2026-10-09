import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getServerSupabase } from './lib/serverSupabase';

function getRangeStartDate(range: string): string | null {
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
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }
}

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

    const {
      metal = 'gold',
      range = '1M',
      purity = '24K',
      limit = '200',
      offset = '0',
    } = req.query;

    const parsedLimit = Math.min(Math.max(parseInt(String(limit), 10) || 200, 1), 500);
    const parsedOffset = Math.max(parseInt(String(offset), 10) || 0, 0);
    const startDate = getRangeStartDate(String(range));

    let query = supabase
      .from('metal_price_observations')
      .select('observed_at, price, high_price, low_price, change_amount, change_percent', { count: 'exact' })
      .eq('is_published', true)
      .eq('metal', String(metal).toLowerCase())
      .order('observed_at', { ascending: true })
      .range(parsedOffset, parsedOffset + parsedLimit - 1);

    if (String(metal).toLowerCase() === 'gold') {
      query = query.eq('purity', String(purity).toUpperCase());
    }

    if (startDate) {
      query = query.gte('observed_at', startDate);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[API /api/history] Database query error:', error.message);
      return res.status(500).json({ error: 'Failed to query price history' });
    }

    // Cache headers: 5min edge cache, 10min stale-while-revalidate
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      success: true,
      metal,
      range,
      purity: String(metal).toLowerCase() === 'gold' ? purity : null,
      data: data || [],
      pagination: {
        total: count || (data ? data.length : 0),
        limit: parsedLimit,
        offset: parsedOffset,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[API /api/history] Internal error:', err instanceof Error ? err.message : String(err));
    return res.status(500).json({ error: 'Internal server error' });
  }
}

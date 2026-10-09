-- Migration: 20261009000000_create_metal_price_observations.sql
-- Description: Creates the normalized precious-metal price observations table with RLS, indexes, and unique constraints.

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.metal_price_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metal VARCHAR(20) NOT NULL,                                       -- 'gold', 'silver', 'platinum', 'palladium'
    purity VARCHAR(10) NULL,                                         -- '24K', '22K', '18K', '14K' or NULL
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',                      -- ISO 4217 Currency ('INR', 'USD')
    unit VARCHAR(10) NOT NULL DEFAULT '1g',                          -- '1g', '10g', '1kg', '1oz'
    price NUMERIC(14, 4) NOT NULL,                                   -- Observation rate per unit
    ask_price NUMERIC(14, 4) NULL,                                   -- Optional ask
    bid_price NUMERIC(14, 4) NULL,                                   -- Optional bid
    high_price NUMERIC(14, 4) NULL,                                  -- Day high
    low_price NUMERIC(14, 4) NULL,                                   -- Day low
    change_amount NUMERIC(14, 4) NULL,                               -- Change vs previous close
    change_percent NUMERIC(8, 4) NULL,                               -- Percentage change
    observed_at TIMESTAMPTZ NOT NULL,                                -- Timestamp in UTC of the price point
    provider VARCHAR(50) NOT NULL DEFAULT 'IBJA',                    -- 'IBJA', 'MCX', 'LBMA', 'DEMO_SEED'
    source_status VARCHAR(20) NOT NULL DEFAULT 'verified',           -- 'verified', 'preliminary', 'demo'
    is_published BOOLEAN NOT NULL DEFAULT true,                      -- Visibility flag for public queries
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,                     -- Additional provider/session payload metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Prevent duplicate observations (Idempotent upsert support)
CREATE UNIQUE INDEX IF NOT EXISTS uq_metal_observation_idx 
ON public.metal_price_observations (
    metal,
    COALESCE(purity, ''),
    currency,
    unit,
    provider,
    observed_at
);

-- 3. Query Performance Indexes
CREATE INDEX IF NOT EXISTS idx_metal_obs_latest 
ON public.metal_price_observations (metal, purity, currency, observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_metal_obs_range 
ON public.metal_price_observations (metal, purity, observed_at ASC);

CREATE INDEX IF NOT EXISTS idx_metal_obs_published 
ON public.metal_price_observations (is_published, observed_at DESC);

-- 4. Automatic updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_metal_price_observations_updated_at ON public.metal_price_observations;
CREATE TRIGGER trg_metal_price_observations_updated_at
BEFORE UPDATE ON public.metal_price_observations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Row Level Security (RLS) Configuration
ALTER TABLE public.metal_price_observations ENABLE ROW LEVEL SECURITY;

-- Allow public (anon and authenticated) READ access to published records only
DROP POLICY IF EXISTS "Allow public read-only access to published price records" ON public.metal_price_observations;
CREATE POLICY "Allow public read-only access to published price records"
ON public.metal_price_observations
FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Grant schema and table select privileges to public roles (so RLS policies can evaluate)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.metal_price_observations TO anon, authenticated;

-- Note: No INSERT / UPDATE / DELETE policies are granted to 'anon' or 'authenticated'.
-- Only the backend service_role key (bypassing RLS) can write or mutate price records.

-- 6. Helper view for latest prices
CREATE OR REPLACE VIEW public.v_latest_metal_prices AS
SELECT DISTINCT ON (metal, COALESCE(purity, ''), currency, unit)
    id,
    metal,
    purity,
    currency,
    unit,
    price,
    change_amount,
    change_percent,
    high_price,
    low_price,
    observed_at,
    provider,
    source_status,
    metadata
FROM public.metal_price_observations
WHERE is_published = true
ORDER BY metal, COALESCE(purity, ''), currency, unit, observed_at DESC;

-- Grant select on view to public
GRANT SELECT ON public.v_latest_metal_prices TO anon, authenticated;

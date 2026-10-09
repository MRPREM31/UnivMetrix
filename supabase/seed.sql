-- Seed Data: supabase/seed.sql
-- Optional sample published records for local testing and initial verification.

INSERT INTO public.metal_price_observations 
(metal, purity, currency, unit, price, high_price, low_price, change_amount, change_percent, observed_at, provider, source_status, is_published, metadata)
VALUES
-- Gold 24K
('gold', '24K', 'INR', '1g', 7650.00, 7680.00, 7575.00, 60.00, 0.79, NOW() - INTERVAL '0 hours', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('gold', '24K', 'INR', '1g', 7590.00, 7620.00, 7550.00, 35.00, 0.46, NOW() - INTERVAL '1 day', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('gold', '24K', 'INR', '1g', 7555.00, 7580.00, 7520.00, -15.00, -0.20, NOW() - INTERVAL '2 days', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('gold', '24K', 'INR', '1g', 7570.00, 7600.00, 7530.00, 40.00, 0.53, NOW() - INTERVAL '3 days', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('gold', '24K', 'INR', '1g', 7530.00, 7560.00, 7500.00, 20.00, 0.27, NOW() - INTERVAL '4 days', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),

-- Gold 22K
('gold', '22K', 'INR', '1g', 7013.00, 7040.00, 6945.00, 55.00, 0.79, NOW() - INTERVAL '0 hours', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('gold', '22K', 'INR', '1g', 6958.00, 6985.00, 6920.00, 32.00, 0.46, NOW() - INTERVAL '1 day', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('gold', '22K', 'INR', '1g', 6926.00, 6950.00, 6890.00, -14.00, -0.20, NOW() - INTERVAL '2 days', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),

-- Gold 18K
('gold', '18K', 'INR', '1g', 5738.00, 5760.00, 5680.00, 45.00, 0.79, NOW() - INTERVAL '0 hours', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('gold', '18K', 'INR', '1g', 5693.00, 5715.00, 5660.00, 26.00, 0.46, NOW() - INTERVAL '1 day', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),

-- Silver 999
('silver', NULL, 'INR', '1g', 94.50, 95.80, 93.90, -0.70, -0.74, NOW() - INTERVAL '0 hours', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('silver', NULL, 'INR', '1g', 95.20, 96.00, 94.60, 0.80, 0.85, NOW() - INTERVAL '1 day', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('silver', NULL, 'INR', '1g', 94.40, 95.10, 93.80, -0.40, -0.42, NOW() - INTERVAL '2 days', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),

-- Platinum 950
('platinum', NULL, 'INR', '1g', 2820.00, 2845.00, 2780.00, 25.00, 0.89, NOW() - INTERVAL '0 hours', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('platinum', NULL, 'INR', '1g', 2795.00, 2815.00, 2760.00, 15.00, 0.54, NOW() - INTERVAL '1 day', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),

-- Palladium 950
('palladium', NULL, 'INR', '1g', 3050.00, 3130.00, 3025.00, -60.00, -1.93, NOW() - INTERVAL '0 hours', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb),
('palladium', NULL, 'INR', '1g', 3110.00, 3160.00, 3080.00, -30.00, -0.96, NOW() - INTERVAL '1 day', 'IBJA', 'verified', true, '{"session": "closing"}'::jsonb)
ON CONFLICT DO NOTHING;

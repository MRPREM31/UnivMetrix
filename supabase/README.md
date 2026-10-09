# MetalPrice — Supabase PostgreSQL Setup & Migration Guide

This document explains how to set up, migrate, and secure the Supabase PostgreSQL database for **MetalPrice**.

---

## 1. Quick Setup Steps

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New project**, choose an organization, and name your project (e.g., `metalprice-in`).
3. Set a strong database password and choose your nearest region (e.g., `ap-south-1` Mumbai for low-latency in India).

### Step 2: Run SQL Migrations
1. In the Supabase Dashboard, navigate to the **SQL Editor** tab.
2. Open the file `supabase/migrations/20261009000000_create_metal_price_observations.sql`.
3. Paste the entire SQL script into the SQL Editor and click **Run**.
4. *(Optional)* To populate initial sample data, open `supabase/seed.sql`, paste it into the SQL Editor, and click **Run**.

### Step 3: Configure Environment Variables
1. Go to **Project Settings** -> **API** in your Supabase dashboard.
2. Copy:
   - **Project URL** (`https://<project-ref>.supabase.co`)
   - **anon / public** API Key (`eyJhbGci...`)
3. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key-here
   ```
4. Restart your Vite development server:
   ```bash
   npm run dev
   ```
   The top bar status indicator will change from *"Demo Fallback"* to *"Supabase PostgreSQL Active"*.

---

## 2. PostgreSQL Schema Overview

### Table: `public.metal_price_observations`

| Column | Type | Nullable | Description |
|---|---|---|---|
| `id` | `UUID` | No | Primary Key (`gen_random_uuid()`) |
| `metal` | `VARCHAR(20)` | No | Commodity group (`'gold'`, `'silver'`, `'platinum'`, `'palladium'`) |
| `purity` | `VARCHAR(10)` | Yes | Karat / purity tier (`'24K'`, `'22K'`, `'18K'`, or `NULL`) |
| `currency` | `VARCHAR(3)` | No | ISO currency code (default: `'INR'`) |
| `unit` | `VARCHAR(10)` | No | Measurement unit (default: `'1g'`) |
| `price` | `NUMERIC(14, 4)` | No | Unit spot rate with exact decimal precision |
| `ask_price` | `NUMERIC(14, 4)` | Yes | Optional ask rate |
| `bid_price` | `NUMERIC(14, 4)` | Yes | Optional bid rate |
| `high_price` | `NUMERIC(14, 4)` | Yes | 24-hour day high |
| `low_price` | `NUMERIC(14, 4)` | Yes | 24-hour day low |
| `change_amount` | `NUMERIC(14, 4)` | Yes | Movement amount vs previous session close |
| `change_percent` | `NUMERIC(8, 4)` | Yes | Movement percentage |
| `observed_at` | `TIMESTAMPTZ` | No | Exact observation timestamp stored in UTC |
| `provider` | `VARCHAR(50)` | No | Data source tag (`'IBJA'`, `'MCX'`, `'LBMA'`, `'DEMO_SEED'`) |
| `source_status` | `VARCHAR(20)` | No | Verification status (`'verified'`, `'preliminary'`, `'demo'`) |
| `is_published` | `BOOLEAN` | No | Visibility flag (default: `true`) |
| `metadata` | `JSONB` | No | Extensible payload attributes (session, batch ID, etc.) |
| `created_at` | `TIMESTAMPTZ` | No | Row creation timestamp (UTC) |
| `updated_at` | `TIMESTAMPTZ` | No | Automatic updated_at trigger |

---

## 3. Security & Row Level Security (RLS) Policies

To protect the financial data store:

1. **Row Level Security (RLS) is Enabled**:
   ```sql
   ALTER TABLE public.metal_price_observations ENABLE ROW LEVEL SECURITY;
   ```
2. **Public Read-Only Policy**:
   ```sql
   CREATE POLICY "Allow public read-only access to published price records"
   ON public.metal_price_observations
   FOR SELECT
   TO anon, authenticated
   USING (is_published = true);
   ```
3. **No Public Write Access**:
   No `INSERT`, `UPDATE`, or `DELETE` policies are granted to `anon` or `authenticated` roles.
4. **Service-Role Key Isolation**:
   The `service_role` secret key is NEVER exposed in the frontend bundle (`.env.example` explicitly forbids `VITE_` prefix for service keys). Only backend ingestion workers (Phase 3) utilize this key.

---

## 4. Query Optimization & Indexes

- **Idempotent Upsert & Deduplication Index**:
  ```sql
  CREATE UNIQUE INDEX uq_metal_observation_idx ON public.metal_price_observations (
      metal, COALESCE(purity, ''), currency, unit, provider, observed_at
  );
  ```
- **Latest Spot Resolution Index**:
  ```sql
  CREATE INDEX idx_metal_obs_latest ON public.metal_price_observations (
      metal, purity, currency, observed_at DESC
  );
  ```
- **Time-Range Historical Query Index**:
  ```sql
  CREATE INDEX idx_metal_obs_range ON public.metal_price_observations (
      metal, purity, observed_at ASC
  );
  ```

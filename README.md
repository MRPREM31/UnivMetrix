# MetalPrice — Precious-Metals Price Tracking Platform (India)

MetalPrice is an institutional-grade precious-metals price tracking and analytics platform tailored for the Indian market. It provides real-time spot benchmark rates and historical time-series analytics for **Gold (24K, 22K, 18K)**, **Silver**, **Platinum**, and **Palladium** in Indian Rupees (INR).

---

## 1. System Architecture

```
┌────────────────────────────────────────────────────────┐
│               Frontend (React 19 + Vite)              │
│       SPA with Route-Level Code Splitting & Recharts   │
└───────────────┬────────────────────────┬───────────────┘
                │ Direct Read (RLS)      │ Edge API Cached
                ▼                        ▼
┌──────────────────────────────┐  ┌───────────────────────────────────┐
│     Supabase PostgreSQL     │  │   Vercel Serverless Functions     │
│  `metal_price_observations`  │◄─┤   `/api/prices`, `/api/history`   │
└──────────────────────────────┘  └─────────────────▲─────────────────┘
                                                    │ Protected Ingestion
                                  ┌─────────────────┴─────────────────┐
                                  │   Vercel Cron Ingestion Engine    │
                                  │    `/api/cron/update-prices`      │
                                  └─────────────────▲─────────────────┘
                                                    │
                                  ┌─────────────────┴─────────────────┐
                                  │     Multi-Tier Provider Adapter   │
                                  │  1. GoldAPI.io (Commercial)       │
                                  │  2. Gold-API.com (Zero-Key)       │
                                  │  3. MetalpriceAPI (Fallback)      │
                                  └───────────────────────────────────┘
```

---

## 2. Environment Variables & Security Isolation

Variables are partitioned strictly between public client-side parameters and server-only secrets:

### A. Browser-Safe Variables (Vite Client Bundle)
| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `VITE_SUPABASE_URL` | Yes | Supabase project API gateway | `https://feeqhdlppwnbgmvbscjt.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase public anonymous key (read-only RLS) | `eyJhbGciOi...` |
| `VITE_DATA_SOURCE_MODE` | No | Operational mode (`auto`, `supabase`, `demo`) | `auto` |

### B. Server-Only Secrets (Vercel Serverless Functions — Never in Client Code)
| Variable | Required | Description |
| :--- | :---: | :--- |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (for Ingestion) | Secret key with full database write privileges (bypasses RLS). |
| `CRON_SECRET` | Recommended | Bearer secret token protecting `/api/cron/update-prices` from public triggers. |
| `GOLDAPI_KEY` | Optional | GoldAPI.io subscription access token for authenticated spot rates. |
| `METALPRICE_API_KEY` | Optional | MetalpriceAPI key for secondary fallback. |

---

## 3. Step-by-Step Deployment Guide

### Phase A: Supabase PostgreSQL Setup
1. Create a Supabase project at [database.new](https://database.new).
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Execute the migration script located at [`supabase/migrations/20261009000000_create_metal_price_observations.sql`](./supabase/migrations/20261009000000_create_metal_price_observations.sql).
4. (Optional) Run [`supabase/seed.sql`](./supabase/seed.sql) to populate initial baseline records.
5. In **Project Settings > API**, copy the `Project URL`, `anon / public key`, and `service_role key`.

### Phase B: GitHub Repository Setup
1. Ensure `.env` is listed in `.gitignore`.
2. Commit and push your codebase to GitHub.

### Phase C: Vercel Deployment
1. Import your repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. In **Project Settings > Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET` (generate a secure random 32-character hex string)
   - `GOLDAPI_KEY` (if subscription active)
6. Trigger the deployment.

---

## 4. Vercel Cron Scheduling & Ingestion

### Cron Schedule Compatibility
[`vercel.json`](./vercel.json) configures `/api/cron/update-prices` on schedule `0 4,11 * * 1-5`:
- **Schedule:** Mon–Fri at `04:00 UTC` (09:30 IST market open) and `11:00 UTC` (16:30 IST market close).
- **Vercel Plan Compatibility:** Supported on Vercel Pro and Enterprise. On Vercel Hobby accounts, cron jobs may be limited to 1 execution per 24 hours.

### Manual Ingestion Trigger
To manually trigger the ingestion pipeline:
```bash
curl -X POST "https://<your-vercel-domain>.vercel.app/api/cron/update-prices" \
  -H "Authorization: Bearer <YOUR_CRON_SECRET>"
```

---

## 5. Production Smoke-Test Checklist

| Test Item | Verification Method | Expected Outcome |
| :--- | :--- | :--- |
| **Homepage Overview** | Navigate to `/` | Top bar renders green status chip if Supabase is active; cards display 24K, 22K, 18K Gold, Silver, Platinum, Palladium. |
| **Metal Detail Pages** | Navigate to `/gold`, `/silver`, `/platinum`, `/palladium` | Live spot rate, 24h change, day high/low, and statutory benchmark disclaimer are visible. |
| **Historical Charts** | Select range pills (`1D`, `1W`, `1M`, `6M`, `1Y`, `ALL`) | Interactive Recharts area graph renders smooth price curve without UI flickering. |
| **Diamond Guide** | Navigate to `/diamond-guide` | 4Cs educational reference guide renders clearly. |
| **Status Tagging** | Inspect top-right chip | Displays `Live Published Observations` or `Demo Fallback` without misleading users. |
| **API Endpoint (`/api/prices`)** | `GET /api/prices` | JSON response with HTTP 200 and `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`. |
| **API History (`/api/history`)** | `GET /api/history?metal=gold&range=1M` | JSON time-series array with pagination metadata. |
| **Cron Ingestion (`/api/cron/update-prices`)** | `GET /api/cron/update-prices` (without secret) | HTTP 401 Unauthorized. |

---

## 6. Licencing & Redistribution Disclaimers

- **Spot Benchmark Notice:** All displayed prices represent international wholesale spot benchmark rates in Indian Rupees (INR) per standard unit (1g / 10g / 1kg / 1 Troy Ounce). These rates exclude India's 3% Goods & Services Tax (GST), import customs tariffs, and local retail jeweller making charges.
- **Provider Status:**
  - **GoldAPI.io:** Commercial redistribution permitted under active paid API subscription.
  - **Gold-API.com:** Unconfirmed for commercial redistribution. Used strictly as an open community informational fallback.

---

## 7. Local Development

```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Run oxlint checks
npm run lint

# Run automated end-to-end integration test
node test-e2e.js

# Build production bundle
npm run build
```

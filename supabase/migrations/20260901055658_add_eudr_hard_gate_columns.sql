-- Migration: add EUDR hard-gate columns to suppliers
-- This is the first migration file in this repo. Prior to this, the
-- Supabase schema was managed only via the dashboard (see BACKEND_BUILD
-- §9 for the gap this was flagged as). Starting schema-as-code here
-- because these four columns are required for the coffee EUDR hard gates
-- specified in doc/scoring/coffee-eudr-addendum.md §2.
--
-- IMPORTANT: this file describes the intended schema change. If the
-- suppliers table in the live Supabase project was modified directly via
-- the dashboard after this migration was written, reconcile by hand
-- before applying — there is no guarantee the live schema matches any
-- prior state assumed here, per the existing "no schema-as-code" gap.

alter table public.suppliers
  add column if not exists eudr_geolocation_provided boolean,
  add column if not exists eudr_deforestation_free_confirmed boolean,
  add column if not exists eudr_legality_documented boolean,
  add column if not exists eudr_due_diligence_ready boolean;

comment on column public.suppliers.eudr_geolocation_provided is
  'Plot-level geolocation data (point or polygon) provided for all production units. EUDR hard gate, coffee-only — see doc/scoring/coffee-eudr-addendum.md.';
comment on column public.suppliers.eudr_deforestation_free_confirmed is
  'Supplier has confirmed/declared deforestation-free production (no deforestation after 31 Dec 2020). EUDR hard gate, coffee-only.';
comment on column public.suppliers.eudr_legality_documented is
  'Legal compliance in country of production documented (land use rights, environmental protection, labour rights, tax, anti-corruption, trade/customs). EUDR hard gate, coffee-only.';
comment on column public.suppliers.eudr_due_diligence_ready is
  'Due diligence statement prepared and ready for submission via the EU Information System. EUDR hard gate, coffee-only.';

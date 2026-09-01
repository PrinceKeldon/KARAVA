# Coffee Readiness Track — EUDR Addendum

**Status:** Coffee is a selectable product category. EUDR is scored in
the form-based/quick paths, AND the four EUDR hard gates below are now
implemented in the detailed-data pipeline (`hardGates.ts`), backed by a
real migration. See §3 for exactly what changed and how to verify it.

---

## 1. Why Coffee, Why Now

* Coffee is one of the 7 commodities actually covered by the EU
  Deforestation Regulation (EUDR) — cattle, cocoa, coffee, oil palm,
  rubber, soy, wood. Macadamia is not.
* EUDR carries a hard compliance deadline (large operators: Dec 2025;
  SMEs: June 2026 — confirm current date against the official EUDR
  timeline before quoting it to a supplier or buyer, as it has shifted
  before).
* Coffee is Kenya's largest single export category to Germany already —
  real existing trade volume, not a hypothetical corridor.
* This combination (real urgency + real deadline + real volume) is the
  reason coffee was chosen as the second product category, per the
  original KARAVA viability research.

---

## 2. EUDR Hard Gate Design (Specified)

EUDR due diligence has four substantive pillars. This is the target
hard-gate design for coffee suppliers going through the full,
detailed-data scoring pipeline (`calculateKenyaGermanyReadiness` /
`hardGates.ts`):

```
{
  "eudrHardGates": [
    {
      "id": "eudr_geolocation",
      "label": "Plot-level geolocation data for all production units",
      "required": true,
      "appliesTo": "coffee",
      "evidenceRequired": ["geolocation_coordinates_or_polygon"],
      "note": "Point coordinates for plots ≤4 hectares; polygon boundaries for larger plots, per EUDR Article 9."
    },
    {
      "id": "eudr_deforestation_free",
      "label": "Confirmation of deforestation-free production (no deforestation after 31 Dec 2020)",
      "required": true,
      "appliesTo": "coffee",
      "evidenceRequired": ["deforestation_free_declaration", "supporting_satellite_or_survey_evidence"]
    },
    {
      "id": "eudr_legality",
      "label": "Legal compliance in country of production (land use rights, environmental protection, labour rights, tax, anti-corruption, trade/customs)",
      "required": true,
      "appliesTo": "coffee",
      "evidenceRequired": ["legality_documentation"]
    },
    {
      "id": "eudr_due_diligence_statement",
      "label": "Due diligence statement prepared, ready for submission via the EU Information System",
      "required": true,
      "appliesTo": "coffee",
      "evidenceRequired": ["dds_draft_or_reference_number"]
    }
  ]
}
```

**These gates are now implemented in `hardGates.ts`** (`EUDR_HARD_GATES`,
`getHardGatesForSupplier()`), gated by
`isEUDRCoveredCategory(supplier.product_category)` — so macadamia and
other non-coffee suppliers are entirely unaffected, and only evaluated
when a supplier's category matches. Backing columns were added via
`supabase/migrations/20260901055658_add_eudr_hard_gate_columns.sql` —
the first real migration in this repo (see `BACKEND_BUILD` §9 for the
gap this addresses; that gap remains open for every other table until
someone does the same for them).

**Consequence to be aware of:** any coffee supplier who reaches the
detailed-data scoring pipeline (`calculateKenyaGermanyReadiness`) without
having set all four fields will be `BLOCKED`, same as failing any other
hard gate. This was a deliberate, conservative default matching "evidence
over aspiration" — but it means a coffee supplier can go from
`CONDITIONALLY_READY` to `BLOCKED` purely by having their category read
as coffee once these fields exist. The onboarding UI (§3) now collects
these fields directly so this isn't a silent trap, but it's worth
knowing about if reviewing existing coffee supplier data that predates
this change — those records will have all four fields `null`/unset and
will read as `BLOCKED` until updated.

---

## 3. What's Actually Implemented Today

* **`src/lib/scoring/eudr.ts`** — `isEUDRCoveredCategory()`, a shared
  keyword-based helper (checks for "coffee" in a category string or
  array). Not an enum check, because `product_category` / `products` are
  freeform strings (see `BACKEND_BUILD` §9).
* **`calculateReadinessFromFormData`** (`fitEngine.ts`) — the live
  onboarding-form scoring path. Scores the coarse `eudrStatus` field
  (`Not started` / `In progress` / `Unsure` / `Complete`), gated by
  `isEUDRCoveredCategory(formData.products)`.
* **`calculateQuickReadiness`** (`scoring/index.ts`) — the DB-backed quick
  path used for suppliers without detailed data. Checks for an
  `'EUDR Compliant'` tag in `supplier.certifications`, gated the same way,
  by `supplier.product_category`.
* **`hardGates.ts`** — `EUDR_HARD_GATES` (the four gates from §2),
  evaluated as real binary hard gates for coffee suppliers going through
  the detailed-data pipeline (`calculateKenyaGermanyReadiness`). Verified
  with scripted checks: a macadamia supplier with none of the four EUDR
  fields set is unaffected; a coffee supplier with none of them set is
  `BLOCKED` specifically on the four `eudr_*` gate IDs; the same coffee
  supplier with all four set is not blocked by EUDR (falls through to
  normal readiness scoring on the remaining criteria).
* **`supabase/migrations/20260901055658_add_eudr_hard_gate_columns.sql`**
  — adds `eudr_geolocation_provided`, `eudr_deforestation_free_confirmed`,
  `eudr_legality_documented`, `eudr_due_diligence_ready` as nullable
  booleans on `suppliers`. First real migration in this repo.
* **`src/types/supabase.ts`** and **`src/lib/scoring/types.ts`** — the
  four fields added to `Supplier` and `SupplierScoringData`.
* **Onboarding UI** (`ProcessorOnboarding.tsx`, `ReadinessStep`) — when
  Coffee is among the supplier's selected products, four toggles appear
  under the existing EUDR status question, with copy explicitly warning
  that these are hard requirements, not scored criteria. Values are
  written into the Supabase insert payload on submit.
* **Product category lists** — "Coffee" added to:
  `ProcessorOnboarding.tsx`, `BuyerOnboarding.tsx`, and
  `BuyerDiscovery.tsx`'s filter list.

## 4. What's Still NOT Implemented

* Buyer-side EUDR requirement fields (e.g. a buyer stating "I require DDS
  reference on file") — not modeled anywhere yet.
* Any integration with the EU's actual Information System / TRACES for
  DDS submission or verification — out of scope for KARAVA, which is a
  pre-trade readiness tool, not a compliance filing system.
* Applying the migration to the live Supabase project. The SQL file
  exists in the repo; someone with project access still needs to run it
  (via the Supabase CLI or dashboard SQL editor) before these fields
  actually persist. Until then, the code paths that read/write them will
  fail against the live DB or silently no-op depending on Supabase's
  behavior for unknown columns — test against a real environment before
  relying on this in production.

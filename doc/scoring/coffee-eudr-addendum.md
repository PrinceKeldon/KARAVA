# Coffee Readiness Track — EUDR Addendum

**Status:** Coffee is now a selectable product category. EUDR is scored,
conditionally, in the two live/reachable scoring paths (see §3). The full
4-gate EUDR hard-gate design below (§2) is specified but only partially
implemented — see §3 for exactly what runs today vs. what's designed for
later.

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

**These gates are NOT yet wired into `hardGates.ts`.** Reasons, so this
isn't silent scope-cutting:

* `hardGates.ts` operates on persisted `Supplier` DB records. None of the
  four fields above (`eudr_geolocation`, etc.) exist as columns in the
  live Supabase schema, and — per `BACKEND_BUILD` §9 — there's no
  `supabase/migrations/` in this repo to add them safely.
* Wiring these as hard gates today, with no way for any coffee supplier
  to ever satisfy them, would make every coffee supplier that reaches the
  detailed-data pipeline permanently `BLOCKED` with no path to fix it —
  a worse outcome than not scoring EUDR at all.
* The coarse-grained scoring that IS live today (§3) already captures the
  directional signal ("has this supplier started/finished EUDR
  paperwork?") without that failure mode, and matches what the onboarding
  form can actually collect right now.

**Before implementing these as real hard gates:** add the four
corresponding columns to the Supplier schema (ideally via a real
migration, breaking the "schema lives only in the dashboard" pattern),
add UI fields to collect them during onboarding, then wire them into
`hardGates.ts` gated by `isEUDRCoveredCategory(supplier.product_category)`
the same way the coarse scoring is gated today.

---

## 3. What's Actually Implemented Today

* **`src/lib/scoring/eudr.ts`** — `isEUDRCoveredCategory()`, a shared
  keyword-based helper (checks for "coffee" in a category string or
  array). Not an enum check, because `product_category` / `products` are
  freeform strings (see `BACKEND_BUILD` §9).
* **`calculateReadinessFromFormData`** (`fitEngine.ts`) — the live
  onboarding-form scoring path. Now scores the existing `eudrStatus`
  field (`Not started` / `In progress` / `Unsure` / `Complete`) exactly
  as before, but only when `isEUDRCoveredCategory(formData.products)` is
  true. This is the path a new coffee supplier actually experiences today.
* **`calculateQuickReadiness`** (`scoring/index.ts`) — the DB-backed quick
  path used for suppliers without detailed data. Now checks for an
  `'EUDR Compliant'` tag in `supplier.certifications`, gated the same way,
  by `supplier.product_category`.
* **Product category lists** — "Coffee" added to:
  `ProcessorOnboarding.tsx` (supplier product selection),
  `BuyerOnboarding.tsx` (buyer product-interest selection), and
  `BuyerDiscovery.tsx` (buyer-side filter list).
* **Onboarding copy** — the EUDR question in `ProcessorOnboarding.tsx`
  now reads differently depending on whether the supplier has selected
  Coffee, so suppliers aren't confused about whether it affects their
  score.

## 4. What's NOT Implemented

* The four-pillar hard-gate design in §2 (geolocation, deforestation-free,
  legality, DDS) — specified, not built. See §2 for why and what's needed
  first.
* Buyer-side EUDR requirement fields (e.g. a buyer stating "I require DDS
  reference on file") — not modeled anywhere yet.
* Any integration with the EU's actual Information System / TRACES for
  DDS submission or verification — out of scope for KARAVA, which is a
  pre-trade readiness tool, not a compliance filing system.

# 1. Scoring Architecture
The readiness score is composed of three sequential layers:

Hard Gates → Readiness Score → Risk Discounts → Final Score

If any hard gate fails, the process stops immediately.

# 2. Hard Trade Gates (Binary)
Definition

Hard gates represent legal, regulatory, or de-facto buyer requirements.
They are evaluated as boolean values only.

# RULE
if (anyHardGateFailed) {
  finalScore = 0;
  status = "BLOCKED";
}

# Hard Gate Schema
type HardGate = {
  id: string;
  label: string;
  required: true;
  evidenceRequired: string[];
};

# Hard Gate List
{
  "hardGates": [
    {
      "id": "export_license",
      "label": "Valid Kenyan export licence (AFA / relevant directorate)",
      "required": true,
      "evidenceRequired": ["licence_pdf", "licence_number", "validity_date"]
    },
    {
      "id": "legal_entity",
      "label": "Registered legal entity and company bank account",
      "required": true,
      "evidenceRequired": ["registration_certificate", "bank_confirmation"]
    },
    {
      "id": "food_safety_cert",
      "label": "EU-recognised food safety certification (BRCGS / IFS / FSSC 22000)",
      "required": true,
      "evidenceRequired": ["certificate_pdf", "cert_number", "expiry_date"]
    },
    {
      "id": "contaminant_compliance",
      "label": "EU contaminant & pesticide MRL compliance",
      "required": true,
      "evidenceRequired": ["accredited_lab_report", "test_date"]
    },
    {
      "id": "phytosanitary_certificate",
      "label": "Phytosanitary certificate (where product form requires it)",
      "required": true,
      "evidenceRequired": ["phyto_certificate"]
    },
    {
      "id": "eu_labelling",
      "label": "EU-compliant labelling including allergens",
      "required": true,
      "evidenceRequired": ["label_mockup_or_spec"]
    }
  ]
}


# 3. Readiness Score (0–100)
Calculated only if all hard gates pass.

# Category Weighting
{
  "readinessCategories": {
    "product_specification": 15,
    "capacity_and_volume": 20,
    "consistency_and_planning": 15,
    "documentation_and_transparency": 20,
    "commercial_readiness": 10,
    "traceability_basics": 20
  }
}

# Product Specification (0–15)
{
  "product_specification": {
    "criteria": [
      { "condition": "clear_grade_definitions", "points": 5 },
      { "condition": "defined_moisture_and_defect_limits", "points": 5 },
      { "condition": "packaging_and_shelf_life_defined", "points": 5 }
    ]
  }
}

# Capacity & Volume Realism (0–20)
{
  "capacity_and_volume": {
    "criteria": [
      { "condition": "container_equivalent_capacity", "points": 10 },
      { "condition": "documented_processing_capacity", "points": 5 },
      { "condition": "historical_export_evidence", "points": 5 }
    ]
  }
}

# Consistency & Planning (0–15)
{
  "consistency_and_planning": {
    "criteria": [
      { "condition": "defined_seasonality_window", "points": 5 },
      { "condition": "multi_season_supply_plan", "points": 5 },
      { "condition": "buffer_capacity_defined", "points": 5 }
    ]
  }
}

# Documentation & Transparency (0–20)
{
  "documentation_and_transparency": {
    "criteria": [
      { "condition": "company_profile_and_facility_description", "points": 5 },
      { "condition": "process_flow_documented", "points": 5 },
      { "condition": "recent_lab_results_shared", "points": 5 },
      { "condition": "traceable_document_storage", "points": 5 }
    ]
  }
}

# Commercial Readiness (0–10)
{
  "commercial_readiness": {
    "criteria": [
      { "condition": "incoterms_defined", "points": 5 },
      { "condition": "payment_terms_understood", "points": 5 }
    ]
  }
}

# Traceability Basics (0–20)
{
  "traceability_basics": {
    "criteria": [
      { "condition": "lot_coding_system_defined", "points": 10 },
      { "condition": "farm_or_coop_mapping", "points": 5 },
      { "condition": "recall_procedure_documented", "points": 5 }
    ]
  }
}


# 4. Risk Discount Layer (Negative Adjustments)

# Risk discounts are applied after readiness scoring.

# Rule 

finalScore = readinessScore - totalRiskPenalty;

# Risk Penalty Schema
type RiskPenalty = {
  id: string;
  label: string;
  minPenalty: number;
  maxPenalty: number;
  trigger: string;
};

# Risk Penalty Definitions

{
  "riskPenalties": [
    {
      "id": "quality_variance",
      "label": "High lot-to-lot quality variance",
      "minPenalty": 10,
      "maxPenalty": 25,
      "trigger": "documented_quality_inconsistency"
    },
    {
      "id": "inflated_capacity",
      "label": "Unverified or inflated capacity claims",
      "minPenalty": 10,
      "maxPenalty": 20,
      "trigger": "capacity_claims_exceed_evidence"
    },
    {
      "id": "weak_traceability",
      "label": "Weak or unclear traceability",
      "minPenalty": 5,
      "maxPenalty": 15,
      "trigger": "traceability_not_demonstrable"
    },
    {
      "id": "documentation_gaps",
      "label": "Missing or slow documentation",
      "minPenalty": 10,
      "maxPenalty": 20,
      "trigger": "key_docs_missing_at_onboarding"
    },
    {
      "id": "no_export_history",
      "label": "No container export experience",
      "minPenalty": 5,
      "maxPenalty": 5,
      "trigger": "no_prior_exports"
    },
    {
      "id": "logistics_issues",
      "label": "Documented logistics or delivery failures",
      "minPenalty": 10,
      "maxPenalty": 20,
      "trigger": "late_or_failed_shipments"
    }
  ]
}

# 5. Score Interpretation Bands
{
  "scoreBands": [
    { "min": 0, "max": 0, "label": "BLOCKED" },
    { "min": 1, "max": 59, "label": "NOT_READY" },
    { "min": 60, "max": 79, "label": "CONDITIONALLY_READY" },
    { "min": 80, "max": 100, "label": "HIGH_READINESS" }
  ]
}

# Calibration Guardrails
{
  "distributionTargets": {
    "blocked": "20–30%",
    "not_ready": "40–50%",
    "conditionally_ready": "15–25%",
    "high_readiness": "5–10%"
  }
}

# AI Usage Constraint (Non-Negotiable)
{
  "aiPolicy": {
    "allowed": [
      "explain_gate_failures",
      "summarise_risk_penalties",
      "recommend_next_actions",
      "translate_regulatory_requirements"
    ],
    "forbidden": [
      "modify_scores",
      "override_gates",
      "predict_deal_success",
      "approve_non_compliant_suppliers"
    ]
  }
}

# Summary Principle: 

KARAVA scores represent regulatory and buyer reality — not potential.
Scores move slowly, penalties are conservative, and excellence is rare by design.

---

# 6. Deviations Between This Spec and the Live Code (Added — Docs Reconciliation)

**Buyer-fit adjustment layer (undocumented, implemented):**
`fitEngine.ts` applies additional score adjustments on top of the readiness score above when buyer requirements are supplied — a −15 penalty if supplier capacity is below the buyer's minimum order quantity, and a −20 penalty if the supplier's product category doesn't match the buyer's requested category. This is a real, live part of the scoring outcome and belongs in this spec as a fourth layer: Hard Gates → Readiness Score → Risk Discounts → **Buyer-Fit Adjustment**.

**EUDR fields (resolved — see `doc/scoring/coffee-eudr-addendum.md`):**
The onboarding form's EUDR documentation status field is now scored conditionally, gated on product category via `isEUDRCoveredCategory()` (`src/lib/scoring/eudr.ts`). It applies to coffee (the only EUDR-covered category KARAVA currently supports); it remains unscored for macadamia and other current categories. This is implemented today in the form-based scoring path (`calculateReadinessFromFormData`) and the quick-readiness path (`calculateQuickReadiness`) — see the addendum doc for the fuller EUDR hard-gate design (geolocation, deforestation-free status, legality, due diligence statement) and what's specified vs. actually implemented.

---





























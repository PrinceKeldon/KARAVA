// Hard Trade Gates (Binary)
// If any hard gate fails, finalScore = 0 and status = "BLOCKED"

import type { HardGate, HardGateResult, SupplierScoringData } from './types';
import type { Supplier } from '@/types/supabase';
import { isEUDRCoveredCategory } from './eudr';

export const HARD_GATES: HardGate[] = [
  {
    id: 'export_license',
    label: 'Valid Kenyan export licence (AFA / relevant directorate)',
    required: true,
    evidenceRequired: ['licence_pdf', 'licence_number', 'validity_date'],
  },
  {
    id: 'legal_entity',
    label: 'Registered legal entity and company bank account',
    required: true,
    evidenceRequired: ['registration_certificate', 'bank_confirmation'],
  },
  {
    id: 'food_safety_cert',
    label: 'EU-recognised food safety certification (BRCGS / IFS / FSSC 22000)',
    required: true,
    evidenceRequired: ['certificate_pdf', 'cert_number', 'expiry_date'],
  },
  {
    id: 'contaminant_compliance',
    label: 'EU contaminant & pesticide MRL compliance',
    required: true,
    evidenceRequired: ['accredited_lab_report', 'test_date'],
  },
  {
    id: 'phytosanitary_certificate',
    label: 'Phytosanitary certificate (where product form requires it)',
    required: true,
    evidenceRequired: ['phyto_certificate'],
  },
  {
    id: 'eu_labelling',
    label: 'EU-compliant labelling including allergens',
    required: true,
    evidenceRequired: ['label_mockup_or_spec'],
  },
];

// EUDR hard gates — only apply to EUDR-covered categories (currently:
// coffee). See doc/scoring/coffee-eudr-addendum.md §2 for the source
// spec and doc/scoring/coffee-eudr-addendum.md §3 for what's implemented.
// Backed by supabase/migrations/20260901055658_add_eudr_hard_gate_columns.sql.
export const EUDR_HARD_GATES: HardGate[] = [
  {
    id: 'eudr_geolocation',
    label: 'Plot-level geolocation data for all production units',
    required: true,
    evidenceRequired: ['geolocation_coordinates_or_polygon'],
  },
  {
    id: 'eudr_deforestation_free',
    label: 'Confirmation of deforestation-free production (no deforestation after 31 Dec 2020)',
    required: true,
    evidenceRequired: ['deforestation_free_declaration', 'supporting_satellite_or_survey_evidence'],
  },
  {
    id: 'eudr_legality',
    label: 'Legal compliance in country of production (land use rights, environmental protection, labour rights, tax, anti-corruption, trade/customs)',
    required: true,
    evidenceRequired: ['legality_documentation'],
  },
  {
    id: 'eudr_due_diligence_statement',
    label: 'Due diligence statement prepared, ready for submission via the EU Information System',
    required: true,
    evidenceRequired: ['dds_draft_or_reference_number'],
  },
];

type ExtendedSupplier = Supplier & Partial<SupplierScoringData>;

/**
 * Get the applicable hard gate list for a supplier — base gates always
 * apply; EUDR gates apply only when the supplier's product category is
 * EUDR-covered (currently: coffee).
 */
export function getHardGatesForSupplier(supplier: ExtendedSupplier): HardGate[] {
  return isEUDRCoveredCategory(supplier.product_category)
    ? [...HARD_GATES, ...EUDR_HARD_GATES]
    : HARD_GATES;
}

/**
 * Evaluate all hard gates for a supplier.
 * For MVP, we check against available data and mark as "pending verification" when data is missing.
 */
export function evaluateHardGates(supplier: ExtendedSupplier): HardGateResult[] {
  const results: HardGateResult[] = [];
  const certs = supplier.certifications || [];

  // 1. Export License
  results.push({
    gateId: 'export_license',
    label: HARD_GATES[0].label,
    passed: Boolean(supplier.export_license_number && supplier.export_license_valid_until),
    reason: supplier.export_license_number 
      ? undefined 
      : 'Export license information not provided',
  });

  // 2. Legal Entity & Bank Account
  results.push({
    gateId: 'legal_entity',
    label: HARD_GATES[1].label,
    passed: Boolean(supplier.legal_registration_number && supplier.has_company_bank_account),
    reason: supplier.legal_registration_number 
      ? undefined 
      : 'Legal registration or bank account not verified',
  });

  // 3. EU-Recognized Food Safety Certification
  const foodSafetyCerts = supplier.food_safety_certs || [];
  const hasEUFoodSafetyCert = Boolean(
    foodSafetyCerts.length > 0 || 
    certs.some(c => ['BRCGS', 'IFS', 'FSSC 22000', 'FSSC22000'].includes(c))
  );
  results.push({
    gateId: 'food_safety_cert',
    label: HARD_GATES[2].label,
    passed: hasEUFoodSafetyCert,
    reason: hasEUFoodSafetyCert 
      ? undefined 
      : 'Missing EU-recognised food safety certification (BRCGS/IFS/FSSC 22000)',
  });

  // 4. Contaminant & Pesticide MRL Compliance
  results.push({
    gateId: 'contaminant_compliance',
    label: HARD_GATES[3].label,
    passed: Boolean(supplier.has_contaminant_report),
    reason: supplier.has_contaminant_report 
      ? undefined 
      : 'No accredited lab report for EU contaminant/pesticide MRL compliance',
  });

  // 5. Phytosanitary Certificate
  // Only required for certain product forms; for MVP, we check if they have it
  const requiresPhyto = supplier.processing_level === 'raw';
  results.push({
    gateId: 'phytosanitary_certificate',
    label: HARD_GATES[4].label,
    passed: !requiresPhyto || Boolean(supplier.has_phytosanitary_cert),
    reason: (!requiresPhyto || supplier.has_phytosanitary_cert)
      ? undefined 
      : 'Phytosanitary certificate required for raw products',
  });

  // 6. EU-Compliant Labelling
  results.push({
    gateId: 'eu_labelling',
    label: HARD_GATES[5].label,
    passed: Boolean(supplier.has_eu_compliant_labels),
    reason: supplier.has_eu_compliant_labels 
      ? undefined 
      : 'EU-compliant labelling not verified',
  });

  // 7-10. EUDR hard gates — coffee only. See getHardGatesForSupplier().
  if (isEUDRCoveredCategory(supplier.product_category)) {
    results.push({
      gateId: 'eudr_geolocation',
      label: EUDR_HARD_GATES[0].label,
      passed: Boolean(supplier.eudr_geolocation_provided),
      reason: supplier.eudr_geolocation_provided
        ? undefined
        : 'Plot-level geolocation data not provided (required for coffee under EUDR)',
    });

    results.push({
      gateId: 'eudr_deforestation_free',
      label: EUDR_HARD_GATES[1].label,
      passed: Boolean(supplier.eudr_deforestation_free_confirmed),
      reason: supplier.eudr_deforestation_free_confirmed
        ? undefined
        : 'Deforestation-free production not confirmed (required for coffee under EUDR)',
    });

    results.push({
      gateId: 'eudr_legality',
      label: EUDR_HARD_GATES[2].label,
      passed: Boolean(supplier.eudr_legality_documented),
      reason: supplier.eudr_legality_documented
        ? undefined
        : 'Legal compliance in country of production not documented (required for coffee under EUDR)',
    });

    results.push({
      gateId: 'eudr_due_diligence_statement',
      label: EUDR_HARD_GATES[3].label,
      passed: Boolean(supplier.eudr_due_diligence_ready),
      reason: supplier.eudr_due_diligence_ready
        ? undefined
        : 'Due diligence statement not ready (required for coffee under EUDR)',
    });
  }

  return results;
}

/**
 * Check if any hard gate has failed
 */
export function hasFailedGates(results: HardGateResult[]): boolean {
  return results.some(r => !r.passed);
}

/**
 * Get only the failed gates
 */
export function getFailedGates(results: HardGateResult[]): HardGateResult[] {
  return results.filter(r => !r.passed);
}

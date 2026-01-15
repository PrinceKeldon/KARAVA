// Hard Trade Gates (Binary)
// If any hard gate fails, finalScore = 0 and status = "BLOCKED"

import type { HardGate, HardGateResult, SupplierScoringData } from './types';
import type { Supplier } from '@/types/supabase';

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

type ExtendedSupplier = Supplier & Partial<SupplierScoringData>;

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
  const hasEUFoodSafetyCert = Boolean(
    supplier.food_safety_cert_type || 
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

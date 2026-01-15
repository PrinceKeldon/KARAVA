// Risk Discount Layer (Negative Adjustments)
// Applied after readiness scoring: finalScore = readinessScore - totalRiskPenalty

import type { RiskPenalty, AppliedRiskPenalty, SupplierScoringData } from './types';
import type { Supplier } from '@/types/supabase';

type ExtendedSupplier = Supplier & Partial<SupplierScoringData>;

export const RISK_PENALTIES: RiskPenalty[] = [
  {
    id: 'quality_variance',
    label: 'High lot-to-lot quality variance',
    minPenalty: 10,
    maxPenalty: 25,
    trigger: 'documented_quality_inconsistency',
  },
  {
    id: 'inflated_capacity',
    label: 'Unverified or inflated capacity claims',
    minPenalty: 10,
    maxPenalty: 20,
    trigger: 'capacity_claims_exceed_evidence',
  },
  {
    id: 'weak_traceability',
    label: 'Weak or unclear traceability',
    minPenalty: 5,
    maxPenalty: 15,
    trigger: 'traceability_not_demonstrable',
  },
  {
    id: 'documentation_gaps',
    label: 'Missing or slow documentation',
    minPenalty: 10,
    maxPenalty: 20,
    trigger: 'key_docs_missing_at_onboarding',
  },
  {
    id: 'no_export_history',
    label: 'No container export experience',
    minPenalty: 5,
    maxPenalty: 5,
    trigger: 'no_prior_exports',
  },
  {
    id: 'logistics_issues',
    label: 'Documented logistics or delivery failures',
    minPenalty: 10,
    maxPenalty: 20,
    trigger: 'late_or_failed_shipments',
  },
];

/**
 * Calculate risk penalties for a supplier
 */
export function calculateRiskPenalties(supplier: ExtendedSupplier): AppliedRiskPenalty[] {
  const applied: AppliedRiskPenalty[] = [];

  // 1. Quality Variance Risk
  if (supplier.quality_variance_risk === 'high') {
    applied.push({
      penaltyId: 'quality_variance',
      label: RISK_PENALTIES[0].label,
      penalty: 25, // max penalty for high variance
      reason: 'Documented high lot-to-lot quality variance',
    });
  } else if (supplier.quality_variance_risk === 'medium') {
    applied.push({
      penaltyId: 'quality_variance',
      label: RISK_PENALTIES[0].label,
      penalty: 15, // mid-range penalty
      reason: 'Moderate quality variance observed',
    });
  }

  // 2. Inflated Capacity
  if (supplier.capacity_verified === false) {
    applied.push({
      penaltyId: 'inflated_capacity',
      label: RISK_PENALTIES[1].label,
      penalty: 15, // mid-range penalty
      reason: 'Capacity claims not independently verified',
    });
  }

  // 3. Weak Traceability
  if (supplier.traceability_strength === 'weak') {
    applied.push({
      penaltyId: 'weak_traceability',
      label: RISK_PENALTIES[2].label,
      penalty: 15, // max penalty
      reason: 'Traceability to farm level not demonstrable',
    });
  } else if (supplier.traceability_strength === 'partial') {
    applied.push({
      penaltyId: 'weak_traceability',
      label: RISK_PENALTIES[2].label,
      penalty: 8, // mid-range
      reason: 'Partial traceability – gaps in chain documentation',
    });
  }

  // 4. Documentation Gaps
  if (supplier.documentation_complete === false) {
    applied.push({
      penaltyId: 'documentation_gaps',
      label: RISK_PENALTIES[3].label,
      penalty: 15, // mid-range
      reason: 'Key documentation missing at onboarding',
    });
  }

  // 5. No Export History (fixed penalty)
  if (!supplier.export_experience) {
    applied.push({
      penaltyId: 'no_export_history',
      label: RISK_PENALTIES[4].label,
      penalty: 5, // fixed
      reason: 'No prior container export experience',
    });
  }

  // 6. Logistics Issues
  if (supplier.has_logistics_issues) {
    applied.push({
      penaltyId: 'logistics_issues',
      label: RISK_PENALTIES[5].label,
      penalty: 15, // mid-range
      reason: 'Documented delivery or logistics failures',
    });
  }

  return applied;
}

/**
 * Calculate total penalty from all applied risk discounts
 */
export function calculateTotalPenalty(penalties: AppliedRiskPenalty[]): number {
  return penalties.reduce((sum, p) => sum + p.penalty, 0);
}

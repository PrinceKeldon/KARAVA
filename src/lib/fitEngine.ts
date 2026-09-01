import type { Supplier, Buyer } from '@/types/supabase';
import { 
  calculateKenyaGermanyReadiness, 
  calculateQuickReadiness,
  getStatusLabel,
  getStatusColor,
  type ScoreResult,
  type ScoreBand,
  type HardGateResult,
  type ReadinessCategory,
  type AppliedRiskPenalty,
} from './scoring';
import { isEUDRCoveredCategory } from './scoring/eudr';

export interface FitResult {
  fitScore: number;
  readinessScore: number;
  status: ScoreBand;
  statusLabel: string;
  statusColor: string;
  gaps: string[];
  // Detailed breakdown (only available with full scoring)
  gateResults?: HardGateResult[];
  failedGates?: HardGateResult[];
  readinessBreakdown?: ReadinessCategory[];
  appliedPenalties?: AppliedRiskPenalty[];
  totalPenalty?: number;
}

/**
 * Calculate fit score using the Kenya-Germany readiness scoring system
 * 
 * Architecture (from doc/scoring/kenya-germany-readiness-spec.md):
 * 1. Hard Gates → If any fail: BLOCKED, score = 0
 * 2. Readiness Score → Weighted category scoring (0-100)
 * 3. Risk Discounts → Penalties applied after readiness score
 * 
 * If buyer requirements are provided, additional buyer-specific adjustments are applied.
 */
export function calculateFitScore(
  supplier: Supplier,
  buyerRequirements?: Partial<Buyer>
): FitResult {
  // Use quick readiness for suppliers without full scoring data
  // This provides a reasonable estimate when detailed fields aren't available
  const hasDetailedData = Boolean(
    supplier.export_license_number || 
    supplier.has_grade_definitions ||
    supplier.has_lot_coding_system
  );

  let result: ScoreResult;
  
  if (hasDetailedData) {
    // Full Kenya-Germany readiness scoring
    result = calculateKenyaGermanyReadiness(supplier);
  } else {
    // Quick assessment based on available data
    const quick = calculateQuickReadiness(supplier);
    result = {
      finalScore: quick.score,
      readinessScore: quick.score,
      status: quick.status,
      gateResults: [],
      failedGates: [],
      readinessBreakdown: [],
      appliedPenalties: [],
      totalPenalty: 0,
      gaps: quick.gaps,
    };
  }

  let fitScore = result.finalScore;
  const additionalGaps: string[] = [];

  // Apply buyer-specific adjustments (on top of readiness score)
  if (buyerRequirements) {
    // Check capacity against buyer minimum
    if (buyerRequirements.min_order_quantity && supplier.production_capacity_monthly) {
      if (supplier.production_capacity_monthly < buyerRequirements.min_order_quantity) {
        fitScore -= 15;
        additionalGaps.push(
          `Production capacity (${supplier.production_capacity_monthly} MT/mo) below buyer minimum (${buyerRequirements.min_order_quantity} MT)`
        );
      }
    }

    // Check product category alignment
    if (buyerRequirements.product_category) {
      const supplierProducts = supplier.product_category.toLowerCase();
      const buyerCategory = buyerRequirements.product_category.toLowerCase();
      if (!supplierProducts.includes(buyerCategory)) {
        fitScore -= 20;
        additionalGaps.push('Product category does not match buyer requirements');
      }
    }
  }

  // Clamp final fit score
  fitScore = Math.max(0, Math.min(100, fitScore));

  return {
    fitScore,
    readinessScore: result.readinessScore,
    status: result.status,
    statusLabel: getStatusLabel(result.status),
    statusColor: getStatusColor(result.status),
    gaps: [...result.gaps, ...additionalGaps],
    gateResults: result.gateResults,
    failedGates: result.failedGates,
    readinessBreakdown: result.readinessBreakdown,
    appliedPenalties: result.appliedPenalties,
    totalPenalty: result.totalPenalty,
  };
}

/**
 * Calculate readiness from onboarding form data
 * Used during the supplier onboarding flow
 */
export function calculateReadinessFromFormData(formData: {
  certifications?: string[];
  eudrStatus?: string;
  traceability?: string;
  exportCapacity?: string;
  annualVolume?: string;
  products?: string[];
}): FitResult {
  let readinessScore = 50; // Start at midpoint
  const gaps: string[] = [];
  
  const certifications = formData.certifications || [];
  const eudrStatus = formData.eudrStatus || '';
  const traceability = formData.traceability || '';
  const exportCapacity = parseFloat(formData.exportCapacity || '0') || 0;
  const annualVolume = parseFloat(formData.annualVolume || '0') || 0;

  // EU Food Safety Certification check
  const hasEUFoodSafety = certifications.some(c => 
    ['BRCGS', 'IFS', 'FSSC 22000', 'FSSC22000'].includes(c)
  );
  if (!hasEUFoodSafety) {
    readinessScore -= 15;
    gaps.push('Missing EU-recognised food safety certification (BRCGS/IFS/FSSC 22000)');
  }

  // HACCP baseline
  if (!certifications.includes('HACCP')) {
    readinessScore -= 10;
    gaps.push('Missing HACCP certification');
  }

  // EUDR is only scored for EUDR-covered product categories (currently:
  // coffee). Macadamia, sesame, and other oilseeds are not EUDR-covered —
  // see src/lib/scoring/eudr.ts and MVP Freeze Document §5a for why this
  // is conditional rather than universal.
  if (isEUDRCoveredCategory(formData.products)) {
    if (eudrStatus === 'Not started') {
      readinessScore -= 20;
      gaps.push('EUDR due diligence not started — required for coffee exports to the EU');
    } else if (eudrStatus === 'In progress') {
      readinessScore -= 10;
      gaps.push('EUDR due diligence in progress');
    } else if (eudrStatus === 'Unsure') {
      readinessScore -= 15;
      gaps.push('EUDR compliance status unknown — required for coffee exports to the EU');
    } else if (eudrStatus === 'Complete') {
      readinessScore += 10;
    }
  } else {
    // Not an EUDR-covered category — collected but not scored.
    void eudrStatus;
  }

  // Traceability
  if (traceability === 'None') {
    readinessScore -= 15;
    gaps.push('No traceability to farm level');
  } else if (traceability === 'Partial') {
    readinessScore -= 8;
    gaps.push('Partial traceability – full farm-level tracing recommended');
  } else if (traceability === 'Full') {
    readinessScore += 10;
  }

  // Export orientation bonus
  if (exportCapacity > 0 && annualVolume > 0) {
    const exportRatio = exportCapacity / annualVolume;
    if (exportRatio >= 0.5) {
      readinessScore += 5;
    }
  }

  // Certification bonuses
  if (certifications.includes('Organic')) readinessScore += 5;
  if (certifications.includes('Fair Trade')) readinessScore += 3;

  const finalScore = Math.max(0, Math.min(100, readinessScore));
  const status: ScoreBand = 
    finalScore === 0 ? 'BLOCKED' :
    finalScore < 60 ? 'NOT_READY' :
    finalScore < 80 ? 'CONDITIONALLY_READY' : 'HIGH_READINESS';

  return {
    fitScore: finalScore,
    readinessScore: finalScore,
    status,
    statusLabel: getStatusLabel(status),
    statusColor: getStatusColor(status),
    gaps,
  };
}

// Re-export scoring utilities
export { getStatusLabel, getStatusColor } from './scoring';
export type { ScoreBand, HardGateResult, ReadinessCategory, AppliedRiskPenalty } from './scoring';

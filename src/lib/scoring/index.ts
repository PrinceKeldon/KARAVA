// Kenya-Germany Readiness Scoring Engine
// Main orchestrator for the 3-layer scoring architecture

import type { ScoreResult, ScoreBand, SupplierScoringData } from './types';
import type { Supplier } from '@/types/supabase';
import { evaluateHardGates, hasFailedGates, getFailedGates } from './hardGates';
import { calculateReadinessBreakdown, calculateReadinessScore, getReadinessGaps } from './readinessScore';
import { calculateRiskPenalties, calculateTotalPenalty } from './riskDiscounts';
import { isEUDRCoveredCategory } from './eudr';

export type { ScoreResult, ScoreBand, SupplierScoringData };
export type { HardGateResult, ReadinessCategory, AppliedRiskPenalty } from './types';

type ExtendedSupplier = Supplier & Partial<SupplierScoringData>;

/**
 * Determine the score band based on final score
 */
function getScoreBand(score: number, hasFailedGates: boolean): ScoreBand {
  if (hasFailedGates || score === 0) return 'BLOCKED';
  if (score < 60) return 'NOT_READY';
  if (score < 80) return 'CONDITIONALLY_READY';
  return 'HIGH_READINESS';
}

/**
 * Get human-readable status label
 */
export function getStatusLabel(status: ScoreBand): string {
  const labels: Record<ScoreBand, string> = {
    BLOCKED: 'Blocked',
    NOT_READY: 'Not Ready',
    CONDITIONALLY_READY: 'Conditionally Ready',
    HIGH_READINESS: 'High Readiness',
  };
  return labels[status];
}

/**
 * Get status color class for UI
 */
export function getStatusColor(status: ScoreBand): string {
  const colors: Record<ScoreBand, string> = {
    BLOCKED: 'bg-destructive/10 text-destructive border-destructive/20',
    NOT_READY: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    CONDITIONALLY_READY: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    HIGH_READINESS: 'bg-primary/10 text-primary border-primary/20',
  };
  return colors[status];
}

/**
 * Main scoring function - calculates Kenya-Germany readiness score
 * 
 * Architecture:
 * 1. Hard Gates → If any fail: BLOCKED, score = 0
 * 2. Readiness Score → Weighted category scoring (0-100)
 * 3. Risk Discounts → Penalties applied after readiness score
 * 
 * finalScore = readinessScore - totalRiskPenalty
 */
export function calculateKenyaGermanyReadiness(supplier: ExtendedSupplier): ScoreResult {
  // Step 1: Evaluate Hard Gates
  const gateResults = evaluateHardGates(supplier);
  const failedGates = getFailedGates(gateResults);
  const gatesFailed = hasFailedGates(gateResults);

  // If any gate fails → BLOCKED
  if (gatesFailed) {
    return {
      finalScore: 0,
      readinessScore: 0,
      status: 'BLOCKED',
      gateResults,
      failedGates,
      readinessBreakdown: [],
      appliedPenalties: [],
      totalPenalty: 0,
      gaps: failedGates.map(g => g.reason || g.label),
    };
  }

  // Step 2: Calculate Readiness Score
  const readinessBreakdown = calculateReadinessBreakdown(supplier);
  const readinessScore = calculateReadinessScore(readinessBreakdown);
  const readinessGaps = getReadinessGaps(readinessBreakdown);

  // Step 3: Apply Risk Discounts
  const appliedPenalties = calculateRiskPenalties(supplier);
  const totalPenalty = calculateTotalPenalty(appliedPenalties);

  // Calculate final score
  const finalScore = Math.max(0, readinessScore - totalPenalty);
  const status = getScoreBand(finalScore, false);

  // Combine all gaps
  const gaps = [
    ...readinessGaps,
    ...appliedPenalties.map(p => p.reason),
  ];

  return {
    finalScore,
    readinessScore,
    status,
    gateResults,
    failedGates: [],
    readinessBreakdown,
    appliedPenalties,
    totalPenalty,
    gaps,
  };
}

/**
 * Quick readiness check - simplified version for initial assessment
 * Used when full scoring data is not available
 */
export function calculateQuickReadiness(supplier: Supplier): {
  score: number;
  status: ScoreBand;
  gaps: string[];
} {
  let score = 50; // Start at midpoint for unknown data
  const gaps: string[] = [];
  const certs = supplier.certifications || [];

  // Check for key certifications
  const hasEUFoodSafety = certs.some(c => 
    ['BRCGS', 'IFS', 'FSSC 22000', 'FSSC22000'].includes(c)
  );
  if (!hasEUFoodSafety) {
    score -= 15;
    gaps.push('Missing EU-recognised food safety certification');
  }

  // Check HACCP as a baseline
  if (!certs.includes('HACCP')) {
    score -= 10;
    gaps.push('Missing HACCP certification');
  }

  // EUDR is only scored for EUDR-covered product categories (currently:
  // coffee) — see src/lib/scoring/eudr.ts and MVP Freeze Document §5a.
  // Macadamia/tree nuts and other current categories are not EUDR-covered,
  // so this stays conditional rather than a blanket penalty.
  if (isEUDRCoveredCategory(supplier.product_category)) {
    if (!certs.includes('EUDR Compliant')) {
      score -= 10;
      gaps.push('EUDR compliance not verified — required for coffee exports to the EU');
    }
  }

  // Export experience
  if (!supplier.export_experience) {
    score -= 5;
    gaps.push('No prior export experience');
  }

  // Processing level
  if (supplier.processing_level === 'raw') {
    score -= 5;
    gaps.push('Raw product requires additional processing');
  } else if (supplier.processing_level === 'export-ready') {
    score += 10;
  }

  // Capacity check
  if (!supplier.production_capacity_monthly || supplier.production_capacity_monthly < 10) {
    score -= 10;
    gaps.push('Production capacity below export minimum');
  }

  // Bonuses
  if (certs.includes('Organic')) score += 5;
  if (certs.includes('Fair Trade')) score += 3;

  const finalScore = Math.max(0, Math.min(100, score));
  const status = getScoreBand(finalScore, false);

  return { score: finalScore, status, gaps };
}

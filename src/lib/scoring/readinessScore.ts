// Readiness Score (0-100)
// Calculated only if all hard gates pass

import type { ReadinessCategory, SupplierScoringData } from './types';
import type { Supplier } from '@/types/supabase';

type ExtendedSupplier = Supplier & Partial<SupplierScoringData>;

interface CategoryDefinition {
  category: string;
  weight: number;
  criteria: {
    condition: string;
    points: number;
    check: (supplier: ExtendedSupplier) => boolean;
  }[];
}

const READINESS_CATEGORIES: CategoryDefinition[] = [
  {
    category: 'product_specification',
    weight: 15,
    criteria: [
      {
        condition: 'clear_grade_definitions',
        points: 5,
        check: (s) => Boolean(s.has_grade_definitions),
      },
      {
        condition: 'defined_moisture_and_defect_limits',
        points: 5,
        check: (s) => Boolean(s.has_moisture_defect_limits),
      },
      {
        condition: 'packaging_and_shelf_life_defined',
        points: 5,
        check: (s) => Boolean(s.has_packaging_specs),
      },
    ],
  },
  {
    category: 'capacity_and_volume',
    weight: 20,
    criteria: [
      {
        condition: 'container_equivalent_capacity',
        points: 10,
        // At least 1 container (18-20 MT) per shipment
        check: (s) => (s.container_capacity_20ft || 0) >= 1,
      },
      {
        condition: 'documented_processing_capacity',
        points: 5,
        check: (s) => Boolean(s.documented_processing_capacity || s.production_capacity_monthly),
      },
      {
        condition: 'historical_export_evidence',
        points: 5,
        check: (s) => Boolean(s.export_experience),
      },
    ],
  },
  {
    category: 'consistency_and_planning',
    weight: 15,
    criteria: [
      {
        condition: 'defined_seasonality_window',
        points: 5,
        check: (s) => Boolean(s.has_seasonality_window),
      },
      {
        condition: 'multi_season_supply_plan',
        points: 5,
        check: (s) => Boolean(s.has_multi_season_plan),
      },
      {
        condition: 'buffer_capacity_defined',
        points: 5,
        check: (s) => Boolean(s.has_buffer_capacity),
      },
    ],
  },
  {
    category: 'documentation_and_transparency',
    weight: 20,
    criteria: [
      {
        condition: 'company_profile_and_facility_description',
        points: 5,
        check: (s) => Boolean(s.has_company_profile),
      },
      {
        condition: 'process_flow_documented',
        points: 5,
        check: (s) => Boolean(s.has_process_flow_doc),
      },
      {
        condition: 'recent_lab_results_shared',
        points: 5,
        check: (s) => Boolean(s.has_recent_lab_results),
      },
      {
        condition: 'traceable_document_storage',
        points: 5,
        check: (s) => Boolean(s.has_document_storage),
      },
    ],
  },
  {
    category: 'commercial_readiness',
    weight: 10,
    criteria: [
      {
        condition: 'incoterms_defined',
        points: 5,
        check: (s) => Boolean(s.incoterms_defined),
      },
      {
        condition: 'payment_terms_understood',
        points: 5,
        check: (s) => Boolean(s.payment_terms_understood),
      },
    ],
  },
  {
    category: 'traceability_basics',
    weight: 20,
    criteria: [
      {
        condition: 'lot_coding_system_defined',
        points: 10,
        check: (s) => Boolean(s.has_lot_coding_system),
      },
      {
        condition: 'farm_or_coop_mapping',
        points: 5,
        check: (s) => Boolean(s.has_farm_mapping),
      },
      {
        condition: 'recall_procedure_documented',
        points: 5,
        check: (s) => Boolean(s.has_recall_procedure),
      },
    ],
  },
];

/**
 * Calculate the readiness score breakdown by category
 */
export function calculateReadinessBreakdown(supplier: ExtendedSupplier): ReadinessCategory[] {
  return READINESS_CATEGORIES.map(cat => {
    const criteria = cat.criteria.map(crit => ({
      condition: crit.condition,
      points: crit.points,
      met: crit.check(supplier),
      reason: crit.check(supplier) ? undefined : `${formatCondition(crit.condition)} not verified`,
    }));

    const earnedPoints = criteria.filter(c => c.met).reduce((sum, c) => sum + c.points, 0);
    const maxPoints = cat.criteria.reduce((sum, c) => sum + c.points, 0);

    return {
      category: cat.category,
      weight: cat.weight,
      maxPoints,
      earnedPoints,
      criteria,
    };
  });
}

/**
 * Calculate the total readiness score (0-100)
 */
export function calculateReadinessScore(breakdown: ReadinessCategory[]): number {
  let totalScore = 0;

  breakdown.forEach(cat => {
    // Each category contributes its weight proportionally based on earned vs max points
    if (cat.maxPoints > 0) {
      const categoryScore = (cat.earnedPoints / cat.maxPoints) * cat.weight;
      totalScore += categoryScore;
    }
  });

  return Math.round(totalScore);
}

/**
 * Get gaps from the readiness breakdown
 */
export function getReadinessGaps(breakdown: ReadinessCategory[]): string[] {
  const gaps: string[] = [];

  breakdown.forEach(cat => {
    cat.criteria.forEach(crit => {
      if (!crit.met && crit.reason) {
        gaps.push(crit.reason);
      }
    });
  });

  return gaps;
}

/**
 * Format condition ID to human-readable text
 */
function formatCondition(condition: string): string {
  return condition
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export { READINESS_CATEGORIES };

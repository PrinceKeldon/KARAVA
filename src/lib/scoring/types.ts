// Kenya-Germany Readiness Scoring System Types
// Based on doc/scoring/kenya-germany-readiness-spec.md

export type ScoreBand = 'BLOCKED' | 'NOT_READY' | 'CONDITIONALLY_READY' | 'HIGH_READINESS';

export interface HardGate {
  id: string;
  label: string;
  required: true;
  evidenceRequired: string[];
}

export interface HardGateResult {
  gateId: string;
  label: string;
  passed: boolean;
  reason?: string;
}

export interface ReadinessCriterion {
  condition: string;
  points: number;
  met: boolean;
  reason?: string;
}

export interface ReadinessCategory {
  category: string;
  weight: number;
  maxPoints: number;
  earnedPoints: number;
  criteria: ReadinessCriterion[];
}

export interface RiskPenalty {
  id: string;
  label: string;
  minPenalty: number;
  maxPenalty: number;
  trigger: string;
}

export interface AppliedRiskPenalty {
  penaltyId: string;
  label: string;
  penalty: number;
  reason: string;
}

export interface ScoreResult {
  finalScore: number;
  readinessScore: number;
  status: ScoreBand;
  gateResults: HardGateResult[];
  failedGates: HardGateResult[];
  readinessBreakdown: ReadinessCategory[];
  appliedPenalties: AppliedRiskPenalty[];
  totalPenalty: number;
  gaps: string[];
}

// Extended Supplier fields for scoring
export interface SupplierScoringData {
  // Hard gate fields
  export_license_number?: string | null;
  export_license_valid_until?: string | null;
  legal_registration_number?: string | null;
  has_company_bank_account?: boolean | null;
  food_safety_certs?: string[] | null;
  food_safety_cert_expiry?: string | null;
  has_contaminant_report?: boolean | null;
  contaminant_report_date?: string | null;
  has_phytosanitary_cert?: boolean | null;
  has_eu_compliant_labels?: boolean | null;
  
  // Readiness scoring fields - Product Specification
  has_grade_definitions?: boolean | null;
  has_moisture_defect_limits?: boolean | null;
  has_packaging_specs?: boolean | null;
  
  // Readiness scoring fields - Capacity & Volume
  container_capacity_20ft?: number | null;
  documented_processing_capacity?: boolean | null;
  
  // Readiness scoring fields - Consistency & Planning
  has_seasonality_window?: boolean | null;
  has_multi_season_plan?: boolean | null;
  has_buffer_capacity?: boolean | null;
  
  // Readiness scoring fields - Documentation & Transparency
  has_company_profile?: boolean | null;
  has_process_flow_doc?: boolean | null;
  has_recent_lab_results?: boolean | null;
  has_document_storage?: boolean | null;
  
  // Readiness scoring fields - Commercial Readiness
  incoterms_defined?: boolean | null;
  payment_terms_understood?: boolean | null;
  
  // Readiness scoring fields - Traceability Basics
  has_lot_coding_system?: boolean | null;
  has_farm_mapping?: boolean | null;
  has_recall_procedure?: boolean | null;
  
  // Risk indicators
  quality_variance_risk?: 'low' | 'medium' | 'high' | null;
  capacity_verified?: boolean | null;
  traceability_strength?: 'strong' | 'partial' | 'weak' | null;
  has_logistics_issues?: boolean | null;
  documentation_complete?: boolean | null;

  // EUDR hard gate fields (coffee-only — see doc/scoring/coffee-eudr-addendum.md)
  eudr_geolocation_provided?: boolean | null;
  eudr_deforestation_free_confirmed?: boolean | null;
  eudr_legality_documented?: boolean | null;
  eudr_due_diligence_ready?: boolean | null;
}

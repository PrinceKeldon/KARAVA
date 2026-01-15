export type ProcessingLevel = 'raw' | 'processed' | 'export-ready';
export type BuyerType = 'importer' | 'processor' | 'wholesaler';
export type OrderFrequency = 'spot' | 'recurring';
export type RiskTolerance = 'low' | 'medium' | 'high';
export type IntroStatus = 'pending' | 'approved' | 'rejected';

export interface Supplier {
  id: string;
  company_name: string;
  contact_name: string | null;
  location_county: string;
  product_category: string;
  production_capacity_monthly: number | null;
  processing_level: ProcessingLevel | null;
  certifications: string[] | null;
  export_experience: boolean;
  created_at: string;
  
  // Extended fields for Kenya-Germany readiness scoring
  // Hard gate fields
  export_license_number?: string | null;
  export_license_valid_until?: string | null;
  legal_registration_number?: string | null;
  has_company_bank_account?: boolean | null;
  food_safety_cert_type?: 'BRCGS' | 'IFS' | 'FSSC22000' | null;
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
}

export interface Buyer {
  id: string;
  company_name: string;
  buyer_type: BuyerType;
  product_category: string;
  required_specs: Record<string, unknown> | null;
  min_order_quantity: number | null;
  frequency: OrderFrequency | null;
  risk_tolerance: RiskTolerance | null;
  created_at: string;
}

export interface FitAnalysis {
  id: string;
  supplier_id: string;
  buyer_id: string;
  fit_score: number;
  readiness_score: number;
  gaps: string[];
  notes: string | null;
  created_at: string;
}

export interface IntroRequest {
  id: string;
  supplier_id: string;
  buyer_id: string;
  status: IntroStatus;
  created_at: string;
}

export type SupplierInsert = Omit<Supplier, 'id' | 'created_at'>;
export type SupplierUpdate = Partial<Omit<Supplier, 'id'>>;

export type BuyerInsert = Omit<Buyer, 'id' | 'created_at'>;
export type BuyerUpdate = Partial<Omit<Buyer, 'id'>>;

export type FitAnalysisInsert = Omit<FitAnalysis, 'id' | 'created_at'>;
export type IntroRequestInsert = Omit<IntroRequest, 'id' | 'created_at'>;

export interface FeatureFlag {
  id: string;
  key: string;
  enabled: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      suppliers: {
        Row: Supplier;
        Insert: SupplierInsert;
        Update: SupplierUpdate;
        Relationships: [];
      };
      buyers: {
        Row: Buyer;
        Insert: BuyerInsert;
        Update: BuyerUpdate;
        Relationships: [];
      };
      fit_analyses: {
        Row: FitAnalysis;
        Insert: FitAnalysisInsert;
        Update: Partial<Omit<FitAnalysis, 'id'>>;
        Relationships: [];
      };
      intro_requests: {
        Row: IntroRequest;
        Insert: IntroRequestInsert;
        Update: Partial<Omit<IntroRequest, 'id'>>;
        Relationships: [];
      };
      feature_flags: {
        Row: FeatureFlag;
        Insert: Omit<FeatureFlag, 'id' | 'created_at'>;
        Update: Partial<Omit<FeatureFlag, 'id'>>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      processing_level: ProcessingLevel;
      buyer_type: BuyerType;
      order_frequency: OrderFrequency;
      risk_tolerance: RiskTolerance;
      intro_status: IntroStatus;
    };
    CompositeTypes: {};
  };
}

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

export interface Database {
  public: {
    Tables: {
      suppliers: {
        Row: Supplier;
        Insert: SupplierInsert;
        Update: SupplierUpdate;
      };
      buyers: {
        Row: Buyer;
        Insert: BuyerInsert;
        Update: BuyerUpdate;
      };
      fit_analyses: {
        Row: FitAnalysis;
        Insert: FitAnalysisInsert;
        Update: Partial<Omit<FitAnalysis, 'id'>>;
      };
      intro_requests: {
        Row: IntroRequest;
        Insert: IntroRequestInsert;
        Update: Partial<Omit<IntroRequest, 'id'>>;
      };
    };
  };
}

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Server-side validation schema (mirrors client-side Zod schema)
interface SupplierData {
  company_name: string;
  location: string;
  roles: string[];
  products: string[];
  annual_volume?: string;
  export_capacity?: string;
  container_capacity_20ft?: string;
  certifications?: string[];
  eudr_status?: string;
  traceability?: string;
  has_export_license?: boolean;
  export_license_number?: string;
  has_legal_registration?: boolean;
  legal_registration_number?: string;
  has_company_bank_account?: boolean;
  food_safety_cert_type?: string;
  has_contaminant_report?: boolean;
  has_phytosanitary_cert?: boolean;
  has_eu_compliant_labels?: boolean;
  has_grade_definitions?: boolean;
  has_moisture_defect_limits?: boolean;
  has_packaging_specs?: boolean;
  documented_processing_capacity?: boolean;
  has_seasonality_window?: boolean;
  has_multi_season_plan?: boolean;
  has_buffer_capacity?: boolean;
  has_company_profile?: boolean;
  has_process_flow_doc?: boolean;
  has_recent_lab_results?: boolean;
  has_document_storage?: boolean;
  incoterms_defined?: boolean;
  payment_terms_understood?: boolean;
  has_lot_coding_system?: boolean;
  has_farm_mapping?: boolean;
  has_recall_procedure?: boolean;
  quality_variance_risk?: string;
  capacity_verified?: boolean;
  traceability_strength?: string;
  has_logistics_issues?: boolean;
  documentation_complete?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  type: 'required' | 'invalid' | 'hard-gate';
}

function validateSupplier(data: SupplierData): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!data.company_name || data.company_name.trim().length < 2) {
    errors.push({
      field: 'company_name',
      message: 'Company name must be at least 2 characters',
      type: 'required'
    });
  }

  if (!data.location || data.location.trim().length < 2) {
    errors.push({
      field: 'location',
      message: 'Location is required',
      type: 'required'
    });
  }

  if (!data.roles || data.roles.length === 0) {
    errors.push({
      field: 'roles',
      message: 'At least one role must be selected',
      type: 'required'
    });
  }

  if (!data.products || data.products.length === 0) {
    errors.push({
      field: 'products',
      message: 'At least one product must be selected',
      type: 'required'
    });
  }

  // Capacity validation
  if (data.annual_volume) {
    const volume = parseFloat(data.annual_volume);
    if (isNaN(volume) || volume < 1) {
      errors.push({
        field: 'annual_volume',
        message: 'Minimum capacity is 1 ton',
        type: 'invalid'
      });
    }
    if (volume > 100000) {
      errors.push({
        field: 'annual_volume',
        message: 'Capacity exceeds realistic limits (100,000 MT)',
        type: 'invalid'
      });
    }
  }

  // Conditional validation: license number required if license claimed
  if (data.has_export_license && (!data.export_license_number || !data.export_license_number.trim())) {
    errors.push({
      field: 'export_license_number',
      message: 'License number is required when export license is claimed',
      type: 'hard-gate'
    });
  }

  // Conditional validation: registration number required if registration claimed
  if (data.has_legal_registration && (!data.legal_registration_number || !data.legal_registration_number.trim())) {
    errors.push({
      field: 'legal_registration_number',
      message: 'Registration number is required when legal entity is claimed',
      type: 'hard-gate'
    });
  }

  // Validate food safety cert type
  const validCertTypes = ['', 'BRCGS', 'IFS', 'FSSC22000'];
  if (data.food_safety_cert_type && !validCertTypes.includes(data.food_safety_cert_type)) {
    errors.push({
      field: 'food_safety_cert_type',
      message: 'Invalid food safety certification type',
      type: 'invalid'
    });
  }

  // Validate risk enums
  const validRiskLevels = ['', 'low', 'medium', 'high'];
  if (data.quality_variance_risk && !validRiskLevels.includes(data.quality_variance_risk)) {
    errors.push({
      field: 'quality_variance_risk',
      message: 'Invalid quality variance risk level',
      type: 'invalid'
    });
  }

  const validTraceabilityStrengths = ['', 'strong', 'partial', 'weak'];
  if (data.traceability_strength && !validTraceabilityStrengths.includes(data.traceability_strength)) {
    errors.push({
      field: 'traceability_strength',
      message: 'Invalid traceability strength value',
      type: 'invalid'
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supplierData: SupplierData = await req.json();
    
    console.log("Validating supplier data:", JSON.stringify(supplierData, null, 2));

    // Run server-side validation
    const validation = validateSupplier(supplierData);

    if (!validation.valid) {
      console.log("Validation failed:", validation.errors);
      return new Response(
        JSON.stringify({
          valid: false,
          errors: validation.errors,
          message: "Supplier data validation failed"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // MVP Demo Mode: Validation-only
    // The scoring engine is deterministic and runs client-side
    // Assessment results are stored in sessionStorage
    // Database persistence is not required for demo credibility
    console.log("Supplier validation passed - MVP demo mode (no database persistence)");

    return new Response(
      JSON.stringify({
        valid: true,
        supplier: { 
          id: 'demo-' + Date.now(), 
          ...supplierData,
          created_at: new Date().toISOString()
        },
        message: "Supplier validated successfully"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("validate-supplier error:", error);
    
    return new Response(
      JSON.stringify({
        valid: false,
        errors: [{ field: 'server', message: errorMessage, type: 'invalid' }],
        message: "Server error during validation"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
import { z } from "zod";

// Validation schema for Supplier Onboarding based on Kenya-Germany readiness spec
export const SupplierOnboardingSchema = z.object({
  // Company Identity
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  yearsOperating: z.string().optional(),
  roles: z.array(z.string()).min(1, "Select at least one role"),
  
  // Product Scope
  products: z.array(z.string()).min(1, "Select at least one product"),
  
  // Capacity
  annualVolume: z.string()
    .refine(val => !val || parseFloat(val) >= 1, "Minimum capacity is 1 ton")
    .refine(val => !val || parseFloat(val) <= 100000, "Capacity exceeds realistic limits (100,000 MT)"),
  exportCapacity: z.string().optional(),
  containerCapacity20ft: z.string().optional(),
  
  // Original readiness fields
  certifications: z.array(z.string()).default([]),
  eudrStatus: z.string().optional(),
  traceability: z.string().optional(),
  
  // Hard Gates (Compliance)
  hasExportLicense: z.boolean().default(false),
  exportLicenseNumber: z.string().optional(),
  hasLegalRegistration: z.boolean().default(false),
  legalRegistrationNumber: z.string().optional(),
  hasCompanyBankAccount: z.boolean().default(false),
  foodSafetyCertType: z.enum(["", "BRCGS", "IFS", "FSSC22000"]).default(""),
  hasContaminantReport: z.boolean().default(false),
  hasPhytosanitaryCert: z.boolean().default(false),
  hasEUCompliantLabels: z.boolean().default(false),
  
  // Readiness Criteria
  hasGradeDefinitions: z.boolean().default(false),
  hasMoistureDefectLimits: z.boolean().default(false),
  hasPackagingSpecs: z.boolean().default(false),
  documentedProcessingCapacity: z.boolean().default(false),
  hasSeasonalityWindow: z.boolean().default(false),
  hasMultiSeasonPlan: z.boolean().default(false),
  hasBufferCapacity: z.boolean().default(false),
  hasCompanyProfile: z.boolean().default(false),
  hasProcessFlowDoc: z.boolean().default(false),
  hasRecentLabResults: z.boolean().default(false),
  hasDocumentStorage: z.boolean().default(false),
  incotermsDefined: z.boolean().default(false),
  paymentTermsUnderstood: z.boolean().default(false),
  hasLotCodingSystem: z.boolean().default(false),
  hasFarmMapping: z.boolean().default(false),
  hasRecallProcedure: z.boolean().default(false),
  
  // Risk Indicators
  qualityVarianceRisk: z.enum(["", "low", "medium", "high"]).default(""),
  capacityVerified: z.boolean().default(false),
  traceabilityStrength: z.enum(["", "strong", "partial", "weak"]).default(""),
  hasLogisticsIssues: z.boolean().default(false),
  documentationComplete: z.boolean().default(false),
}).refine(
  (data) => !data.hasExportLicense || Boolean(data.exportLicenseNumber?.trim()),
  {
    message: "License number is required when export license is claimed",
    path: ["exportLicenseNumber"]
  }
).refine(
  (data) => !data.hasLegalRegistration || Boolean(data.legalRegistrationNumber?.trim()),
  {
    message: "Registration number is required when legal entity is claimed",
    path: ["legalRegistrationNumber"]
  }
);

export type SupplierOnboardingInput = z.infer<typeof SupplierOnboardingSchema>;

// Field groups for per-step validation
export const stepFieldGroups: Record<number, (keyof SupplierOnboardingInput)[]> = {
  1: ['companyName', 'location', 'roles'],
  2: ['products', 'annualVolume'],
  3: ['hasExportLicense', 'exportLicenseNumber', 'hasLegalRegistration', 'legalRegistrationNumber', 'foodSafetyCertType'],
  4: ['certifications', 'traceability', 'eudrStatus'],
  5: ['qualityVarianceRisk', 'traceabilityStrength'],
};

// Default form values
export const defaultFormValues: SupplierOnboardingInput = {
  companyName: '',
  location: '',
  yearsOperating: '',
  roles: [],
  products: [],
  annualVolume: '',
  exportCapacity: '',
  containerCapacity20ft: '',
  certifications: [],
  eudrStatus: '',
  traceability: '',
  hasExportLicense: false,
  exportLicenseNumber: '',
  hasLegalRegistration: false,
  legalRegistrationNumber: '',
  hasCompanyBankAccount: false,
  foodSafetyCertType: '',
  hasContaminantReport: false,
  hasPhytosanitaryCert: false,
  hasEUCompliantLabels: false,
  hasGradeDefinitions: false,
  hasMoistureDefectLimits: false,
  hasPackagingSpecs: false,
  documentedProcessingCapacity: false,
  hasSeasonalityWindow: false,
  hasMultiSeasonPlan: false,
  hasBufferCapacity: false,
  hasCompanyProfile: false,
  hasProcessFlowDoc: false,
  hasRecentLabResults: false,
  hasDocumentStorage: false,
  incotermsDefined: false,
  paymentTermsUnderstood: false,
  hasLotCodingSystem: false,
  hasFarmMapping: false,
  hasRecallProcedure: false,
  qualityVarianceRisk: '',
  capacityVerified: false,
  traceabilityStrength: '',
  hasLogisticsIssues: false,
  documentationComplete: false,
};

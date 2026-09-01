import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Building2, Users, FileCheck, BarChart3, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { useToast } from "@/hooks/use-toast";
import { calculateReadinessFromFormData, type FitResult } from "@/lib/fitEngine";
import { isEUDRCoveredCategory } from "@/lib/scoring/eudr";
import { supabase } from "@/integrations/supabase/client";
import { 
  SupplierOnboardingSchema, 
  SupplierOnboardingInput, 
  stepFieldGroups,
  defaultFormValues 
} from "@/schemas/supplierOnboarding.schema";
import type { ProcessingLevel } from "@/types/supabase";

interface StepProps {
  form: UseFormReturn<SupplierOnboardingInput>;
  onNext: () => void;
  onBack?: () => void;
}

const steps = [
  { title: "Company", icon: Building2 },
  { title: "Products", icon: Users },
  { title: "Compliance", icon: Shield },
  { title: "Readiness", icon: FileCheck },
  { title: "Risk", icon: AlertTriangle },
  { title: "Assessment", icon: BarChart3 },
];

const roleToProcessingLevel = (roles: string[]): ProcessingLevel => {
  if (roles.includes("Exporter")) return 'export-ready';
  if (roles.includes("Processor")) return 'processed';
  return 'raw';
};

function ToggleOption({ 
  label, 
  checked, 
  onChange, 
  className = "" 
}: { 
  label: string; 
  checked: boolean; 
  onChange: () => void;
  className?: string;
}) {
  return (
    <label 
      className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
        checked 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50'
      } ${className}`}
    >
      <input 
        type="checkbox" 
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-sm">{label}</span>
      {checked && <Check className="w-3 h-3 text-primary" />}
    </label>
  );
}

function RadioOption({ 
  label, 
  selected, 
  onChange 
}: { 
  label: string; 
  selected: boolean; 
  onChange: () => void;
}) {
  return (
    <label 
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer transition-colors text-sm bg-card ${
        selected 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50'
      }`}
    >
      <input 
        type="radio" 
        className="sr-only"
        checked={selected}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
}

function CompanyInfoStep({ form, onNext }: StepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const roles = watch('roles');

  const toggleRole = (role: string) => {
    const currentRoles = roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    setValue('roles', newRoles, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Company Information</h3>
        <p className="text-sm text-muted-foreground">Basic details about your operation</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
          <Input 
            placeholder="e.g., Thika Valley Processors Ltd" 
            {...register('companyName')}
          />
          <FormError message={errors.companyName?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
            <Input 
              placeholder="City, County" 
              {...register('location')}
            />
            <FormError message={errors.location?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Years Operating</label>
            <Input 
              placeholder="e.g., 8" 
              type="number"
              {...register('yearsOperating')}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Role in Supply Chain</label>
          <div className="flex flex-wrap gap-2">
            {["Grower", "Processor", "Aggregator", "Exporter"].map((role) => (
              <ToggleOption
                key={role}
                label={role}
                checked={roles?.includes(role) || false}
                onChange={() => toggleRole(role)}
              />
            ))}
          </div>
          <FormError message={errors.roles?.message} />
        </div>
      </div>
      <Button onClick={onNext} className="w-full">
        Continue <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function ProductsStep({ form, onNext, onBack }: StepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const products = watch('products');

  const toggleProduct = (product: string) => {
    const currentProducts = products || [];
    const newProducts = currentProducts.includes(product)
      ? currentProducts.filter(p => p !== product)
      : [...currentProducts, product];
    setValue('products', newProducts, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Products & Capacity</h3>
        <p className="text-sm text-muted-foreground">What do you produce or process?</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Products</label>
          <div className="grid grid-cols-2 gap-2">
            {["Macadamia (in-shell)", "Macadamia (kernel)", "Sesame Seeds", "Sesame Oil", "Coffee (green/parchment)", "Other Oilseeds"].map((product) => (
              <ToggleOption
                key={product}
                label={product}
                checked={products?.includes(product) || false}
                onChange={() => toggleProduct(product)}
              />
            ))}
          </div>
          <FormError message={errors.products?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Annual Volume (MT)</label>
            <Input 
              placeholder="e.g., 2500" 
              type="number"
              {...register('annualVolume')}
            />
            <FormError message={errors.annualVolume?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Export Capacity (MT)</label>
            <Input 
              placeholder="e.g., 2000" 
              type="number"
              {...register('exportCapacity')}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Container Capacity (20ft/month)</label>
          <Input 
            placeholder="e.g., 4" 
            type="number"
            {...register('containerCapacity20ft')}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function ComplianceStep({ form, onNext, onBack }: StepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const hasExportLicense = watch('hasExportLicense');
  const hasLegalRegistration = watch('hasLegalRegistration');
  const hasCompanyBankAccount = watch('hasCompanyBankAccount');
  const foodSafetyCerts = watch('foodSafetyCerts') || [];
  const hasContaminantReport = watch('hasContaminantReport');
  const hasPhytosanitaryCert = watch('hasPhytosanitaryCert');
  const hasEUCompliantLabels = watch('hasEUCompliantLabels');

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Compliance & Licensing</h3>
        <p className="text-sm text-muted-foreground">Required documentation for EU market access</p>
      </div>
      <div className="space-y-4">
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Export License (AFA)</p>
          <div className="space-y-3">
            <ToggleOption
              label="Have valid Kenyan export license"
              checked={hasExportLicense}
              onChange={() => setValue('hasExportLicense', !hasExportLicense, { shouldValidate: true })}
            />
            {hasExportLicense && (
              <div>
                <Input 
                  placeholder="License number" 
                  {...register('exportLicenseNumber')}
                />
                <FormError message={errors.exportLicenseNumber?.message} type="hard-gate" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Legal Entity</p>
          <div className="space-y-3">
            <ToggleOption
              label="Registered legal entity"
              checked={hasLegalRegistration}
              onChange={() => setValue('hasLegalRegistration', !hasLegalRegistration, { shouldValidate: true })}
            />
            {hasLegalRegistration && (
              <div>
                <Input 
                  placeholder="Registration number" 
                  {...register('legalRegistrationNumber')}
                />
                <FormError message={errors.legalRegistrationNumber?.message} type="hard-gate" />
              </div>
            )}
            <ToggleOption
              label="Have company bank account"
              checked={hasCompanyBankAccount}
              onChange={() => setValue('hasCompanyBankAccount', !hasCompanyBankAccount)}
            />
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">EU Food Safety Certification</p>
          <p className="text-xs text-muted-foreground mb-3">Select all certifications you hold</p>
          <div className="flex flex-wrap gap-2">
            {['BRCGS', 'IFS', 'FSSC22000'].map((cert) => {
              const toggleFoodSafetyCert = (certName: string) => {
                const currentCerts = foodSafetyCerts || [];
                const newCerts = currentCerts.includes(certName)
                  ? currentCerts.filter((c: string) => c !== certName)
                  : [...currentCerts, certName];
                setValue('foodSafetyCerts', newCerts);
              };
              return (
                <ToggleOption
                  key={cert}
                  label={cert === 'FSSC22000' ? 'FSSC 22000' : cert}
                  checked={foodSafetyCerts.includes(cert)}
                  onChange={() => toggleFoodSafetyCert(cert)}
                />
              );
            })}
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Additional Compliance</p>
          <div className="space-y-2">
            <ToggleOption
              label="Have contaminant/pesticide MRL report"
              checked={hasContaminantReport}
              onChange={() => setValue('hasContaminantReport', !hasContaminantReport)}
            />
            <ToggleOption
              label="Have phytosanitary certificate"
              checked={hasPhytosanitaryCert}
              onChange={() => setValue('hasPhytosanitaryCert', !hasPhytosanitaryCert)}
            />
            <ToggleOption
              label="Have EU-compliant labelling"
              checked={hasEUCompliantLabels}
              onChange={() => setValue('hasEUCompliantLabels', !hasEUCompliantLabels)}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function ReadinessStep({ form, onNext, onBack }: StepProps) {
  const { watch, setValue } = form;
  const certifications = watch('certifications');
  const eudrStatus = watch('eudrStatus');
  const products = watch('products');
  const eudrApplies = isEUDRCoveredCategory(products);
  const traceability = watch('traceability');
  const hasGradeDefinitions = watch('hasGradeDefinitions');
  const hasMoistureDefectLimits = watch('hasMoistureDefectLimits');
  const hasPackagingSpecs = watch('hasPackagingSpecs');
  const hasSeasonalityWindow = watch('hasSeasonalityWindow');
  const hasMultiSeasonPlan = watch('hasMultiSeasonPlan');
  const hasBufferCapacity = watch('hasBufferCapacity');
  const documentedProcessingCapacity = watch('documentedProcessingCapacity');
  const hasCompanyProfile = watch('hasCompanyProfile');
  const hasProcessFlowDoc = watch('hasProcessFlowDoc');
  const hasRecentLabResults = watch('hasRecentLabResults');
  const hasDocumentStorage = watch('hasDocumentStorage');
  const incotermsDefined = watch('incotermsDefined');
  const paymentTermsUnderstood = watch('paymentTermsUnderstood');
  const hasLotCodingSystem = watch('hasLotCodingSystem');
  const hasFarmMapping = watch('hasFarmMapping');
  const hasRecallProcedure = watch('hasRecallProcedure');

  const toggleCert = (cert: string) => {
    const currentCerts = certifications || [];
    const newCerts = currentCerts.includes(cert)
      ? currentCerts.filter(c => c !== cert)
      : [...currentCerts, cert];
    setValue('certifications', newCerts);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Readiness Assessment</h3>
        <p className="text-sm text-muted-foreground">Documentation and operational capabilities</p>
      </div>
      <div className="space-y-4">
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">General Certifications</p>
          <div className="flex flex-wrap gap-2">
            {["HACCP", "ISO 22000", "Organic", "Fair Trade", "None"].map((cert) => (
              <ToggleOption
                key={cert}
                label={cert}
                checked={certifications?.includes(cert) || false}
                onChange={() => toggleCert(cert)}
                className="bg-card"
              />
            ))}
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Product Specification</p>
          <div className="space-y-2">
            <ToggleOption
              label="Have grade definitions documented"
              checked={hasGradeDefinitions}
              onChange={() => setValue('hasGradeDefinitions', !hasGradeDefinitions)}
            />
            <ToggleOption
              label="Have moisture/defect limits defined"
              checked={hasMoistureDefectLimits}
              onChange={() => setValue('hasMoistureDefectLimits', !hasMoistureDefectLimits)}
            />
            <ToggleOption
              label="Have packaging/shelf-life specs"
              checked={hasPackagingSpecs}
              onChange={() => setValue('hasPackagingSpecs', !hasPackagingSpecs)}
            />
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Planning & Consistency</p>
          <div className="space-y-2">
            <ToggleOption
              label="Have seasonality window defined"
              checked={hasSeasonalityWindow}
              onChange={() => setValue('hasSeasonalityWindow', !hasSeasonalityWindow)}
            />
            <ToggleOption
              label="Have multi-season supply plan"
              checked={hasMultiSeasonPlan}
              onChange={() => setValue('hasMultiSeasonPlan', !hasMultiSeasonPlan)}
            />
            <ToggleOption
              label="Have buffer capacity for demand spikes"
              checked={hasBufferCapacity}
              onChange={() => setValue('hasBufferCapacity', !hasBufferCapacity)}
            />
            <ToggleOption
              label="Documented processing capacity"
              checked={documentedProcessingCapacity}
              onChange={() => setValue('documentedProcessingCapacity', !documentedProcessingCapacity)}
            />
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Documentation & Transparency</p>
          <div className="space-y-2">
            <ToggleOption
              label="Have company profile document"
              checked={hasCompanyProfile}
              onChange={() => setValue('hasCompanyProfile', !hasCompanyProfile)}
            />
            <ToggleOption
              label="Have process flow documentation"
              checked={hasProcessFlowDoc}
              onChange={() => setValue('hasProcessFlowDoc', !hasProcessFlowDoc)}
            />
            <ToggleOption
              label="Have recent lab results"
              checked={hasRecentLabResults}
              onChange={() => setValue('hasRecentLabResults', !hasRecentLabResults)}
            />
            <ToggleOption
              label="Have document storage system"
              checked={hasDocumentStorage}
              onChange={() => setValue('hasDocumentStorage', !hasDocumentStorage)}
            />
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Commercial & Traceability</p>
          <div className="space-y-2">
            <ToggleOption
              label="Incoterms defined (FOB/CIF etc)"
              checked={incotermsDefined}
              onChange={() => setValue('incotermsDefined', !incotermsDefined)}
            />
            <ToggleOption
              label="Payment terms understood (LC, CAD)"
              checked={paymentTermsUnderstood}
              onChange={() => setValue('paymentTermsUnderstood', !paymentTermsUnderstood)}
            />
            <ToggleOption
              label="Have lot/batch coding system"
              checked={hasLotCodingSystem}
              onChange={() => setValue('hasLotCodingSystem', !hasLotCodingSystem)}
            />
            <ToggleOption
              label="Have farm/cooperative mapping"
              checked={hasFarmMapping}
              onChange={() => setValue('hasFarmMapping', !hasFarmMapping)}
            />
            <ToggleOption
              label="Have recall procedure"
              checked={hasRecallProcedure}
              onChange={() => setValue('hasRecallProcedure', !hasRecallProcedure)}
            />
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">EUDR documentation status</p>
          <p className="text-xs text-muted-foreground mb-3">
            {eudrApplies
              ? "Required for coffee exports to the EU — this affects your readiness score."
              : "Optional for this product category — not currently part of your readiness score."}
          </p>
          <div className="flex flex-wrap gap-2">
            {["Complete", "In progress", "Not started", "Unsure"].map((opt) => (
              <RadioOption
                key={opt}
                label={opt}
                selected={eudrStatus === opt}
                onChange={() => setValue('eudrStatus', opt)}
              />
            ))}
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Traceability to farm level</p>
          <div className="flex flex-wrap gap-2">
            {["Full", "Partial", "None"].map((opt) => (
              <RadioOption
                key={opt}
                label={opt}
                selected={traceability === opt}
                onChange={() => setValue('traceability', opt)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function RiskStep({ form, onNext, onBack }: StepProps) {
  const { watch, setValue } = form;
  const qualityVarianceRisk = watch('qualityVarianceRisk');
  const traceabilityStrength = watch('traceabilityStrength');
  const capacityVerified = watch('capacityVerified');
  const documentationComplete = watch('documentationComplete');
  const hasLogisticsIssues = watch('hasLogisticsIssues');

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Risk Indicators</h3>
        <p className="text-sm text-muted-foreground">Self-assessment of potential risk factors</p>
      </div>
      <div className="space-y-4">
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Quality Variance (lot-to-lot)</p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'low', label: 'Low - Consistent' },
              { value: 'medium', label: 'Medium - Some variance' },
              { value: 'high', label: 'High - Variable' },
            ].map((opt) => (
              <RadioOption
                key={opt.value}
                label={opt.label}
                selected={qualityVarianceRisk === opt.value}
                onChange={() => setValue('qualityVarianceRisk', opt.value as 'low' | 'medium' | 'high')}
              />
            ))}
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Traceability System Strength</p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'strong', label: 'Strong - Full chain' },
              { value: 'partial', label: 'Partial - Some gaps' },
              { value: 'weak', label: 'Weak - Limited' },
            ].map((opt) => (
              <RadioOption
                key={opt.value}
                label={opt.label}
                selected={traceabilityStrength === opt.value}
                onChange={() => setValue('traceabilityStrength', opt.value as 'strong' | 'partial' | 'weak')}
              />
            ))}
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Verification & Issues</p>
          <div className="space-y-2">
            <ToggleOption
              label="Capacity has been verified/audited"
              checked={capacityVerified}
              onChange={() => setValue('capacityVerified', !capacityVerified)}
            />
            <ToggleOption
              label="Documentation is complete"
              checked={documentationComplete}
              onChange={() => setValue('documentationComplete', !documentationComplete)}
            />
            <ToggleOption
              label="Have experienced logistics issues"
              checked={hasLogisticsIssues}
              onChange={() => setValue('hasLogisticsIssues', !hasLogisticsIssues)}
            />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function AssessmentPreviewStep({ form, assessment, onBack, onSubmit, isLoading }: { 
  form: UseFormReturn<SupplierOnboardingInput>;
  assessment: FitResult;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  const formData = form.getValues();
  
  const positives = [
    formData.products.length > 0 && "Product types match buyer demand",
    parseInt(formData.annualVolume) >= 100 && "Volume meets minimum thresholds",
    formData.roles.includes("Exporter") && "Export experience present",
    formData.hasExportLicense && "Valid export license",
    formData.foodSafetyCerts && formData.foodSafetyCerts.length > 0 && "EU food safety certification",
    formData.hasLotCodingSystem && "Traceability system in place",
  ].filter(Boolean);

  const warnings = [
    !formData.hasExportLicense && "Missing export license (required)",
    (!formData.foodSafetyCerts || formData.foodSafetyCerts.length === 0) && "No EU food safety certification",
    !formData.hasPhytosanitaryCert && "Missing phytosanitary certificate",
    formData.qualityVarianceRisk === 'high' && "High quality variance risk",
    formData.traceabilityStrength === 'weak' && "Weak traceability systems",
    ...assessment.gaps,
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Assessment Preview</h3>
        <p className="text-sm text-muted-foreground">Your preliminary market-fit evaluation</p>
      </div>
      <div className="bg-muted/30 rounded-md p-5 border border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">Preliminary Readiness Score</span>
          <span className={`px-3 py-1 rounded text-sm font-bold ${
            assessment.readinessScore >= 80 ? 'bg-primary/10 text-primary' :
            assessment.readinessScore >= 60 ? 'bg-[hsl(40_90%_50%/0.1)] text-[hsl(40_90%_40%)]' :
            'bg-destructive/10 text-destructive'
          }`}>
            {assessment.readinessScore}%
          </span>
        </div>
        <div className="space-y-3 mb-4">
          {positives.slice(0, 5).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-primary" />
              <span>{item}</span>
            </div>
          ))}
          {warnings.slice(0, 5).map((gap, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-[hsl(40_90%_40%)] mt-0.5">⚠</span>
              <span className="text-muted-foreground">{gap}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Full assessment with detailed gap analysis available after profile completion.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1" disabled={isLoading}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onSubmit} className="flex-1" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Complete Profile'} <Check className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export function ProcessorOnboarding({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  
  const form = useForm<SupplierOnboardingInput>({
    resolver: zodResolver(SupplierOnboardingSchema),
    mode: "onBlur",
    defaultValues: defaultFormValues,
  });
  
  // Calculate assessment based on current form data
  const formData = form.watch();
  const assessment = calculateReadinessFromFormData(formData);
  
  // Per-step validation before navigation
  const validateAndNext = async () => {
    const fieldsToValidate = stepFieldGroups[step];
    if (fieldsToValidate) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }
    setStep(step + 1);
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please review the form and correct any errors.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const data = form.getValues();
      
      // Map form data to server format
      const supplierData = {
        company_name: data.companyName,
        location: data.location,
        roles: data.roles,
        products: data.products,
        annual_volume: data.annualVolume || undefined,
        export_capacity: data.exportCapacity || undefined,
        container_capacity_20ft: data.containerCapacity20ft || undefined,
        certifications: data.certifications.filter(c => c !== 'None'),
        eudr_status: data.eudrStatus || undefined,
        traceability: data.traceability || undefined,
        has_export_license: data.hasExportLicense,
        export_license_number: data.exportLicenseNumber || undefined,
        has_legal_registration: data.hasLegalRegistration,
        legal_registration_number: data.legalRegistrationNumber || undefined,
        has_company_bank_account: data.hasCompanyBankAccount,
        food_safety_certs: data.foodSafetyCerts || [],
        has_contaminant_report: data.hasContaminantReport,
        has_phytosanitary_cert: data.hasPhytosanitaryCert,
        has_eu_compliant_labels: data.hasEUCompliantLabels,
        has_grade_definitions: data.hasGradeDefinitions,
        has_moisture_defect_limits: data.hasMoistureDefectLimits,
        has_packaging_specs: data.hasPackagingSpecs,
        documented_processing_capacity: data.documentedProcessingCapacity,
        has_seasonality_window: data.hasSeasonalityWindow,
        has_multi_season_plan: data.hasMultiSeasonPlan,
        has_buffer_capacity: data.hasBufferCapacity,
        has_company_profile: data.hasCompanyProfile,
        has_process_flow_doc: data.hasProcessFlowDoc,
        has_recent_lab_results: data.hasRecentLabResults,
        has_document_storage: data.hasDocumentStorage,
        incoterms_defined: data.incotermsDefined,
        payment_terms_understood: data.paymentTermsUnderstood,
        has_lot_coding_system: data.hasLotCodingSystem,
        has_farm_mapping: data.hasFarmMapping,
        has_recall_procedure: data.hasRecallProcedure,
        quality_variance_risk: data.qualityVarianceRisk || undefined,
        capacity_verified: data.capacityVerified,
        traceability_strength: data.traceabilityStrength || undefined,
        has_logistics_issues: data.hasLogisticsIssues,
        documentation_complete: data.documentationComplete,
      };
      
      // Try server-side validation, but fallback to client-side for MVP demo
      let serverValidationPassed = false;
      
      try {
        const { data: result, error } = await supabase.functions.invoke('validate-supplier', {
          body: supplierData
        });
        
        if (!error && result?.valid) {
          serverValidationPassed = true;
        } else if (result && !result.valid) {
          // Server returned validation errors - show them
          const errorMessages = result.errors?.map((e: { message: string }) => e.message).join(', ') || 'Validation failed';
          toast({
            title: "Validation Failed",
            description: errorMessages,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        // If error (network/deployment issue), fall through to client-side fallback
      } catch (edgeFunctionError) {
        console.warn('Edge function unavailable, using client-side validation fallback:', edgeFunctionError);
        // Continue with client-validated data for MVP demo
      }
      
      // MVP Demo Mode: Client-side validation already passed (form.trigger())
      // Scoring engine runs client-side and is deterministic
      // Proceed to verdict page regardless of edge function availability
      
      toast({
        title: "Profile Created",
        description: serverValidationPassed 
          ? "Your supplier profile has been validated and saved successfully."
          : "Your supplier profile has been evaluated successfully.",
      });
      
      // Store the assessment result for the verdict page
      sessionStorage.setItem("supplierVerdictResult", JSON.stringify(assessment));
      sessionStorage.setItem("supplierVerdictCompanyName", data.companyName);
      
      onClose();
      navigate("/supplier/verdict");
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Supplier Profile Intake</h2>
        <p className="text-sm text-muted-foreground">Evaluate your readiness for German market access</p>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-between mb-8 px-2">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = step === i + 1;
          const isCompleted = step > i + 1;
          return (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all`}
              onClick={() => i + 1 < step && setStep(i + 1)}
            >
              <div className={`w-9 h-9 rounded-md flex items-center justify-center transition-all ${
                isActive ? 'bg-primary text-primary-foreground' :
                isCompleted ? 'bg-primary/20 text-primary' :
                'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          {step === 1 && (
            <CompanyInfoStep 
              form={form}
              onNext={validateAndNext}
            />
          )}
          {step === 2 && (
            <ProductsStep 
              form={form}
              onNext={validateAndNext}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <ComplianceStep 
              form={form}
              onNext={validateAndNext}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <ReadinessStep 
              form={form}
              onNext={validateAndNext}
              onBack={() => setStep(3)}
            />
          )}
          {step === 5 && (
            <RiskStep 
              form={form}
              onNext={validateAndNext}
              onBack={() => setStep(4)}
            />
          )}
          {step === 6 && (
            <AssessmentPreviewStep 
              form={form}
              assessment={assessment}
              onBack={() => setStep(5)}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Building2, Users, FileCheck, BarChart3, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateSupplier } from "@/hooks/useSuppliers";
import { useToast } from "@/hooks/use-toast";
import { calculateReadinessFromFormData, type FitResult } from "@/lib/fitEngine";
import type { ProcessingLevel, SupplierInsert } from "@/types/supabase";

interface StepProps {
  formData: SupplierFormData;
  setFormData: React.Dispatch<React.SetStateAction<SupplierFormData>>;
  onNext: () => void;
  onBack?: () => void;
}

interface SupplierFormData {
  // Basic info
  companyName: string;
  location: string;
  yearsOperating: string;
  roles: string[];
  
  // Products
  products: string[];
  annualVolume: string;
  exportCapacity: string;
  
  // Original readiness
  certifications: string[];
  eudrStatus: string;
  traceability: string;
  
  // Hard gates
  hasExportLicense: boolean;
  exportLicenseNumber: string;
  hasLegalRegistration: boolean;
  legalRegistrationNumber: string;
  hasCompanyBankAccount: boolean;
  foodSafetyCertType: '' | 'BRCGS' | 'IFS' | 'FSSC22000';
  hasContaminantReport: boolean;
  hasPhytosanitaryCert: boolean;
  hasEUCompliantLabels: boolean;
  
  // Readiness criteria
  hasGradeDefinitions: boolean;
  hasMoistureDefectLimits: boolean;
  hasPackagingSpecs: boolean;
  containerCapacity20ft: string;
  documentedProcessingCapacity: boolean;
  hasSeasonalityWindow: boolean;
  hasMultiSeasonPlan: boolean;
  hasBufferCapacity: boolean;
  hasCompanyProfile: boolean;
  hasProcessFlowDoc: boolean;
  hasRecentLabResults: boolean;
  hasDocumentStorage: boolean;
  incotermsDefined: boolean;
  paymentTermsUnderstood: boolean;
  hasLotCodingSystem: boolean;
  hasFarmMapping: boolean;
  hasRecallProcedure: boolean;
  
  // Risk indicators
  qualityVarianceRisk: '' | 'low' | 'medium' | 'high';
  capacityVerified: boolean;
  traceabilityStrength: '' | 'strong' | 'partial' | 'weak';
  hasLogisticsIssues: boolean;
  documentationComplete: boolean;
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

function CompanyInfoStep({ formData, setFormData, onNext }: StepProps) {
  const toggleRole = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
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
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
            <Input 
              placeholder="City, County" 
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Years Operating</label>
            <Input 
              placeholder="e.g., 8" 
              type="number"
              value={formData.yearsOperating}
              onChange={(e) => setFormData(prev => ({ ...prev, yearsOperating: e.target.value }))}
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
                checked={formData.roles.includes(role)}
                onChange={() => toggleRole(role)}
              />
            ))}
          </div>
        </div>
      </div>
      <Button onClick={onNext} className="w-full" disabled={!formData.companyName || !formData.location}>
        Continue <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function ProductsStep({ formData, setFormData, onNext, onBack }: StepProps) {
  const toggleProduct = (product: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(product)
        ? prev.products.filter(p => p !== product)
        : [...prev.products, product]
    }));
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
            {["Macadamia (in-shell)", "Macadamia (kernel)", "Sesame Seeds", "Sesame Oil", "Other Oilseeds"].map((product) => (
              <ToggleOption
                key={product}
                label={product}
                checked={formData.products.includes(product)}
                onChange={() => toggleProduct(product)}
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Annual Volume (MT)</label>
            <Input 
              placeholder="e.g., 2500" 
              type="number"
              value={formData.annualVolume}
              onChange={(e) => setFormData(prev => ({ ...prev, annualVolume: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Export Capacity (MT)</label>
            <Input 
              placeholder="e.g., 2000" 
              type="number"
              value={formData.exportCapacity}
              onChange={(e) => setFormData(prev => ({ ...prev, exportCapacity: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Container Capacity (20ft/month)</label>
          <Input 
            placeholder="e.g., 4" 
            type="number"
            value={formData.containerCapacity20ft}
            onChange={(e) => setFormData(prev => ({ ...prev, containerCapacity20ft: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1" disabled={formData.products.length === 0}>
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function ComplianceStep({ formData, setFormData, onNext, onBack }: StepProps) {
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
              checked={formData.hasExportLicense}
              onChange={() => setFormData(prev => ({ ...prev, hasExportLicense: !prev.hasExportLicense }))}
            />
            {formData.hasExportLicense && (
              <Input 
                placeholder="License number" 
                value={formData.exportLicenseNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, exportLicenseNumber: e.target.value }))}
              />
            )}
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Legal Entity</p>
          <div className="space-y-3">
            <ToggleOption
              label="Registered legal entity"
              checked={formData.hasLegalRegistration}
              onChange={() => setFormData(prev => ({ ...prev, hasLegalRegistration: !prev.hasLegalRegistration }))}
            />
            {formData.hasLegalRegistration && (
              <Input 
                placeholder="Registration number" 
                value={formData.legalRegistrationNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, legalRegistrationNumber: e.target.value }))}
              />
            )}
            <ToggleOption
              label="Have company bank account"
              checked={formData.hasCompanyBankAccount}
              onChange={() => setFormData(prev => ({ ...prev, hasCompanyBankAccount: !prev.hasCompanyBankAccount }))}
            />
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">EU Food Safety Certification</p>
          <div className="flex flex-wrap gap-2">
            {[
              { value: '', label: 'None' },
              { value: 'BRCGS', label: 'BRCGS' },
              { value: 'IFS', label: 'IFS' },
              { value: 'FSSC22000', label: 'FSSC 22000' },
            ].map((opt) => (
              <RadioOption
                key={opt.value}
                label={opt.label}
                selected={formData.foodSafetyCertType === opt.value}
                onChange={() => setFormData(prev => ({ 
                  ...prev, 
                  foodSafetyCertType: opt.value as '' | 'BRCGS' | 'IFS' | 'FSSC22000'
                }))}
              />
            ))}
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Additional Compliance</p>
          <div className="space-y-2">
            <ToggleOption
              label="Have contaminant/pesticide MRL report"
              checked={formData.hasContaminantReport}
              onChange={() => setFormData(prev => ({ ...prev, hasContaminantReport: !prev.hasContaminantReport }))}
            />
            <ToggleOption
              label="Have phytosanitary certificate"
              checked={formData.hasPhytosanitaryCert}
              onChange={() => setFormData(prev => ({ ...prev, hasPhytosanitaryCert: !prev.hasPhytosanitaryCert }))}
            />
            <ToggleOption
              label="Have EU-compliant labelling"
              checked={formData.hasEUCompliantLabels}
              onChange={() => setFormData(prev => ({ ...prev, hasEUCompliantLabels: !prev.hasEUCompliantLabels }))}
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

function ReadinessStep({ formData, setFormData, onNext, onBack }: StepProps) {
  const toggleCert = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
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
                checked={formData.certifications.includes(cert)}
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
              checked={formData.hasGradeDefinitions}
              onChange={() => setFormData(prev => ({ ...prev, hasGradeDefinitions: !prev.hasGradeDefinitions }))}
            />
            <ToggleOption
              label="Have moisture/defect limits defined"
              checked={formData.hasMoistureDefectLimits}
              onChange={() => setFormData(prev => ({ ...prev, hasMoistureDefectLimits: !prev.hasMoistureDefectLimits }))}
            />
            <ToggleOption
              label="Have packaging/shelf-life specs"
              checked={formData.hasPackagingSpecs}
              onChange={() => setFormData(prev => ({ ...prev, hasPackagingSpecs: !prev.hasPackagingSpecs }))}
            />
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Planning & Consistency</p>
          <div className="space-y-2">
            <ToggleOption
              label="Have seasonality window defined"
              checked={formData.hasSeasonalityWindow}
              onChange={() => setFormData(prev => ({ ...prev, hasSeasonalityWindow: !prev.hasSeasonalityWindow }))}
            />
            <ToggleOption
              label="Have multi-season supply plan"
              checked={formData.hasMultiSeasonPlan}
              onChange={() => setFormData(prev => ({ ...prev, hasMultiSeasonPlan: !prev.hasMultiSeasonPlan }))}
            />
            <ToggleOption
              label="Have buffer capacity for demand spikes"
              checked={formData.hasBufferCapacity}
              onChange={() => setFormData(prev => ({ ...prev, hasBufferCapacity: !prev.hasBufferCapacity }))}
            />
            <ToggleOption
              label="Documented processing capacity"
              checked={formData.documentedProcessingCapacity}
              onChange={() => setFormData(prev => ({ ...prev, documentedProcessingCapacity: !prev.documentedProcessingCapacity }))}
            />
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Documentation & Transparency</p>
          <div className="space-y-2">
            <ToggleOption
              label="Have company profile document"
              checked={formData.hasCompanyProfile}
              onChange={() => setFormData(prev => ({ ...prev, hasCompanyProfile: !prev.hasCompanyProfile }))}
            />
            <ToggleOption
              label="Have process flow documentation"
              checked={formData.hasProcessFlowDoc}
              onChange={() => setFormData(prev => ({ ...prev, hasProcessFlowDoc: !prev.hasProcessFlowDoc }))}
            />
            <ToggleOption
              label="Have recent lab results"
              checked={formData.hasRecentLabResults}
              onChange={() => setFormData(prev => ({ ...prev, hasRecentLabResults: !prev.hasRecentLabResults }))}
            />
            <ToggleOption
              label="Have document storage system"
              checked={formData.hasDocumentStorage}
              onChange={() => setFormData(prev => ({ ...prev, hasDocumentStorage: !prev.hasDocumentStorage }))}
            />
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Commercial & Traceability</p>
          <div className="space-y-2">
            <ToggleOption
              label="Incoterms defined (FOB/CIF etc)"
              checked={formData.incotermsDefined}
              onChange={() => setFormData(prev => ({ ...prev, incotermsDefined: !prev.incotermsDefined }))}
            />
            <ToggleOption
              label="Payment terms understood (LC, CAD)"
              checked={formData.paymentTermsUnderstood}
              onChange={() => setFormData(prev => ({ ...prev, paymentTermsUnderstood: !prev.paymentTermsUnderstood }))}
            />
            <ToggleOption
              label="Have lot/batch coding system"
              checked={formData.hasLotCodingSystem}
              onChange={() => setFormData(prev => ({ ...prev, hasLotCodingSystem: !prev.hasLotCodingSystem }))}
            />
            <ToggleOption
              label="Have farm/cooperative mapping"
              checked={formData.hasFarmMapping}
              onChange={() => setFormData(prev => ({ ...prev, hasFarmMapping: !prev.hasFarmMapping }))}
            />
            <ToggleOption
              label="Have recall procedure"
              checked={formData.hasRecallProcedure}
              onChange={() => setFormData(prev => ({ ...prev, hasRecallProcedure: !prev.hasRecallProcedure }))}
            />
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">EUDR documentation status</p>
          <div className="flex flex-wrap gap-2">
            {["Complete", "In progress", "Not started", "Unsure"].map((opt) => (
              <RadioOption
                key={opt}
                label={opt}
                selected={formData.eudrStatus === opt}
                onChange={() => setFormData(prev => ({ ...prev, eudrStatus: opt }))}
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
                selected={formData.traceability === opt}
                onChange={() => setFormData(prev => ({ ...prev, traceability: opt }))}
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

function RiskStep({ formData, setFormData, onNext, onBack }: StepProps) {
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
                selected={formData.qualityVarianceRisk === opt.value}
                onChange={() => setFormData(prev => ({ 
                  ...prev, 
                  qualityVarianceRisk: opt.value as 'low' | 'medium' | 'high'
                }))}
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
                selected={formData.traceabilityStrength === opt.value}
                onChange={() => setFormData(prev => ({ 
                  ...prev, 
                  traceabilityStrength: opt.value as 'strong' | 'partial' | 'weak'
                }))}
              />
            ))}
          </div>
        </div>

        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Verification & Issues</p>
          <div className="space-y-2">
            <ToggleOption
              label="Capacity has been verified/audited"
              checked={formData.capacityVerified}
              onChange={() => setFormData(prev => ({ ...prev, capacityVerified: !prev.capacityVerified }))}
            />
            <ToggleOption
              label="Documentation is complete"
              checked={formData.documentationComplete}
              onChange={() => setFormData(prev => ({ ...prev, documentationComplete: !prev.documentationComplete }))}
            />
            <ToggleOption
              label="Have experienced logistics issues"
              checked={formData.hasLogisticsIssues}
              onChange={() => setFormData(prev => ({ ...prev, hasLogisticsIssues: !prev.hasLogisticsIssues }))}
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

function AssessmentPreviewStep({ formData, assessment, onBack, onSubmit, isLoading }: { 
  formData: SupplierFormData;
  assessment: FitResult;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  const positives = [
    formData.products.length > 0 && "Product types match buyer demand",
    parseInt(formData.annualVolume) >= 100 && "Volume meets minimum thresholds",
    formData.roles.includes("Exporter") && "Export experience present",
    formData.hasExportLicense && "Valid export license",
    formData.foodSafetyCertType && "EU food safety certification",
    formData.hasLotCodingSystem && "Traceability system in place",
  ].filter(Boolean);

  const warnings = [
    !formData.hasExportLicense && "Missing export license (required)",
    !formData.foodSafetyCertType && "No EU food safety certification",
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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SupplierFormData>({
    // Basic info
    companyName: '',
    location: '',
    yearsOperating: '',
    roles: [],
    
    // Products
    products: [],
    annualVolume: '',
    exportCapacity: '',
    
    // Original readiness
    certifications: [],
    eudrStatus: '',
    traceability: '',
    
    // Hard gates
    hasExportLicense: false,
    exportLicenseNumber: '',
    hasLegalRegistration: false,
    legalRegistrationNumber: '',
    hasCompanyBankAccount: false,
    foodSafetyCertType: '',
    hasContaminantReport: false,
    hasPhytosanitaryCert: false,
    hasEUCompliantLabels: false,
    
    // Readiness criteria
    hasGradeDefinitions: false,
    hasMoistureDefectLimits: false,
    hasPackagingSpecs: false,
    containerCapacity20ft: '',
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
    
    // Risk indicators
    qualityVarianceRisk: '',
    capacityVerified: false,
    traceabilityStrength: '',
    hasLogisticsIssues: false,
    documentationComplete: false,
  });
  
  const createSupplier = useCreateSupplier();
  const { toast } = useToast();
  
  const assessment = calculateReadinessFromFormData({
    certifications: formData.certifications.filter(c => c !== 'None'),
    eudrStatus: formData.eudrStatus,
    traceability: formData.traceability,
    exportCapacity: parseFloat(formData.exportCapacity) || 0,
    annualVolume: parseFloat(formData.annualVolume) || 0,
  });
  
  const handleSubmit = async () => {
    try {
      const supplierData: SupplierInsert = {
        company_name: formData.companyName,
        contact_name: null,
        location_county: formData.location,
        product_category: formData.products.join(', '),
        production_capacity_monthly: formData.annualVolume ? parseFloat(formData.annualVolume) / 12 : null,
        processing_level: roleToProcessingLevel(formData.roles),
        certifications: formData.certifications.filter(c => c !== 'None'),
        export_experience: formData.roles.includes('Exporter') || parseFloat(formData.exportCapacity) > 0,
        
        // Hard gate fields
        export_license_number: formData.exportLicenseNumber || null,
        legal_registration_number: formData.legalRegistrationNumber || null,
        has_company_bank_account: formData.hasCompanyBankAccount || null,
        food_safety_cert_type: formData.foodSafetyCertType || null,
        has_contaminant_report: formData.hasContaminantReport || null,
        has_phytosanitary_cert: formData.hasPhytosanitaryCert || null,
        has_eu_compliant_labels: formData.hasEUCompliantLabels || null,
        
        // Readiness fields
        has_grade_definitions: formData.hasGradeDefinitions || null,
        has_moisture_defect_limits: formData.hasMoistureDefectLimits || null,
        has_packaging_specs: formData.hasPackagingSpecs || null,
        container_capacity_20ft: formData.containerCapacity20ft ? parseInt(formData.containerCapacity20ft) : null,
        documented_processing_capacity: formData.documentedProcessingCapacity || null,
        has_seasonality_window: formData.hasSeasonalityWindow || null,
        has_multi_season_plan: formData.hasMultiSeasonPlan || null,
        has_buffer_capacity: formData.hasBufferCapacity || null,
        has_company_profile: formData.hasCompanyProfile || null,
        has_process_flow_doc: formData.hasProcessFlowDoc || null,
        has_recent_lab_results: formData.hasRecentLabResults || null,
        has_document_storage: formData.hasDocumentStorage || null,
        incoterms_defined: formData.incotermsDefined || null,
        payment_terms_understood: formData.paymentTermsUnderstood || null,
        has_lot_coding_system: formData.hasLotCodingSystem || null,
        has_farm_mapping: formData.hasFarmMapping || null,
        has_recall_procedure: formData.hasRecallProcedure || null,
        
        // Risk indicators
        quality_variance_risk: formData.qualityVarianceRisk || null,
        capacity_verified: formData.capacityVerified || null,
        traceability_strength: formData.traceabilityStrength || null,
        has_logistics_issues: formData.hasLogisticsIssues || null,
        documentation_complete: formData.documentationComplete || null,
      };
      
      await createSupplier.mutateAsync(supplierData);
      
      toast({
        title: "Profile Created",
        description: "Your supplier profile has been saved successfully.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
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
              formData={formData} 
              setFormData={setFormData} 
              onNext={() => setStep(2)} 
            />
          )}
          {step === 2 && (
            <ProductsStep 
              formData={formData} 
              setFormData={setFormData} 
              onNext={() => setStep(3)} 
              onBack={() => setStep(1)} 
            />
          )}
          {step === 3 && (
            <ComplianceStep 
              formData={formData} 
              setFormData={setFormData} 
              onNext={() => setStep(4)} 
              onBack={() => setStep(2)} 
            />
          )}
          {step === 4 && (
            <ReadinessStep 
              formData={formData} 
              setFormData={setFormData} 
              onNext={() => setStep(5)} 
              onBack={() => setStep(3)} 
            />
          )}
          {step === 5 && (
            <RiskStep 
              formData={formData} 
              setFormData={setFormData} 
              onNext={() => setStep(6)} 
              onBack={() => setStep(4)} 
            />
          )}
          {step === 6 && (
            <AssessmentPreviewStep 
              formData={formData}
              assessment={assessment}
              onBack={() => setStep(5)}
              onSubmit={handleSubmit}
              isLoading={createSupplier.isPending}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

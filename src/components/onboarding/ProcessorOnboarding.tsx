import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Building2, Users, FileCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateSupplier } from "@/hooks/useSuppliers";
import { useToast } from "@/hooks/use-toast";
import { calculateReadinessFromFormData, type FitResult } from "@/lib/fitEngine";
import type { ProcessingLevel } from "@/types/supabase";

interface StepProps {
  formData: SupplierFormData;
  setFormData: React.Dispatch<React.SetStateAction<SupplierFormData>>;
  onNext: () => void;
  onBack?: () => void;
}

interface SupplierFormData {
  companyName: string;
  location: string;
  yearsOperating: string;
  roles: string[];
  products: string[];
  annualVolume: string;
  exportCapacity: string;
  certifications: string[];
  eudrStatus: string;
  traceability: string;
}

const steps = [
  { title: "Company", icon: Building2 },
  { title: "Products", icon: Users },
  { title: "Readiness", icon: FileCheck },
  { title: "Assessment", icon: BarChart3 },
];

const roleToProcessingLevel = (roles: string[]): ProcessingLevel => {
  if (roles.includes("Exporter")) return 'export-ready';
  if (roles.includes("Processor")) return 'processed';
  return 'raw';
};

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
              <label 
                key={role} 
                className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                  formData.roles.includes(role) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={formData.roles.includes(role)}
                  onChange={() => toggleRole(role)}
                />
                <span className="text-sm">{role}</span>
                {formData.roles.includes(role) && <Check className="w-3 h-3 text-primary" />}
              </label>
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
              <label 
                key={product} 
                className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                  formData.products.includes(product) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={formData.products.includes(product)}
                  onChange={() => toggleProduct(product)}
                />
                <span className="text-sm">{product}</span>
                {formData.products.includes(product) && <Check className="w-3 h-3 text-primary" />}
              </label>
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
        <p className="text-sm text-muted-foreground">Current certifications and documentation status</p>
      </div>
      <div className="space-y-4">
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Current certifications held</p>
          <div className="flex flex-wrap gap-2">
            {["HACCP", "ISO 22000", "Organic", "Fair Trade", "None"].map((cert) => (
              <label 
                key={cert} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer transition-colors text-sm bg-card ${
                  formData.certifications.includes(cert) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={formData.certifications.includes(cert)}
                  onChange={() => toggleCert(cert)}
                />
                <span>{cert}</span>
                {formData.certifications.includes(cert) && <Check className="w-3 h-3 text-primary" />}
              </label>
            ))}
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">EUDR documentation status</p>
          <div className="flex flex-wrap gap-2">
            {["Complete", "In progress", "Not started", "Unsure"].map((opt) => (
              <label 
                key={opt} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer transition-colors text-sm bg-card ${
                  formData.eudrStatus === opt 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input 
                  type="radio" 
                  name="eudrStatus" 
                  className="sr-only"
                  checked={formData.eudrStatus === opt}
                  onChange={() => setFormData(prev => ({ ...prev, eudrStatus: opt }))}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="font-medium text-foreground mb-3 text-sm">Traceability to farm level</p>
          <div className="flex flex-wrap gap-2">
            {["Full", "Partial", "None"].map((opt) => (
              <label 
                key={opt} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer transition-colors text-sm bg-card ${
                  formData.traceability === opt 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input 
                  type="radio" 
                  name="traceability" 
                  className="sr-only"
                  checked={formData.traceability === opt}
                  onChange={() => setFormData(prev => ({ ...prev, traceability: opt }))}
                />
                <span>{opt}</span>
              </label>
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
          {positives.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-primary" />
              <span>{item}</span>
            </div>
          ))}
          {assessment.gaps.map((gap, i) => (
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
    companyName: '',
    location: '',
    yearsOperating: '',
    roles: [],
    products: [],
    annualVolume: '',
    exportCapacity: '',
    certifications: [],
    eudrStatus: '',
    traceability: '',
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
      await createSupplier.mutateAsync({
        company_name: formData.companyName,
        contact_name: null,
        location_county: formData.location,
        product_category: formData.products.join(', '),
        production_capacity_monthly: formData.annualVolume ? parseFloat(formData.annualVolume) / 12 : null,
        processing_level: roleToProcessingLevel(formData.roles),
        certifications: formData.certifications.filter(c => c !== 'None'),
        export_experience: formData.roles.includes('Exporter') || parseFloat(formData.exportCapacity) > 0,
      });
      
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
          {step === 1 && <CompanyInfoStep formData={formData} setFormData={setFormData} onNext={() => setStep(2)} />}
          {step === 2 && <ProductsStep formData={formData} setFormData={setFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <ReadinessStep formData={formData} setFormData={setFormData} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <AssessmentPreviewStep formData={formData} assessment={assessment} onBack={() => setStep(3)} onSubmit={handleSubmit} isLoading={createSupplier.isPending} />}
        </motion.div>
      </AnimatePresence>

      {/* Cancel link */}
      <button
        onClick={onClose}
        className="w-full mt-4 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}

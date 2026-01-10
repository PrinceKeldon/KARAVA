import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Building2, Package, Settings, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateBuyer } from "@/hooks/useBuyers";
import { useToast } from "@/hooks/use-toast";
import type { BuyerType, OrderFrequency, RiskTolerance } from "@/types/supabase";

interface StepProps {
  formData: BuyerFormData;
  setFormData: React.Dispatch<React.SetStateAction<BuyerFormData>>;
  onNext: () => void;
  onBack?: () => void;
}

interface BuyerFormData {
  companyName: string;
  buyerType: BuyerType | '';
  productCategory: string;
  minOrderQuantity: string;
  frequency: OrderFrequency | '';
  riskTolerance: RiskTolerance | '';
  requiredCerts: string[];
  qualitySpecs: string;
}

const steps = [
  { title: "Company", icon: Building2 },
  { title: "Products", icon: Package },
  { title: "Requirements", icon: Settings },
  { title: "Confirm", icon: FileCheck },
];

function CompanyStep({ formData, setFormData, onNext }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Company Information</h3>
        <p className="text-sm text-muted-foreground">Tell us about your organization</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
          <Input 
            placeholder="e.g., Hamburg Food Imports GmbH" 
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Buyer Type</label>
          <div className="grid grid-cols-3 gap-2">
            {(['importer', 'processor', 'wholesaler'] as const).map((type) => (
              <label 
                key={type} 
                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-md border cursor-pointer transition-colors ${
                  formData.buyerType === type 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input 
                  type="radio" 
                  name="buyerType" 
                  className="sr-only"
                  checked={formData.buyerType === type}
                  onChange={() => setFormData(prev => ({ ...prev, buyerType: type }))}
                />
                <span className="text-sm capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={onNext} className="w-full" disabled={!formData.companyName || !formData.buyerType}>
        Continue <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function ProductsStep({ formData, setFormData, onNext, onBack }: StepProps) {
  const products = ["Macadamia Kernels", "Macadamia Oil", "Sesame Seeds", "Sesame Oil", "Other Oilseeds"];
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Product Requirements</h3>
        <p className="text-sm text-muted-foreground">What products are you sourcing?</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Product Category</label>
          <div className="grid grid-cols-2 gap-2">
            {products.map((product) => (
              <label 
                key={product} 
                className={`flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                  formData.productCategory === product 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input 
                  type="radio" 
                  name="productCategory" 
                  className="sr-only"
                  checked={formData.productCategory === product}
                  onChange={() => setFormData(prev => ({ ...prev, productCategory: product }))}
                />
                <span className="text-sm">{product}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Minimum Order Quantity (MT/order)
          </label>
          <Input 
            placeholder="e.g., 100" 
            type="number"
            value={formData.minOrderQuantity}
            onChange={(e) => setFormData(prev => ({ ...prev, minOrderQuantity: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1" disabled={!formData.productCategory}>
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function RequirementsStep({ formData, setFormData, onNext, onBack }: StepProps) {
  const certifications = ["HACCP", "ISO 22000", "Organic", "Fair Trade", "EUDR Compliant"];
  
  const toggleCert = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      requiredCerts: prev.requiredCerts.includes(cert)
        ? prev.requiredCerts.filter(c => c !== cert)
        : [...prev.requiredCerts, cert]
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Supplier Requirements</h3>
        <p className="text-sm text-muted-foreground">What do you need from suppliers?</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Required Certifications</label>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <label 
                key={cert} 
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer transition-colors ${
                  formData.requiredCerts.includes(cert) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input 
                  type="checkbox"
                  className="sr-only"
                  checked={formData.requiredCerts.includes(cert)}
                  onChange={() => toggleCert(cert)}
                />
                <span className="text-sm">{cert}</span>
                {formData.requiredCerts.includes(cert) && <Check className="w-3 h-3 text-primary" />}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Order Frequency</label>
          <div className="grid grid-cols-2 gap-2">
            {(['spot', 'recurring'] as const).map((freq) => (
              <label 
                key={freq} 
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                  formData.frequency === freq 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input 
                  type="radio" 
                  name="frequency" 
                  className="sr-only"
                  checked={formData.frequency === freq}
                  onChange={() => setFormData(prev => ({ ...prev, frequency: freq }))}
                />
                <span className="text-sm capitalize">{freq === 'spot' ? 'Spot Orders' : 'Recurring Orders'}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Risk Tolerance</label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as const).map((risk) => (
              <label 
                key={risk} 
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                  formData.riskTolerance === risk 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input 
                  type="radio" 
                  name="riskTolerance" 
                  className="sr-only"
                  checked={formData.riskTolerance === risk}
                  onChange={() => setFormData(prev => ({ ...prev, riskTolerance: risk }))}
                />
                <span className="text-sm capitalize">{risk}</span>
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

function ConfirmStep({ formData, onBack, onSubmit, isLoading }: { 
  formData: BuyerFormData; 
  onBack: () => void; 
  onSubmit: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Confirm Your Profile</h3>
        <p className="text-sm text-muted-foreground">Review before submitting</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-muted/30 rounded-md p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Company</p>
          <p className="font-medium text-foreground">{formData.companyName}</p>
          <p className="text-sm text-muted-foreground capitalize">{formData.buyerType}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-md p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Product</p>
            <p className="text-sm font-medium text-foreground">{formData.productCategory}</p>
          </div>
          <div className="bg-muted/30 rounded-md p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Min. Quantity</p>
            <p className="text-sm font-medium text-foreground">{formData.minOrderQuantity || 'Not specified'} MT</p>
          </div>
        </div>
        
        {formData.requiredCerts.length > 0 && (
          <div className="bg-muted/30 rounded-md p-3 border border-border">
            <p className="text-xs text-muted-foreground mb-2">Required Certifications</p>
            <div className="flex flex-wrap gap-1">
              {formData.requiredCerts.map(cert => (
                <span key={cert} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1" disabled={isLoading}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={onSubmit} className="flex-1" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save & Find Suppliers'} <Check className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export function BuyerOnboarding({ onClose, onComplete }: { 
  onClose: () => void; 
  onComplete: (buyerId: string) => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BuyerFormData>({
    companyName: '',
    buyerType: '',
    productCategory: '',
    minOrderQuantity: '',
    frequency: '',
    riskTolerance: '',
    requiredCerts: [],
    qualitySpecs: '',
  });
  
  const createBuyer = useCreateBuyer();
  const { toast } = useToast();
  
  const handleSubmit = async () => {
    if (!formData.buyerType) return;
    
    try {
      const buyer = await createBuyer.mutateAsync({
        company_name: formData.companyName,
        buyer_type: formData.buyerType,
        product_category: formData.productCategory,
        min_order_quantity: formData.minOrderQuantity ? parseFloat(formData.minOrderQuantity) : null,
        frequency: formData.frequency || null,
        risk_tolerance: formData.riskTolerance || null,
        required_specs: {
          certifications: formData.requiredCerts,
          quality_notes: formData.qualitySpecs,
        },
      });
      
      toast({
        title: "Profile Created",
        description: "Your buyer profile has been saved.",
      });
      
      onComplete(buyer.id);
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
        <h2 className="font-display text-xl font-bold text-foreground">Buyer Requirements</h2>
        <p className="text-sm text-muted-foreground">Define what you need from suppliers</p>
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
              className="flex flex-col items-center gap-1 cursor-pointer transition-all"
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
          {step === 1 && <CompanyStep formData={formData} setFormData={setFormData} onNext={() => setStep(2)} />}
          {step === 2 && <ProductsStep formData={formData} setFormData={setFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <RequirementsStep formData={formData} setFormData={setFormData} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <ConfirmStep formData={formData} onBack={() => setStep(3)} onSubmit={handleSubmit} isLoading={createBuyer.isPending} />}
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

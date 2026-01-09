import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Building2, Users, FileCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

const steps = [
  { title: "Company", icon: Building2 },
  { title: "Products", icon: Users },
  { title: "Readiness", icon: FileCheck },
  { title: "Assessment", icon: BarChart3 },
];

function CompanyInfoStep({ onNext }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Company Information</h3>
        <p className="text-sm text-muted-foreground">Basic details about your operation</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
          <Input placeholder="e.g., Thika Valley Processors Ltd" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
            <Input placeholder="City, County" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Years Operating</label>
            <Input placeholder="e.g., 8" type="number" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Role in Supply Chain</label>
          <div className="flex flex-wrap gap-2">
            {["Grower", "Processor", "Aggregator", "Exporter"].map((role) => (
              <label key={role} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:border-primary cursor-pointer transition-colors">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm">{role}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={onNext} className="w-full">
        Continue <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function ProductsStep({ onNext, onBack }: StepProps) {
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
              <label key={product} className="flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:border-primary cursor-pointer transition-colors">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm">{product}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Annual Volume (MT)</label>
            <Input placeholder="e.g., 2500" type="number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Export Capacity (MT)</label>
            <Input placeholder="e.g., 2000" type="number" />
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

function ReadinessStep({ onNext, onBack }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Readiness Assessment</h3>
        <p className="text-sm text-muted-foreground">Current certifications and documentation status</p>
      </div>
      <div className="space-y-4">
        {[
          { q: "Current certifications held", options: ["HACCP", "ISO 22000", "Organic", "Fair Trade", "None"] },
          { q: "EUDR documentation status", options: ["Complete", "In progress", "Not started", "Unsure"] },
          { q: "Traceability to farm level", options: ["Full", "Partial", "None"] },
        ].map((item, idx) => (
          <div key={idx} className="bg-muted/30 rounded-md p-4 border border-border">
            <p className="font-medium text-foreground mb-3 text-sm">{item.q}</p>
            <div className="flex flex-wrap gap-2">
              {item.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:border-primary cursor-pointer transition-colors text-sm bg-card">
                  <input type="radio" name={`q-${idx}`} className="sr-only" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
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

function AssessmentPreviewStep({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Assessment Preview</h3>
        <p className="text-sm text-muted-foreground">Your preliminary market-fit evaluation</p>
      </div>
      <div className="bg-muted/30 rounded-md p-5 border border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-foreground">Preliminary Readiness Score</span>
          <span className="px-3 py-1 rounded bg-[hsl(40_90%_50%/0.1)] text-[hsl(40_90%_40%)] text-sm font-bold">
            72%
          </span>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-primary" />
            <span>Volume meets minimum thresholds</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-primary" />
            <span>Product types match buyer demand</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-[hsl(40_90%_40%)] mt-0.5">⚠</span>
            <span className="text-muted-foreground">EUDR documentation incomplete</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-[hsl(40_90%_40%)] mt-0.5">⚠</span>
            <span className="text-muted-foreground">Organic certification not held</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Full assessment with detailed gap analysis available after profile completion.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button className="flex-1">
          Complete Profile <Check className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

export function ProcessorOnboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

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
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                isActive ? '' : ''
              }`}
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
          {step === 1 && <CompanyInfoStep onNext={() => setStep(2)} />}
          {step === 2 && <ProductsStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <ReadinessStep onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <AssessmentPreviewStep onBack={() => setStep(3)} />}
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

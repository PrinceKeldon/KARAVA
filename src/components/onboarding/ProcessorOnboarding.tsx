import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Building2, Users, Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

const steps = [
  { title: "Company Info", icon: Building2, emoji: "🏢" },
  { title: "Farmer Network", icon: Users, emoji: "👨‍🌾" },
  { title: "EUDR Assessment", icon: Shield, emoji: "✅" },
  { title: "Dashboard Setup", icon: BarChart3, emoji: "📊" },
];

function CompanyInfoStep({ onNext }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-foreground">Tell us about your company</h3>
        <p className="text-sm text-muted-foreground">We'll use this to create your supplier profile</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
          <Input placeholder="e.g., Valley Macadamia Processors" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
            <Input placeholder="City, County" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Capacity (MT/year)</label>
            <Input placeholder="e.g., 5000" type="number" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Products Processed</label>
          <div className="flex flex-wrap gap-2">
            {["Macadamia Nuts", "Sesame Seeds", "Sesame Oil", "Other"].map((product) => (
              <label key={product} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm">{product}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <Button variant="hero" onClick={onNext} className="w-full">
        Continue <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}

function FarmerNetworkStep({ onNext, onBack }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-foreground">Your Farmer Network</h3>
        <p className="text-sm text-muted-foreground">How many farms do you source from?</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { range: "1-50", icon: "🌱", desc: "Small network" },
          { range: "51-200", icon: "🌿", desc: "Growing network" },
          { range: "201-500", icon: "🌳", desc: "Large network" },
          { range: "500+", icon: "🌲", desc: "Enterprise" },
        ].map((option) => (
          <label key={option.range} className="flex flex-col items-center p-4 rounded-xl border border-border hover:border-secondary hover:bg-secondary/5 cursor-pointer transition-all">
            <span className="text-3xl mb-2">{option.icon}</span>
            <span className="font-semibold text-foreground">{option.range}</span>
            <span className="text-xs text-muted-foreground">{option.desc}</span>
            <input type="radio" name="network-size" className="sr-only" />
          </label>
        ))}
      </div>
      <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
        <p className="text-sm text-muted-foreground">
          💡 <strong className="text-foreground">Tip:</strong> Nutflix can help you onboard farmers via SMS—no smartphone needed on their end.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button variant="hero" onClick={onNext} className="flex-1">
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function EUDRAssessmentStep({ onNext, onBack }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-foreground">Quick EUDR Assessment</h3>
        <p className="text-sm text-muted-foreground">Let's understand your current compliance status</p>
      </div>
      <div className="space-y-4">
        {[
          { q: "Do you have GPS coordinates for your sourcing farms?", options: ["Yes, all", "Partial", "Not yet"] },
          { q: "Do you track purchase dates per farm?", options: ["Yes", "Partially", "No"] },
          { q: "Can you verify no deforestation since Dec 2020?", options: ["Yes, verified", "Likely", "Unsure"] },
        ].map((item, idx) => (
          <div key={idx} className="bg-card rounded-lg p-4 border border-border">
            <p className="font-medium text-foreground mb-3">{item.q}</p>
            <div className="flex flex-wrap gap-2">
              {item.options.map((opt) => (
                <label key={opt} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:border-primary cursor-pointer transition-colors text-sm">
                  <input type="radio" name={`q-${idx}`} className="sr-only" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <p className="font-semibold text-foreground">Estimated Compliance: 65%</p>
            <p className="text-sm text-muted-foreground">With Nutflix tools, most processors reach 95%+ within 4 weeks.</p>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button variant="hero" onClick={onNext} className="flex-1">
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function DashboardPreviewStep({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-foreground">Your Dashboard is Ready!</h3>
        <p className="text-sm text-muted-foreground">Here's a preview of what you'll get</p>
      </div>
      <div className="bg-gradient-card rounded-xl p-4 border border-border shadow-soft">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Farms", value: "0", pending: "Add farms" },
            { label: "Compliance", value: "—", pending: "Start mapping" },
            { label: "Buyers", value: "12", pending: "Waiting" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-primary" />
            <span>Farm network management</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-primary" />
            <span>EUDR compliance tracking</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-primary" />
            <span>Buyer connection marketplace</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-primary" />
            <span>Automated documentation</span>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button variant="hero" className="flex-1">
          Create Account <Check className="w-4 h-4 ml-2" />
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
      <div className="text-center mb-6">
        <span className="text-4xl">🏭</span>
        <h2 className="font-display text-2xl font-bold text-foreground mt-2">Processor Onboarding</h2>
        <p className="text-sm text-muted-foreground">Get your processing facility EUDR-ready</p>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-between mb-8 px-4">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = step === i + 1;
          const isCompleted = step > i + 1;
          return (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                isActive ? 'scale-105' : ''
              }`}
              onClick={() => i + 1 < step && setStep(i + 1)}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-secondary text-secondary-foreground shadow-warm' :
                isCompleted ? 'bg-primary text-primary-foreground' :
                'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-secondary' : 'text-muted-foreground'}`}>
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 1 && <CompanyInfoStep onNext={() => setStep(2)} />}
          {step === 2 && <FarmerNetworkStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <EUDRAssessmentStep onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <DashboardPreviewStep onBack={() => setStep(3)} />}
        </motion.div>
      </AnimatePresence>

      {/* Cancel link */}
      <button
        onClick={onClose}
        className="w-full mt-4 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel and go back
      </button>
    </div>
  );
}

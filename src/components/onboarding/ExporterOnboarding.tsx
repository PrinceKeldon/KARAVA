import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Building2, Globe, FileCheck, Ship } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
}

const steps = [
  { title: "Company", icon: Building2, emoji: "🏢" },
  { title: "Markets", icon: Globe, emoji: "🌍" },
  { title: "Compliance", icon: FileCheck, emoji: "📋" },
  { title: "Connect", icon: Ship, emoji: "🚢" },
];

function CompanyStep({ onNext }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-foreground">Your Export Company</h3>
        <p className="text-sm text-muted-foreground">Tell us about your export operations</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
          <Input placeholder="e.g., Kenya Nut Exports Ltd" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">HQ Location</label>
            <Input placeholder="City, Kenya" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Export Volume (MT/year)</label>
            <Input placeholder="e.g., 10000" type="number" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Products Exported</label>
          <div className="flex flex-wrap gap-2">
            {["Macadamia Nuts", "Sesame Seeds", "Sesame Oil", "Macadamia Oil"].map((product) => (
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

function MarketsStep({ onNext, onBack }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-foreground">Your Export Markets</h3>
        <p className="text-sm text-muted-foreground">Which European markets do you serve?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { country: "Germany", flag: "🇩🇪" },
          { country: "Netherlands", flag: "🇳🇱" },
          { country: "Belgium", flag: "🇧🇪" },
          { country: "France", flag: "🇫🇷" },
          { country: "UK", flag: "🇬🇧" },
          { country: "Spain", flag: "🇪🇸" },
          { country: "Italy", flag: "🇮🇹" },
          { country: "Other EU", flag: "🇪🇺" },
        ].map((market) => (
          <label key={market.country} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors">
            <input type="checkbox" className="rounded border-border" />
            <span className="text-xl">{market.flag}</span>
            <span className="text-sm font-medium">{market.country}</span>
          </label>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Primary Port of Export</label>
        <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
          <option>Mombasa Port</option>
          <option>Lamu Port</option>
          <option>Other</option>
        </select>
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

function ComplianceStep({ onNext, onBack }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-foreground">EUDR Readiness</h3>
        <p className="text-sm text-muted-foreground">Assess your current compliance status</p>
      </div>
      <div className="space-y-4">
        {[
          { q: "Do you have traceability to farm level?", icon: "📍" },
          { q: "Can you provide GPS coordinates for sourcing?", icon: "🗺️" },
          { q: "Do you have due diligence systems in place?", icon: "📋" },
          { q: "Can you verify deforestation-free status?", icon: "🌳" },
        ].map((item, idx) => (
          <div key={idx} className="bg-card rounded-lg p-4 border border-border">
            <p className="font-medium text-foreground mb-3 flex items-center gap-2">
              <span>{item.icon}</span> {item.q}
            </p>
            <div className="flex gap-2">
              {["Yes", "Partial", "No"].map((opt) => (
                <label key={opt} className="flex-1 text-center px-3 py-2 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors text-sm">
                  <input type="radio" name={`q-${idx}`} className="sr-only" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
        <p className="text-sm text-muted-foreground">
          🚀 <strong className="text-foreground">One-Click Documentation:</strong> Nutflix generates EUDR-compliant export documents automatically from your supply chain data.
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

function ConnectStep({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold text-foreground">Connect with Buyers</h3>
        <p className="text-sm text-muted-foreground">European buyers are waiting for verified suppliers</p>
      </div>
      <div className="bg-gradient-card rounded-xl p-5 border border-border shadow-soft">
        <div className="text-center mb-4">
          <span className="text-4xl">🌍</span>
          <p className="font-display text-2xl font-bold text-foreground mt-2">12 Buyers</p>
          <p className="text-sm text-muted-foreground">Actively seeking Kenyan suppliers</p>
        </div>
        <div className="space-y-2 mb-4">
          {["GermanSnacks GmbH - Hamburg", "Dutch Organic Imports - Rotterdam", "Belgian Nut Traders - Antwerp"].map((buyer) => (
            <div key={buyer} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {buyer}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">+9 more buyers in your product categories</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-primary" />
          <span>Your profile visible to verified EU buyers</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-primary" />
          <span>Receive sample requests directly</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Check className="w-4 h-4 text-primary" />
          <span>Automated EUDR documentation</span>
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

export function ExporterOnboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-4xl">🚢</span>
        <h2 className="font-display text-2xl font-bold text-foreground mt-2">Exporter Onboarding</h2>
        <p className="text-sm text-muted-foreground">Streamline your EU exports with one-click compliance</p>
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
          {step === 1 && <CompanyStep onNext={() => setStep(2)} />}
          {step === 2 && <MarketsStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <ComplianceStep onNext={() => setStep(4)} onBack={() => setStep(2)} />}
          {step === 4 && <ConnectStep onBack={() => setStep(3)} />}
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

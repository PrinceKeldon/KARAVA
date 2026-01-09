import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, MapPin, FileCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChainNode {
  type: "supplier" | "assessment" | "buyer" | "introduction";
  icon: React.ReactNode;
  label: string;
  description: string;
}

const chainNodes: ChainNode[] = [
  { 
    type: "supplier", 
    icon: <Building2 className="w-5 h-5" />, 
    label: "Supplier Profile",
    description: "Structured information in buyer-relevant formats"
  },
  { 
    type: "assessment", 
    icon: <FileCheck className="w-5 h-5" />, 
    label: "Market-Fit Analysis",
    description: "Readiness signals and gap identification"
  },
  { 
    type: "buyer", 
    icon: <MapPin className="w-5 h-5" />, 
    label: "Buyer Requirements",
    description: "Clear, actionable specifications"
  },
  { 
    type: "introduction", 
    icon: <Users className="w-5 h-5" />, 
    label: "Informed Introduction",
    description: "Connection only when alignment exists"
  },
];

interface SupplierProfile {
  company: string;
  location: string;
  products: string[];
  capacity: string;
  certifications: string[];
  readinessScore: number;
  gaps: string[];
}

interface BuyerRequirement {
  company: string;
  location: string;
  seeking: string[];
  minVolume: string;
  requiredCerts: string[];
  timeline: string;
}

const sampleSupplier: SupplierProfile = {
  company: "Thika Valley Processors",
  location: "Thika, Kenya",
  products: ["Macadamia Kernels", "Macadamia Oil"],
  capacity: "3,500 MT/year",
  certifications: ["HACCP", "ISO 22000"],
  readinessScore: 78,
  gaps: ["Missing EUDR documentation", "No organic certification"]
};

const sampleBuyer: BuyerRequirement = {
  company: "Hamburg Food Ingredients",
  location: "Hamburg, Germany",
  seeking: ["Organic Macadamia", "Sesame Oil"],
  minVolume: "500 MT/year",
  requiredCerts: ["Organic", "HACCP", "EUDR Compliant"],
  timeline: "Q2 2026"
};

export function InteractiveChainVisualization() {
  const [selectedNode, setSelectedNode] = useState<ChainNode["type"] | null>(null);

  const renderDetailContent = () => {
    if (!selectedNode) return null;

    switch (selectedNode) {
      case "supplier":
        return (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground">{sampleSupplier.company}</h4>
                <p className="text-sm text-muted-foreground">{sampleSupplier.location}</p>
              </div>
              <div className="px-2 py-1 rounded bg-muted text-xs font-medium">
                Supplier Profile
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Products</p>
                <div className="space-y-1">
                  {sampleSupplier.products.map(p => (
                    <p key={p} className="font-medium text-foreground">{p}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Capacity</p>
                <p className="font-medium text-foreground">{sampleSupplier.capacity}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">Certifications</p>
              <div className="flex flex-wrap gap-1.5">
                {sampleSupplier.certifications.map(cert => (
                  <span key={cert} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case "assessment":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg font-semibold text-foreground">Market-Fit Assessment</h4>
              <div className={`px-3 py-1 rounded text-sm font-bold ${
                sampleSupplier.readinessScore >= 80 ? 'fit-high' :
                sampleSupplier.readinessScore >= 60 ? 'fit-medium' : 'fit-low'
              }`}>
                {sampleSupplier.readinessScore}% Ready
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-3">Identified Gaps</p>
              <ul className="space-y-2">
                {sampleSupplier.gaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-warning mt-0.5">⚠</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">
              Assessment evaluates documentation, certifications, volume capacity, and compliance readiness against German buyer requirements.
            </p>
          </div>
        );

      case "buyer":
        return (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground">{sampleBuyer.company}</h4>
                <p className="text-sm text-muted-foreground">{sampleBuyer.location}</p>
              </div>
              <div className="px-2 py-1 rounded bg-muted text-xs font-medium">
                Buyer Requirements
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Seeking</p>
                <div className="space-y-1">
                  {sampleBuyer.seeking.map(p => (
                    <p key={p} className="font-medium text-foreground">{p}</p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Min. Volume</p>
                <p className="font-medium text-foreground">{sampleBuyer.minVolume}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-2">Required Certifications</p>
              <div className="flex flex-wrap gap-1.5">
                {sampleBuyer.requiredCerts.map(cert => (
                  <span key={cert} className="px-2 py-0.5 bg-accent/10 text-accent rounded text-xs font-medium">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Timeline: <span className="font-medium text-foreground">{sampleBuyer.timeline}</span>
            </p>
          </div>
        );

      case "introduction":
        return (
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Introduction Request</h4>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Introductions are facilitated only when:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span className="text-foreground">Market-fit score exceeds threshold</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span className="text-foreground">Critical gaps have been addressed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span className="text-foreground">Both parties confirm interest</span>
                </li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">
              KARAVA does not facilitate trade execution. We provide discovery and qualification only.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute top-6 left-12 right-12 h-px bg-border" />
      
      {/* Chain nodes */}
      <div className="relative flex justify-between items-start">
        {chainNodes.map((node, index) => (
          <motion.div
            key={node.type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex flex-col items-center gap-2 cursor-pointer group w-1/4"
            onClick={() => setSelectedNode(selectedNode === node.type ? null : node.type)}
          >
            {/* Node circle */}
            <div className={`w-12 h-12 rounded-lg bg-card border flex items-center justify-center transition-all ${
              selectedNode === node.type 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}>
              <span className={`transition-colors ${
                selectedNode === node.type ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
              }`}>
                {node.icon}
              </span>
            </div>
            
            {/* Label */}
            <div className="text-center px-1">
              <p className="text-xs font-medium text-foreground">
                {node.label}
              </p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 hidden sm:block">
                {node.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="bg-card rounded-lg p-5 border border-border relative">
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-3 right-3 p-1 rounded hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              {renderDetailContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

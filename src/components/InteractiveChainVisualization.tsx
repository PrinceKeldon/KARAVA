import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChainNode {
  type: "farms" | "processor" | "exporter" | "buyer";
  icon: string;
  label: string;
}

interface FarmData {
  id: number;
  name: string;
  location: string;
  trees: number;
  compliance: number;
  image?: string;
}

interface NodeData {
  farms: FarmData[];
  processor: { name: string; location: string; capacity: string; certifications: string[] };
  exporter: { name: string; location: string; shipments: number; routes: string[] };
  buyer: { name: string; location: string; since: string; products: string[] };
}

const chainData: NodeData = {
  farms: [
    { id: 1, name: "Mwangi Family Farm", location: "Thika", trees: 120, compliance: 85 },
    { id: 2, name: "Kiambu Women's Co-op", location: "Kiambu", trees: 450, compliance: 92 },
    { id: 3, name: "Murang'a Growers", location: "Murang'a", trees: 280, compliance: 88 },
  ],
  processor: { 
    name: "Valley Macadamia", 
    location: "Mombasa", 
    capacity: "5,000 MT/year",
    certifications: ["HACCP", "ISO 22000", "Organic Certified"]
  },
  exporter: { 
    name: "Kenya Nut Exports", 
    location: "Nairobi", 
    shipments: 24,
    routes: ["Hamburg", "Rotterdam", "Antwerp", "Barcelona"]
  },
  buyer: { 
    name: "GermanSnacks GmbH", 
    location: "Hamburg", 
    since: "2023",
    products: ["Premium Roasted Nuts", "Organic Trail Mix", "Chocolate-Covered Macadamias"]
  }
};

const chainNodes: ChainNode[] = [
  { type: "farms", icon: "🌱", label: "Farmers" },
  { type: "processor", icon: "🏭", label: "Processors" },
  { type: "exporter", icon: "🚢", label: "Exporters" },
  { type: "buyer", icon: "🛒", label: "Buyers" },
];

export function InteractiveChainVisualization() {
  const [selectedNode, setSelectedNode] = useState<ChainNode["type"] | null>(null);

  const renderDetailContent = () => {
    if (!selectedNode) return null;

    switch (selectedNode) {
      case "farms":
        return (
          <div className="space-y-4">
            <h4 className="font-display text-lg font-semibold text-foreground">Partner Farms</h4>
            <div className="space-y-3">
              {chainData.farms.map((farm) => (
                <div key={farm.id} className="bg-muted/50 rounded-lg p-4 border border-border/50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{farm.name}</p>
                      <p className="text-sm text-muted-foreground">📍 {farm.location}, Kenya</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      farm.compliance >= 90 ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                    }`}>
                      {farm.compliance}% Compliant
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>🌳 {farm.trees} trees</span>
                    <span>✅ EUDR Mapped</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">+197 more farms in network</p>
          </div>
        );

      case "processor":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                🏭
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground">{chainData.processor.name}</h4>
                <p className="text-sm text-muted-foreground">📍 {chainData.processor.location}, Kenya</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
              <div className="text-center">
                <p className="font-display text-xl font-bold text-foreground">{chainData.processor.capacity}</p>
                <p className="text-xs text-muted-foreground">Processing Capacity</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl font-bold text-secondary">200+</p>
                <p className="text-xs text-muted-foreground">Partner Farms</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Certifications</p>
              <div className="flex flex-wrap gap-2">
                {chainData.processor.certifications.map((cert) => (
                  <span key={cert} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
            <Button variant="warm" size="sm" className="w-full">
              Tour Facility Virtually
            </Button>
          </div>
        );

      case "exporter":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-2xl">
                🚢
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground">{chainData.exporter.name}</h4>
                <p className="text-sm text-muted-foreground">📍 {chainData.exporter.location}, Kenya</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
              <p className="font-display text-3xl font-bold text-foreground text-center">{chainData.exporter.shipments}</p>
              <p className="text-sm text-muted-foreground text-center">Shipments this year</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Export Routes</p>
              <div className="flex flex-wrap gap-2">
                {chainData.exporter.routes.map((route) => (
                  <span key={route} className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                    🚢 → {route}
                  </span>
                ))}
              </div>
            </div>
            <Button variant="forest" size="sm" className="w-full">
              Track Current Shipments
            </Button>
          </div>
        );

      case "buyer":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-2xl">
                🛒
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-foreground">{chainData.buyer.name}</h4>
                <p className="text-sm text-muted-foreground">📍 {chainData.buyer.location}, Germany</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground text-center">Partner since</p>
              <p className="font-display text-2xl font-bold text-foreground text-center">{chainData.buyer.since}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Product Applications</p>
              <div className="space-y-2">
                {chainData.buyer.products.map((product) => (
                  <div key={product} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>🥜</span>
                    <span>{product}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="warm" size="sm" className="w-full">
              See Sourcing Story
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {/* Connection line */}
      <div className="absolute top-7 left-8 right-8 h-0.5 bg-gradient-to-r from-primary via-secondary to-gold opacity-30" />
      
      {/* Animated flow */}
      <motion.div
        className="absolute top-7 left-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: "calc(100% - 4rem)" }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "linear" }}
        style={{ opacity: 0.6 }}
      />
      
      {/* Chain nodes */}
      <div className="relative flex justify-between items-start px-2">
        {chainNodes.map((node, index) => (
          <motion.div
            key={node.type}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => setSelectedNode(selectedNode === node.type ? null : node.type)}
          >
            {/* Node circle */}
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className={`w-14 h-14 rounded-full bg-card border-2 shadow-medium flex items-center justify-center text-2xl transition-all ${
                selectedNode === node.type 
                  ? 'border-secondary ring-2 ring-secondary/20' 
                  : 'border-primary/20 hover:border-secondary group-hover:shadow-warm'
              }`}
            >
              {node.icon}
            </motion.div>
            
            {/* Label */}
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground group-hover:text-secondary transition-colors">
                {node.label}
              </p>
              <p className="text-xs text-primary">Click to explore</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="bg-card rounded-xl p-5 border border-border shadow-soft relative">
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
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

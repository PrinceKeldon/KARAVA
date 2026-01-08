import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Star, Check, X, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Supplier {
  id: number;
  name: string;
  location: string;
  products: string[];
  eudrScore: number;
  certifications: string[];
  farms: number;
  capacity: string;
  featured?: boolean;
}

const suppliers: Supplier[] = [
  {
    id: 1,
    name: "Valley Macadamia Processors",
    location: "Mombasa, Kenya",
    products: ["Macadamia Nuts", "Macadamia Oil"],
    eudrScore: 92,
    certifications: ["HACCP", "Organic", "Fair Trade"],
    farms: 156,
    capacity: "5,000 MT/year",
    featured: true,
  },
  {
    id: 2,
    name: "Kiambu Sesame Co-op",
    location: "Kiambu, Kenya",
    products: ["Sesame Seeds", "Sesame Oil"],
    eudrScore: 88,
    certifications: ["Organic", "Rainforest Alliance"],
    farms: 89,
    capacity: "2,000 MT/year",
  },
  {
    id: 3,
    name: "Kenya Premium Exports",
    location: "Nairobi, Kenya",
    products: ["Macadamia Nuts", "Sesame Seeds"],
    eudrScore: 95,
    certifications: ["HACCP", "ISO 22000", "Organic"],
    farms: 312,
    capacity: "10,000 MT/year",
    featured: true,
  },
];

const filters = {
  products: ["All Products", "Macadamia Nuts", "Sesame Seeds", "Sesame Oil", "Macadamia Oil"],
  eudrScore: ["All Scores", "90%+", "80%+", "70%+"],
  certifications: ["Any", "Organic", "Fair Trade", "HACCP", "Rainforest Alliance"],
  volume: ["Any Volume", "Small (<1,000 MT)", "Medium (1-5,000 MT)", "Large (5,000+ MT)"],
};

function SupplierCard({ supplier, onCompare, isComparing }: { 
  supplier: Supplier; 
  onCompare: (id: number) => void;
  isComparing: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-card rounded-xl p-4 border transition-all ${
        isComparing ? 'border-secondary ring-2 ring-secondary/20' : 'border-border hover:border-primary/50 hover:shadow-soft'
      }`}
    >
      {supplier.featured && (
        <div className="flex items-center gap-1 text-xs text-secondary font-medium mb-2">
          <Star className="w-3 h-3 fill-current" /> Featured Supplier
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground">{supplier.name}</h4>
          <p className="text-sm text-muted-foreground">📍 {supplier.location}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
          supplier.eudrScore >= 90 ? 'bg-primary/20 text-primary' : 
          supplier.eudrScore >= 80 ? 'bg-secondary/20 text-secondary' : 
          'bg-muted text-muted-foreground'
        }`}>
          {supplier.eudrScore}% EUDR
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {supplier.products.map((product) => (
          <span key={product} className="px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground">
            {product}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {supplier.certifications.map((cert) => (
          <span key={cert} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium flex items-center gap-1">
            <Check className="w-3 h-3" /> {cert}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 py-2 border-t border-border text-sm">
        <div>
          <span className="text-muted-foreground">Farms: </span>
          <span className="font-medium text-foreground">{supplier.farms}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Capacity: </span>
          <span className="font-medium text-foreground">{supplier.capacity}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <Button variant="hero" size="sm" className="flex-1">
          <Package className="w-4 h-4 mr-1" /> Request Sample
        </Button>
        <Button 
          variant={isComparing ? "warm" : "ghost"} 
          size="sm"
          onClick={() => onCompare(supplier.id)}
        >
          {isComparing ? <X className="w-4 h-4" /> : "Compare"}
        </Button>
      </div>
    </motion.div>
  );
}

function ComparePanel({ suppliers, onRemove, onClose }: { 
  suppliers: Supplier[]; 
  onRemove: (id: number) => void;
  onClose: () => void;
}) {
  if (suppliers.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-card rounded-xl p-4 border border-secondary shadow-warm"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground">Compare Suppliers ({suppliers.length})</h4>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">Attribute</th>
              {suppliers.map((s) => (
                <th key={s.id} className="text-left py-2 px-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{s.name}</span>
                    <button onClick={() => onRemove(s.id)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-2 text-muted-foreground">EUDR Score</td>
              {suppliers.map((s) => (
                <td key={s.id} className="py-2 px-2">
                  <span className={`font-bold ${s.eudrScore >= 90 ? 'text-primary' : 'text-secondary'}`}>
                    {s.eudrScore}%
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 text-muted-foreground">Partner Farms</td>
              {suppliers.map((s) => (
                <td key={s.id} className="py-2 px-2 font-medium">{s.farms}</td>
              ))}
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 text-muted-foreground">Capacity</td>
              {suppliers.map((s) => (
                <td key={s.id} className="py-2 px-2">{s.capacity}</td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-muted-foreground">Certifications</td>
              {suppliers.map((s) => (
                <td key={s.id} className="py-2 px-2">{s.certifications.length} certs</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <Button variant="hero" className="w-full mt-4">
        Request Quotes from Selected <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </motion.div>
  );
}

export function BuyerDiscovery({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    product: "All Products",
    eudrScore: "All Scores",
    certification: "Any",
    volume: "Any Volume",
  });
  const [comparingIds, setComparingIds] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleCompare = (id: number) => {
    setComparingIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id].slice(0, 3)
    );
  };

  const comparingSuppliers = suppliers.filter((s) => comparingIds.includes(s.id));

  return (
    <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-4xl">🛒</span>
        <h2 className="font-display text-2xl font-bold text-foreground mt-2">Discover Verified Suppliers</h2>
        <p className="text-sm text-muted-foreground">Find EUDR-compliant Kenyan suppliers for your business</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? "warm" : "ghost"}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-1" /> Filters
        </Button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-muted/50 rounded-lg p-4 border border-border/50 grid grid-cols-2 gap-4">
              {Object.entries(filters).map(([key, options]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase">
                    {key === "eudrScore" ? "EUDR Score" : key}
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    value={activeFilters[key as keyof typeof activeFilters]}
                    onChange={(e) => setActiveFilters((prev) => ({ ...prev, [key]: e.target.value }))}
                  >
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Supplier Cards */}
      <div className="space-y-4 mb-4">
        {suppliers.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            onCompare={toggleCompare}
            isComparing={comparingIds.includes(supplier.id)}
          />
        ))}
      </div>

      {/* Compare Panel */}
      <AnimatePresence>
        {comparingIds.length > 0 && (
          <ComparePanel
            suppliers={comparingSuppliers}
            onRemove={toggleCompare}
            onClose={() => setComparingIds([])}
          />
        )}
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

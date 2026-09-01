import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Check, ArrowRight, Building2, Loader2, AlertTriangle, Shield, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useRequestIntro } from "@/hooks/useIntroRequests";
import { useToast } from "@/hooks/use-toast";
import { calculateFitScore, type FitResult, type ScoreBand } from "@/lib/fitEngine";
import type { Supplier } from "@/types/supabase";

interface DisplaySupplier {
  id: string;
  name: string;
  location: string;
  products: string[];
  fitScore: number;
  certifications: string[];
  capacity: string;
  gaps: string[];
  // Extended scoring data
  status: ScoreBand;
  statusLabel: string;
  statusColor: string;
  readinessScore: number;
  failedGates?: { gateId: string; label: string; reason?: string }[];
  appliedPenalties?: { penaltyId: string; label: string; penalty: number; reason: string }[];
  totalPenalty?: number;
}

const filters = {
  products: ["All Products", "Macadamia", "Sesame Seeds", "Sesame Oil", "Coffee"],
  fitScore: ["All Scores", "80%+", "60%+"],
  certifications: ["Any", "Organic", "HACCP", "EUDR Compliant"],
};

function transformSupplier(supplier: Supplier): DisplaySupplier {
  const result = calculateFitScore(supplier);
  
  return {
    id: supplier.id,
    name: supplier.company_name,
    location: `${supplier.location_county}, Kenya`,
    products: supplier.product_category.split(', ').filter(Boolean),
    fitScore: result.fitScore,
    certifications: supplier.certifications || [],
    capacity: supplier.production_capacity_monthly 
      ? `${Math.round(supplier.production_capacity_monthly * 12).toLocaleString()} MT/year`
      : 'Not specified',
    gaps: result.gaps,
    status: result.status,
    statusLabel: result.statusLabel,
    statusColor: result.statusColor,
    readinessScore: result.readinessScore,
    failedGates: result.failedGates,
    appliedPenalties: result.appliedPenalties,
    totalPenalty: result.totalPenalty,
  };
}

function SupplierCard({ supplier, onSelect }: { 
  supplier: DisplaySupplier; 
  onSelect: (supplier: DisplaySupplier) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-muted/30 rounded-md p-4 border border-border hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-foreground">{supplier.name}</h4>
          <p className="text-sm text-muted-foreground">{supplier.location}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold ${
          supplier.fitScore >= 80 ? 'fit-high' : 
          supplier.fitScore >= 60 ? 'fit-medium' : 
          'fit-low'
        }`}>
          {supplier.fitScore}% Fit
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {supplier.products.map((product) => (
          <span key={product} className="px-2 py-0.5 bg-card rounded text-xs text-muted-foreground border border-border">
            {product}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {supplier.certifications.map((cert) => (
          <span key={cert} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
            {cert}
          </span>
        ))}
      </div>

      {supplier.gaps.length > 0 && (
        <div className="mb-3 p-2 bg-[hsl(40_90%_50%/0.05)] rounded text-xs">
          <span className="text-[hsl(40_90%_40%)] font-medium">Gaps: </span>
          <span className="text-muted-foreground">{supplier.gaps.slice(0, 2).join(", ")}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">Capacity: {supplier.capacity}</span>
        <Button variant="ghost" size="sm" onClick={() => onSelect(supplier)}>
          View Details <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

function SupplierDetail({ supplier, onBack, onRequestIntro, isRequesting }: { 
  supplier: DisplaySupplier; 
  onBack: () => void;
  onRequestIntro: () => void;
  isRequesting: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
          <Building2 className="w-6 h-6 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-lg font-semibold text-foreground">{supplier.name}</h3>
          <p className="text-sm text-muted-foreground">{supplier.location}</p>
        </div>
        <div className={`px-3 py-1 rounded text-sm font-bold ${
          supplier.fitScore >= 80 ? 'fit-high' : 
          supplier.fitScore >= 60 ? 'fit-medium' : 
          'fit-low'
        }`}>
          {supplier.fitScore}% Fit
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/30 rounded-md p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Products</p>
          <div className="space-y-1">
            {supplier.products.map(p => (
              <p key={p} className="text-sm font-medium text-foreground">{p}</p>
            ))}
          </div>
        </div>
        <div className="bg-muted/30 rounded-md p-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Capacity</p>
          <p className="text-sm font-medium text-foreground">{supplier.capacity}</p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-2">Certifications</p>
        <div className="flex flex-wrap gap-1.5">
          {supplier.certifications.length > 0 ? supplier.certifications.map(cert => (
            <span key={cert} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> {cert}
            </span>
          )) : (
            <span className="text-sm text-muted-foreground">No certifications listed</span>
          )}
        </div>
      </div>

      {supplier.gaps.length > 0 && (
        <div className="bg-[hsl(40_90%_50%/0.05)] rounded-md p-4 border border-[hsl(40_90%_50%/0.2)]">
          <p className="text-sm font-medium text-foreground mb-2">Identified Gaps</p>
          <ul className="space-y-1">
            {supplier.gaps.map((gap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-[hsl(40_90%_40%)] mt-0.5">⚠</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1" disabled={isRequesting}>
          Back to List
        </Button>
        <Button onClick={onRequestIntro} className="flex-1" disabled={supplier.fitScore < 70 || isRequesting}>
          {isRequesting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Requesting...
            </>
          ) : (
            'Request Introduction'
          )}
        </Button>
      </div>

      {supplier.fitScore < 70 && (
        <p className="text-xs text-muted-foreground text-center">
          Introductions available for suppliers with 70%+ fit score
        </p>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-muted/30 rounded-md p-4 border border-border animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="h-5 bg-muted rounded w-40 mb-2"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
            </div>
            <div className="h-6 bg-muted rounded w-16"></div>
          </div>
          <div className="flex gap-1 mb-3">
            <div className="h-5 bg-muted rounded w-20"></div>
            <div className="h-5 bg-muted rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-medium text-foreground mb-2">No suppliers found</h3>
      <p className="text-sm text-muted-foreground">
        No suppliers have registered yet. Check back later or adjust your filters.
      </p>
    </div>
  );
}

export function BuyerDiscovery({ onClose, buyerId }: { onClose: () => void; buyerId?: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    product: "All Products",
    fitScore: "All Scores",
    certification: "Any",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<DisplaySupplier | null>(null);
  const [introRequested, setIntroRequested] = useState(false);
  
  const { data: suppliers, isLoading, error } = useSuppliers();
  const requestIntro = useRequestIntro();
  const { toast } = useToast();
  
  const displaySuppliers = (suppliers || []).map(transformSupplier);
  
  // Apply filters
  const filteredSuppliers = displaySuppliers.filter(supplier => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!supplier.name.toLowerCase().includes(query) && 
          !supplier.location.toLowerCase().includes(query) &&
          !supplier.products.some(p => p.toLowerCase().includes(query))) {
        return false;
      }
    }
    
    // Product filter
    if (activeFilters.product !== "All Products") {
      if (!supplier.products.some(p => p.toLowerCase().includes(activeFilters.product.toLowerCase()))) {
        return false;
      }
    }
    
    // Fit score filter
    if (activeFilters.fitScore === "80%+") {
      if (supplier.fitScore < 80) return false;
    } else if (activeFilters.fitScore === "60%+") {
      if (supplier.fitScore < 60) return false;
    }
    
    // Certification filter
    if (activeFilters.certification !== "Any") {
      if (!supplier.certifications.includes(activeFilters.certification)) return false;
    }
    
    return true;
  });

  const handleRequestIntro = async () => {
    if (!selectedSupplier) return;
    
    try {
      await requestIntro.mutateAsync({
        supplier_id: selectedSupplier.id,
        buyer_id: buyerId || 'anonymous', // Use buyer ID if available
        status: 'pending',
      });
      
      setIntroRequested(true);
      toast({
        title: "Introduction Requested",
        description: "We'll evaluate the match and facilitate contact if alignment is confirmed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request introduction. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (introRequested) {
    return (
      <div className="w-full max-w-lg text-center py-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">Introduction Requested</h3>
        <p className="text-sm text-muted-foreground mb-6">
          We will evaluate the match and facilitate contact if alignment is confirmed.
        </p>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    );
  }

  if (selectedSupplier) {
    return (
      <div className="w-full max-w-lg">
        <SupplierDetail 
          supplier={selectedSupplier} 
          onBack={() => setSelectedSupplier(null)}
          onRequestIntro={handleRequestIntro}
          isRequesting={requestIntro.isPending}
        />
        <button
          onClick={onClose}
          className="w-full mt-4 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl max-h-[70vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground">Supplier Discovery</h2>
        <p className="text-sm text-muted-foreground">Assess Kenyan suppliers against your requirements</p>
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
          variant={showFilters ? "secondary" : "outline"}
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
            <div className="bg-muted/30 rounded-md p-4 border border-border grid grid-cols-3 gap-4">
              {Object.entries(filters).map(([key, options]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase">
                    {key === "fitScore" ? "Fit Score" : key}
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm"
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
      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-sm text-destructive">Failed to load suppliers. Please try again.</p>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3 mb-4">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onSelect={setSelectedSupplier}
            />
          ))}
        </div>
      )}

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

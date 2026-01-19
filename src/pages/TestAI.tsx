import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, AlertCircle, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { resolveFitAnalysis } from "@/lib/fitResolver";
import { FEATURES, hydrateFeaturesFromDB } from "@/lib/features";
import { AIExplanationPanel } from "@/components/AIExplanationPanel";
import { getStatusColor, getStatusLabel } from "@/lib/fitEngine";
import type { Supplier, Buyer } from "@/types/supabase";
import type { FitResult } from "@/lib/fitEngine";

// Test data with gaps to trigger AI explanation
const testSupplier: Supplier = {
  id: "test-supplier-1",
  company_name: "Kenya Fresh Produce Ltd",
  contact_name: "John Kamau",
  location_county: "Nakuru",
  product_category: "Macadamia, Sesame Seeds",
  certifications: ["ISO 22000"], // Missing HACCP - will create a gap
  production_capacity_monthly: 50,
  export_experience: false, // No export experience - will create a gap
  processing_level: "raw",
  created_at: new Date().toISOString(),
};

const testBuyer: Buyer = {
  id: "test-buyer-1",
  company_name: "Berlin Organic Imports GmbH",
  buyer_type: "importer",
  product_category: "Macadamia",
  required_specs: {
    certifications: ["HACCP", "Organic"],
    min_capacity: 100,
  },
  min_order_quantity: 100,
  frequency: "recurring",
  risk_tolerance: "low",
  created_at: new Date().toISOString(),
};

interface AnalysisResult extends FitResult {
  explanation: string;
  explanationSource: string;
}

export default function TestAI() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiEnabled, setAiEnabled] = useState(FEATURES.AI_EXPLANATIONS);

  const toggleAI = () => {
    const newValue = !aiEnabled;
    hydrateFeaturesFromDB({ AI_EXPLANATIONS: newValue });
    setAiEnabled(newValue);
    setResult(null);
  };

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await resolveFitAnalysis(testSupplier, testBuyer);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">AI Integration Test</h1>
          <p className="text-muted-foreground">
            Test the AI-powered fit explanation feature (Lovable AI Gateway)
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Feature Flag Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">AI_EXPLANATIONS</p>
                <p className="text-sm text-muted-foreground">
                  {aiEnabled ? "AI explanations enabled" : "Using rule-based fallback"}
                </p>
              </div>
              <Button
                variant={aiEnabled ? "default" : "outline"}
                onClick={toggleAI}
              >
                {aiEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium text-foreground mb-1">Supplier</p>
                <p className="text-muted-foreground">{testSupplier.company_name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Certs: {testSupplier.certifications?.join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Export Exp: {testSupplier.export_experience ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium text-foreground mb-1">Buyer</p>
                <p className="text-muted-foreground">{testBuyer.company_name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Type: {testBuyer.buyer_type}
                </p>
                <p className="text-xs text-muted-foreground">
                  Risk: {testBuyer.risk_tolerance}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full"
          size="lg"
          onClick={runTest}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running Fit Analysis...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Run Fit Analysis
            </>
          )}
        </Button>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Error</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Analysis Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score and Status */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{result.fitScore}%</p>
                  <p className="text-xs text-muted-foreground">Fit Score</p>
                </div>
                <Badge className={getStatusColor(result.status)}>
                  {getStatusLabel(result.status)}
                </Badge>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  result.explanationSource === "ai" 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  Source: {result.explanationSource === "ai" ? "🤖 AI" : "📋 Rules"}
                </div>
              </div>

              {/* Hard Gates */}
              {result.failedGates && result.failedGates.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-destructive" />
                    Failed Hard Gates
                  </p>
                  <ul className="space-y-1 pl-6">
                    {result.failedGates.map((gate, i) => (
                      <li key={i} className="text-sm text-destructive">
                        {gate.label}: {gate.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Readiness Breakdown */}
              {result.readinessBreakdown && result.readinessBreakdown.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Readiness Breakdown</p>
                  <div className="grid grid-cols-2 gap-2">
                    {result.readinessBreakdown.map((cat, i) => (
                      <div key={i} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                        <span className="text-muted-foreground">{cat.category}</span>
                        <span className="font-medium">{cat.earnedPoints}/{cat.maxPoints}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Penalties */}
              {result.appliedPenalties && result.appliedPenalties.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Applied Risk Penalties
                  </p>
                  <ul className="space-y-1 pl-6">
                    {result.appliedPenalties.map((penalty, i) => (
                      <li key={i} className="text-sm text-amber-600">
                        {penalty.label}: -{penalty.penalty} pts ({penalty.reason})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gaps */}
              {result.gaps.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Identified Gaps</p>
                  <ul className="space-y-1">
                    {result.gaps.map((gap, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rules-based explanation (fallback) */}
              {result.explanationSource === "rules" && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">Explanation (rules-based):</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              )}

              {/* AI Explanation Panel - collapsible, per spec */}
              {result.explanationSource === "ai" && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">
                    Explanation (AI-generated, informational)
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {result.explanation}
                  </p>
                </div>
              )}

              {/* Interactive AI Panel for on-demand explanations */}
              {result.explanationSource === "rules" && aiEnabled && (
                <AIExplanationPanel
                  scoreResult={result}
                  supplierName={testSupplier.company_name}
                  buyerName={testBuyer.company_name}
                />
              )}
            </CardContent>
          </Card>
        )}

        <p className="text-xs text-center text-muted-foreground">
          AI explanations powered by Lovable AI Gateway. Feature flag controlled.
        </p>
      </div>
    </div>
  );
}

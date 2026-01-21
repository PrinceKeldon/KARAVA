import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { AIExplanationPanel } from "@/components/AIExplanationPanel";
import { getStatusLabel, getStatusColor } from "@/lib/scoring";
import type { FitResult } from "@/lib/fitEngine";

export default function SupplierVerdict() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<FitResult | null>(null);
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    // Retrieve stored result from sessionStorage
    const storedResult = sessionStorage.getItem("supplierVerdictResult");
    const storedCompanyName = sessionStorage.getItem("supplierVerdictCompanyName");
    
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
        setCompanyName(storedCompanyName || "Your Company");
      } catch (e) {
        console.error("Failed to parse stored result:", e);
        navigate("/");
      }
    } else {
      // No result stored, redirect to home
      navigate("/");
    }
  }, [navigate]);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Logo />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Readiness Assessment
            </h1>
            <p className="text-muted-foreground">
              {companyName} — Kenya → Germany Corridor
            </p>
          </motion.div>

          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-lg border border-border p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{result.fitScore}</p>
                  <p className="text-xs text-muted-foreground">Readiness Score</p>
                </div>
                <Badge className={getStatusColor(result.status)}>
                  {getStatusLabel(result.status)}
                </Badge>
              </div>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                {result.status === "HIGH_READINESS" && <CheckCircle2 className="w-6 h-6 text-primary" />}
                {result.status === "CONDITIONALLY_READY" && <AlertTriangle className="w-6 h-6 text-yellow-600" />}
                {result.status === "NOT_READY" && <AlertTriangle className="w-6 h-6 text-orange-500" />}
                {result.status === "BLOCKED" && <XCircle className="w-6 h-6 text-destructive" />}
              </div>
            </div>

            {/* Status Explanation */}
            <div className="p-4 bg-muted/30 rounded-lg border border-border mb-6">
              <p className="text-sm text-foreground">
                {result.status === "HIGH_READINESS" && 
                  "This supplier demonstrates strong alignment with German buyer requirements. Ready for introduction discussions."}
                {result.status === "CONDITIONALLY_READY" && 
                  "This supplier shows promise but has gaps that should be addressed before buyer engagement."}
                {result.status === "NOT_READY" && 
                  "Significant readiness gaps exist. Address listed items before pursuing German market access."}
                {result.status === "BLOCKED" && 
                  "Critical requirements are not met. Trade cannot proceed until hard gate failures are resolved."}
              </p>
            </div>
          </motion.div>

          {/* Failed Hard Gates */}
          {result.failedGates && result.failedGates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-destructive/5 rounded-lg border border-destructive/20 p-6 mb-6"
            >
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                Failed Hard Gates
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                These are binary requirements that must be met before trade can proceed.
              </p>
              <ul className="space-y-2">
                {result.failedGates.map((gate, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-destructive mt-0.5">✗</span>
                    <div>
                      <span className="font-medium text-foreground">{gate.label}</span>
                      {gate.reason && (
                        <span className="text-muted-foreground"> — {gate.reason}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Readiness Breakdown */}
          {result.readinessBreakdown && result.readinessBreakdown.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-lg border border-border p-6 mb-6"
            >
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Readiness Breakdown
              </h3>
              <div className="space-y-3">
                {result.readinessBreakdown.map((category, i) => {
                  const percentage = category.maxPoints > 0 
                    ? Math.round((category.earnedPoints / category.maxPoints) * 100)
                    : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{category.category}</span>
                        <span className="text-muted-foreground">
                          {category.earnedPoints}/{category.maxPoints} pts
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Applied Risk Penalties */}
          {result.appliedPenalties && result.appliedPenalties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-yellow-500/5 rounded-lg border border-yellow-500/20 p-6 mb-6"
            >
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Applied Risk Penalties
              </h3>
              <ul className="space-y-2">
                {result.appliedPenalties.map((penalty, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-yellow-600 mt-0.5">−{penalty.penalty}</span>
                    <div>
                      <span className="font-medium text-foreground">{penalty.label}</span>
                      <span className="text-muted-foreground"> — {penalty.reason}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Identified Gaps */}
          {result.gaps && result.gaps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-lg border border-border p-6 mb-6"
            >
              <h3 className="font-display font-semibold text-foreground mb-4">
                Identified Gaps
              </h3>
              <ul className="space-y-2">
                {result.gaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">{gap}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* AI Explanation Panel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <AIExplanationPanel
              scoreResult={result}
              supplierName={companyName}
              buyerName="German Buyer"
              className="mb-6"
            />
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            KARAVA Readiness Assessment — Kenya → Germany Corridor
          </p>
        </div>
      </footer>
    </div>
  );
}

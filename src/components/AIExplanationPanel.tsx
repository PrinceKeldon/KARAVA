import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { explainFitWithAI, AIExplainerInput } from "@/lib/aiExplainer";
import { FEATURES } from "@/lib/features";
import { cn } from "@/lib/utils";
import type { FitResult } from "@/lib/fitEngine";

type AIState = "idle" | "loading" | "success" | "error";

interface AIExplanationPanelProps {
  scoreResult: FitResult;
  supplierName: string;
  buyerName: string;
  className?: string;
}

export function AIExplanationPanel({
  scoreResult,
  supplierName,
  buyerName,
  className,
}: AIExplanationPanelProps) {
  const [state, setState] = useState<AIState>("idle");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if AI is disabled
  if (!FEATURES.AI_EXPLANATIONS) {
    return null;
  }

  const fetchExplanation = async () => {
    if (state === "loading") return;
    
    setState("loading");
    
    try {
      const input: AIExplainerInput = {
        supplierName,
        buyerName,
        corridor: "Kenya → Germany",
        status: scoreResult.status,
        totalScore: scoreResult.fitScore,
        readinessScore: scoreResult.readinessScore,
        passedHardGates: !scoreResult.failedGates?.length,
        failedGates: scoreResult.failedGates ?? [],
        readinessBreakdown: scoreResult.readinessBreakdown ?? [],
        appliedPenalties: scoreResult.appliedPenalties ?? [],
        gaps: scoreResult.gaps,
      };

      const result = await explainFitWithAI(input);
      
      if (result) {
        setExplanation(result);
        setState("success");
        setIsExpanded(true);
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  const handleToggle = () => {
    if (state === "idle") {
      fetchExplanation();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={cn("mt-4", className)}>
      {/* Trigger button - subtle, not prominent */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={state === "loading"}
        className="text-muted-foreground hover:text-foreground gap-2"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating explanation...
          </>
        ) : (
          <>
            <HelpCircle className="w-4 h-4" />
            Why this score?
            {state === "success" && (
              isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
            )}
          </>
        )}
      </Button>

      {/* Explanation panel - muted, non-authoritative styling */}
      {state === "success" && isExpanded && explanation && (
        <div className="mt-3 rounded-md bg-muted/50 border border-border p-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            Explanation (informational)
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {explanation}
          </p>
        </div>
      )}

      {/* Silent error state - just show unavailable message */}
      {state === "error" && isExpanded && (
        <div className="mt-3 rounded-md bg-muted/30 border border-border p-3">
          <p className="text-xs text-muted-foreground">
            Explanation temporarily unavailable.
          </p>
        </div>
      )}
    </div>
  );
}

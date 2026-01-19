import { FEATURES } from "@/lib/features";
import { supabase } from "@/integrations/supabase/client";
import type { ScoreBand, HardGateResult, AppliedRiskPenalty, ReadinessCategory } from "@/lib/scoring/types";

export interface AIExplainerInput {
  supplierName: string;
  buyerName: string;
  corridor: "Kenya → Germany";
  // Full score result (not raw form data)
  status: ScoreBand;
  totalScore: number;
  readinessScore: number;
  passedHardGates: boolean;
  failedGates: HardGateResult[];
  readinessBreakdown: ReadinessCategory[];
  appliedPenalties: AppliedRiskPenalty[];
  gaps: string[];
}

export async function explainFitWithAI(
  input: AIExplainerInput
): Promise<string | null> {
  // Feature flag hard stop
  if (!FEATURES.AI_EXPLANATIONS) {
    return null;
  }

  // Defensive guard - no meaningful data to explain
  if (!input.gaps.length && input.passedHardGates) {
    return "This supplier aligns well with current EU trade requirements.";
  }

  try {
    const { data, error } = await supabase.functions.invoke("explain-fit", {
      body: {
        supplierName: input.supplierName,
        buyerName: input.buyerName,
        corridor: input.corridor,
        status: input.status,
        totalScore: input.totalScore,
        readinessScore: input.readinessScore,
        passedHardGates: input.passedHardGates,
        hardGateFailures: input.failedGates
          .filter(g => !g.passed)
          .map(g => ({
            id: g.gateId,
            label: g.label,
            reason: g.reason,
          })),
        readinessBreakdown: input.readinessBreakdown.map(c => ({
          category: c.category,
          earnedPoints: c.earnedPoints,
          maxPoints: c.maxPoints,
        })),
        riskPenalties: input.appliedPenalties.map(p => ({
          id: p.penaltyId,
          label: p.label,
          penalty: p.penalty,
          reason: p.reason,
        })),
        gaps: input.gaps,
      },
    });

    if (error) {
      console.error("Edge function error:", error);
      return null;
    }

    return data?.explanation ?? null;
  } catch (error) {
    console.error("AI explanation failed:", error);
    return null; // graceful fallback
  }
}

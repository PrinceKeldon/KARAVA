import { FEATURES } from "@/lib/features";
import { supabase } from "@/integrations/supabase/client";
import type { ScoreBand, HardGateResult, AppliedRiskPenalty } from "@/lib/fitEngine";

export interface AIExplainerContext {
  supplierName: string;
  buyerName: string;
  corridor: "Kenya → Germany";
  status?: ScoreBand;
  failedGates?: HardGateResult[];
  appliedPenalties?: AppliedRiskPenalty[];
}

export async function explainFitWithAI(
  gaps: string[],
  context: AIExplainerContext
): Promise<string | null> {
  // Feature flag hard stop
  if (!FEATURES.AI_EXPLANATIONS) {
    return null;
  }

  // Defensive guard
  if (!gaps.length) {
    return "This supplier aligns well with current buyer requirements.";
  }

  try {
    const { data, error } = await supabase.functions.invoke("explain-fit", {
      body: {
        gaps,
        supplierName: context.supplierName,
        buyerName: context.buyerName,
        corridor: context.corridor,
        // Enhanced context for richer AI responses
        status: context.status,
        failedGates: context.failedGates?.map(g => ({
          id: g.gateId,
          label: g.label,
          reason: g.reason,
        })),
        riskPenalties: context.appliedPenalties?.map(p => ({
          id: p.penaltyId,
          label: p.label,
          penalty: p.penalty,
          reason: p.reason,
        })),
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

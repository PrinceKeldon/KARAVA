import { FEATURES } from "@/lib/features";
import { supabase } from "@/integrations/supabase/client";

export async function explainFitWithAI(
  gaps: string[],
  context: {
    supplierName: string;
    buyerName: string;
    corridor: "Kenya → Germany";
  }
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

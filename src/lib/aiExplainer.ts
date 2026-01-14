import { FEATURES } from "@/lib/features";

export async function explainFitWithAI(
  gaps: string[],
  context: {
    supplierName: string;
    buyerName: string;
    corridor: "Kenya → Germany";
  }
): Promise<string | null> {
  // Feature flag hard stop - AI is disabled
  if (!FEATURES.AI_EXPLANATIONS) {
    return null;
  }

  // Defensive guard
  if (!gaps.length) {
    return "This supplier aligns well with current buyer requirements.";
  }

  // AI integration placeholder - will be implemented when feature is enabled
  // For now, return null to use rule-based fallback
  return null;
}

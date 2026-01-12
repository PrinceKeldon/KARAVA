import { FEATURES } from "@/config/features";

export async function explainFitWithAI(
  gaps: string[],
  context: {
    supplierName: string;
    buyerName: string;
    corridor: "Kenya → Germany";
  }
): Promise<string | null> {
  if (!FEATURES.AI_EXPLANATIONS) {
    return null;
  }

  return `
In the Kenya → Germany corridor, the following factors may affect readiness:
${gaps.map(g => `- ${g}`).join("\n")}

Addressing these will improve buyer confidence.
`.trim();
}

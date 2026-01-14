import { FEATURES } from "@/config/features";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export async function explainFitWithAI(
  gaps: string[],
  context: {
    supplierName: string;
    buyerName: string;
    corridor: "Kenya → Germany";
  }
): Promise<string | null> {
  // 1️⃣ Feature flag hard stop
  if (!FEATURES.AI_EXPLANATIONS) {
    return null;
  }

  // 2️⃣ Defensive guard
  if (!gaps.length) {
    return "This supplier aligns well with current buyer requirements.";
  }

  try {
    const prompt = `
You are assisting a B2B agricultural trade platform.

Context:
- Trade corridor: ${context.corridor}
- Supplier: ${context.supplierName}
- Buyer: ${context.buyerName}

These gaps were identified by rule-based logic:
${gaps.map(g => `- ${g}`).join("\n")}

Explain *why these gaps matter* in a professional, neutral, non-judgmental tone.
Do not shame. Do not exaggerate. Keep it under 120 words.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content ?? null;
  } catch (error) {
    console.error("AI explanation failed:", error);
    return null; // graceful fallback
  }
}

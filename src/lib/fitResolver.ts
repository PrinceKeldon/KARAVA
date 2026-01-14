import { calculateFitScore, FitResult } from "./fitEngine";
import { explainFitWithAI } from "./aiExplainer";
import type { Supplier, Buyer } from "@/types/supabase";

export async function resolveFitAnalysis(
  supplier: Supplier,
  buyer: Buyer
) {
  const base: FitResult = calculateFitScore(supplier, buyer);

  const explanation = await explainFitWithAI(base.gaps, {
    supplierName: supplier.company_name,
    buyerName: buyer.company_name,
    corridor: "Kenya → Germany",
  });

  return {
    score: base.fitScore,
    gaps: base.gaps,
    explanation:
      explanation ??
      "This assessment is based on standard Kenya → Germany trade requirements.",
    explanationSource: explanation ? "ai" : "rules",
  };
}

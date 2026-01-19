import { calculateFitScore, FitResult } from "./fitEngine";
import { explainFitWithAI } from "./aiExplainer";
import type { Supplier, Buyer } from "@/types/supabase";

export async function resolveFitAnalysis(
  supplier: Supplier,
  buyer: Buyer
) {
  const base: FitResult = calculateFitScore(supplier, buyer);

  const explanation = await explainFitWithAI({
    supplierName: supplier.company_name,
    buyerName: buyer.company_name,
    corridor: "Kenya → Germany",
    status: base.status,
    totalScore: base.fitScore,
    readinessScore: base.readinessScore,
    passedHardGates: !base.failedGates?.length,
    failedGates: base.failedGates ?? [],
    readinessBreakdown: base.readinessBreakdown ?? [],
    appliedPenalties: base.appliedPenalties ?? [],
    gaps: base.gaps,
  });

  return {
    // Full score result for UI
    ...base,
    explanation:
      explanation ??
      "This assessment is based on standard Kenya → Germany trade requirements.",
    explanationSource: explanation ? "ai" : "rules",
  };
}

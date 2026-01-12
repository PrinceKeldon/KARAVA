import { calculateFitScore } from "./fitEngine";
import { explainFitWithAI } from "./aiExplainer";

export async function resolveFitAnalysis(
  supplier: SupplierProfile,
  buyer: BuyerProfile
) {
  const base = calculateFitScore(supplier, buyer);

  const explanation = await explainFitWithAI(base.gaps, {
    supplierName: supplier.name,
    buyerName: buyer.companyName,
    corridor: "Kenya → Germany",
  });

  return {
    score: base.score,
    gaps: base.gaps,
    explanation:
      explanation ??
      "This assessment is based on standard Kenya → Germany trade requirements.",
    explanationSource: explanation ? "ai" : "rules",
  };
}

// EUDR (EU Deforestation Regulation) applicability helper.
//
// EUDR covers exactly 7 commodities: cattle, cocoa, coffee, oil palm,
// rubber, soy, and wood. Of the product categories KARAVA currently
// supports, only coffee falls in scope. Macadamia, sesame, and other
// oilseeds do not — see doc/scoring/kenya-germany-readiness-spec.md §6
// and doc/MVP Freeze Document §5a for the history of this decision.
//
// `product_category` / `products` fields are freeform strings, not an
// enum (see BACKEND_BUILD §9 — no schema-as-code, hand-maintained types),
// so this checks by keyword rather than exact match. Extend
// EUDR_COVERED_KEYWORDS if KARAVA ever adds cocoa, rubber, soy, palm oil,
// cattle, or wood product categories.

const EUDR_COVERED_KEYWORDS = ['coffee'];

export function isEUDRCoveredCategory(input: string | string[] | null | undefined): boolean {
  if (!input) return false;
  const haystack = (Array.isArray(input) ? input.join(' ') : input).toLowerCase();
  return EUDR_COVERED_KEYWORDS.some(keyword => haystack.includes(keyword));
}

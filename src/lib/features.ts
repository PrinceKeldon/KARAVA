// Default is intentionally OFF. AI explanations are a secondary, optional
// layer on top of deterministic scoring (see doc/AI Explanation Prompt
// Template and doc/Wiring AI Explanations Into the UI). Enable per-environment
// via the Supabase `feature_flags` table (see featureFlags.ts), not by
// flipping this default.
export const FEATURES = {
  AI_EXPLANATIONS: false,
};

export function hydrateFeaturesFromDB(
  flags: Record<string, boolean>
) {
  Object.assign(FEATURES, flags);
}

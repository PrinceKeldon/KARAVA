// Default is intentionally OFF. AI explanations are a secondary, optional
// layer on top of deterministic scoring (see doc/AI Explanation Prompt
// Template and doc/Wiring AI Explanations Into the UI). Enable per-environment
// via the Supabase `feature_flags` table (see featureFlags.ts), not by
// flipping this default.
//
// BUYER_CONTACT_PAYWALL: scaffolded, inactive by default. Gates the
// "Request Introduction" step in BuyerDiscovery.tsx behind a placeholder
// paywall panel — no real payment processing exists yet. See
// doc/BUYER_MONETIZATION for the design and what's needed before this can
// safely go live (pricing, a real payment processor, and a `payment_status`
// column on `intro_requests`, which doesn't exist in the DB yet).
export const FEATURES = {
  AI_EXPLANATIONS: false,
  BUYER_CONTACT_PAYWALL: false,
};

export function hydrateFeaturesFromDB(
  flags: Record<string, boolean>
) {
  Object.assign(FEATURES, flags);
}

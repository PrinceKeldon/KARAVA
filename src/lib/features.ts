export const FEATURES = {
  AI_EXPLANATIONS: true,
};

export function hydrateFeaturesFromDB(
  flags: Record<string, boolean>
) {
  Object.assign(FEATURES, flags);
}

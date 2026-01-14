export const FEATURES = {
  AI_EXPLANATIONS: false,
};

export function hydrateFeaturesFromDB(
  flags: Record<string, boolean>
) {
  Object.assign(FEATURES, flags);
}

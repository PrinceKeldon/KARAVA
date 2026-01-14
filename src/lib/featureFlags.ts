import { supabase } from "@/integrations/supabase/client";

interface FeatureFlag {
  key: string;
  enabled: boolean;
}

export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from("feature_flags")
    .select("key, enabled");

  if (error || !data) {
    return {};
  }

  const flags = data as FeatureFlag[];
  return Object.fromEntries(
    flags.map(flag => [flag.key, flag.enabled])
  );
}

import { supabase } from "@/integrations/supabase/client";

export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const { data, error } = await supabase
    .from("feature_flags")
    .select("key, enabled");

  if (error || !data) {
    return {};
  }

  return Object.fromEntries(
    data.map(flag => [flag.key, flag.enabled])
  );
}

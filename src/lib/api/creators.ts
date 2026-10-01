// api/creators.ts
import { supabase } from "@/lib/supabase";

export async function fetchCreators() {
  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchCreatorById(creatorId: string) {
  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .eq("id", creatorId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchCreatorProducts(creatorId: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("creator_id", creatorId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

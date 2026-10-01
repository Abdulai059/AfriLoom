// api/search.ts
import { supabase } from "@/lib/supabase";
import type { ProductFilters } from "./products";

export async function searchProducts(
  searchTerm: string,
  filters?: ProductFilters,
) {
  let query = supabase
    .from("products")
    .select(
      `
      *,
      creators (
        id,
        creator_name,
        country,
        is_verified,
        profile_image
      )
    `,
    )
    .eq("is_active", true);

  if (searchTerm) {
    query = query.or(
      `title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,product_story.ilike.%${searchTerm}%`,
    );
  }
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.country) query = query.eq("country_of_origin", filters.country);
  if (filters?.accepts_skr !== undefined)
    query = query.eq("accepts_skr", filters.accepts_skr);

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// api/products.ts
import { supabase } from "@/lib/supabase";

export type ProductFilters = {
  category?: string;
  country?: string;
  accepts_skr?: boolean;
  is_featured?: boolean;
};

const PRODUCT_WITH_CREATOR = `
  *,
  creators (
    id,
    creator_name,
    country,
    is_verified,
    profile_image,
    passport_id
  )
`;

const PRODUCT_WITH_FULL_CREATOR = `
  *,
  creators (
    id,
    creator_name,
    country,
    city,
    bio,
    is_verified,
    profile_image,
    passport_id,
    rating,
    total_products,
    total_sales
  )
`;

export async function fetchProducts(filters?: ProductFilters) {
  let query = supabase
    .from("products")
    .select(PRODUCT_WITH_CREATOR)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.country) query = query.eq("country_of_origin", filters.country);
  if (filters?.accepts_skr !== undefined)
    query = query.eq("accepts_skr", filters.accepts_skr);
  if (filters?.is_featured) query = query.eq("is_featured", true);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchProductById(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_FULL_CREATOR)
    .eq("id", productId)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_WITH_CREATOR)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw error;
  return data;
}

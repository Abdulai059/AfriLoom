// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductById,
  fetchFeaturedProducts,
  type ProductFilters,
} from "@/lib/api/products";

export const useProducts = (filters?: ProductFilters) =>
  useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
  });

export const useProduct = (productId: string) =>
  useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn: fetchFeaturedProducts,
  });

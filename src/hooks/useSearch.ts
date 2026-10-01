// hooks/useSearch.ts
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api/search";
import type { ProductFilters } from "@/lib/api/products";

export const useSearch = (searchTerm: string, filters?: ProductFilters) =>
  useQuery({
    queryKey: ["search", searchTerm, filters],
    queryFn: () => searchProducts(searchTerm, filters),
    enabled: searchTerm.length >= 2 || !!filters,
  });

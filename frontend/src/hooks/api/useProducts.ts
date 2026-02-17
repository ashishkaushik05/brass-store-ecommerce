/**
 * Products API Hooks
 * React Query hooks for product-related API calls
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  Product,
  ProductFilters,
  ProductsResponse,
  CreateProductData,
  UpdateProductData
} from '@/types/product';
import { toast } from 'sonner';

// Query Keys Factory
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  reviews: (id: string) => [...productKeys.detail(id), 'reviews'] as const,
  related: (id: string) => [...productKeys.detail(id), 'related'] as const,
};

// Get Products List with Filters
export const useProducts = (
  filters: ProductFilters = {},
  options?: Omit<UseQueryOptions<ProductsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async (): Promise<ProductsResponse> => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });
      const response = await api.get<ProductsResponse>(
        `${API_ENDPOINTS.PRODUCTS}?${params.toString()}`
      );
      return response;
    },
    ...options,
  });
};

// Get Single Product by ID or Slug
export const useProduct = (
  idOrSlug: string,
  options?: Omit<UseQueryOptions<Product>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: productKeys.detail(idOrSlug),
    queryFn: async (): Promise<Product> => {
      const response = await api.get<Product>(
        API_ENDPOINTS.PRODUCT_BY_ID(idOrSlug)
      );
      return response;
    },
    enabled: !!idOrSlug,
    ...options,
  });
};

// Get Product Reviews
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: productKeys.reviews(productId),
    queryFn: async () => {
      const response = await api.get(
        API_ENDPOINTS.PRODUCT_REVIEWS(productId)
      );
      return response;
    },
    enabled: !!productId,
  });
};

// Get Related Products
export const useRelatedProducts = (productId: string) => {
  return useQuery<Product[]>({
    queryKey: productKeys.related(productId),
    queryFn: async (): Promise<Product[]> => {
      const response = await api.get<Product[]>(
        API_ENDPOINTS.PRODUCT_RELATED(productId)
      );
      return response;
    },
    enabled: !!productId,
  });
};

// Admin: Create Product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductData): Promise<Product> => {
      const response = await api.post<Product>(
        API_ENDPOINTS.PRODUCTS,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

// Admin: Update Product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductData }): Promise<Product> => {
      const response = await api.patch<Product>(
        API_ENDPOINTS.PRODUCT_BY_ID(id),
        data
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });
};

// Admin: Delete Product (Soft Delete)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        API_ENDPOINTS.PRODUCT_BY_ID(id)
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};

// Admin: Restore Product
export const useRestoreProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(
        `${API_ENDPOINTS.PRODUCT_BY_ID(id)}/restore`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product restored successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to restore product');
    },
  });
};

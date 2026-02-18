import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API } from '@/lib/api/endpoints';
import { toast } from 'sonner';

export interface ProductMetadata {
  finish?: string;
  usage?: string;
  dimensions?: string;
  weight?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  images: string[];
  category: string;
  collectionHandle?: string;
  tags: string[];
  stock: number;
  isActive: boolean;
  metadata?: ProductMetadata;
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export const productKeys = {
  all: ['products'] as const,
  list: (p?: object) => ['products', 'list', p] as const,
  detail: (id: string) => ['products', id] as const,
};

export function useProducts(params?: object) {
  return useQuery<{ products: Product[]; total: number }>({
    queryKey: productKeys.list(params),
    queryFn: () => api.get(API.PRODUCTS, { params }) as any,
  });
}

export function useProduct(id: string) {
  return useQuery<{ product: Product }>({
    queryKey: productKeys.detail(id),
    queryFn: () => api.get(API.PRODUCT(id)) as any,
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => (api as any).post(API.PRODUCTS, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Product created');
    },
    onError: () => toast.error('Failed to create product'),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      (api as any).patch(API.PRODUCT(id), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Product updated');
    },
    onError: () => toast.error('Failed to update product'),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => (api as any).delete(API.PRODUCT(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });
}

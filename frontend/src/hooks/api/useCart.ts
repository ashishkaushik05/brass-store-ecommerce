/**
 * Cart API Hooks
 * React Query hooks for shopping cart operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Cart, AddToCartData, UpdateCartItemData } from '@/types/cart';
import { toast } from 'sonner';

// Query Keys Factory
export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

// Get User's Cart
export const useCart = (
  options?: Omit<UseQueryOptions<Cart>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: async (): Promise<Cart> => {
      const response = await api.get<Cart>(API_ENDPOINTS.CART);
      return response;
    },
    ...options,
  });
};

// Add Item to Cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddToCartData): Promise<Cart> => {
      const response = await api.post<Cart>(
        API_ENDPOINTS.CART_ADD,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Added to cart!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });
};

// Update Cart Item Quantity
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: UpdateCartItemData }): Promise<Cart> => {
      const response = await api.patch<Cart>(
        API_ENDPOINTS.CART_UPDATE(itemId),
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Cart updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    },
  });
};

// Remove Item from Cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await api.delete(
        API_ENDPOINTS.CART_REMOVE(itemId)
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Item removed from cart');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    },
  });
};

// Clear Entire Cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(API_ENDPOINTS.CART_CLEAR);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Cart cleared');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    },
  });
};

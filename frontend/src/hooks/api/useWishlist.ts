/**
 * Wishlist API Hooks
 * React Query hooks for wishlist operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Wishlist, AddToWishlistData } from '@/types/wishlist';
import { toast } from 'sonner';

// Query Keys Factory
export const wishlistKeys = {
  all: ['wishlist'] as const,
  detail: () => [...wishlistKeys.all, 'detail'] as const,
};

// Get User's Wishlist
export const useWishlist = (
  options?: Omit<UseQueryOptions<Wishlist>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: wishlistKeys.detail(),
    queryFn: async (): Promise<Wishlist> => {
      const response = await api.get<Wishlist>(
        API_ENDPOINTS.WISHLIST
      );
      return response;
    },
    ...options,
  });
};

// Add Item to Wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddToWishlistData): Promise<Wishlist> => {
      const response = await api.post<Wishlist>(
        API_ENDPOINTS.WISHLIST_ADD,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
      toast.success('Added to wishlist!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    },
  });
};

// Remove Item from Wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete(
        API_ENDPOINTS.WISHLIST_REMOVE(productId)
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
      toast.success('Removed from wishlist');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    },
  });
};

// Clear Entire Wishlist
export const useClearWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete(
        API_ENDPOINTS.WISHLIST_CLEAR
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
      toast.success('Wishlist cleared');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to clear wishlist');
    },
  });
};

// Toggle Wishlist Item (Add or Remove)
export const useToggleWishlist = () => {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlist } = useWishlist();

  return {
    toggleWishlist: (productId: string) => {
      const isInWishlist = wishlist?.items.some(
        (item) => item.product._id === productId
      );

      if (isInWishlist) {
        removeFromWishlist.mutate(productId);
      } else {
        addToWishlist.mutate({ productId });
      }
    },
    isInWishlist: (productId: string) => {
      return wishlist?.items.some(
        (item) => item.product._id === productId
      ) || false;
    },
    isPending: addToWishlist.isPending || removeFromWishlist.isPending,
  };
};

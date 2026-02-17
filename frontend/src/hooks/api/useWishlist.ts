/**
 * Wishlist API Hooks
 * React Query hooks for wishlist operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Wishlist, WishlistItem, AddToWishlistData } from '@/types/wishlist';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// Query Keys Factory
export const wishlistKeys = {
  all: ['wishlist'] as const,
  detail: () => [...wishlistKeys.all, 'detail'] as const,
};

// Get User's Wishlist
export const useWishlist = (
  options?: Omit<UseQueryOptions<Wishlist>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: wishlistKeys.detail(),
    queryFn: async (): Promise<Wishlist> => {
      const response = await api.get<Wishlist>(
        API_ENDPOINTS.WISHLIST
      );
      return response;
    },
    enabled: isAuthenticated,
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
    // Optimistic update
    onMutate: async (data: AddToWishlistData) => {
      // Cancel outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: wishlistKeys.detail() });
      
      const previousWishlist = queryClient.getQueryData<Wishlist>(wishlistKeys.detail());
      
      if (previousWishlist) {
        // Check if item already exists
        const exists = previousWishlist.items.some(
          item => item.productId === data.productId
        );
        
        if (!exists) {
          const newItem: WishlistItem = {
            productId: data.productId,
            addedAt: new Date().toISOString(),
          };
          
          queryClient.setQueryData<Wishlist>(wishlistKeys.detail(), {
            ...previousWishlist,
            items: [...previousWishlist.items, newItem],
            updatedAt: new Date().toISOString(),
          });
        }
      }
      
      return { previousWishlist };
    },
    onSuccess: () => {
      toast.success('Added to wishlist!');
    },
    onError: (error: any, _variables, context) => {
      // Rollback on error
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKeys.detail(), context.previousWishlist);
      }
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
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
    // Optimistic update
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.detail() });
      
      const previousWishlist = queryClient.getQueryData<Wishlist>(wishlistKeys.detail());
      
      if (previousWishlist) {
        const newItems = previousWishlist.items.filter(
          item => item.productId !== productId
        );
        
        queryClient.setQueryData<Wishlist>(wishlistKeys.detail(), {
          ...previousWishlist,
          items: newItems,
          updatedAt: new Date().toISOString(),
        });
      }
      
      return { previousWishlist };
    },
    onSuccess: () => {
      toast.success('Removed from wishlist');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKeys.detail(), context.previousWishlist);
      }
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
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
    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.detail() });
      
      const previousWishlist = queryClient.getQueryData<Wishlist>(wishlistKeys.detail());
      
      if (previousWishlist) {
        queryClient.setQueryData<Wishlist>(wishlistKeys.detail(), {
          ...previousWishlist,
          items: [],
          updatedAt: new Date().toISOString(),
        });
      }
      
      return { previousWishlist };
    },
    onSuccess: () => {
      toast.success('Wishlist cleared');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKeys.detail(), context.previousWishlist);
      }
      toast.error(error.response?.data?.message || 'Failed to clear wishlist');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
    },
  });
};

// Toggle Wishlist Item (Add or Remove)
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlist } = useWishlist();

  return {
    toggleWishlist: async (productId: string) => {
      // Cancel ongoing queries to prevent race conditions
      await queryClient.cancelQueries({ queryKey: wishlistKeys.detail() });
      
      // Get the current wishlist state from cache
      const currentWishlist = queryClient.getQueryData<Wishlist>(wishlistKeys.detail());
      
      const isInWishlist = currentWishlist?.items.some(
        (item) => item.productId === productId || item.product?._id === productId
      );

      if (isInWishlist) {
        removeFromWishlist.mutate(productId);
      } else {
        addToWishlist.mutate({ productId });
      }
    },
    isInWishlist: (productId: string) => {
      return wishlist?.items.some(
        (item) => item.productId === productId || item.product?._id === productId
      ) || false;
    },
    isPending: addToWishlist.isPending || removeFromWishlist.isPending,
  };
};

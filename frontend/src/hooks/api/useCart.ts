/**
 * Cart API Hooks
 * React Query hooks for shopping cart operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { useClerk } from '@clerk/clerk-react';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Cart, CartItem, AddToCartData, UpdateCartItemData } from '@/types/cart';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useCartStore } from '@/store/cartStore';

// Query Keys Factory
export const cartKeys = {
  all: ['cart'] as const,
  detail: () => [...cartKeys.all, 'detail'] as const,
};

// Get User's Cart
export const useCart = (
  options?: Omit<UseQueryOptions<Cart>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: async (): Promise<Cart> => {
      const raw = await api.get<any>(API_ENDPOINTS.CART);
      // Normalize the backend shape to the frontend Cart type:
      //   backend: { subtotal, itemCount, items[{ name, slug, image, ... }] }
      //   frontend: { totalPrice, totalItems, items[{ product: { name, slug, images }, ... }] }
      const items: CartItem[] = (raw?.items ?? []).map((item: any) => ({
        productId: String(item.productId ?? item._id),
        price: item.price ?? 0,
        quantity: item.quantity ?? 1,
        product: {
          _id: String(item.productId ?? item._id),
          name: item.name ?? '',
          slug: item.slug ?? '',
          images: item.image ? [item.image] : [],
          price: item.price ?? 0,
        } as any,
      }));
      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
      return {
        _id: raw?._id,
        userId: raw?.userId,
        sessionId: raw?.sessionId,
        updatedAt: raw?.updatedAt,
        items,
        totalPrice,
        totalItems,
      };
    },
    enabled: !!isAuthenticated,
    ...options,
  });
};

// Add Item to Cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const { openSignIn } = useClerk();
  const { openDrawer } = useCartStore();

  return useMutation({
    mutationFn: async (data: AddToCartData): Promise<Cart> => {
      // If not signed in, open Clerk sign-in modal and abort the mutation
      if (!isAuthenticated) {
        openSignIn();
        throw new Error('SIGN_IN_REQUIRED');
      }
      const response = await api.post<Cart>(
        API_ENDPOINTS.CART_ADD,
        data
      );
      return response;
    },
    // Optimistic update
    onMutate: async (data: AddToCartData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      
      // Snapshot previous value
      const previousCart = queryClient.getQueryData<Cart>(cartKeys.detail());
      
      // Optimistically update cart
      if (previousCart) {
        const existingItem = previousCart.items.find(
          item => item.productId === data.productId
        );
        
        let newItems: CartItem[];
        if (existingItem) {
          // Update existing item
          newItems = previousCart.items.map(item =>
            item.productId === data.productId
              ? { ...item, quantity: item.quantity + data.quantity }
              : item
          );
        } else {
          // Add new item (we don't have full product data, but we can add a placeholder)
          newItems = [
            ...previousCart.items,
            {
              productId: data.productId,
              quantity: data.quantity,
              price: 0, // Will be updated from server
            },
          ];
        }
        
        const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const newTotalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        queryClient.setQueryData<Cart>(cartKeys.detail(), {
          ...previousCart,
          items: newItems,
          totalItems: newTotalItems,
          totalPrice: newTotalPrice,
          updatedAt: new Date().toISOString(),
        });
      }
      
      return { previousCart };
    },
    onSuccess: () => {
      toast.success('Added to cart!');
      openDrawer(); // show the mini-cart confirmation drawer
    },
    onError: (error: any, _variables, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
      // Don't show a toast when we intentionally aborted to show sign-in modal
      if (error?.message === 'SIGN_IN_REQUIRED') return;
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
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
    // Optimistic update
    onMutate: async ({ itemId, data }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      
      const previousCart = queryClient.getQueryData<Cart>(cartKeys.detail());
      
      if (previousCart) {
        const newItems = previousCart.items.map(item =>
          item.productId === data.productId
            ? { ...item, quantity: data.quantity }
            : item
        );
        
        const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const newTotalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        queryClient.setQueryData<Cart>(cartKeys.detail(), {
          ...previousCart,
          items: newItems,
          totalItems: newTotalItems,
          totalPrice: newTotalPrice,
          updatedAt: new Date().toISOString(),
        });
      }
      
      return { previousCart };
    },
    onSuccess: () => {
      toast.success('Cart updated');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
      toast.error(error.response?.data?.message || 'Failed to update cart');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
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
    // Optimistic update
    onMutate: async (itemId: string) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      
      const previousCart = queryClient.getQueryData<Cart>(cartKeys.detail());
      
      if (previousCart) {
        const newItems = previousCart.items.filter(
          item => item.productId !== itemId
        );
        
        const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
        const newTotalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        queryClient.setQueryData<Cart>(cartKeys.detail(), {
          ...previousCart,
          items: newItems,
          totalItems: newTotalItems,
          totalPrice: newTotalPrice,
          updatedAt: new Date().toISOString(),
        });
      }
      
      return { previousCart };
    },
    onSuccess: () => {
      toast.success('Item removed from cart');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
      toast.error(error.response?.data?.message || 'Failed to remove item');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
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
    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      
      const previousCart = queryClient.getQueryData<Cart>(cartKeys.detail());
      
      if (previousCart) {
        queryClient.setQueryData<Cart>(cartKeys.detail(), {
          ...previousCart,
          items: [],
          totalItems: 0,
          totalPrice: 0,
          updatedAt: new Date().toISOString(),
        });
      }
      
      return { previousCart };
    },
    onSuccess: () => {
      toast.success('Cart cleared');
    },
    onError: (error: any, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
    },
  });
};

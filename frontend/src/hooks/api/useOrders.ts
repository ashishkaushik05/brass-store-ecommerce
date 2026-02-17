/**
 * Orders API Hooks
 * React Query hooks for order management
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Order, OrdersResponse, OrderStats } from '@/types/order';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// Query Keys Factory
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: any) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
};

// Get User's Orders
export const useOrders = (
  options?: Omit<UseQueryOptions<OrdersResponse>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: async (): Promise<OrdersResponse> => {
      const response = await api.get<OrdersResponse>(
        API_ENDPOINTS.ORDERS
      );
      return response;
    },
    enabled: isAuthenticated,
    ...options,
  });
};

// Get Single Order
export const useOrder = (
  id: string,
  options?: Omit<UseQueryOptions<Order>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async (): Promise<Order> => {
      const response = await api.get<Order>(
        API_ENDPOINTS.ORDER_BY_ID(id)
      );
      return response;
    },
    enabled: !!id,
    ...options,
  });
};

// Create New Order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: any): Promise<Order> => {
      const response = await api.post<Order>(
        API_ENDPOINTS.ORDERS,
        orderData
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create order');
    },
  });
};

// Admin: Get All Orders
export const useAdminOrders = (
  filters?: any,
  options?: Omit<UseQueryOptions<OrdersResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: async (): Promise<OrdersResponse> => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      const response = await api.get<OrdersResponse>(
        `${API_ENDPOINTS.ADMIN_ORDERS}?${params.toString()}`
      );
      return response;
    },
    ...options,
  });
};

// Admin: Get Order Stats
export const useAdminOrderStats = (
  options?: Omit<UseQueryOptions<OrderStats>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: async (): Promise<OrderStats> => {
      const response = await api.get<OrderStats>(
        API_ENDPOINTS.ADMIN_ORDER_STATS
      );
      return response;
    },
    ...options,
  });
};

// Admin: Update Order Status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(
        `${API_ENDPOINTS.ADMIN_ORDERS}/${id}/status`,
        { status }
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('Order status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    },
  });
};

// Admin: Update Order Tracking
export const useUpdateOrderTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, tracking }: { id: string; tracking: any }) => {
      const response = await api.patch(
        `${API_ENDPOINTS.ADMIN_ORDERS}/${id}/tracking`,
        tracking
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.id) });
      toast.success('Tracking information updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update tracking');
    },
  });
};

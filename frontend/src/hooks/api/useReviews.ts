/**
 * Reviews API Hooks
 * React Query hooks for product reviews
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Review, CreateReviewData, UpdateReviewData, ReviewsResponse, ReviewFilters } from '@/types/review';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// Query Keys Factory
export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (filters: ReviewFilters) => [...reviewKeys.lists(), filters] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: string) => [...reviewKeys.details(), id] as const,
  my: () => [...reviewKeys.all, 'my'] as const,
};

// Get Reviews for Product
export const useReviews = (
  productSlug: string,
  filters: ReviewFilters = {},
  options?: Omit<UseQueryOptions<ReviewsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: reviewKeys.list({ productId: productSlug, ...filters }),
    queryFn: async (): Promise<ReviewsResponse> => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      const url = `${API_ENDPOINTS.PRODUCT_REVIEWS(productSlug)}${queryString ? `?${queryString}` : ''}`;
      const response = await api.get<ReviewsResponse>(url);
      return response;
    },
    enabled: !!productSlug,
    ...options,
  });
};

// Get User's Reviews
export const useMyReviews = (
  options?: Omit<UseQueryOptions<ReviewsResponse>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: reviewKeys.my(),
    queryFn: async (): Promise<ReviewsResponse> => {
      const response = await api.get<ReviewsResponse>(
        API_ENDPOINTS.MY_REVIEWS
      );
      return response;
    },
    enabled: isAuthenticated,
    ...options,
  });
};

// Create Review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewData): Promise<Review> => {
      const response = await api.post<Review>(
        API_ENDPOINTS.REVIEWS,
        data
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: reviewKeys.list({ productId: variables.productId }) 
      });
      queryClient.invalidateQueries({ queryKey: reviewKeys.my() });
      toast.success('Review submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });
};

// Update Review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateReviewData }): Promise<Review> => {
      const response = await api.patch<Review>(
        API_ENDPOINTS.REVIEW_BY_ID(id),
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.my() });
      toast.success('Review updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update review');
    },
  });
};

// Delete Review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(
        API_ENDPOINTS.REVIEW_BY_ID(id)
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.my() });
      toast.success('Review deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    },
  });
};

// Mark Review as Helpful
export const useMarkHelpful = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(
        `${API_ENDPOINTS.REVIEW_BY_ID(id)}/helpful`
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
      toast.success('Thank you for your feedback!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark as helpful');
    },
  });
};

// Alias for useReviews - more semantic name for product-specific reviews
export const useProductReviews = useReviews;

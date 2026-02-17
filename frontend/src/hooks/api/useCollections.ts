/**
 * Collections API Hooks
 * React Query hooks for collection-related API calls
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Collection, CollectionsResponse } from '@/types/collection';

// Query Keys Factory
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (handle: string) => [...collectionKeys.details(), handle] as const,
};

// Get All Collections
export const useCollections = (
  options?: Omit<UseQueryOptions<CollectionsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: async (): Promise<CollectionsResponse> => {
      const response = await api.get<CollectionsResponse>(
        API_ENDPOINTS.COLLECTIONS
      );
      return response;
    },
    ...options,
  });
};

// Get Single Collection by Handle
export const useCollection = (
  handle: string,
  options?: Omit<UseQueryOptions<Collection>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: collectionKeys.detail(handle),
    queryFn: async (): Promise<Collection> => {
      const response = await api.get<Collection>(
        API_ENDPOINTS.COLLECTION_BY_HANDLE(handle)
      );
      return response;
    },
    enabled: !!handle,
    ...options,
  });
};

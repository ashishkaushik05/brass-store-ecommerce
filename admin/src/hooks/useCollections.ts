import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API } from '@/lib/api/endpoints';
import { toast } from 'sonner';

export interface Collection {
  _id: string;
  name: string;
  handle: string;
  description?: string;
  imageUrl?: string;
  featured: boolean;
  displayOrder?: number;
  createdAt: string;
}

export const collectionKeys = {
  all: ['collections'] as const,
  list: () => ['collections', 'list'] as const,
  detail: (h: string) => ['collections', h] as const,
};

export function useCollections() {
  return useQuery<{ collections: Collection[]; total: number }>({
    queryKey: collectionKeys.list(),
    queryFn: () => api.get(API.COLLECTIONS) as any,
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Collection>) => (api as any).post(API.COLLECTIONS, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.all });
      toast.success('Collection created');
    },
    onError: () => toast.error('Failed to create collection'),
  });
}

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ handle, data }: { handle: string; data: Partial<Collection> }) =>
      (api as any).patch(API.COLLECTION(handle), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.all });
      toast.success('Collection updated');
    },
    onError: () => toast.error('Failed to update collection'),
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (handle: string) => (api as any).delete(API.COLLECTION(handle)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: collectionKeys.all });
      toast.success('Collection deleted');
    },
    onError: () => toast.error('Failed to delete collection'),
  });
}

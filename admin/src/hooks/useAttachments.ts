import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API } from '@/lib/api/endpoints';
import { toast } from 'sonner';

export interface Attachment {
  _id: string;
  filename: string;
  originalName: string;
  key: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  linkedTo: {
    resourceType: 'product' | 'collection' | 'review' | 'article' | null;
    resourceId: string | null;
    field: string | null;
  };
  uploadedBy: string;
  createdAt: string;
}

export interface AttachmentsResponse {
  attachments: Attachment[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export const attachmentKeys = {
  all: ['attachments'] as const,
  list: (params?: object) => ['attachments', 'list', params] as const,
  detail: (id: string) => ['attachments', id] as const,
};

export function useAttachments(params?: {
  status?: 'all' | 'linked' | 'unlinked';
  resourceType?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<AttachmentsResponse>({
    queryKey: attachmentKeys.list(params),
    queryFn: () => api.get(API.ATTACHMENTS, { params }) as any,
  });
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File): Promise<Attachment> => {
      const formData = new FormData();
      formData.append('image', file);
      const res = await (api as any).post(API.ATTACHMENT_UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attachmentKeys.all });
      toast.success('File uploaded');
    },
    onError: () => toast.error('Upload failed'),
  });
}

export function useLinkAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      resourceType,
      resourceId,
      field,
    }: {
      id: string;
      resourceType: string;
      resourceId: string;
      field: string;
    }) => {
      return (api as any).patch(API.ATTACHMENT_LINK(id), { resourceType, resourceId, field });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attachmentKeys.all });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => (api as any).delete(API.ATTACHMENT(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attachmentKeys.all });
      toast.success('Attachment deleted');
    },
    onError: () => toast.error('Delete failed'),
  });
}

export function useCleanupAttachments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => (api as any).delete(API.ATTACHMENT_CLEANUP),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: attachmentKeys.all });
      toast.success(`Cleaned up ${data?.deleted ?? 0} unlinked attachments`);
    },
  });
}

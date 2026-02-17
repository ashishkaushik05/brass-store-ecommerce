/**
 * Articles API Hooks
 * React Query hooks for blog/journal articles
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { 
  Article, 
  ArticlesResponse, 
  ArticleFilters, 
  CreateArticleData, 
  UpdateArticleData 
} from '@/types/article';
import { toast } from 'sonner';

// Query Keys Factory
export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: ArticleFilters) => [...articleKeys.lists(), filters] as const,
  details: () => [...articleKeys.all, 'detail'] as const,
  detail: (slug: string) => [...articleKeys.details(), slug] as const,
  categories: () => [...articleKeys.all, 'categories'] as const,
  tags: () => [...articleKeys.all, 'tags'] as const,
};

// Get Articles with Filters
export const useArticles = (
  filters: ArticleFilters = {},
  options?: Omit<UseQueryOptions<ArticlesResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: articleKeys.list(filters),
    queryFn: async (): Promise<ArticlesResponse> => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, String(v)));
          } else {
            params.append(key, String(value));
          }
        }
      });
      const response = await api.get<ArticlesResponse>(
        `${API_ENDPOINTS.ARTICLES}?${params.toString()}`
      );
      return response;
    },
    ...options,
  });
};

// Get Single Article by Slug
export const useArticle = (
  slug: string,
  options?: Omit<UseQueryOptions<Article>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: articleKeys.detail(slug),
    queryFn: async (): Promise<Article> => {
      const response = await api.get<Article>(
        API_ENDPOINTS.ARTICLE_BY_SLUG(slug)
      );
      return response;
    },
    enabled: !!slug,
    ...options,
  });
};

// Get Article Categories
export const useArticleCategories = (
  options?: Omit<UseQueryOptions<string[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: articleKeys.categories(),
    queryFn: async (): Promise<string[]> => {
      const response = await api.get<string[]>(
        `${API_ENDPOINTS.ARTICLES}/categories`
      );
      return response;
    },
    ...options,
  });
};

// Get Article Tags
export const useArticleTags = (
  options?: Omit<UseQueryOptions<string[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: articleKeys.tags(),
    queryFn: async (): Promise<string[]> => {
      const response = await api.get<string[]>(
        `${API_ENDPOINTS.ARTICLES}/tags`
      );
      return response;
    },
    ...options,
  });
};

// Admin: Create Article
export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateArticleData): Promise<Article> => {
      const response = await api.post<Article>(
        API_ENDPOINTS.ARTICLES,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      toast.success('Article created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create article');
    },
  });
};

// Admin: Update Article
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: UpdateArticleData }): Promise<Article> => {
      const response = await api.patch<Article>(
        API_ENDPOINTS.ARTICLE_BY_SLUG(slug),
        data
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(variables.slug) });
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      toast.success('Article updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update article');
    },
  });
};

// Admin: Delete Article
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await api.delete(
        API_ENDPOINTS.ARTICLE_BY_SLUG(slug)
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      toast.success('Article deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete article');
    },
  });
};

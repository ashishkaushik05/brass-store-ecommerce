/**
 * Article Types
 * Matches backend Article model
 */

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
  };
  status: 'draft' | 'published';
  publishedAt?: string;
  readTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags?: string[];
  status?: 'draft' | 'published';
}

export interface UpdateArticleData extends Partial<CreateArticleData> {}

export interface ArticleFilters {
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface ArticlesResponse {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ArticleCategory {
  name: string;
  slug: string;
  count: number;
}

export interface ArticleTag {
  name: string;
  slug: string;
  count: number;
}

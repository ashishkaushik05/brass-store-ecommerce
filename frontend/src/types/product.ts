/**
 * Product Types
 * Matches backend Product model
 */

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  isActive: boolean;
  metadata?: {
    finish?: string;
    usage?: string;
    dimensions?: string;
    weight?: string;
    [key: string]: any;
  };
  averageRating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: 'price' | '-price' | 'name' | '-name' | 'createdAt' | '-createdAt' | 'averageRating';
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateProductData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  images: string[];
  category: string;
  tags?: string[];
  stock: number;
  metadata?: Record<string, any>;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

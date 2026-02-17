/**
 * Type Definitions Index
 * Re-export all types for convenient importing
 */

// Product types
export * from './product';

// Cart types
export * from './cart';

// Order types
export * from './order';

// Review types
export * from './review';

// Article types
export * from './article';

// Wishlist types
export * from './wishlist';

// Collection types
export * from './collection';

// User types
export * from './user';

// Legacy mock data types (to be removed in Phase 5)
export interface Product {
  id: string;
  handle: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  tag?: 'Best Seller' | 'New' | 'Sold Out' | 'Limited' | 'Handcrafted';
  images?: string[];
  finish?: 'Antique' | 'Polished' | 'Black Oxide';
  usage?: 'Puja' | 'Kitchen' | 'Decor' | 'Gifting';
  dimensions?: string;
  weight?: string;
}

export interface Collection {
  id: string;
  handle: string;
  name: string;
  description: string;
  imageUrl: string;
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: string;
    verified: boolean;
}

export interface Article {
    id: string;
    slug: string;
    category: string;
    date: string;
    readTime: number;
    title: string;
    excerpt: string;
    imageUrl: string;
    content: string;
}

/**
 * Centralized API endpoint definitions
 * Keep all API URLs in one place for easy changes
 */

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
  PRODUCT_REVIEWS: (id: string) => `/api/products/${id}/reviews`,
  PRODUCT_RELATED: (id: string) => `/api/products/${id}/related`,
  
  // Collections
  COLLECTIONS: '/api/collections',
  COLLECTION_BY_HANDLE: (handle: string) => `/api/collections/${handle}`,
  
  // Cart
  CART: '/api/cart',
  
  // Orders
  ORDERS: '/api/orders',
  MY_ORDERS: '/api/orders/my',
  ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
  ADMIN_ORDERS: '/api/orders/admin/all',
  ADMIN_ORDER_STATS: '/api/orders/admin/stats',
  UPDATE_ORDER_STATUS: (id: string) => `/api/orders/${id}/status`,
  UPDATE_ORDER_TRACKING: (id: string) => `/api/orders/${id}/tracking`,
  
  // Reviews
  REVIEWS: '/api/reviews',
  MY_REVIEWS: '/api/reviews/my',
  REVIEW_BY_ID: (id: string) => `/api/reviews/${id}`,
  REVIEW_HELPFUL: (id: string) => `/api/reviews/${id}/helpful`,
  
  // Articles
  ARTICLES: '/api/articles',
  ARTICLE_BY_SLUG: (slug: string) => `/api/articles/${slug}`,
  ARTICLE_CATEGORIES: '/api/articles/categories',
  ARTICLE_TAGS: '/api/articles/tags',
  
  // Wishlist
  WISHLIST: '/api/wishlist',
  WISHLIST_ADD: '/api/wishlist/add',
  WISHLIST_REMOVE: '/api/wishlist/remove',
  WISHLIST_TOGGLE: (id: string) => `/api/wishlist/toggle/${id}`,
  
  // Files
  FILE_UPLOAD: '/api/files/upload',
} as const;

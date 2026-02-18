export const API = {
  // Products
  PRODUCTS: '/api/products',
  PRODUCT: (id: string) => `/api/products/${id}`,
  // Collections
  COLLECTIONS: '/api/collections',
  COLLECTION: (handle: string) => `/api/collections/${handle}`,
  // Orders
  ORDERS: '/api/orders/admin/all',
  ORDER: (id: string) => `/api/orders/${id}`,
  ORDER_STATUS: (id: string) => `/api/orders/${id}/status`,
  // Reviews
  REVIEWS: '/api/reviews',
  REVIEW: (id: string) => `/api/reviews/${id}`,
  // Attachments
  ATTACHMENTS: '/api/attachments',
  ATTACHMENT: (id: string) => `/api/attachments/${id}`,
  ATTACHMENT_UPLOAD: '/api/attachments/upload',
  ATTACHMENT_LINK: (id: string) => `/api/attachments/${id}/link`,
  ATTACHMENT_UNLINK: (id: string) => `/api/attachments/${id}/unlink`,
  ATTACHMENT_CLEANUP: '/api/attachments/cleanup',
  // Articles
  ARTICLES: '/api/articles',
  ARTICLE: (slug: string) => `/api/articles/${slug}`,
};

# Frontend-Backend Integration Plan
## Kuber Brass Store Storefront

**Date:** January 2024  
**Status:** Planning Phase

---

## 1. Current State Analysis

### Backend (Complete ✅)
- **Framework:** Express 5.2.1 + TypeScript + MongoDB + Clerk JWT
- **Port:** 3001
- **Authentication:** Clerk JWT with role-based access (user/admin)
- **File Storage:** MinIO + Sharp for image processing
- **Features Implemented:**
  - ✅ Products (CRUD + Admin Operations)
  - ✅ Collections
  - ✅ Cart (Session-based)
  - ✅ Orders (User + Admin Management)
  - ✅ Reviews (with verified purchases)
  - ✅ Articles (CMS with categories/tags)
  - ✅ Wishlist
  - ✅ File Upload

### Frontend (Current State ⚠️)
- **Framework:** React 19.2.4 + React Router 7.13.0
- **Build Tool:** Vite 6.2.0
- **Language:** TypeScript 5.8.2
- **Current Data:** Mock data (data/mockData.ts)
- **Missing:**
  - ❌ API Client (No axios/fetch wrapper)
  - ❌ Authentication (No Clerk SDK)
  - ❌ State Management (No Zustand/Redux/React Query)
  - ❌ Form Management (No react-hook-form)
  - ❌ Validation (No Zod on client)
  - ❌ Cart Functionality
  - ❌ User Profile/Orders
  - ❌ Admin Panel

---

## 2. Backend API Inventory

### Products API (`/api/products`)
```
GET    /                          # List products (filter, search, sort, pagination)
GET    /:id                       # Get single product
GET    /:id/reviews              # Get product reviews
GET    /:id/related              # Get related products
POST   /                          # [ADMIN] Create product
PATCH  /:id                       # [ADMIN] Update product
DELETE /:id                       # [ADMIN] Soft delete product
POST   /:id/restore               # [ADMIN] Restore deleted product
```

### Collections API (`/api/collections`)
```
GET    /                          # List all collections
GET    /:handle                   # Get collection by handle
```

### Cart API (`/api/cart`)
```
GET    /                          # Get cart (guest or auth)
POST   /                          # Add/Update/Remove items
DELETE /                          # Clear cart
```

### Orders API (`/api/orders`)
```
POST   /                          # Create order
GET    /my                        # Get user's orders
GET    /:id                       # Get single order
GET    /admin/all                 # [ADMIN] Get all orders
GET    /admin/stats               # [ADMIN] Get order statistics
PATCH  /:id/status                # [ADMIN] Update order status
PATCH  /:id/tracking              # [ADMIN] Update tracking info
```

### Reviews API (`/api/reviews`)
```
POST   /                          # Create review (with verified purchase check)
GET    /my                        # Get user's reviews
PATCH  /:id                       # Update own review
DELETE /:id                       # Delete own review
POST   /:id/helpful               # Mark review helpful
```

### Articles API (`/api/articles`)
```
GET    /                          # List articles (filter by category/tags)
GET    /:slug                     # Get article by slug
GET    /categories                # Get all categories
GET    /tags                      # Get all tags
POST   /                          # [ADMIN] Create article
PATCH  /:slug                     # [ADMIN] Update article
DELETE /:slug                     # [ADMIN] Delete article
```

### Wishlist API (`/api/wishlist`)
```
GET    /                          # Get wishlist
POST   /add                       # Add item to wishlist
POST   /remove                    # Remove item
DELETE /                          # Clear wishlist
POST   /toggle/:productId         # Toggle item (add/remove)
```

### Files API (`/api/files`)
```
POST   /upload                    # Upload file (returns URL)
```

---

## 3. Frontend Data Requirements

### Pages & Their Data Needs

| Page | Data Needed | Backend API |
|------|------------|-------------|
| **HomePage** | Best sellers, Featured collections | `GET /api/products?tag=Best%20Seller`, `GET /api/collections` |
| **ShopPage** | All products, Filters | `GET /api/products?category=&price=&sort=` |
| **ProductPage** | Product details, Reviews, Related products | `GET /api/products/:id`, `GET /api/products/:id/reviews`, `GET /api/products/:id/related` |
| **CollectionPage** | Collection info, Products in collection | `GET /api/collections/:handle`, `GET /api/products?collection=` |
| **JournalPage** | All articles, Categories | `GET /api/articles`, `GET /api/articles/categories` |
| **ArticlePage** | Article details | `GET /api/articles/:slug` |
| **ContactPage** | Contact form submission | Backend endpoint needed (NEW) |
| **CartPage** | Cart items, Totals | `GET /api/cart` |
| **CheckoutPage** | Create order | `POST /api/orders` |
| **OrdersPage** | User's orders | `GET /api/orders/my` |
| **OrderDetailsPage** | Single order | `GET /api/orders/:id` |
| **ProfilePage** | User info, Wishlist | Clerk API, `GET /api/wishlist` |
| **AdminDashboard** | Stats, Orders, Products | `GET /api/orders/admin/stats`, etc. |

### Components & Their Data Needs

| Component | Data Needed | Backend API |
|-----------|------------|-------------|
| **Header** | Cart count, User info, Wishlist count | `GET /api/cart`, Clerk, `GET /api/wishlist` |
| **ProductCard** | Product info | Props (from parent) |
| **ReviewSection** | Reviews | Props (from parent) |
| **CartDrawer** | Cart items | `GET /api/cart` |
| **WishlistButton** | Wishlist status | `GET /api/wishlist` |

---

## 4. Technology Stack Recommendations

### Required Packages
```json
{
  "dependencies": {
    "@clerk/clerk-react": "^5.0.0",          // Authentication
    "axios": "^1.6.0",                        // HTTP client
    "@tanstack/react-query": "^5.0.0",       // Data fetching & caching
    "react-hook-form": "^7.49.0",            // Form management
    "@hookform/resolvers": "^3.3.0",         // Form validation
    "zod": "^3.22.0",                        // Client-side validation
    "zustand": "^4.4.0",                     // Global state (cart, UI)
    "sonner": "^1.3.0"                       // Toast notifications
  }
}
```

### Why These Libraries?

**@clerk/clerk-react**
- Already using Clerk on backend
- Provides React hooks: `useAuth()`, `useUser()`
- Auto token management

**axios**
- Better than fetch (interceptors, cancellation)
- Easier error handling
- Request/response transformation

**@tanstack/react-query (React Query)**
- Server state management (caching, revalidation)
- Automatic background refetching
- Optimistic updates
- Loading/error states
- Better than Redux for API data

**react-hook-form + zod**
- Performance (uncontrolled forms)
- Built-in validation
- Type-safe schemas

**zustand**
- Simple global state (cart, UI state)
- No boilerplate like Redux
- Better than Context API for frequent updates

**sonner**
- Beautiful toast notifications
- Simple API

---

## 5. Folder Structure

```
frontend/
├── src/                          # New src/ directory (better organization)
│   ├── components/               # Existing components (move here)
│   │   ├── ui/                   # New: Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Spinner.tsx
│   │   ├── cart/                 # New: Cart components
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── wishlist/             # New: Wishlist components
│   │   │   └── WishlistButton.tsx
│   │   └── ...existing components
│   │
│   ├── pages/                    # Existing pages (move here)
│   │   ├── cart/                 # New: Cart pages
│   │   │   ├── CartPage.tsx
│   │   │   └── CheckoutPage.tsx
│   │   ├── account/              # New: User account pages
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   └── OrderDetailsPage.tsx
│   │   ├── admin/                # New: Admin pages
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminProducts.tsx
│   │   │   ├── AdminOrders.tsx
│   │   │   └── AdminArticles.tsx
│   │   └── ...existing pages
│   │
│   ├── lib/                      # New: Core utilities
│   │   ├── api/                  # API client
│   │   │   ├── client.ts         # Axios instance with interceptors
│   │   │   ├── endpoints.ts      # API endpoint constants
│   │   │   └── types.ts          # API request/response types
│   │   ├── auth/                 # Auth utilities
│   │   │   └── clerk.ts          # Clerk configuration
│   │   └── utils/                # Helper functions
│   │       ├── format.ts         # Date, price formatting
│   │       ├── validation.ts     # Validation helpers
│   │       └── constants.ts      # App constants
│   │
│   ├── hooks/                    # New: Custom React hooks
│   │   ├── api/                  # API hooks
│   │   │   ├── useProducts.ts
│   │   │   ├── useCollections.ts
│   │   │   ├── useCart.ts
│   │   │   ├── useOrders.ts
│   │   │   ├── useReviews.ts
│   │   │   ├── useArticles.ts
│   │   │   └── useWishlist.ts
│   │   ├── useAuth.ts            # Auth hook (wraps Clerk)
│   │   └── useDebounce.ts        # Utility hooks
│   │
│   ├── store/                    # New: Zustand stores
│   │   ├── cartStore.ts          # Cart state
│   │   ├── uiStore.ts            # UI state (modals, drawers)
│   │   └── filterStore.ts        # Shop filters state
│   │
│   ├── types/                    # TypeScript types
│   │   ├── index.ts              # Re-export all types
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── review.ts
│   │   ├── article.ts
│   │   └── user.ts
│   │
│   ├── schemas/                  # New: Zod schemas (client validation)
│   │   ├── product.schema.ts
│   │   ├── order.schema.ts
│   │   ├── review.schema.ts
│   │   └── contact.schema.ts
│   │
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Entry point
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 6. Implementation Phases

### Phase 1: Infrastructure Setup (2-3 hours)

#### Step 1.1: Install Dependencies
```bash
cd frontend
npm install @clerk/clerk-react axios @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod zustand sonner
```

#### Step 1.2: Reorganize Files
```bash
# Create src directory
mkdir -p src/{components,pages,lib,hooks,store,types,schemas}
mkdir -p src/lib/{api,auth,utils}
mkdir -p src/hooks/api
mkdir -p src/components/{ui,cart,wishlist}
mkdir -p src/pages/{cart,account,admin}

# Move existing files
mv components/* src/components/
mv pages/* src/pages/
mv types.ts src/types/index.ts
mv App.tsx src/
mv index.tsx src/main.tsx
```

#### Step 1.3: Update Vite Config & Imports
- Update `vite.config.ts` to add path aliases
- Update all import paths in existing files

#### Step 1.4: Setup Environment Variables
Create `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

#### Step 1.5: Create API Client
**File:** `src/lib/api/client.ts`
```typescript
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const { getToken } = useAuth();
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle different error types
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**File:** `src/lib/api/endpoints.ts`
```typescript
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
```

#### Step 1.6: Setup Providers
**File:** `src/App.tsx`
```typescript
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <Router>
          {/* Routes */}
        </Router>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
```

---

### Phase 2: Type Definitions (1 hour)

Create TypeScript types matching backend models in `src/types/`:

**File:** `src/types/product.ts`
```typescript
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
  sortBy?: 'price' | '-price' | 'name' | '-name' | 'createdAt' | '-createdAt';
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
```

**File:** `src/types/cart.ts`
```typescript
export interface CartItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  action?: 'add' | 'set' | 'remove';
}
```

**File:** `src/types/order.ts`
```typescript
export interface OrderItem {
  productId: string;
  product?: Product;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  tracking?: {
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    status?: string;
    estimatedDelivery?: string;
    lastUpdate?: string;
  };
  paymentInfo?: {
    method: string;
    transactionId?: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: { productId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}
```

Similar files for: `review.ts`, `article.ts`, `wishlist.ts`, `user.ts`

---

### Phase 3: API Hooks (3-4 hours)

Create custom hooks for each API endpoint.

**File:** `src/hooks/api/useProducts.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Product, ProductFilters, ProductsResponse } from '@/types/product';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  reviews: (id: string) => [...productKeys.detail(id), 'reviews'] as const,
  related: (id: string) => [...productKeys.detail(id), 'related'] as const,
};

// Get Products List
export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
      const response = await apiClient.get<ProductsResponse>(
        `${API_ENDPOINTS.PRODUCTS}?${params}`
      );
      return response;
    },
  });
};

// Get Single Product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Product>(
        API_ENDPOINTS.PRODUCT_BY_ID(id)
      );
      return response;
    },
    enabled: !!id,
  });
};

// Get Product Reviews
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: productKeys.reviews(productId),
    queryFn: async () => {
      const response = await apiClient.get(
        API_ENDPOINTS.PRODUCT_REVIEWS(productId)
      );
      return response;
    },
    enabled: !!productId,
  });
};

// Get Related Products
export const useRelatedProducts = (productId: string) => {
  return useQuery({
    queryKey: productKeys.related(productId),
    queryFn: async () => {
      const response = await apiClient.get<Product[]>(
        API_ENDPOINTS.PRODUCT_RELATED(productId)
      );
      return response;
    },
    enabled: !!productId,
  });
};

// Admin: Create Product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      const response = await apiClient.post<Product>(
        API_ENDPOINTS.PRODUCTS,
        data
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Admin: Update Product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const response = await apiClient.patch<Product>(
        API_ENDPOINTS.PRODUCT_BY_ID(id),
        data
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Admin: Delete Product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(
        API_ENDPOINTS.PRODUCT_BY_ID(id)
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
```

**File:** `src/hooks/api/useCart.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Cart, AddToCartData } from '@/types/cart';
import { toast } from 'sonner';

export const cartKeys = {
  all: ['cart'] as const,
};

// Get Cart
export const useCart = () => {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: async () => {
      const response = await apiClient.get<Cart>(API_ENDPOINTS.CART);
      return response;
    },
  });
};

// Add to Cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AddToCartData) => {
      const response = await apiClient.post<Cart>(API_ENDPOINTS.CART, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success('Added to cart!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });
};

// Update Cart Item
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: AddToCartData) => {
      const response = await apiClient.post<Cart>(API_ENDPOINTS.CART, {
        ...data,
        action: 'set',
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
};

// Remove from Cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.post<Cart>(API_ENDPOINTS.CART, {
        productId,
        quantity: 0,
        action: 'remove',
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success('Removed from cart');
    },
  });
};

// Clear Cart
export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(API_ENDPOINTS.CART);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success('Cart cleared');
    },
  });
};
```

**Similar files needed:**
- `src/hooks/api/useOrders.ts`
- `src/hooks/api/useReviews.ts`
- `src/hooks/api/useArticles.ts`
- `src/hooks/api/useWishlist.ts`
- `src/hooks/api/useCollections.ts`

---

### Phase 4: Global State (Zustand) (1 hour)

**File:** `src/store/cartStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStoreState {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      isDrawerOpen: false,
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
    }),
    {
      name: 'cart-ui-storage',
    }
  )
);
```

**File:** `src/store/uiStore.ts`
```typescript
import { create } from 'zustand';

interface UIStoreState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
}

export const useUIStore = create<UIStoreState>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  closeSearch: () => set({ isSearchOpen: false }),
}));
```

---

### Phase 5: Component Integration (4-5 hours)

Update existing components to use API hooks instead of mock data.

**Update:** `src/pages/HomePage.tsx`
```typescript
// BEFORE
import { collections, products } from '../data/mockData';
const bestSellers = products.filter(p => p.tag === 'Best Seller').slice(0, 4);

// AFTER
import { useProducts } from '@/hooks/api/useProducts';
import { useCollections } from '@/hooks/api/useCollections';

const HomePage: React.FC = () => {
  const { data: productsData, isLoading: productsLoading } = useProducts({ 
    tags: ['Best Seller'],
    limit: 4 
  });
  
  const { data: collectionsData, isLoading: collectionsLoading } = useCollections();
  
  const bestSellers = productsData?.products || [];
  const homeCollections = collectionsData?.slice(0, 4) || [];
  
  if (productsLoading || collectionsLoading) {
    return <Spinner />;
  }
  
  // ... rest of component
};
```

**Update:** `src/pages/ProductPage.tsx`
```typescript
// BEFORE
const product = allProducts.find(p => p.handle === handle);

// AFTER
import { useProduct, useProductReviews, useRelatedProducts } from '@/hooks/api/useProducts';
import { useAddToCart } from '@/hooks/api/useCart';
import { useWishlist, useToggleWishlist } from '@/hooks/api/useWishlist';

const ProductPage: React.FC = () => {
  const { handle } = useParams();
  const { data: product, isLoading } = useProduct(handle!);
  const { data: reviews } = useProductReviews(product?._id!);
  const { data: relatedProducts } = useRelatedProducts(product?._id!);
  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  
  const handleAddToCart = () => {
    addToCart.mutate({
      productId: product._id,
      quantity,
    });
  };
  
  const handleToggleWishlist = () => {
    toggleWishlist.mutate(product._id);
  };
  
  if (isLoading) return <Spinner />;
  if (!product) return <div>Product not found</div>;
  
  // ... rest of component
};
```

**Update:** `src/components/Header.tsx`
```typescript
// Add auth and cart count
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { useCart } from '@/hooks/api/useCart';
import { useCartStore } from '@/store/cartStore';

const Header: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const { data: cart } = useCart();
  const { openDrawer } = useCartStore();
  
  return (
    <header>
      {/* ... */}
      <button onClick={openDrawer} className="relative">
        <Icon name="shopping_cart" />
        {cart && cart.totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cart.totalItems}
          </span>
        )}
      </button>
      
      {isSignedIn ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <SignInButton mode="modal">
          <button>
            <Icon name="person" />
          </button>
        </SignInButton>
      )}
    </header>
  );
};
```

**New Component:** `src/components/cart/CartDrawer.tsx`
```typescript
import { X } from 'lucide-react';
import { useCart, useRemoveFromCart, useUpdateCartItem } from '@/hooks/api/useCart';
import { useCartStore } from '@/store/cartStore';

export const CartDrawer: React.FC = () => {
  const { data: cart, isLoading } = useCart();
  const { isDrawerOpen, closeDrawer } = useCartStore();
  const removeItem = useRemoveFromCart();
  const updateItem = useUpdateCartItem();
  
  if (!isDrawerOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={closeDrawer} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        {/* Cart contents */}
        {cart?.items.map(item => (
          <CartItem 
            key={item.productId}
            item={item}
            onRemove={() => removeItem.mutate(item.productId)}
            onUpdateQuantity={(qty) => updateItem.mutate({
              productId: item.productId,
              quantity: qty
            })}
          />
        ))}
      </div>
    </div>
  );
};
```

---

### Phase 6: New Pages (3-4 hours)

Create missing pages:

1. **Cart/Checkout Pages**
   - `src/pages/cart/CartPage.tsx`
   - `src/pages/cart/CheckoutPage.tsx`

2. **User Account Pages**
   - `src/pages/account/ProfilePage.tsx`
   - `src/pages/account/OrdersPage.tsx`
   - `src/pages/account/OrderDetailsPage.tsx`

3. **Admin Pages**
   - `src/pages/admin/AdminDashboard.tsx`
   - `src/pages/admin/AdminProducts.tsx`
   - `src/pages/admin/AdminOrders.tsx`
   - `src/pages/admin/AdminArticles.tsx`

4. **Protected Routes**
```typescript
import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isSignedIn, user } = useAuth();
  
  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }
  
  if (requireAdmin && user?.publicMetadata?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
```

---

### Phase 7: Forms & Validation (2-3 hours)

Create forms with react-hook-form + zod:

**Example:** `src/pages/cart/CheckoutPage.tsx`
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateOrder } from '@/hooks/api/useOrders';

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().regex(/^\d{6}$/, 'Invalid PIN code'),
  country: z.string().default('India'),
  phone: z.string().regex(/^\d{10}$/, 'Invalid phone number'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const CheckoutPage = () => {
  const createOrder = useCreateOrder();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
  });
  
  const onSubmit = async (data: ShippingFormData) => {
    await createOrder.mutateAsync({
      shippingAddress: data,
      paymentMethod: 'cod', // or PhonePe
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('fullName')} />
      {errors.fullName && <span>{errors.fullName.message}</span>}
      {/* ... other fields */}
      <button type="submit">Place Order</button>
    </form>
  );
};
```

---

### Phase 8: Testing & Polish (2-3 hours)

1. Test all user flows:
   - Browse products → Add to cart → Checkout
   - Create account → View orders
   - Write review → Edit review
   - Add to wishlist → Remove from wishlist
   - Search products → Filter results

2. Add loading states everywhere
3. Add error boundaries
4. Add empty states (empty cart, no orders, etc.)
5. Optimize images (lazy loading)
6. Add React Query DevTools for debugging

---

## 7. Migration Checklist

### Before Starting
- [ ] Backup current frontend code
- [ ] Create feature branch: `git checkout -b feature/backend-integration`
- [ ] Set up .env.local with API URL and Clerk keys

### Phase 1: Infrastructure
- [ ] Install all dependencies
- [ ] Create src/ directory structure
- [ ] Move existing files to src/
- [ ] Update import paths
- [ ] Create API client
- [ ] Setup providers (Clerk, React Query)
- [ ] Test basic API connection

### Phase 2: Types
- [ ] Create product.ts
- [ ] Create cart.ts
- [ ] Create order.ts
- [ ] Create review.ts
- [ ] Create article.ts
- [ ] Create wishlist.ts
- [ ] Create user.ts

### Phase 3: API Hooks
- [ ] Create useProducts hook
- [ ] Create useCollections hook
- [ ] Create useCart hook
- [ ] Create useOrders hook
- [ ] Create useReviews hook
- [ ] Create useArticles hook
- [ ] Create useWishlist hook
- [ ] Test hooks with React Query DevTools

### Phase 4: Global State
- [ ] Create cartStore (drawer state)
- [ ] Create uiStore (menus, modals)
- [ ] Create filterStore (shop filters)

### Phase 5: Update Existing Components
- [ ] Update HomePage
- [ ] Update ShopPage
- [ ] Update ProductPage
- [ ] Update CollectionPage
- [ ] Update JournalPage
- [ ] Update ArticlePage
- [ ] Update Header (cart, auth)
- [ ] Update ProductCard (wishlist)
- [ ] Update ReviewSection (API data)

### Phase 6: New Components
- [ ] Create CartDrawer
- [ ] Create CartItem
- [ ] Create WishlistButton
- [ ] Create LoadingSpinner
- [ ] Create ErrorBoundary
- [ ] Create EmptyState

### Phase 7: New Pages
- [ ] Create CartPage
- [ ] Create CheckoutPage
- [ ] Create ProfilePage
- [ ] Create OrdersPage
- [ ] Create OrderDetailsPage
- [ ] Create AdminDashboard
- [ ] Create AdminProducts
- [ ] Create AdminOrders
- [ ] Create AdminArticles
- [ ] Add protected routes

### Phase 8: Forms
- [ ] Checkout form (shipping)
- [ ] Review form
- [ ] Contact form
- [ ] Product form (admin)
- [ ] Article form (admin)

### Phase 9: Testing
- [ ] Test authentication flow
- [ ] Test cart functionality
- [ ] Test order creation
- [ ] Test admin operations
- [ ] Test error scenarios
- [ ] Test loading states
- [ ] Test mobile responsiveness

### Phase 10: Cleanup
- [ ] Remove mockData.ts
- [ ] Remove unused imports
- [ ] Add error boundaries
- [ ] Add loading states
- [ ] Optimize bundle size
- [ ] Remove console.logs

---

## 8. Estimated Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| Phase 1 | 2-3 hours | Infrastructure setup |
| Phase 2 | 1 hour | Type definitions |
| Phase 3 | 3-4 hours | API hooks |
| Phase 4 | 1 hour | Global state |
| Phase 5 | 4-5 hours | Update components |
| Phase 6 | 3-4 hours | New pages |
| Phase 7 | 2-3 hours | Forms & validation |
| Phase 8 | 2-3 hours | Testing & polish |
| **TOTAL** | **18-26 hours** | **2-3 working days** |

---

## 9. Success Criteria

✅ **All existing pages work with backend data**  
✅ **Authentication flow complete (Clerk)**  
✅ **Cart functionality working**  
✅ **Checkout flow complete**  
✅ **User can view orders**  
✅ **User can write/edit reviews**  
✅ **Wishlist functionality working**  
✅ **Admin panel functional**  
✅ **No mock data remaining**  
✅ **All TypeScript errors resolved**  
✅ **Responsive on mobile**  
✅ **Error handling in place**  
✅ **Loading states everywhere**

---

## 10. Next Steps After Integration

1. **Payment Integration**
   - Integrate PhonePe SDK
   - Add payment flow to checkout
   - Handle payment callbacks

2. **Email Notifications**
   - Setup email service (SendGrid/Nodemailer)
   - Order confirmation emails
   - Shipping notifications

3. **Advanced Features**
   - Product search with autocomplete
   - Image zoom on product page
   - Size guide modal
   - Product comparison
   - Customer support chat

4. **Performance**
   - Add image optimization (next/image equivalent)
   - Add lazy loading
   - Code splitting
   - Service worker (PWA)

5. **SEO**
   - Add meta tags
   - Add structured data
   - Sitemap generation
   - robots.txt

---

## Notes

- Keep mock data file for reference during migration
- Test each phase before moving to next
- Use React Query DevTools for debugging
- Keep components small and focused
- Create reusable UI components
- Document any breaking changes
- Update README with setup instructions

---

**Last Updated:** January 2024  
**Author:** Integration Team

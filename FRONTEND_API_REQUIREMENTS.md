# Frontend API Requirements - Kuber Brass Store Storefront

**Generated**: December 2024  
**Purpose**: Complete mapping of frontend data requirements to backend API endpoints for integration planning

---

## Executive Summary

This document provides a comprehensive analysis of the Kuber Brass Store storefront frontend application, detailing all data requirements across 10 pages and 7 components. It maps current mock data usage to required backend API endpoints and identifies gaps in the current backend implementation.

### Current State
- **Frontend**: React 19.2.4 + TypeScript 5.8.2 + Vite 6.2.0
- **Data Source**: Hardcoded mock data in `data/mockData.ts`
- **Backend**: Express + MongoDB + Clerk (running on port 3001)
- **Authentication**: Not yet implemented in frontend (Clerk needs integration)

### Integration Status
- ✅ Backend API: Running and tested
- ❌ Frontend API Client: Not implemented
- ❌ Authentication: Clerk not integrated in frontend
- ❌ State Management: No React Query or context setup
- ❌ Cart System: Frontend needs cart hooks and state
- ❌ Order System: Frontend needs order creation and tracking

---

## Mock Data Analysis

### Current Mock Data Structure (data/mockData.ts)

#### 1. Products (10 items)
```typescript
interface Product {
  id: string;           // e.g., 'p1', 'p2'
  handle: string;       // URL slug: 'vintage-brass-diya'
  name: string;         // Display name
  category: string;     // Category name
  price: number;        // Price in rupees
  imageUrl: string;     // Primary image URL
  tag?: 'Best Seller' | 'New' | 'Sold Out' | 'Limited' | 'Handcrafted';
  images?: string[];    // Gallery images (only p4 has this)
  finish?: 'Antique' | 'Polished' | 'Black Oxide';
  usage?: 'Puja' | 'Kitchen' | 'Decor' | 'Gifting';
  dimensions?: string;  // e.g., '4" H x 3" W'
  weight?: string;      // e.g., '250g'
}
```

**Data**: 10 products with various categories, prices ₹2,400-₹18,000

#### 2. Collections (6 items)
```typescript
interface Collection {
  id: string;
  handle: string;       // URL slug: 'god-idols'
  name: string;         // Display name
  description: string;  // Short description
  imageUrl: string;     // Hero image
}
```

**Data**: God Idols, Brass Utensils, Home Decor, Wall Art, Lamps & Diyas, Gift Items

#### 3. Articles (3 items)
```typescript
interface Article {
  id: string;
  slug: string;         // URL slug: 'caring-for-brass'
  category: string;     // 'Care Guide', 'Heritage', 'Craft'
  date: string;         // 'Oct 12, 2023'
  readTime: number;     // Minutes: 4-8
  title: string;        // Article title
  excerpt: string;      // Short description
  imageUrl: string;     // Featured image
  content: string;      // Full article body (plain text)
}
```

**Data**: Caring for brass, History of brass in India, Artisan's touch

#### 4. Reviews (4 items)
```typescript
interface Review {
  id: string;
  author: string;
  rating: number;       // 1-5 stars
  title: string;        // Review title
  content: string;      // Review body
  date: string;         // Date string
  verified: boolean;    // Purchase verified
}
```

**Data**: 4 reviews, 3 verified, ratings 4-5 stars

---

## Page-by-Page API Requirements

### 1. HomePage (`/`)

**Purpose**: Landing page with hero, collections showcase, best sellers, craftsmanship story

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| Hero content | Static/hardcoded | None (static) | N/A | Text and image are static |
| Featured collections (4) | `collections.slice(0, 4)` | `GET /api/collections?featured=true&limit=4` | ❌ Missing | Need Collections model |
| Best seller products (4) | `products.filter(tag='Best Seller').slice(0,4)` | `GET /api/products?tag=best-seller&limit=4` | ✅ Partial | Can filter by tag |
| Newsletter signup | Form (no action) | `POST /api/newsletter/subscribe` | ❌ Missing | Need Newsletter model |

**API Calls on Page Load**:
1. Fetch 4 featured collections
2. Fetch 4 best seller products

**User Actions**:
- Newsletter email submission (needs endpoint)

---

### 2. ShopPage (`/shop`)

**Purpose**: Main product catalog with filters and sorting

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| All products | `products` (10 items) | `GET /api/products?page=1&limit=12` | ✅ Exists | Pagination implemented |
| Filter by category | Client-side filter | `GET /api/products?category=God%20Idols` | ✅ Exists | Query param supported |
| Filter by usage | Client-side filter | `GET /api/products?usage=Puja` | ⚠️ Check | Need to verify backend |
| Filter by finish | Client-side filter | `GET /api/products?finish=Antique` | ⚠️ Check | Need to verify backend |
| Filter by price range | Client-side filter | `GET /api/products?minPrice=0&maxPrice=20000` | ❌ Missing | Need backend support |
| Sort options | Client-side sort | `GET /api/products?sort=price_asc` | ❌ Missing | Need backend support |

**Current Filters** (need backend support):
- Category: All, God Idols, Brass Utensils, Home Decor, Wall Art, Lamps & Diyas
- Usage: Puja, Kitchen, Decor, Gifting (checkboxes)
- Finish: Antique, Polished, Black Oxide (checkboxes)
- Price Range: ₹0 - ₹20,000+ (slider)
- Sort: Best Sellers, Newest, Price Low-High, Price High-Low

**API Calls on Page Load**:
1. Fetch paginated products with filters

**User Actions**:
- Apply filters (re-fetch with query params)
- Change sort order (re-fetch with sort param)
- Pagination (re-fetch with page param)
- Quick add to cart from product cards

---

### 3. CollectionPage (`/collections/:handle`)

**Purpose**: Display products within a specific collection

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| Collection metadata | `collections.find(handle)` | `GET /api/collections/:handle` | ❌ Missing | Need Collections model |
| Collection products | `products.slice(0,8)` (fake) | `GET /api/collections/:handle/products` | ❌ Missing | Need collection-product relationship |

**API Calls on Page Load**:
1. Fetch collection by handle (metadata + hero image)
2. Fetch products in collection

**User Actions**:
- Quick add to cart from product cards

---

### 4. ProductPage (`/product/:handle`)

**Purpose**: Single product details with gallery, reviews, related products

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| Product details | `products.find(handle)` | `GET /api/products/:slug` | ✅ Exists | Tested and working |
| Product gallery | `product.images` or fallback | Included in product data | ✅ Exists | Backend has images array |
| Product reviews | `reviews` (global mock) | `GET /api/products/:slug/reviews` | ❌ Missing | Need Reviews model |
| Related products | `products.slice(0,4)` (fake) | `GET /api/products/:slug/related` | ❌ Missing | Need recommendation logic |
| Add to cart | No backend | `POST /api/cart/add` | ✅ Exists | Auth required |

**API Calls on Page Load**:
1. Fetch product by slug
2. Fetch product reviews
3. Fetch related products

**User Actions**:
- Change quantity (local state)
- Add to cart (needs auth)
- Submit review (needs endpoint)

**Current Issues**:
- Reviews are global (not product-specific)
- Related products logic doesn't exist
- No stock/availability checking

---

### 5. StoryPage (`/story`)

**Purpose**: Brand story and philosophy (static content)

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| Story content | Static/hardcoded | None | N/A | All content is static |

**API Calls**: None (fully static)

---

### 6. CraftPage (`/craft`)

**Purpose**: Craftsmanship process showcase (static content)

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| Process steps | Static/hardcoded | None | N/A | All content is static |

**API Calls**: None (fully static)

---

### 7. JournalPage (`/journal`)

**Purpose**: Blog/article listing

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| All articles | `articles` (3 items) | `GET /api/articles?page=1&limit=9` | ❌ Missing | Need Articles model |
| Load more articles | Not implemented | `GET /api/articles?page=2` | ❌ Missing | Pagination needed |

**API Calls on Page Load**:
1. Fetch paginated articles

**User Actions**:
- Load more articles (pagination)

---

### 8. ArticlePage (`/journal/:slug`)

**Purpose**: Single article view

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| Article content | `articles.find(slug)` | `GET /api/articles/:slug` | ❌ Missing | Need Articles model |
| Related articles (3) | `articles.filter(!=slug).slice(0,3)` | `GET /api/articles/:slug/related` | ❌ Missing | Need recommendation logic |

**API Calls on Page Load**:
1. Fetch article by slug
2. Fetch related articles

---

### 9. ContactPage (`/contact`)

**Purpose**: Contact form

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| Contact info | Static/hardcoded | None | N/A | Address, phone, email are static |
| Form submission | No backend | `POST /api/contact/submit` | ❌ Missing | Need Contact model/email service |

**API Calls**: None on page load

**User Actions**:
- Submit contact form (needs endpoint)

---

### 10. PoliciesPage (`/policies/:type`)

**Purpose**: Display policy content (shipping, returns, care, terms, privacy)

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| Policy content | Static object in component | None (can stay static) | N/A | Policies rarely change |

**API Calls**: None (fully static content)

**Note**: Could optionally fetch from CMS/database for easier management, but static is acceptable.

---

## Component API Requirements

### 1. Header Component

**Purpose**: Global navigation with cart badge, user session

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| User session | Not implemented | Clerk SDK (client-side) | ⚠️ Clerk not integrated | Need @clerk/clerk-react |
| Cart item count | Not implemented | `GET /api/cart` | ✅ Exists (auth) | Need to fetch cart |
| User profile | Not implemented | Clerk user object | ⚠️ Clerk not integrated | From Clerk context |

**API Calls**:
- Fetch cart on initial load (if authenticated)
- Subscribe to cart updates (context/state)

**User Actions**:
- Click cart icon → open cart drawer/page
- Click profile → login or profile page
- Search (needs endpoint or client-side)

**Current Issues**:
- Cart badge shows dot, not count
- No authentication state
- No user menu/dropdown

---

### 2. ProductCard Component

**Purpose**: Reusable product display card with quick actions

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| Product data | Props from parent | N/A | N/A | Passed as prop |
| Add to cart | Not implemented | `POST /api/cart/add` | ✅ Exists (auth) | Needs auth |

**User Actions**:
- Quick add to cart (needs auth check and API call)

---

### 3. CollectionCard Component

**Purpose**: Display collection preview card

**Data Requirements**: None (display-only, data from props)

---

### 4. ReviewSection Component

**Purpose**: Display product reviews with average rating

**Data Requirements**:
| Data Type | Current Source | API Endpoint Needed | Backend Status | Notes |
|-----------|---------------|-------------------|----------------|-------|
| Reviews array | Props from parent | N/A | N/A | Passed from ProductPage |
| Submit review | Not implemented | `POST /api/products/:slug/reviews` | ❌ Missing | Need Reviews model |

**User Actions**:
- Write a review (needs endpoint and auth)

---

### 5. Footer, Section, Icon Components

**Purpose**: Layout and UI utilities

**Data Requirements**: None (static content and utilities)

---

## Backend API Gap Analysis

### ✅ Implemented Endpoints

1. **Health Check**
   - `GET /health` - Server health status

2. **Products** (Public)
   - `GET /api/products` - List products with pagination, search, filters
   - `GET /api/products/:slug` - Get single product by slug

3. **Cart** (Protected - Clerk Auth)
   - `GET /api/cart` - Get user's cart
   - `POST /api/cart/add` - Add item to cart
   - `POST /api/cart/update` - Update item quantity
   - `POST /api/cart/remove` - Remove item from cart
   - `DELETE /api/cart/clear` - Clear entire cart

4. **Orders** (Protected - Clerk Auth)
   - `POST /api/orders/create` - Create new order
   - `GET /api/orders/my` - Get user's orders
   - `GET /api/orders/:orderId` - Get single order details

### ❌ Missing Endpoints (Required)

#### High Priority (Core Features)

1. **Collections**
   - `GET /api/collections` - List all collections (with featured filter)
   - `GET /api/collections/:handle` - Get collection by handle
   - `GET /api/collections/:handle/products` - Get products in collection
   - **Requires**: New `Collection` model + controller + routes

2. **Product Reviews**
   - `GET /api/products/:slug/reviews` - Get reviews for product
   - `POST /api/products/:slug/reviews` - Submit product review (auth)
   - `GET /api/reviews/my` - Get user's reviews (auth)
   - **Requires**: New `Review` model + controller + routes

3. **Product Search & Filters**
   - Extend `GET /api/products` with:
     - `?minPrice=X&maxPrice=Y` - Price range filter
     - `?sort=price_asc|price_desc|newest|popular` - Sorting
     - `?tag=best-seller|new|limited` - Tag filtering
   - **Requires**: Update product controller query builder

4. **Related Products**
   - `GET /api/products/:slug/related` - Get similar products
   - **Requires**: Logic in product controller (by category, tags, etc.)

#### Medium Priority (Content Management)

5. **Articles/Blog**
   - `GET /api/articles` - List articles with pagination
   - `GET /api/articles/:slug` - Get single article
   - `GET /api/articles/:slug/related` - Get related articles
   - **Requires**: New `Article` model + controller + routes

6. **Contact Form**
   - `POST /api/contact/submit` - Submit contact form
   - **Requires**: Email service integration (nodemailer) + Contact model

7. **Newsletter**
   - `POST /api/newsletter/subscribe` - Newsletter signup
   - **Requires**: New `Newsletter` model + controller + routes

#### Low Priority (Nice to Have)

8. **User Profile** (if not using Clerk's dashboard)
   - `GET /api/users/me` - Get user profile
   - `PUT /api/users/me` - Update user profile
   - **Note**: Clerk handles this, may not be needed

9. **Wishlist** (feature not in frontend yet)
   - `GET /api/wishlist` - Get user's wishlist
   - `POST /api/wishlist/add` - Add to wishlist
   - `DELETE /api/wishlist/remove/:productId` - Remove from wishlist

10. **Product Stock Management**
    - Current `Product.stock` field exists but no endpoints to update
    - Admin endpoints would be needed (out of scope for now)

### ⚠️ Endpoints Needing Verification

1. **Product Filters**: Check if backend supports `usage` and `finish` query params
2. **Cart Session Management**: Verify sessionId handling for guest users
3. **Order Status Updates**: Verify if order status can be updated (tracking)

---

## Authentication Requirements

### Current Backend Setup
- **Library**: `@clerk/express`
- **Middleware**: `src/middleware/auth.ts`
- **Status**: Simplified JWT parsing (development mode)
- **Protected Routes**: Cart, Orders

### Frontend Integration Needed

1. **Install Clerk**
   ```bash
   npm install @clerk/clerk-react
   ```

2. **Wrap App with ClerkProvider**
   ```tsx
   import { ClerkProvider } from '@clerk/clerk-react';
   
   const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
   
   <ClerkProvider publishableKey={clerkPubKey}>
     <App />
   </ClerkProvider>
   ```

3. **Use Authentication Hooks**
   ```tsx
   import { useUser, useAuth } from '@clerk/clerk-react';
   
   const { isSignedIn, user } = useUser();
   const { getToken } = useAuth();
   ```

4. **Attach JWT to API Requests**
   ```tsx
   const token = await getToken();
   axios.get('/api/cart', {
     headers: { Authorization: `Bearer ${token}` }
   });
   ```

5. **Protected Routes**
   - Cart page (requires auth)
   - Orders page (requires auth)
   - Profile page (requires auth)
   - Review submission (requires auth)

---

## Data Models Comparison

### Backend Product Model vs Frontend Type

**Backend** (`src/models/Product.model.ts`):
```typescript
{
  name: string;
  slug: string;           // ✅ Matches frontend 'handle'
  description: string;    // ❌ Frontend doesn't use (hardcoded on ProductPage)
  price: number;
  compareAtPrice?: number; // ❌ Frontend doesn't use
  images: string[];       // ✅ Matches (frontend has imageUrl + images array)
  category: string;
  tags: string[];         // ⚠️ Frontend uses single 'tag' field
  stock: number;          // ❌ Frontend doesn't check stock
  sku?: string;           // ❌ Frontend doesn't use
  metadata: {
    finish?: string;      // ✅ Matches
    usage?: string;       // ✅ Matches
    dimensions?: string;  // ✅ Matches
    weight?: string;      // ✅ Matches
    material?: string;    // ❌ Frontend doesn't use (hardcoded as "100% Pure Brass")
  }
}
```

**Frontend** (`types.ts`):
```typescript
{
  id: string;             // ❌ Backend uses _id (MongoDB)
  handle: string;         // ✅ Backend uses 'slug'
  name: string;
  category: string;
  price: number;
  imageUrl: string;       // ⚠️ Backend has images[] array
  tag?: string;           // ⚠️ Backend has tags[] array
  images?: string[];
  finish?: string;
  usage?: string;
  dimensions?: string;
  weight?: string;
}
```

**Mapping Issues**:
1. Frontend `id` → Backend `_id` (MongoDB ObjectId)
2. Frontend `handle` → Backend `slug` ✅
3. Frontend `imageUrl` → Backend `images[0]` (use first image)
4. Frontend `tag` → Backend `tags[0]` or priority tag
5. Frontend `finish/usage/dimensions/weight` → Backend `metadata.*`

**Solution**: Create a frontend Product type transformer:
```typescript
function mapBackendProduct(backendProduct: BackendProduct): Product {
  return {
    id: backendProduct._id,
    handle: backendProduct.slug,
    name: backendProduct.name,
    category: backendProduct.category,
    price: backendProduct.price,
    imageUrl: backendProduct.images[0],
    images: backendProduct.images,
    tag: backendProduct.tags[0], // or priority logic
    finish: backendProduct.metadata.finish,
    usage: backendProduct.metadata.usage,
    dimensions: backendProduct.metadata.dimensions,
    weight: backendProduct.metadata.weight,
  };
}
```

---

## State Management Strategy

### Option 1: React Query (Recommended)

**Why**:
- Perfect for server state (API data)
- Built-in caching, background refetching
- Loading/error states handled
- Optimistic updates for cart

**Setup**:
```bash
npm install @tanstack/react-query
```

**Example Usage**:
```tsx
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.products.list(filters),
  });
}

// In component
const { data, isLoading, error } = useProducts({ category: 'God Idols' });
```

### Option 2: Context API + useState

**When**: For simpler apps, but more boilerplate

### Cart State Management

**Requirements**:
- Global cart state (accessible from Header, ProductCard, CartPage)
- Sync with backend on changes
- Persist during session
- Real-time count updates

**Recommended**: React Query + Context
```tsx
// contexts/CartContext.tsx
const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }) {
  const { data: cart, refetch } = useQuery(['cart'], api.cart.get);
  const addItem = useMutation(api.cart.add, { onSuccess: () => refetch() });
  
  return (
    <CartContext.Provider value={{ cart, addItem }}>
      {children}
    </CartContext.Provider>
  );
}
```

---

## API Client Architecture

### Recommended Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── index.ts          // Main API client export
│   │   ├── client.ts         // Axios instance with interceptors
│   │   ├── products.ts       // Product endpoints
│   │   ├── cart.ts           // Cart endpoints
│   │   ├── orders.ts         // Order endpoints
│   │   ├── collections.ts    // Collection endpoints (to add)
│   │   ├── articles.ts       // Article endpoints (to add)
│   │   └── types.ts          // API request/response types
│   └── utils/
│       └── transformers.ts   // Backend to frontend type mappers
├── hooks/
│   ├── useProducts.ts        // React Query hook
│   ├── useCart.ts            // Cart hook
│   ├── useOrders.ts          // Orders hook
│   └── useAuth.ts            // Clerk auth wrapper
└── contexts/
    └── CartContext.tsx       // Global cart state
```

### Example API Client

```typescript
// lib/api/client.ts
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: Attach JWT
client.interceptors.request.use(async (config) => {
  const { getToken } = useAuth();
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle errors
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default client;
```

```typescript
// lib/api/products.ts
import client from './client';
import { Product, ProductFilters } from './types';

export const productsApi = {
  list: async (filters?: ProductFilters) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.tag) params.append('tag', filters.tag);
    // ... more filters
    
    return client.get<{ products: Product[] }>(`/api/products?${params}`);
  },
  
  getBySlug: async (slug: string) => {
    return client.get<{ product: Product }>(`/api/products/${slug}`);
  },
  
  getRelated: async (slug: string) => {
    return client.get<{ products: Product[] }>(`/api/products/${slug}/related`);
  },
};
```

---

## Frontend Environment Variables

Create `.env` file in frontend folder:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Optional: Feature Flags
VITE_ENABLE_REVIEWS=true
VITE_ENABLE_WISHLIST=false
```

---

## Integration Checklist

### Phase 1: Foundation (Week 1)

**Backend Work**:
- [ ] Add Collections model, controller, routes
- [ ] Add Reviews model, controller, routes  
- [ ] Extend Product controller with filters (price, sort)
- [ ] Add related products logic
- [ ] Test all endpoints with Postman/curl

**Frontend Work**:
- [ ] Install dependencies: `@clerk/clerk-react`, `@tanstack/react-query`, `axios`
- [ ] Set up ClerkProvider in `index.tsx`
- [ ] Create API client (`lib/api/`)
- [ ] Set up React Query provider
- [ ] Create environment variables file

### Phase 2: Core Features (Week 2)

**Products**:
- [ ] Create `useProducts` hook with React Query
- [ ] Update ShopPage to fetch from API
- [ ] Update ProductPage to fetch from API
- [ ] Add loading skeletons and error states
- [ ] Test filters and sorting

**Cart**:
- [ ] Create `useCart` hook
- [ ] Create CartContext for global state
- [ ] Update Header to show cart count
- [ ] Add "Add to Cart" functionality to ProductCard
- [ ] Create Cart page/drawer (if needed)

**Authentication**:
- [ ] Add Clerk SignIn/SignUp components
- [ ] Add user menu in Header
- [ ] Protect cart/order routes
- [ ] Test auth flow end-to-end

### Phase 3: Content & Features (Week 3)

**Collections**:
- [ ] Add Articles model, controller, routes (backend)
- [ ] Create `useCollections` hook
- [ ] Update HomePage to fetch collections
- [ ] Update CollectionPage to fetch products

**Blog/Journal**:
- [ ] Create `useArticles` hook
- [ ] Update JournalPage to fetch articles
- [ ] Update ArticlePage to fetch article

**Reviews**:
- [ ] Create `useReviews` hook
- [ ] Update ProductPage to fetch reviews
- [ ] Add "Write Review" form with submission

### Phase 4: Polish & Testing (Week 4)

**Additional Features**:
- [ ] Add Contact form submission (backend + frontend)
- [ ] Add Newsletter subscription (backend + frontend)
- [ ] Add related products to ProductPage
- [ ] Add search functionality (if time permits)

**Testing**:
- [ ] Test all pages with real data
- [ ] Test auth flows (login, logout, protected routes)
- [ ] Test cart operations (add, update, remove, checkout)
- [ ] Test error states (network errors, 404s, auth errors)
- [ ] Cross-browser testing
- [ ] Mobile responsive testing

**Performance**:
- [ ] Add image optimization/lazy loading
- [ ] Add route-based code splitting
- [ ] Optimize React Query caching strategy
- [ ] Add loading skeletons for better UX

---

## Testing Strategy

### 1. API Endpoint Testing (Backend)

Use **Thunder Client** (VS Code) or **Postman**:

**Products**:
```
GET http://localhost:3001/api/products
GET http://localhost:3001/api/products/vintage-brass-diya
GET http://localhost:3001/api/products?category=Lamps%20%26%20Diyas
GET http://localhost:3001/api/products?tag=best-seller
```

**Cart** (requires JWT):
```
GET http://localhost:3001/api/cart
Headers: Authorization: Bearer <clerk-jwt>

POST http://localhost:3001/api/cart/add
Body: { "productId": "...", "quantity": 1 }
```

### 2. Frontend Integration Testing

**Manual Testing**:
1. Load each page and verify API calls in Network tab
2. Check loading states appear correctly
3. Verify error handling (disconnect backend)
4. Test auth flows (login, logout, protected routes)
5. Test cart operations end-to-end

**Automated Testing** (optional):
- Unit tests: Jest + React Testing Library
- E2E tests: Playwright or Cypress

### 3. Comparison Testing

Compare mock data vs API data side-by-side:
1. Load page with mock data (before)
2. Load page with API data (after)
3. Verify UI looks identical
4. Check for missing data/fields

---

## Deployment Considerations

### Frontend Build

**Vite Production Build**:
```bash
cd frontend
npm run build
```

**Output**: `dist/` folder with static assets

### Environment Variables

**Development**:
- `VITE_API_BASE_URL=http://localhost:3001`
- `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`

**Production**:
- `VITE_API_BASE_URL=https://api.kuber-brass-store.com`
- `VITE_CLERK_PUBLISHABLE_KEY=pk_live_...`

### CORS Configuration

**Backend** (`src/app.ts`):
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',      // Dev frontend
    'https://kuber-brass-store.com',         // Production domain
  ],
  credentials: true,
}));
```

### Static File Hosting

Options:
1. **Vercel** (recommended for Vite apps)
2. **Netlify**
3. **CloudFlare Pages**
4. **AWS S3 + CloudFront**

All support:
- Automatic deployments from Git
- Environment variables
- Custom domains
- HTTPS/SSL

---

## Risk Assessment & Mitigation

### High Risk

**1. Clerk Authentication Integration**
- **Risk**: Complex JWT flow, token refresh issues
- **Mitigation**: Follow Clerk docs exactly, test thoroughly, use dev keys first

**2. Cart State Synchronization**
- **Risk**: Cart state out of sync between frontend/backend
- **Mitigation**: Use React Query for automatic refetching, optimistic updates

**3. Data Model Mismatches**
- **Risk**: Frontend types don't match backend responses
- **Mitigation**: Create type transformers, use TypeScript strictly

### Medium Risk

**4. Missing Backend Endpoints**
- **Risk**: Collections, Reviews, Articles not yet implemented
- **Mitigation**: Prioritize endpoints, implement in phases, keep mock data as fallback

**5. Image Loading Performance**
- **Risk**: Large images slow down page load
- **Mitigation**: Use lazy loading, optimize images, consider CDN

### Low Risk

**6. Static Content Migration**
- **Risk**: Story, Craft, Policies pages are static
- **Mitigation**: No API needed, keep as-is for now

---

## Performance Optimization

### React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 minutes
      cacheTime: 10 * 60 * 1000,   // 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on tab switch
      retry: 1,                     // Retry failed requests once
    },
  },
});
```

### Image Optimization

1. **Use `loading="lazy"` attribute**
2. **Consider next-gen formats**: WebP, AVIF
3. **Use image CDN**: Cloudinary, imgix
4. **Implement progressive loading**: Blur-up effect

### Code Splitting

```typescript
// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));

// Wrap in Suspense
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/shop" element={<ShopPage />} />
  </Routes>
</Suspense>
```

---

## Next Steps

### Immediate Actions

1. **Backend**:
   - Add Collections model/routes
   - Add Reviews model/routes
   - Extend Product filters
   - Test all endpoints

2. **Frontend**:
   - Install dependencies
   - Set up Clerk + React Query
   - Build API client
   - Test with one page (ShopPage)

3. **Documentation**:
   - Update API documentation
   - Create API response examples
   - Document error codes

### Week-by-Week Plan

**Week 1**: Backend endpoints + Frontend foundation  
**Week 2**: Products + Cart + Auth integration  
**Week 3**: Collections + Blog + Reviews  
**Week 4**: Testing + Polish + Deployment

---

## Appendix

### A. Current Backend API Documentation

See `/backend/README.md` for full endpoint documentation.

### B. Mock Data Reference

See `/frontend/data/mockData.ts` for current data structure.

### C. Type Definitions

See `/frontend/types.ts` for frontend TypeScript interfaces.

### D. Backend Models

- `/backend/src/models/Product.model.ts`
- `/backend/src/models/Cart.model.ts`
- `/backend/src/models/Order.model.ts`

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Author**: Technical Audit  
**Status**: Ready for Implementation

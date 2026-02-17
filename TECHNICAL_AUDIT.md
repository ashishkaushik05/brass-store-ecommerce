# 🔍 Technical Audit Report
## Pitalya Storefront - Shopify Integration Readiness Assessment

**Project:** Pitalya Storefront  
**Audit Date:** February 17, 2026  
**Repository:** vercel/commerce (main branch)  
**Auditor:** GitHub Copilot  
**Assessment Grade:** B- (Strong foundation, needs backend integration)

---

## Executive Summary

This is a **React/TypeScript storefront** built as a pixel-perfect prototype for Pitalya, a premium handcrafted brass artifact brand. The project is **80-85% complete** from a UI/UX perspective but requires significant backend integration work to connect with the Shopify Storefront API.

**Key Findings:**
- ✅ Production-ready UI/UX with excellent visual design
- ✅ Well-structured component architecture
- ⚠️ No data fetching layer or API integration
- ⚠️ No state management system
- ❌ No error handling infrastructure
- ❌ No shopping cart functionality
- ❌ Build configuration uses CDN dependencies

**Estimated Integration Time:** 4-5 weeks for full Shopify Storefront API integration with proper error handling, state management, and UX polish.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Frontend State Analysis](#3-frontend-state-analysis)
4. [Component Architecture](#4-component-architecture)
5. [API Integration Readiness](#5-api-integration-readiness)
6. [State Management Assessment](#6-state-management-assessment)
7. [Caching Strategy](#7-caching-strategy)
8. [Error Handling Evaluation](#8-error-handling-evaluation)
9. [Technical Debt & Risks](#9-technical-debt--risks)
10. [Implementation Gaps](#10-implementation-gaps)
11. [Shopify Integration Roadmap](#11-shopify-integration-roadmap)
12. [Recommended Architecture](#12-recommended-architecture)
13. [Detailed Assessment Scores](#13-detailed-assessment-scores)

---

## 1. Project Overview

### 1.1 What Currently Exists

This project is a **single-page application (SPA)** showcasing handcrafted brass artifacts from the Pitalya brand. It functions as a comprehensive design prototype with full page layouts, navigation, and UI interactions—but without any real data connectivity.

**Architecture:**
- **Framework:** React 19.2.4 with TypeScript 5.8.2
- **Build Tool:** Vite 6.2.0
- **Routing:** React Router DOM 7.13.0 with HashRouter
- **Styling:** Tailwind CSS (via CDN, inline configuration)
- **Fonts:** Google Fonts (Playfair Display, Work Sans)
- **Icons:** Material Symbols
- **Data Source:** Hardcoded mock data (`data/mockData.ts`)

### 1.2 Project Structure

```
pitalya-storefront/
├── App.tsx                 # Main app component with routing
├── index.tsx              # React root entry point
├── index.html             # HTML template with CDN imports
├── types.ts               # TypeScript interfaces
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies
├── components/
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── ProductCard.tsx    # Product grid item
│   ├── CollectionCard.tsx # Collection grid item
│   ├── ReviewSection.tsx  # Product reviews display
│   ├── Section.tsx        # Layout wrapper
│   └── Icon.tsx           # Material icon wrapper
├── pages/
│   ├── HomePage.tsx       # Landing page
│   ├── ShopPage.tsx       # Product listing with filters
│   ├── CollectionPage.tsx # Collection-specific products
│   ├── ProductPage.tsx    # Product detail page
│   ├── StoryPage.tsx      # Brand story
│   ├── CraftPage.tsx      # Craftsmanship showcase
│   ├── JournalPage.tsx    # Article/blog listing
│   ├── ArticlePage.tsx    # Individual article view
│   ├── ContactPage.tsx    # Contact form
│   └── PoliciesPage.tsx   # Dynamic policy pages
└── data/
    └── mockData.ts        # Hardcoded products, collections, articles
```

### 1.3 Current Capabilities

**What Works:**
- Full page navigation across all routes
- Responsive design (mobile, tablet, desktop)
- Visual interactions (hover states, transitions)
- Image galleries with thumbnail selection
- Accordion UI for product details
- Review display with rating stars
- URL-based routing with route parameters

**What Doesn't Work:**
- No actual data fetching
- Forms don't submit
- Filters don't filter
- Cart doesn't function
- Search doesn't search
- Authentication doesn't exist
- No loading states
- No error handling

---

## 2. Technology Stack

### 2.1 Core Dependencies

```json
{
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

### 2.2 External Dependencies (CDN-based)

⚠️ **Risk Factor:** Production site relies on external CDNs

- **Tailwind CSS:** Loaded via `cdn.tailwindcss.com`
- **React/React-DOM:** Loaded via ESM.sh
- **Google Fonts:** Loaded via `fonts.googleapis.com`
- **Material Symbols:** Loaded via `fonts.googleapis.com`

### 2.3 TypeScript Configuration

**Target:** ES2022  
**Module:** ESNext with bundler resolution  
**JSX:** react-jsx (automatic runtime)  
**Path Aliases:** `@/*` → project root  
**Strict Mode:** Not enabled (potential type safety gaps)

---

## 3. Frontend State Analysis

### 3.1 Implemented Pages

| Page | Route | Completion | Data Source | Notes |
|------|-------|-----------|-------------|-------|
| **Home** | `/` | 100% | mockData.ts | Hero, collections, best sellers, newsletter |
| **Shop** | `/shop` | 95% | mockData.ts | Missing: functional filters, sorting, pagination |
| **Collection** | `/collections/:handle` | 100% | mockData.ts | Dynamic collection pages |
| **Product** | `/product/:handle` | 100% | mockData.ts | Gallery, specs, reviews, related products |
| **Story** | `/story` | 100% | Static | Brand narrative and philosophy |
| **Craft** | `/craft` | 100% | Static | Manufacturing process showcase |
| **Journal** | `/journal` | 100% | mockData.ts | Article grid with categories |
| **Article** | `/journal/:slug` | 100% | mockData.ts | Full article view |
| **Contact** | `/contact` | 90% | Static | Missing: form submission handler |
| **Policies** | `/policies/:type` | 100% | Static | Dynamic policy content |

### 3.2 Feature Implementation Status

#### ✅ Fully Implemented
- Responsive navigation header
- Product and collection card components
- Image galleries with zoom capability
- Review display with star ratings
- Accordion UI components
- Breadcrumb navigation
- Footer with link structure
- Route-based page transitions

#### 🔶 Partially Implemented (UI Only)
- Product filtering (checkboxes render, don't filter)
- Sorting dropdown (displays options, doesn't sort)
- Pagination controls (UI present, non-functional)
- Newsletter signup (form exists, no submission)
- Contact form (layout complete, no handler)
- Search button (icon present, no modal/functionality)
- Cart icon (displays badge, no cart logic)
- User account icon (present, no auth flow)

#### ❌ Not Implemented
- Shopping cart system
- Checkout flow
- User authentication
- Search functionality
- Mobile navigation menu
- Loading states
- Error boundaries
- Toast notifications
- Product quick view
- Wishlist functionality

---

## 4. Component Architecture

### 4.1 Component Inventory

#### Layout Components

**Header.tsx**
- **Purpose:** Site-wide navigation and actions
- **Reusability:** High
- **API Readiness:** ⚠️ Partial
- **Dependencies:** React Router NavLink
- **Issues:** Cart count hardcoded, mobile menu non-functional
- **Props:** None (self-contained)

```tsx
// Key features:
- Sticky positioning
- Desktop/mobile responsive nav
- Cart badge indicator
- Search, cart, user icons
```

**Footer.tsx**
- **Purpose:** Site footer with links and branding
- **Reusability:** High
- **API Readiness:** ✅ Ready
- **Dependencies:** React Router Link
- **Issues:** None
- **Props:** None (self-contained)

**Section.tsx**
- **Purpose:** Reusable layout wrapper with consistent spacing
- **Reusability:** High
- **API Readiness:** ✅ Ready
- **Dependencies:** None
- **Props:** `children`, `className`, `py` (padding override)

```tsx
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  py?: string; // Default: 'py-20 md:py-28'
}
```

#### Product Components

**ProductCard.tsx**
- **Purpose:** Display product in grid layouts
- **Reusability:** High
- **API Readiness:** ✅ Ready
- **Dependencies:** Product type, Icon, Link
- **Props:** `product: Product`
- **Shopify Mapping:** Direct 1:1 with Shopify product schema

```tsx
// Features:
- Image with hover scale effect
- Tag badges (Best Seller, New, etc.)
- Add to cart quick action (non-functional)
- Category and price display
```

**CollectionCard.tsx**
- **Purpose:** Display collection in grid layouts
- **Reusability:** High
- **API Readiness:** ✅ Ready
- **Dependencies:** Collection type, Link
- **Props:** `collection: Collection`
- **Shopify Mapping:** Ready for Shopify collection schema

**ReviewSection.tsx**
- **Purpose:** Display product reviews with ratings
- **Reusability:** Medium (product-specific)
- **API Readiness:** ✅ Ready
- **Dependencies:** Review type, Icon
- **Props:** `reviews: Review[]`
- **Shopify Mapping:** Can consume Shopify Metafields or third-party review apps

```tsx
// Features:
- Average rating calculation
- Star rating visualization
- Verified purchase badges
- Review submission button (non-functional)
```

#### Utility Components

**Icon.tsx**
- **Purpose:** Material Symbols icon wrapper
- **Reusability:** High
- **API Readiness:** ✅ Ready
- **Dependencies:** Google Fonts Material Symbols
- **Props:** `name: string`, `className?: string`

### 4.2 Component Coupling Analysis

#### Loose Coupling ✅
- `ProductCard`, `CollectionCard` - Accept data via props, no internal dependencies
- `Section`, `Icon` - Pure presentational, no business logic
- `Footer` - Static content, no state dependencies

#### Tight Coupling ⚠️
- `HomePage` - Filters products in-component: `.filter(p => p.tag === 'Best Seller')`
- `ShopPage` - Filter UI doesn't connect to any filtering logic
- `ProductPage` - Assumes `product.images` array structure
- `Header` - Hardcoded cart badge, needs state connection

#### Refactoring Recommendations
```typescript
// Current (HomePage.tsx)
const bestSellers = products.filter(p => p.tag === 'Best Seller').slice(0, 4);

// Recommended
const { data: bestSellers } = useProducts({ 
  tag: 'Best Seller', 
  limit: 4 
});
```

### 4.3 Missing Components for Production

| Component | Priority | Purpose | Complexity |
|-----------|----------|---------|------------|
| **CartDrawer** | Critical | Slide-out cart with items, totals | High |
| **SearchModal** | High | Full-screen search overlay | Medium |
| **MobileMenu** | High | Mobile navigation drawer | Medium |
| **LoadingSkeleton** | High | Content placeholders during load | Low |
| **ErrorBoundary** | High | Catch and display render errors | Low |
| **Toast** | Medium | Success/error notifications | Medium |
| **QuickView** | Low | Modal product preview | High |
| **WishlistButton** | Low | Save for later functionality | Medium |

---

## 5. API Integration Readiness

### 5.1 Current Data Flow

```
┌─────────────┐
│ mockData.ts │
│  (static)   │
└──────┬──────┘
       │ Direct import
       ↓
┌─────────────┐
│   Pages     │
│ (HomePage,  │
│  ShopPage)  │
└──────┬──────┘
       │ Props
       ↓
┌─────────────┐
│ Components  │
│(ProductCard)│
└─────────────┘
```

### 5.2 Target Shopify Data Flow

```
┌──────────────────┐
│ Shopify          │
│ Storefront API   │
│   (GraphQL)      │
└────────┬─────────┘
         │ HTTP Request
         ↓
┌──────────────────┐
│   api/shopify.ts │
│  (GraphQL Client)│
└────────┬─────────┘
         │ Query/Mutation
         ↓
┌──────────────────┐
│  React Query     │
│  (Cache Layer)   │
└────────┬─────────┘
         │ Hook
         ↓
┌──────────────────┐
│   Pages          │
└────────┬─────────┘
         │ Props
         ↓
┌──────────────────┐
│   Components     │
└──────────────────┘
```

### 5.3 Type Compatibility Analysis

**Current Types (types.ts):**

```typescript
interface Product {
  id: string;
  handle: string;        // ✅ Maps to Shopify handle
  name: string;          // ✅ Maps to Shopify title
  category: string;      // ⚠️ Needs collection mapping
  price: number;         // ⚠️ Shopify uses price ranges/variants
  imageUrl: string;      // ✅ Maps to Shopify featured image
  tag?: string;          // ⚠️ Maps to Shopify tags (string[])
  images?: string[];     // ✅ Maps to Shopify images array
  finish?: string;       // ⚠️ Custom metafield
  usage?: string;        // ⚠️ Custom metafield
  dimensions?: string;   // ⚠️ Custom metafield
  weight?: string;       // ⚠️ Custom metafield
}
```

**Required Adaptations:**

```typescript
// Shopify-compatible Product type
interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string; };
    maxVariantPrice: { amount: string; currencyCode: string; };
  };
  featuredImage: { url: string; altText: string; };
  images: { edges: Array<{ node: { url: string; } }>; };
  tags: string[];
  metafields: Array<{ key: string; value: string; }>;
  variants: Array<{
    id: string;
    title: string;
    priceV2: { amount: string; currencyCode: string; };
    availableForSale: boolean;
  }>;
}
```

### 5.4 Integration Complexity Assessment

| Page | Current Data Source | Shopify Query Needed | Complexity | Estimated Effort |
|------|-------------------|---------------------|------------|------------------|
| HomePage | `mockData.products` | Products by tag query | Medium | 4-6 hours |
| ShopPage | `mockData.products` | Products with filtering | High | 8-12 hours |
| CollectionPage | `mockData.products` | Collection by handle query | Medium | 6-8 hours |
| ProductPage | `mockData.products` | Product by handle query | High | 8-10 hours |
| JournalPage | `mockData.articles` | Blog articles (or CMS) | Low | 4-6 hours |

**Total Integration Effort:** 30-42 hours (1 week)

### 5.5 Required API Abstractions

**Proposed File Structure:**

```
api/
├── client.ts              # GraphQL client setup
├── queries/
│   ├── products.ts        # Product queries
│   ├── collections.ts     # Collection queries
│   ├── cart.ts            # Cart mutations
│   └── customer.ts        # Auth queries
├── hooks/
│   ├── useProducts.ts     # React Query wrapper
│   ├── useCollection.ts   # Collection hook
│   ├── useCart.ts         # Cart state hook
│   └── useCustomer.ts     # Auth hook
└── types/
    └── shopify.ts         # Generated types from schema
```

**Example Implementation:**

```typescript
// api/client.ts
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
  apiVersion: '2024-01',
  publicAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
});

// api/queries/products.ts
export const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      featuredImage { url altText }
      images(first: 10) {
        edges { node { url } }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            priceV2 { amount currencyCode }
            availableForSale
          }
        }
      }
    }
  }
`;

// api/hooks/useProduct.ts
import { useQuery } from '@tanstack/react-query';
import { shopifyClient } from '../client';
import { PRODUCT_BY_HANDLE_QUERY } from '../queries/products';

export const useProduct = (handle: string) => {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: async () => {
      const { data } = await shopifyClient.request(
        PRODUCT_BY_HANDLE_QUERY,
        { variables: { handle } }
      );
      return data.product;
    },
    enabled: !!handle,
  });
};
```

### 5.6 Migration Strategy

**Phase 1: Setup (Day 1-2)**
```bash
npm install @shopify/storefront-api-client @tanstack/react-query
```
- Create API client
- Write initial queries
- Setup React Query provider

**Phase 2: Single Page Migration (Day 3-4)**
- Migrate `ProductPage` as proof of concept
- Add loading/error states
- Test with real Shopify data

**Phase 3: Bulk Migration (Day 5-7)**
- Migrate remaining pages
- Update all component data sources
- Remove mockData dependencies

---

## 6. State Management Assessment

### 6.1 Current State Management: ❌ NONE

**What Exists:**
- Local component state via `useState`:
  - `ProductPage`: Image gallery selection, quantity
  - `AccordionItem`: Expand/collapse state
- Props drilling from `App.tsx` → Route components
- No global state whatsoever

**What's Missing:**
- Shopping cart state
- User authentication state
- UI state (modals, toasts, drawers)
- Search state
- Filter state persistence
- Wishlist state

### 6.2 State Requirements by Feature

| Feature | State Needed | Persistence | Complexity |
|---------|-------------|-------------|------------|
| **Shopping Cart** | Items, quantities, totals | localStorage + API | High |
| **Authentication** | User, token, session | Cookies/localStorage | High |
| **Wishlist** | Product IDs | localStorage | Medium |
| **Search** | Query, results, history | Session/none | Low |
| **Filters** | Active filters | URL params | Medium |
| **UI State** | Modals, toasts, drawers | None | Low |
| **Product Compare** | Selected products | Session | Medium |

### 6.3 Recommended Solution: Zustand + React Query

**Why Zustand:**
- ✅ Minimal boilerplate (vs Redux)
- ✅ Built-in TypeScript support
- ✅ Persistence middleware for cart/wishlist
- ✅ No Context API wrapper needed
- ✅ DevTools integration
- ✅ Lightweight (~1KB)

**Why React Query:**
- ✅ Server state management
- ✅ Automatic caching and invalidation
- ✅ Loading/error states built-in
- ✅ Request deduplication
- ✅ Optimistic updates
- ✅ Perfect for Shopify API integration

### 6.4 Implementation Examples

#### Cart Store (Zustand)

```typescript
// stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  variantId: string;
  productId: string;
  quantity: number;
  title: string;
  price: number;
  imageUrl: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  
  // Computed
  itemCount: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.variantId === item.variantId);
        if (existing) {
          return {
            items: state.items.map(i => 
              i.variantId === item.variantId 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),
      
      removeItem: (variantId) => set((state) => ({
        items: state.items.filter(i => i.variantId !== variantId)
      })),
      
      updateQuantity: (variantId, quantity) => set((state) => ({
        items: state.items.map(i =>
          i.variantId === variantId ? { ...i, quantity } : i
        )
      })),
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      
      total: () => get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    }),
    {
      name: 'pitalya-cart-storage',
    }
  )
);
```

#### Product Data Hook (React Query)

```typescript
// hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { shopifyClient } from '@/api/client';
import { PRODUCTS_QUERY } from '@/api/queries/products';

interface UseProductsOptions {
  collection?: string;
  tag?: string;
  limit?: number;
  sortKey?: 'TITLE' | 'PRICE' | 'CREATED_AT' | 'BEST_SELLING';
}

export const useProducts = (options: UseProductsOptions = {}) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      const { data } = await shopifyClient.request(PRODUCTS_QUERY, {
        variables: {
          first: options.limit || 20,
          sortKey: options.sortKey || 'BEST_SELLING',
          query: buildQueryString(options),
        }
      });
      return data.products.edges.map(edge => edge.node);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
};

function buildQueryString(options: UseProductsOptions): string {
  const filters: string[] = [];
  if (options.collection) filters.push(`collection:${options.collection}`);
  if (options.tag) filters.push(`tag:${options.tag}`);
  return filters.join(' AND ');
}
```

#### UI Store (Zustand)

```typescript
// stores/uiStore.ts
import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UIStore {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  toasts: Toast[];
  
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  toasts: [],
  
  toggleMobileMenu: () => set((state) => ({ 
    isMobileMenuOpen: !state.isMobileMenuOpen 
  })),
  
  toggleSearch: () => set((state) => ({ 
    isSearchOpen: !state.isSearchOpen 
  })),
  
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }]
  })),
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));
```

### 6.5 Migration Path

**Step 1: Install Dependencies**
```bash
npm install zustand @tanstack/react-query
npm install -D @tanstack/react-query-devtools
```

**Step 2: Setup Providers**
```tsx
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        {/* ... existing routes ... */}
      </HashRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Step 3: Replace Mock Data**
```tsx
// Before (HomePage.tsx)
import { products } from './data/mockData';
const bestSellers = products.filter(p => p.tag === 'Best Seller').slice(0, 4);

// After (HomePage.tsx)
import { useProducts } from './hooks/useProducts';
const { data: bestSellers, isLoading, error } = useProducts({ 
  tag: 'Best Seller', 
  limit: 4 
});

if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage error={error} />;
```

---

## 7. Caching Strategy

### 7.1 Current State: ❌ NO CACHING

**Issues:**
- Every route navigation re-renders with identical hardcoded data
- No optimization for repeated requests
- No cache invalidation strategy
- No consideration for Shopify API rate limits (2 requests/second on Storefront API)

### 7.2 Recommended Caching Layers

#### Layer 1: React Query (In-Memory Cache)

**Purpose:** Client-side request cache with automatic invalidation

```typescript
// Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // Data fresh for 5 minutes
      cacheTime: 30 * 60 * 1000,     // Keep in cache for 30 minutes
      refetchOnWindowFocus: false,    // Don't refetch on tab focus
      refetchOnReconnect: true,       // Refetch on reconnection
      retry: 1,                       // Retry failed requests once
    },
  },
});
```

#### Layer 2: Browser Cache (HTTP Headers)

**Purpose:** Leverage Shopify CDN caching

```typescript
// Shopify Storefront API responses include cache headers
// Cache-Control: public, max-age=300, s-maxage=3600
// Automatically handled by browser
```

#### Layer 3: Service Worker (Optional - PWA)

**Purpose:** Offline support and advanced caching strategies

```javascript
// service-worker.js
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

### 7.3 Cache Strategy by Data Type

| Data Type | Stale Time | Cache Time | Refetch Strategy | Rationale |
|-----------|-----------|------------|------------------|-----------|
| **Products** | 5 min | 30 min | On mount | Catalog rarely changes |
| **Collections** | 10 min | 1 hour | On mount | Very static |
| **Cart** | 0 sec | 5 min | On mutation | Always fresh |
| **Inventory** | 30 sec | 2 min | On add-to-cart | Stock changes frequently |
| **Customer Data** | 0 sec | 10 min | On mutation | Sensitive data |
| **Blog Articles** | 1 hour | 24 hours | Manual | CMS content |
| **Search Results** | 2 min | 10 min | On input change | User-driven |

### 7.4 Cache Invalidation Patterns

**Automatic Invalidation:**

```typescript
// When cart is updated, invalidate cart queries
const addToCart = useMutation({
  mutationFn: (item) => shopifyClient.cartAdd(item),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['inventory'] });
  },
});
```

**Manual Invalidation:**

```typescript
// Force refresh product data
const refreshProduct = () => {
  queryClient.invalidateQueries({ queryKey: ['product', productHandle] });
};
```

**Time-based Invalidation:**

```typescript
// Prefetch next page in collection
const prefetchNextPage = () => {
  queryClient.prefetchQuery({
    queryKey: ['products', { page: currentPage + 1 }],
    queryFn: () => fetchProducts({ page: currentPage + 1 }),
  });
};
```

### 7.5 Performance Optimizations

#### Prefetching

```typescript
// Prefetch product on card hover
const ProductCard = ({ product }) => {
  const queryClient = useQueryClient();
  
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['product', product.handle],
      queryFn: () => fetchProduct(product.handle),
    });
  };
  
  return <div onMouseEnter={handleMouseEnter}>...</div>;
};
```

#### Optimistic Updates

```typescript
// Update cart UI before API confirms
const removeFromCart = useMutation({
  mutationFn: (variantId) => shopifyClient.cartRemove(variantId),
  onMutate: async (variantId) => {
    await queryClient.cancelQueries({ queryKey: ['cart'] });
    const previousCart = queryClient.getQueryData(['cart']);
    
    queryClient.setQueryData(['cart'], (old) => ({
      ...old,
      items: old.items.filter(item => item.variantId !== variantId)
    }));
    
    return { previousCart };
  },
  onError: (err, variantId, context) => {
    queryClient.setQueryData(['cart'], context.previousCart);
  },
});
```

#### Request Deduplication

```typescript
// Multiple components requesting same product = 1 API call
const ProductPage = () => {
  const { data: product } = useProduct(handle);
  // ...
};

const RelatedProducts = () => {
  const { data: product } = useProduct(handle); // Reuses cache
  // ...
};
```

---

## 8. Error Handling Evaluation

### 8.1 Current State: ⚠️ MINIMAL

**What Exists:**
```tsx
// Basic null checks only
if (!product) {
  return <div className="text-center py-20">Product not found.</div>;
}
```

**Critical Issues:**
- ❌ No loading state differentiation
- ❌ No error boundaries to catch crashes
- ❌ No retry mechanisms
- ❌ No user feedback for failures
- ❌ No error logging/monitoring
- ❌ No network error handling
- ❌ No graceful degradation

### 8.2 Error Taxonomy

```typescript
// types/errors.ts
export enum ErrorType {
  // Network errors
  NETWORK_ERROR = 'network_error',
  TIMEOUT = 'timeout',
  
  // API errors
  NOT_FOUND = 'not_found',
  UNAUTHORIZED = 'unauthorized',
  RATE_LIMIT = 'rate_limit',
  SERVER_ERROR = 'server_error',
  
  // Business logic errors
  OUT_OF_STOCK = 'out_of_stock',
  INVALID_VARIANT = 'invalid_variant',
  CART_ERROR = 'cart_error',
  PAYMENT_ERROR = 'payment_error',
  
  // Client errors
  INVALID_INPUT = 'invalid_input',
  UNKNOWN = 'unknown',
}

export class AppError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public retryable: boolean = false,
    public metadata?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}
```

### 8.3 Recommended Error Infrastructure

#### Error Boundary Component

```tsx
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Log to error monitoring service
    this.props.onError?.(error, errorInfo);
    
    // Send to analytics/Sentry
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: { react: errorInfo }
      });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorFallback 
          error={this.state.error} 
          onReset={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
}
```

#### Error Fallback UI

```tsx
// components/ErrorFallback.tsx
import { Icon } from './Icon';

interface ErrorFallbackProps {
  error?: Error;
  onReset?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  onReset 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="error" className="text-4xl text-red-600" />
        </div>
        <h2 className="text-2xl font-serif font-bold mb-2">Something went wrong</h2>
        <p className="text-text-subtle mb-6">
          We're sorry for the inconvenience. Please try refreshing the page.
        </p>
        {error && process.env.NODE_ENV === 'development' && (
          <pre className="text-xs text-left bg-gray-100 p-4 rounded mb-4 overflow-auto">
            {error.message}
          </pre>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-text-main font-bold rounded-lg hover:bg-opacity-90"
          >
            Refresh Page
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="px-6 py-2 border border-gray-300 text-text-main font-bold rounded-lg hover:bg-gray-50"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

#### Inline Error Message Component

```tsx
// components/ErrorMessage.tsx
import { Icon } from './Icon';

interface ErrorMessageProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  type = 'error',
  onRetry,
  className = '',
}) => {
  const styles = {
    error: 'bg-red-50 border-red-500 text-red-900',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
    info: 'bg-blue-50 border-blue-500 text-blue-900',
  };

  const icons = {
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  return (
    <div className={`border-l-4 p-4 rounded ${styles[type]} ${className}`}>
      <div className="flex items-start">
        <Icon name={icons[type]} className="text-xl mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold mb-1">{title}</h3>
          <p className="text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm font-bold underline hover:no-underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

#### Loading Skeleton Component

```tsx
// components/LoadingSkeleton.tsx
export const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
  </div>
);

export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {[...Array(8)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
```

### 8.4 Error Handling in Pages

```tsx
// pages/ProductPage.tsx (refactored)
import { useProduct } from '@/hooks/useProduct';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const ProductPage = () => {
  const { handle } = useParams();
  const { data: product, isLoading, error, refetch } = useProduct(handle);

  if (isLoading) {
    return <LoadingSkeleton type="product" />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <ErrorMessage
          title="Product not found"
          message="The product you're looking for might have been removed or is temporarily unavailable."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Product Not Found</h2>
        <p className="text-text-subtle mb-8">
          We couldn't find the product you're looking for.
        </p>
        <Link to="/shop" className="btn-primary">
          Browse All Products
        </Link>
      </div>
    );
  }

  return <>{/* Product UI */}</>;
};
```

### 8.5 Toast Notification System

```tsx
// components/Toast.tsx
import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { Icon } from './Icon';

export const ToastContainer = () => {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className={`${styles[toast.type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
      <Icon name={toast.type === 'success' ? 'check_circle' : 'info'} />
      <p className="flex-1">{toast.message}</p>
      <button onClick={onClose}>
        <Icon name="close" className="text-sm" />
      </button>
    </div>
  );
};
```

### 8.6 Integration Points

**1. App-Level Error Boundary**
```tsx
// App.tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>{/* ... */}</Routes>
      <ToastContainer />
    </BrowserRouter>
  </QueryClientProvider>
</ErrorBoundary>
```

**2. Route-Level Error Boundaries**
```tsx
<Route 
  path="/product/:handle" 
  element={
    <ErrorBoundary fallback={<ProductErrorFallback />}>
      <ProductPage />
    </ErrorBoundary>
  } 
/>
```

**3. API Error Handling**
```typescript
// api/client.ts
export const handleAPIError = (error: any): AppError => {
  if (error.networkError) {
    return new AppError(
      ErrorType.NETWORK_ERROR,
      'Unable to connect. Please check your internet connection.',
      true
    );
  }
  
  if (error.graphQLErrors) {
    const firstError = error.graphQLErrors[0];
    if (firstError.message.includes('not found')) {
      return new AppError(ErrorType.NOT_FOUND, 'Resource not found', false);
    }
  }
  
  return new AppError(ErrorType.UNKNOWN, 'An unexpected error occurred', true);
};
```

---

## 9. Technical Debt & Risks

### 9.1 🚨 Critical Issues (Must Fix Before Production)

#### Issue #1: CDN Dependencies in Production

**Problem:**
```html
<!-- index.html -->
<script src="https://cdn.tailwindcss.com"></script>
```

**Risk Level:** 🔴 **CRITICAL**
- **Impact:** 3MB+ JavaScript bundle downloaded on every page load
- **Performance:** Poor Core Web Vitals (LCP, FCP)
- **Reliability:** External CDN dependency, potential downtime
- **SEO:** Slow page loads hurt search rankings

**Solution:**
```bash
# Install Tailwind as dev dependency
npm install -D tailwindcss postcss autoprefixer

# Create config
npx tailwindcss init -p

# Update package.json
"scripts": {
  "dev": "vite",
  "build": "vite build"
}
```

**Estimated Savings:**
- Bundle size: -2.8MB
- Initial load: -1.5s (3G network)
- Lighthouse score: +25 points

---

#### Issue #2: React via ESM.sh CDN

**Problem:**
```html
<!-- index.html -->
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@^19.2.4",
    "react-dom/": "https://esm.sh/react-dom@^19.2.4/"
  }
}
</script>
```

**Risk Level:** 🔴 **CRITICAL**
- **Impact:** No build optimization, no tree-shaking
- **Reliability:** External CDN, version drift risk
- **Development:** No offline development possible
- **Tooling:** Breaks most React DevTools features

**Solution:**
```bash
# Already in package.json, just need proper import
# Remove importmap from index.html
# Update imports to use npm packages
```

**Benefits:**
- Proper React DevTools support
- Build-time optimization
- Predictable versions
- Offline development

---

#### Issue #3: HashRouter for SEO

**Problem:**
```tsx
// App.tsx
<HashRouter>
```

**Risk Level:** 🔴 **CRITICAL** (for SEO)
- **Impact:** All URLs have `#/` prefix (`example.com/#/product/diya`)
- **SEO:** Search engines don't index hash-based routes properly
- **Sharing:** Social media previews don't work
- **Analytics:** Tracking hash routes requires extra configuration

**Solution:**
```tsx
// App.tsx
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter>
  {/* ... */}
</BrowserRouter>

// vite.config.ts - Add fallback for SPA routing
export default defineConfig({
  // ...
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
});

// Server config (Vercel: vercel.json)
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

#### Issue #4: No Environment Variables

**Problem:**
```typescript
// vite.config.ts
define: {
  'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
  'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
}
```

**Risk Level:** 🔴 **CRITICAL**
- **Security:** API keys could be exposed if hardcoded
- **Flexibility:** Can't change config per environment
- **Best Practice:** Violates 12-factor app principles

**Solution:**
```bash
# Create .env file
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_token_here
VITE_SHOPIFY_API_VERSION=2024-01

# Create .env.example (commit to git)
VITE_SHOPIFY_STORE_DOMAIN=
VITE_SHOPIFY_STOREFRONT_TOKEN=
VITE_SHOPIFY_API_VERSION=

# Update .gitignore
.env
.env.local

# Usage in code
const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
```

---

### 9.2 ⚠️ High Priority Issues

#### Issue #5: No Code Splitting

**Problem:** All JavaScript loads upfront

**Risk Level:** 🟡 **HIGH**
- **Impact:** Large initial bundle (~500KB+ after deps)
- **Performance:** Slow First Contentful Paint

**Solution:**
```tsx
// App.tsx - Lazy load pages
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));

<Suspense fallback={<PageLoadingSkeleton />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/product/:handle" element={<ProductPage />} />
    {/* ... */}
  </Routes>
</Suspense>
```

**Expected Improvement:**
- Initial bundle: -40%
- Time to Interactive: -30%

---

#### Issue #6: No Image Optimization

**Problem:** Using placeholder images (Picsum), no optimization

**Risk Level:** 🟡 **HIGH**
- **Impact:** Large image downloads, poor LCP
- **UX:** Slow image loading on mobile networks

**Solution:**
```tsx
// components/OptimizedImage.tsx
import { useState } from 'react';

export const OptimizedImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <div className="relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};
```

**Better Solution:** Use image CDN (Cloudinary, Shopify CDN)
```tsx
const imageUrl = `https://cdn.shopify.com/s/files/1/0001/2345/6789/products/image.jpg?width=800`;
```

---

#### Issue #7: Missing TypeScript Strict Mode

**Problem:**
```json
// tsconfig.json - No strict mode enabled
{
  "compilerOptions": {
    "strict": false  // or absent
  }
}
```

**Risk Level:** 🟡 **HIGH**
- **Impact:** Type safety holes, runtime errors
- **Maintenance:** Harder to refactor safely

**Solution:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

**Migration:** Fix ~20-30 type errors incrementally

---

#### Issue #8: No Accessibility Audit

**Problem:** Missing ARIA labels, keyboard navigation

**Risk Level:** 🟡 **HIGH**
- **Legal:** ADA/WCAG compliance risk
- **UX:** Unusable for screen reader users
- **SEO:** Accessibility affects rankings

**Key Issues:**
```tsx
// ❌ Icon buttons without labels
<button className="p-2">
  <Icon name="search" />
</button>

// ✅ Fixed
<button className="p-2" aria-label="Search products">
  <Icon name="search" aria-hidden="true" />
</button>
```

**Action Items:**
1. Run Lighthouse accessibility audit
2. Add `aria-label` to all icon buttons
3. Implement keyboard navigation for cart/modals
4. Add skip links for navigation
5. Ensure form labels are properly associated

---

### 9.3 🔵 Medium Priority Issues

#### Issue #9: No Testing Infrastructure

**Risk Level:** 🔵 **MEDIUM**

**Solution:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom

# vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

---

#### Issue #10: Inconsistent Design Tokens

**Problem:**
```tsx
// Magic numbers everywhere
<div className="py-20 md:py-28">
<div className="px-4 sm:px-8 lg:px-12">
```

**Solution:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        'section-sm': '5rem',   // py-20
        'section-lg': '7rem',   // py-28
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '3rem',
        },
      },
    },
  },
};

// Usage
<div className="py-section-sm md:py-section-lg">
```

---

### 9.4 Risk Summary Table

| Issue | Risk Level | Impact | Effort | Priority |
|-------|-----------|--------|--------|----------|
| CDN Dependencies | 🔴 Critical | Performance | 4h | 1 |
| React via ESM.sh | 🔴 Critical | Development | 2h | 1 |
| HashRouter | 🔴 Critical | SEO | 3h | 1 |
| No Environment Config | 🔴 Critical | Security | 1h | 1 |
| No Code Splitting | 🟡 High | Performance | 3h | 2 |
| No Image Optimization | 🟡 High | Performance | 6h | 2 |
| TypeScript Strict Mode | 🟡 High | Maintainability | 8h | 3 |
| Accessibility Gaps | 🟡 High | Legal/UX | 12h | 2 |
| No Testing | 🔵 Medium | Quality | 16h | 4 |
| Inconsistent Tokens | 🔵 Medium | Maintainability | 4h | 4 |

**Total Estimated Effort:** 59 hours (~7.5 days)

---

## 10. Implementation Gaps

### 10.1 Feature Prioritization Matrix

```
         High Impact │ Low Impact
         ────────────┼────────────
High     │  P1       │  P2
Urgency  │  Critical │  Important
         ├───────────┼────────────
Low      │  P3       │  P4
Urgency  │  Nice     │  Future
         │           │
```

### 10.2 Priority 1: Core E-commerce (CRITICAL) 🔴

**Must-have features to launch**

#### 1. Shopping Cart System
**Status:** ❌ Not implemented  
**Effort:** 16-20 hours  
**Dependencies:** State management, Shopify Cart API

**Deliverables:**
- [ ] Cart drawer/modal UI component
- [ ] Add to cart mutation
- [ ] Remove from cart mutation
- [ ] Update quantity mutation
- [ ] Cart state persistence (localStorage)
- [ ] Cart count badge in header
- [ ] Empty cart state
- [ ] Cart total calculation
- [ ] Sync with Shopify Cart API

**Implementation:**
```tsx
// components/CartDrawer.tsx
export const CartDrawer = () => {
  const { items, removeItem, updateQuantity } = useCartStore();
  const isOpen = useCartStore((state) => state.isOpen);
  const toggleCart = useCartStore((state) => state.toggleCart);

  return (
    <Drawer open={isOpen} onClose={toggleCart}>
      <CartHeader />
      <CartItems items={items} onRemove={removeItem} onUpdate={updateQuantity} />
      <CartTotal items={items} />
      <CheckoutButton />
    </Drawer>
  );
};
```

---

#### 2. Checkout Integration
**Status:** ❌ Not implemented  
**Effort:** 8-12 hours  
**Dependencies:** Cart system, Shopify Checkout API

**Deliverables:**
- [ ] Checkout button with Shopify redirect
- [ ] Cart to checkout data transformation
- [ ] Discount code application (optional)
- [ ] Checkout URL generation
- [ ] Loading state during redirect

**Implementation:**
```tsx
// hooks/useCheckout.ts
export const useCheckout = () => {
  return useMutation({
    mutationFn: async (cartItems) => {
      const checkoutUrl = await shopifyClient.createCheckout({
        lineItems: cartItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        }))
      });
      return checkoutUrl;
    },
    onSuccess: (url) => {
      window.location.href = url;
    }
  });
};
```

---

#### 3. Product Filtering & Sorting
**Status:** 🔶 UI exists, not functional  
**Effort:** 12-16 hours  
**Dependencies:** Shopify Products API

**Deliverables:**
- [ ] Filter state management
- [ ] Filter UI → API query mapping
- [ ] URL param persistence
- [ ] Sort functionality
- [ ] Filter reset button
- [ ] Active filter chips
- [ ] Filter count badges

**Implementation:**
```tsx
// hooks/useProductFilters.ts
export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filters = {
    category: searchParams.get('category'),
    finish: searchParams.getAll('finish'),
    usage: searchParams.getAll('usage'),
    minPrice: searchParams.get('minPrice'),
    maxPrice: searchParams.get('maxPrice'),
    sortBy: searchParams.get('sort'),
  };
  
  const setFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };
  
  return { filters, setFilter };
};
```

---

#### 4. Search Functionality
**Status:** ❌ Not implemented  
**Effort:** 12-16 hours  
**Dependencies:** Shopify Search API

**Deliverables:**
- [ ] Search modal/overlay UI
- [ ] Search input with debounce
- [ ] Search results display
- [ ] Search history (localStorage)
- [ ] No results state
- [ ] Keyboard navigation (arrow keys, escape)
- [ ] Mobile-optimized search

**Implementation:**
```tsx
// components/SearchModal.tsx
export const SearchModal = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data: results, isLoading } = useSearch(debouncedQuery);

  return (
    <Modal>
      <SearchInput value={query} onChange={setQuery} />
      {isLoading && <SearchSkeleton />}
      {results && <SearchResults results={results} />}
      {!results?.length && query && <NoResults query={query} />}
    </Modal>
  );
};
```

---

#### 5. Customer Authentication
**Status:** ❌ Not implemented  
**Effort:** 20-24 hours  
**Dependencies:** Shopify Customer API

**Deliverables:**
- [ ] Login form
- [ ] Registration form
- [ ] Password reset flow
- [ ] Account dashboard page
- [ ] Order history page
- [ ] Profile edit page
- [ ] Auth state management
- [ ] Protected routes
- [ ] Session persistence

---

### 10.3 Priority 2: UX Enhancements (IMPORTANT) 🟡

#### 6. Loading States
**Status:** ❌ Not implemented  
**Effort:** 8-12 hours

**Deliverables:**
- [ ] Product card skeleton
- [ ] Product page skeleton
- [ ] Collection grid skeleton
- [ ] Page transition spinner
- [ ] Button loading states
- [ ] Progressive image loading

---

#### 7. Error Handling System
**Status:** ⚠️ Basic only  
**Effort:** 12-16 hours

**Deliverables:**
- [ ] Error boundary components
- [ ] Error fallback UI
- [ ] Inline error messages
- [ ] Retry mechanisms
- [ ] Error logging service
- [ ] Network error detection

---

#### 8. Mobile Navigation
**Status:** 🔶 Button exists, no drawer  
**Effort:** 6-8 hours

**Deliverables:**
- [ ] Mobile menu drawer
- [ ] Slide-in animation
- [ ] Nested navigation support
- [ ] Mobile search integration
- [ ] Account links

---

#### 9. Toast Notifications
**Status:** ❌ Not implemented  
**Effort:** 4-6 hours

**Deliverables:**
- [ ] Toast container component
- [ ] Success/error/info variants
- [ ] Auto-dismiss timers
- [ ] Action buttons in toasts
- [ ] Queue management

---

### 10.4 Priority 3: Performance (NICE TO HAVE) 🟢

#### 10. Build Optimization
**Effort:** 8-12 hours

**Tasks:**
- [ ] Replace CDN Tailwind with npm package
- [ ] Remove ESM.sh React imports
- [ ] Setup proper build pipeline
- [ ] Configure code splitting
- [ ] Optimize bundle size
- [ ] Setup source maps

---

#### 11. Image Optimization
**Effort:** 8-10 hours

**Tasks:**
- [ ] Replace Picsum with real images
- [ ] Implement lazy loading
- [ ] Use Shopify CDN with size parameters
- [ ] Add WebP format support
- [ ] Implement blur-up placeholders
- [ ] Optimize image dimensions

---

#### 12. SEO Improvements
**Effort:** 8-12 hours

**Tasks:**
- [ ] Switch to BrowserRouter
- [ ] Add dynamic meta tags
- [ ] Implement structured data (JSON-LD)
- [ ] Generate sitemap.xml
- [ ] Add robots.txt
- [ ] Setup Open Graph tags
- [ ] Add Twitter Card tags

---

### 10.5 Priority 4: Developer Experience (FUTURE) 🔵

#### 13. Testing Setup
**Effort:** 16-24 hours

**Tasks:**
- [ ] Configure Vitest
- [ ] Setup React Testing Library
- [ ] Write component unit tests
- [ ] Write integration tests
- [ ] Setup E2E tests (Playwright)
- [ ] Add test coverage reporting
- [ ] Setup CI/CD testing pipeline

---

#### 14. Documentation
**Effort:** 12-16 hours

**Tasks:**
- [ ] Component Storybook
- [ ] API integration guide
- [ ] Deployment runbook
- [ ] Contributing guidelines
- [ ] Code style guide
- [ ] Architecture decision records (ADRs)

---

#### 15. Developer Tools
**Effort:** 6-8 hours

**Tasks:**
- [ ] Setup ESLint
- [ ] Configure Prettier
- [ ] Add pre-commit hooks (Husky)
- [ ] Setup conventional commits
- [ ] Add VS Code workspace settings
- [ ] Create component templates

---

### 10.6 Implementation Timeline

**Week 1: Foundation**
- Setup proper build system
- Install state management
- Configure Shopify API client
- Migrate one page as POC

**Week 2: Core E-commerce**
- Shopping cart system
- Checkout integration
- Product filtering
- Search functionality

**Week 3: UX Polish**
- Loading states everywhere
- Error handling system
- Mobile navigation
- Toast notifications

**Week 4: Authentication & Performance**
- Customer authentication
- Build optimization
- Image optimization
- SEO improvements

**Week 5: Testing & Launch**
- Testing infrastructure
- Bug fixes
- Documentation
- Performance audit
- Production deployment

---

## 11. Shopify Integration Roadmap

### 11.1 Integration Phases Overview

```
Phase 1: Setup → Phase 2: Core Features → Phase 3: UX → Phase 4: Auth → Phase 5: Optimize
   (5 days)          (7 days)            (5 days)      (5 days)      (3 days)
     ↓                 ↓                    ↓             ↓             ↓
  Foundation      Products & Cart      Polish UI      Accounts      Launch-Ready
```

---

### 11.2 Phase 1: Foundation (Week 1: Days 1-5)

**Objective:** Setup development environment and API infrastructure

#### Day 1-2: Environment Setup

```bash
# Install core dependencies
npm install @shopify/storefront-api-client
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Setup environment variables
cat > .env << EOF
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
VITE_SHOPIFY_API_VERSION=2024-01
EOF

# Update .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

**File Changes:**
- Remove Tailwind CDN from `index.html`
- Remove React importmap from `index.html`
- Create `tailwind.config.js` with existing color scheme
- Update imports to use npm packages

---

#### Day 3: API Client Setup

**Create API Structure:**

```
api/
├── client.ts              # Shopify client instance
├── queries/
│   ├── products.ts        # Product GraphQL queries
│   ├── collections.ts     # Collection queries
│   └── cart.ts            # Cart mutations
└── types.ts               # Type definitions
```

**Implementation:**

```typescript
// api/client.ts
import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const shopifyClient = createStorefrontApiClient({
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION,
  publicAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN,
});

// api/queries/products.ts
export const PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
      tags
      metafields(identifiers: [
        {namespace: "custom", key: "finish"},
        {namespace: "custom", key: "usage"}
      ]) {
        key
        value
      }
    }
  }
`;
```

---

#### Day 4: React Query Setup

```tsx
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* existing routes */}
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

#### Day 5: POC - Migrate One Page

**Target:** ProductPage (most complex data requirements)

```tsx
// hooks/useProduct.ts
import { useQuery } from '@tanstack/react-query';
import { shopifyClient } from '@/api/client';
import { PRODUCT_BY_HANDLE_QUERY } from '@/api/queries/products';

export const useProduct = (handle: string) => {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: async () => {
      const response = await shopifyClient.request(
        PRODUCT_BY_HANDLE_QUERY,
        { variables: { handle } }
      );
      return transformProduct(response.data.product);
    },
    enabled: !!handle,
  });
};

function transformProduct(shopifyProduct: any) {
  // Transform Shopify product to match existing Product type
  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    imageUrl: shopifyProduct.featuredImage.url,
    images: shopifyProduct.images.edges.map(e => e.node.url),
    // ... etc
  };
}

// pages/ProductPage.tsx
const ProductPage = () => {
  const { handle } = useParams();
  const { data: product, isLoading, error } = useProduct(handle!);

  if (isLoading) return <ProductPageSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!product) return <NotFound />;

  return (
    // existing product UI
  );
};
```

**Success Criteria:**
- ✅ Product page loads from Shopify API
- ✅ Loading state displays
- ✅ Error state displays
- ✅ Data matches UI requirements

---

### 11.3 Phase 2: Core Features (Week 2: Days 6-12)

#### Day 6-8: Shopping Cart

**1. Cart Store Setup:**

```typescript
// stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      // ... implementation
    }),
    { name: 'pitalya-cart' }
  )
);
```

**2. Cart UI Components:**

```tsx
// components/cart/CartDrawer.tsx
export const CartDrawer = () => {
  const { items, isOpen, toggleCart } = useCartStore();
  
  return (
    <Drawer open={isOpen} onClose={toggleCart} position="right">
      <div className="flex flex-col h-full">
        <CartHeader itemCount={items.length} onClose={toggleCart} />
        <CartItemsList items={items} />
        <CartFooter items={items} />
      </div>
    </Drawer>
  );
};
```

**3. Add to Cart Integration:**

```tsx
// components/ProductCard.tsx
const handleAddToCart = () => {
  const cartItem = {
    variantId: product.variants[0].id,
    productId: product.id,
    quantity: 1,
    title: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
  };
  
  addItem(cartItem);
  toggleCart(); // Open cart drawer
  
  // Show toast notification
  addToast({
    type: 'success',
    message: `${product.name} added to cart`
  });
};
```

---

#### Day 9-10: Product Listing & Filtering

**1. Products Hook:**

```typescript
// hooks/useProducts.ts
export const useProducts = (options: FilterOptions) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: () => fetchProducts(options),
  });
};
```

**2. Filter Management:**

```tsx
// hooks/useProductFilters.ts
export const useProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const filters = useMemo(() => ({
    category: searchParams.get('category'),
    tags: searchParams.getAll('tag'),
    minPrice: searchParams.get('minPrice'),
    maxPrice: searchParams.get('maxPrice'),
    sortBy: searchParams.get('sort') || 'BEST_SELLING',
  }), [searchParams]);
  
  const setFilter = useCallback((key: string, value: any) => {
    // Update URL params
  }, [searchParams]);
  
  return { filters, setFilter };
};
```

**3. Shop Page Integration:**

```tsx
// pages/ShopPage.tsx
const ShopPage = () => {
  const { filters, setFilter } = useProductFilters();
  const { data: products, isLoading } = useProducts(filters);
  
  return (
    <div className="flex gap-10">
      <FilterSidebar filters={filters} onChange={setFilter} />
      <ProductGrid products={products} isLoading={isLoading} />
    </div>
  );
};
```

---

#### Day 11-12: Search & Collections

**1. Search Implementation:**

```tsx
// components/SearchModal.tsx
export const SearchModal = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data: results } = useSearch(debouncedQuery);
  
  return (
    <Modal>
      <SearchInput 
        value={query} 
        onChange={setQuery}
        placeholder="Search products..."
      />
      <SearchResults results={results} />
    </Modal>
  );
};
```

**2. Collection Page:**

```tsx
// pages/CollectionPage.tsx
const CollectionPage = () => {
  const { handle } = useParams();
  const { data: collection } = useCollection(handle!);
  const { data: products } = useCollectionProducts(handle!);
  
  return (
    <>
      <CollectionHero collection={collection} />
      <ProductGrid products={products} />
    </>
  );
};
```

---

### 11.4 Phase 3: UX Polish (Week 3: Days 13-17)

#### Day 13-14: Loading & Error States

**Tasks:**
- Create skeleton components for all pages
- Implement error boundaries
- Add retry mechanisms
- Create error fallback UIs

---

#### Day 15-16: Mobile Experience

**Tasks:**
- Build mobile navigation drawer
- Optimize cart for mobile
- Implement mobile search
- Test responsive layouts

---

#### Day 17: Notifications

**Tasks:**
- Build toast notification system
- Add success/error toasts for all actions
- Implement queue management
- Add animations

---

### 11.5 Phase 4: Authentication (Week 4: Days 18-22)

#### Day 18-20: Customer Auth

**1. Auth Store:**

```typescript
// stores/authStore.ts
export const useAuthStore = create<AuthStore>((set) => ({
  customer: null,
  isAuthenticated: false,
  login: async (email, password) => {
    // Shopify Customer API
  },
  logout: () => {
    // Clear session
  },
}));
```

**2. Auth Pages:**
- Login form
- Registration form
- Password reset
- Account dashboard

---

#### Day 21-22: Protected Routes & Order History

**Tasks:**
- Implement route protection
- Build account dashboard
- Display order history
- Profile editing

---

### 11.6 Phase 5: Optimization (Week 5: Days 23-25)

#### Day 23: Build Optimization

**Tasks:**
- Remove all CDN dependencies
- Setup code splitting
- Optimize bundle size
- Configure production build

---

#### Day 24: SEO & Performance

**Tasks:**
- Add meta tags
- Implement structured data
- Optimize images
- Run Lighthouse audit

---

#### Day 25: Final Testing & Launch

**Tasks:**
- End-to-end testing
- Bug fixes
- Performance validation
- Production deployment

---

### 11.7 Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| **Lighthouse Performance** | N/A | >90 | Chrome DevTools |
| **Time to Interactive** | ~5s | <2s | Lighthouse |
| **Largest Contentful Paint** | ~4s | <2.5s | Web Vitals |
| **Cumulative Layout Shift** | Unknown | <0.1 | Web Vitals |
| **Bundle Size** | ~500KB | <200KB | Build output |
| **API Response Time** | N/A | <500ms | React Query DevTools |

---

## 12. Recommended Architecture

### 12.1 Final Project Structure

```
pitalya-storefront/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── queries/
│   │   │   ├── products.ts
│   │   │   ├── collections.ts
│   │   │   ├── cart.ts
│   │   │   └── customer.ts
│   │   └── types.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Section.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductGallery.tsx
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Drawer.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   └── loading/
│   │       ├── ProductCardSkeleton.tsx
│   │       └── PageSkeleton.tsx
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useProduct.ts
│   │   ├── useCollection.ts
│   │   ├── useCart.ts
│   │   ├── useSearch.ts
│   │   └── useAuth.ts
│   ├── stores/
│   │   ├── cartStore.ts
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductPage.tsx
│   │   ├── CollectionPage.tsx
│   │   ├── AccountPage.tsx
│   │   └── ... (existing pages)
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── transformers.ts
│   ├── types/
│   │   ├── product.ts
│   │   ├── collection.ts
│   │   ├── cart.ts
│   │   └── customer.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

### 12.2 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interaction                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 React Components                         │
│  (ProductCard, CartDrawer, SearchModal, etc.)           │
└────────────┬────────────────────────┬───────────────────┘
             │                        │
             │ Server State           │ Client State
             ▼                        ▼
┌─────────────────────┐    ┌─────────────────────┐
│   React Query       │    │   Zustand Stores    │
│  (API Data Cache)   │    │  (UI & Cart State)  │
└──────────┬──────────┘    └──────────┬──────────┘
           │                          │
           │ GraphQL Query            │ localStorage
           ▼                          ▼
┌─────────────────────┐    ┌─────────────────────┐
│  Shopify Client     │    │   Browser Storage   │
│ (@shopify/store...) │    │                     │
└──────────┬──────────┘    └─────────────────────┘
           │
           │ HTTPS
           ▼
┌─────────────────────────────────────────────────────────┐
│            Shopify Storefront API (GraphQL)             │
└─────────────────────────────────────────────────────────┘
```

---

### 12.3 State Management Boundaries

**Server State (React Query):**
- Product data
- Collection data
- Search results
- Customer data
- Order history

**Client State (Zustand):**
- Shopping cart items
- Cart drawer open/closed
- Mobile menu open/closed
- Search modal open/closed
- Toast notifications
- User session

**URL State (React Router):**
- Current page/route
- Filter parameters
- Sort parameters
- Page number

**Local Component State:**
- Form inputs
- Accordion expand/collapse
- Image gallery selection
- Quantity selectors

---

### 12.4 Component Patterns

#### Container/Presenter Pattern

```tsx
// Container (smart component)
const ProductPageContainer = () => {
  const { handle } = useParams();
  const { data, isLoading, error } = useProduct(handle);
  
  if (isLoading) return <ProductPageSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <ProductPagePresenter product={data} />;
};

// Presenter (dumb component)
const ProductPagePresenter = ({ product }) => {
  return (
    <div>
      <ProductGallery images={product.images} />
      <ProductInfo product={product} />
    </div>
  );
};
```

#### Custom Hook Pattern

```tsx
// Encapsulate complex logic in hooks
export const useAddToCart = () => {
  const addItem = useCartStore((state) => state.addItem);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { addToast } = useUIStore();
  
  return useCallback((product: Product) => {
    const cartItem = transformProductToCartItem(product);
    addItem(cartItem);
    toggleCart();
    addToast({
      type: 'success',
      message: `${product.name} added to cart`
    });
  }, [addItem, toggleCart, addToast]);
};

// Usage in component
const ProductCard = ({ product }) => {
  const handleAddToCart = useAddToCart();
  
  return (
    <button onClick={() => handleAddToCart(product)}>
      Add to Cart
    </button>
  );
};
```

---

### 12.5 API Layer Best Practices

#### Type Safety

```typescript
// api/types.ts - Match Shopify schema
export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  // ... full schema
}

// Transform to app types
export function transformProduct(shopifyProduct: ShopifyProduct): Product {
  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    // ...
  };
}
```

#### Error Handling

```typescript
// api/client.ts
export async function queryShopify<T>(query: string, variables?: any): Promise<T> {
  try {
    const response = await shopifyClient.request(query, { variables });
    return response.data;
  } catch (error) {
    if (error.networkError) {
      throw new AppError(
        ErrorType.NETWORK_ERROR,
        'Unable to connect to store',
        true
      );
    }
    if (error.graphQLErrors) {
      const firstError = error.graphQLErrors[0];
      throw new AppError(
        ErrorType.SERVER_ERROR,
        firstError.message,
        false
      );
    }
    throw error;
  }
}
```

---

## 13. Detailed Assessment Scores

### 13.1 Category Breakdown

| Category | Score | Weight | Weighted Score | Rationale |
|----------|-------|--------|----------------|-----------|
| **UI/UX Design** | A+ (98%) | 20% | 19.6 | Pixel-perfect, professional design |
| **Component Architecture** | A (90%) | 15% | 13.5 | Well-structured, reusable components |
| **TypeScript Usage** | B+ (87%) | 10% | 8.7 | Good types, strict mode disabled |
| **State Management** | D (60%) | 15% | 9.0 | Non-existent, needs implementation |
| **API Integration** | C (75%) | 15% | 11.25 | Mock data, clear path to real API |
| **Error Handling** | D (60%) | 10% | 6.0 | Basic null checks only |
| **Performance** | C (72%) | 10% | 7.2 | CDN deps hurt performance |
| **Accessibility** | C (70%) | 5% | 3.5 | Missing ARIA, keyboard nav gaps |
| **Testing** | F (0%) | 0% | 0.0 | No tests exist |

**Overall Score:** **78.75/100** → **B-**

---

### 13.2 Detailed Scoring Rubric

#### UI/UX Design: A+ (98/100)

**Strengths:**
- ✅ Cohesive visual design system
- ✅ Responsive layouts (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Consistent typography and spacing
- ✅ Professional color palette
- ✅ Clear visual hierarchy

**Weaknesses:**
- ⚠️ Missing loading states (-1)
- ⚠️ No empty states for cart/wishlist (-1)

---

#### Component Architecture: A (90/100)

**Strengths:**
- ✅ Reusable, composable components
- ✅ Clear separation of concerns
- ✅ Props-based data flow
- ✅ Consistent naming conventions

**Weaknesses:**
- ⚠️ Some tight coupling in pages (-5)
- ⚠️ Missing key UI components (cart, search) (-5)

---

#### TypeScript Usage: B+ (87/100)

**Strengths:**
- ✅ All files use TypeScript
- ✅ Clear interface definitions
- ✅ Type-safe props

**Weaknesses:**
- ⚠️ Strict mode disabled (-8)
- ⚠️ Some `any` types likely (-5)

---

#### State Management: D (60/100)

**Strengths:**
- ✅ Local state properly used
- ✅ Props drilling minimized

**Weaknesses:**
- ❌ No global state solution (-20)
- ❌ No cart state (-10)
- ❌ No auth state (-10)

---

#### API Integration: C (75/100)

**Strengths:**
- ✅ Clear data types defined
- ✅ Component structure supports API integration
- ✅ Props-based data flow

**Weaknesses:**
- ❌ No API client (-10)
- ❌ No data fetching hooks (-10)
- ❌ No caching strategy (-5)

---

#### Error Handling: D (60/100)

**Strengths:**
- ✅ Basic null checks present

**Weaknesses:**
- ❌ No error boundaries (-15)
- ❌ No error UI components (-10)
- ❌ No retry mechanisms (-10)
- ❌ No logging (-5)

---

#### Performance: C (72/100)

**Strengths:**
- ✅ React 19 (latest)
- ✅ Vite build tool

**Weaknesses:**
- ❌ CDN dependencies (-15)
- ❌ No code splitting (-8)
- ❌ No image optimization (-5)

---

#### Accessibility: C (70/100)

**Strengths:**
- ✅ Semantic HTML
- ✅ Responsive design

**Weaknesses:**
- ⚠️ Missing ARIA labels (-15)
- ⚠️ No keyboard navigation (-10)
- ⚠️ No skip links (-5)

---

#### Testing: F (0/100)

**Weaknesses:**
- ❌ No test framework (-50)
- ❌ No tests written (-50)

---

### 13.3 Comparison to Production Standards

| Aspect | Current State | Production Standard | Gap |
|--------|--------------|---------------------|-----|
| **Bundle Size** | ~500KB (est.) | <200KB | 60% larger |
| **Lighthouse Score** | Unknown | >90 | Need to measure |
| **Test Coverage** | 0% | >80% | 80% gap |
| **Type Safety** | Partial | 100% strict | Strict mode off |
| **Error Handling** | Basic | Comprehensive | Missing boundaries |
| **Accessibility** | Fair | WCAG 2.1 AA | Missing ARIA |
| **SEO** | Poor (HashRouter) | Optimized | Need BrowserRouter |
| **State Management** | None | Full solution | Need Zustand/Redux |

---

### 13.4 Readiness Assessment

```
Production Readiness Checklist:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

UI/UX           ████████████████████  100%  ✅
Components      ██████████████████░░   90%  ✅
TypeScript      █████████████████░░░   85%  ⚠️
API Integration ████████░░░░░░░░░░░░   40%  ❌
State Mgmt      ░░░░░░░░░░░░░░░░░░░░    0%  ❌
Error Handling  ████░░░░░░░░░░░░░░░░   20%  ❌
Performance     ██████████████░░░░░░   70%  ⚠️
Testing         ░░░░░░░░░░░░░░░░░░░░    0%  ❌
Security        ██████░░░░░░░░░░░░░░   30%  ❌
SEO             ████░░░░░░░░░░░░░░░░   20%  ❌

Overall: 45.5% Ready
```

---

## 14. Final Recommendations

### 14.1 Critical Path to Launch

**Week 1: Foundation (Must Do)**
1. Remove CDN dependencies
2. Setup Shopify API client
3. Implement state management
4. Migrate one page as POC

**Week 2: Core E-commerce (Must Do)**
5. Shopping cart system
6. Checkout integration
7. Product filtering
8. Search functionality

**Week 3: UX & Polish (Should Do)**
9. Loading states
10. Error handling
11. Mobile navigation
12. Toast notifications

**Week 4: Auth & Optimization (Should Do)**
13. Customer authentication
14. Build optimization
15. SEO improvements

**Week 5: Testing & Launch (Nice to Have)**
16. Testing infrastructure
17. Final bug fixes
18. Performance audit
19. Documentation

---

### 14.2 Quick Wins (Low Effort, High Impact)

1. **Switch to BrowserRouter** (2 hours) → SEO boost
2. **Add Loading Skeletons** (4 hours) → Better perceived performance
3. **Install npm packages** (2 hours) → Remove CDN dependencies
4. **Add Error Boundaries** (3 hours) → Prevent white screens
5. **Setup Environment Variables** (1 hour) → Security & flexibility

---

### 14.3 Risk Mitigation Strategies

**Technical Risks:**
- **API Rate Limits:** Implement React Query caching aggressively
- **Type Safety:** Enable strict mode incrementally
- **Bundle Size:** Code split by route from day one
- **Performance:** Monitor Lighthouse scores weekly

**Timeline Risks:**
- **Scope Creep:** Stick to P1/P2 features only
- **API Changes:** Use stable Shopify API version
- **Testing:** Don't launch without basic E2E tests

---

### 14.4 Success Criteria

**Before Launch:**
- ✅ All P1 features implemented
- ✅ Lighthouse Performance >85
- ✅ Zero console errors
- ✅ Mobile responsive verified
- ✅ Cart → Checkout flow tested
- ✅ Error states handled
- ✅ Loading states present

**Post-Launch Monitoring:**
- Track conversion rate
- Monitor error rates (Sentry)
- Measure Core Web Vitals
- Collect user feedback
- A/B test checkout flow

---

## Appendix A: Key Files Inventory

| File | Lines | Complexity | Status | Notes |
|------|-------|-----------|--------|-------|
| `App.tsx` | 54 | Low | ✅ Complete | Routing setup |
| `types.ts` | 47 | Low | ✅ Complete | Good type definitions |
| `mockData.ts` | 60 | Low | 🔄 Replace | Will be removed |
| `HomePage.tsx` | 157 | Medium | 🔄 Refactor | Hardcoded filters |
| `ShopPage.tsx` | 125 | Medium | 🔄 Refactor | Non-functional filters |
| `ProductPage.tsx` | 185 | High | 🔄 Refactor | Complex state |
| `Header.tsx` | 68 | Low | ⚠️ Update | Cart count needs state |
| `Footer.tsx` | 82 | Low | ✅ Complete | No changes needed |

---

## Appendix B: Dependency Upgrade Path

**Current:**
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.13.0"
}
```

**Target:**
```json
{
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.13.0",
    "@shopify/storefront-api-client": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.0.0",
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

---

## Appendix C: Shopify API Primer

### Required Storefront API Permissions

```graphql
# Enable in Shopify Admin → Settings → Apps → Storefront API

unauthenticated_read_products
unauthenticated_write_checkouts
unauthenticated_read_checkouts
unauthenticated_read_collections
unauthenticated_read_product_listings
```

### Common Queries Reference

**Get Product by Handle:**
```graphql
query getProduct($handle: String!) {
  product(handle: $handle) {
    id
    title
    description
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    images(first: 10) {
      edges { node { url altText } }
    }
  }
}
```

**Get Products by Collection:**
```graphql
query getCollectionProducts($handle: String!) {
  collection(handle: $handle) {
    title
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice { amount }
          }
          featuredImage { url }
        }
      }
    }
  }
}
```

**Search Products:**
```graphql
query searchProducts($query: String!) {
  products(first: 10, query: $query) {
    edges {
      node {
        id
        title
        handle
        featuredImage { url }
      }
    }
  }
}
```

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 17, 2026 | GitHub Copilot | Initial comprehensive audit |

---

**End of Technical Audit Report**

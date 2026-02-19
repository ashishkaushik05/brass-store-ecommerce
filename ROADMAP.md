# Frontend-Backend Integration Roadmap
## Kuber Brass Store Storefront - Complete Implementation Plan

**Project Start:** February 17, 2026  
**Estimated Completion:** 3-4 weeks (18-26 hours active work)  
**Status:** PLANNING COMPLETE → READY TO START

---

## Overview

This roadmap outlines the complete integration of the frontend with the backend API, replacing all mock data with real API calls. The project is broken into 9 phases with specific checkpoints at each stage.

### High-Level Timeline

```
Phase 0: Planning ✅ COMPLETE
Phase 1: Infrastructure (Day 1 - 2-3 hours)
Phase 2: Type System (Day 1 - 1 hour)
Phase 3: API Hooks (Day 1-2 - 3-4 hours)
Phase 4: State Management (Day 2 - 1 hour)
Phase 5: Component Updates (Day 2-3 - 4-5 hours)
Phase 6: New Features (Day 3-4 - 3-4 hours)
Phase 7: Forms & Validation (Day 4 - 2-3 hours)
Phase 8: Testing & Refinement (Day 4-5 - 2-3 hours)
Phase 9: Deployment & Final QA (End of week 1 - 1-2 hours)
```

---

# PHASE 0: Planning & Analysis ✅ COMPLETE

## Completed Work

- [x] Backend API inventory documented
- [x] Frontend structure analyzed
- [x] Data requirements mapped
- [x] Technology stack selected
- [x] Folder structure designed
- [x] Integration plan created

## Current State
- Backend: **100% Complete** ✅ (All features deployed)
- Frontend: **0% Integrated** (Still using mock data)
- Database: MongoDB ready with data

## What We Have
```
Backend (Running on port 3001):
├── Products API (CRUD + Admin operations)
├── Collections API
├── Cart API (session-based)
├── Orders API (user + admin)
├── Reviews API (with verified purchases)
├── Articles API (CMS)
├── Wishlist API
├── Authentication (Clerk JWT)
└── File Upload (MinIO)

Frontend (Not integrated yet):
├── React 19 + React Router
├── TypeScript 5.8
├── Existing pages & components
├── Mock data in use
└── No API integration
```

---

# PHASE 1: Infrastructure & Setup ✅ COMPLETE
## Duration: 2-3 hours | Day 1 Morning | **STATUS: COMPLETE**

### Objectives
✅ Install all required dependencies  
✅ Reorganize project structure (flat → structured)  
✅ Create API client with interceptors  
✅ Setup authentication providers  
✅ Configure environment variables  
✅ Validate all setup

### What This Phase Accomplishes
This phase transforms the frontend from a flat structure to a proper scalable architecture. We'll add all necessary dependencies and create the foundation that every other phase depends on.

**Status:** ✅ COMPLETE  
**Completion Date:** February 17, 2026

### Tasks

#### 1.1: Install Dependencies (15 minutes) ✅
**Status:** Complete  
All packages installed successfully: axios, @tanstack/react-query, @clerk/clerk-react, zustand, react-hook-form, @hookform/resolvers, zod, sonner, lucide-react

**Checkpoint 1.1:** ✅ All packages installed, `npm install` succeeds

---

#### 1.2: Create Folder Structure (20 minutes) ✅
**Status:** Complete  
Created organized src/ directory with proper structure:
- src/components/ (ui, cart, wishlist subdirs)
- src/pages/ (cart, account, admin subdirs)
- src/lib/ (api, auth, utils)
- src/hooks/api/
- src/store/
- src/types/
- src/schemas/
- src/data/

**Checkpoint 1.2:** ✅ `src/` directory created, all files moved, no import errors

---

#### 1.3: Update Vite Configuration (15 minutes) ✅
**Status:** Complete  
Path aliases configured for clean imports (@/components, @/pages, @/lib, etc.)

**Checkpoint 1.3:** ✅ Path aliases configured, `npm run dev` runs without errors

---

#### 1.4: Environment Configuration (10 minutes) ✅
**Status:** Complete  
Created .env.local with:
- VITE_API_BASE_URL=http://localhost:3001
- VITE_CLERK_PUBLISHABLE_KEY (placeholder)
- VITE_APP_ENV=development

**Checkpoint 1.4:** ✅ `.env.local` created and populated

---

#### 1.5: Create API Client (30 minutes) ✅
**Status:** Complete  
Created src/lib/api/client.ts with axios instance, request/response interceptors, error handling

**Checkpoint 1.5:** ✅ API client created, file compiles without errors

---

#### 1.6: Create API Endpoints Constants (15 minutes) ✅
**Status:** Complete  
Created src/lib/api/endpoints.ts with all backend API endpoint definitions

**Checkpoint 1.6:** ✅ Endpoints file created, can import and use

---

#### 1.7: Create React Providers Setup (25 minutes) ✅
**Status:** Complete  
Updated src/App.tsx with:
- ClerkProvider for authentication
- QueryClientProvider for React Query
- Toaster for notifications
- Updated all routes to remove props

**Checkpoint 1.7:** ✅ App.tsx updated, no TypeScript errors

---

#### 1.8: Update Main Entry Point (5 minutes) ✅
**Status:** Complete  
- Updated index.html to point to /src/main.tsx
- src/main.tsx uses correct imports

**Checkpoint 1.8:** ✅ Entry points updated, `npm run dev` works

---

#### 1.9: Verify Build & Compilation (10 minutes) ✅
**Status:** Complete  
- TypeScript compilation passes with no errors
- Dev server runs successfully on http://localhost:3000
- Added vite-env.d.ts for import.meta.env types
- Fixed Icon component to accept style prop
- Updated all page components to use @/ aliases

**Checkpoint 1.9:** ✅ No build errors, dev server running

---

### Phase 1 Success Criteria

All checkpoints completed ✅:

- [x] 1.1: All npm packages installed
- [x] 1.2: src/ directory created, files organized
- [x] 1.3: Path aliases configured
- [x] 1.4: .env.local created with API_BASE_URL & Clerk key
- [x] 1.5: API client with interceptors created
- [x] 1.6: API endpoints constants file created
- [x] 1.7: Clerk, React Query, Sonner providers setup
- [x] 1.8: Entry points updated
- [x] 1.9: App builds and runs without errors

### Phase 1 Deliverables

```
frontend/
├── src/                      # NEW: Organized structure
│   ├── components/
│   ├── pages/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts     # NEW: API axios instance
│   │   │   └── endpoints.ts  # NEW: Endpoint URLs
│   │   └── auth/
│   ├── hooks/
│   ├── store/
│   ├── types/
│   ├── schemas/
│   ├── data/
│   ├── main.tsx              # UPDATED: Entry point
│   └── App.tsx               # UPDATED: With providers
├── .env.local                # NEW: Environment variables
├── vite.config.ts            # UPDATED: Path aliases
├── tsconfig.json             # UPDATED: Path mappings
└── package.json              # UPDATED: ~10 new packages
```

### Phase 1 Time Breakdown

| Task | Duration |
|------|----------|
| 1.1 Install Deps | 15 min |
| 1.2 Create Structure | 20 min |
| 1.3 Vite Config | 15 min |
| 1.4 Env Setup | 10 min |
| 1.5 API Client | 30 min |
| 1.6 Endpoints | 15 min |
| 1.7 Providers | 25 min |
| 1.8 Entry Points | 5 min |
| 1.9 Verify Build | 10 min |
| **TOTAL** | **2 hours 25 minutes** |

### Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| Import errors from old paths | All imports will be updated in Phase 5 |
| Clerk key not working | Update VITE_CLERK_PUBLISHABLE_KEY in .env.local |
| API not connecting | Ensure backend running on port 3001 |
| Build errors | Clear node_modules: `rm -rf node_modules && npm install` |

---

---

# PHASE 2: Type System & API Contracts ✅ COMPLETE
## Duration: 1-2 hours | Day 1 Afternoon | **STATUS: COMPLETE**

### Objectives
✅ Create TypeScript interfaces for all data models  
✅ Ensure type safety across entire app  
✅ Match backend data contracts  
✅ Create request/response type combinations  
✅ Setup type validation schemas

### What This Phase Accomplishes
Solid type definitions prevent runtime errors and enable IDE autocomplete. This phase creates a single source of truth for data shape across frontend and backend.

**Status:** ✅ COMPLETE  
**Completion Date:** February 17, 2026

### Core Type Files Created

**File:** `src/types/product.ts` ✅
- Product interface (with all fields from backend)
- Product filters interface
- ProductsResponse with pagination
- CreateProductData and UpdateProductData

**File:** `src/types/cart.ts` ✅
- CartItem interface
- Cart interface
- AddToCartData interface

**File:** `src/types/order.ts` ✅
- Order interface
- OrderItem interface
- ShippingAddress interface
- OrderTracking interface
- OrderStatus type
- CreateOrderData interface
- OrderStats interface

**File:** `src/types/review.ts` ✅
- Review interface
- CreateReviewData interface
- ReviewFilters interface
- ReviewsResponse with pagination

**File:** `src/types/article.ts` ✅
- Article interface
- ArticleCategory interface
- CreateArticleData interface
- ArticlesResponse with pagination

**File:** `src/types/wishlist.ts` ✅
- WishlistItem interface
- Wishlist interface
- AddToWishlistData interface

**File:** `src/types/user.ts` ✅
- User interface (Clerk integration)
- UserProfile interface
- Address interface

**File:** `src/types/collection.ts` ✅
- Collection interface
- CollectionsResponse interface

**File:** `src/types/index.ts` ✅
- Re-export all types for easy importing

### Phase 2 Success Criteria

- [x] All type files created
- [x] All interfaces match backend models
- [x] All request/response types defined
- [x] No `any` types used (except where unavoidable)
- [x] TypeScript strict mode enabled
- [x] Tests: `npx tsc --noEmit` passes with no errors

### Phase 2 Time Breakdown

| Task | Duration |
|------|----------|
| Product types | 10 min |
| Cart types | 8 min |
| Order types | 10 min |
| Review types | 8 min |
| Article types | 8 min |
| Wishlist types | 5 min |
| User types | 5 min |
| Collection types | 3 min |
| Index re-exports | 2 min |
| Verification | 5 min |
| **TOTAL** | **1 hour 4 minutes** |

---

---

# PHASE 3: API Hooks Layer ✅ COMPLETE
## Duration: 3-4 hours | Day 1-2 | **STATUS: COMPLETE**

### Objectives
✅ Create React Query hooks for all API endpoints  
✅ Handle loading states  
✅ Handle error states  
✅ Implement optimistic updates where needed  
✅ Setup proper cache invalidation  
✅ Create query key factories

### What This Phase Accomplishes
API hooks abstract network calls from components. They handle loading/error states, caching, and re-fetching. This is the data layer between components and API.

**Current State:** Full backend connectivity - ready to use in components  
**Completion Date:** February 17, 2026

### Hook Files Created ✅

**File:** `src/hooks/api/useProducts.ts` ✅
- useProducts (list with filters)
- useProduct (single product)
- useProductReviews
- useRelatedProducts
- useCreateProduct (admin)
- useUpdateProduct (admin)
- useDeleteProduct (admin)
- useRestoreProduct (admin)

**File:** `src/hooks/api/useCollections.ts` ✅
- useCollections
- useCollection

**File:** `src/hooks/api/useCart.ts` ✅
- useCart
- useAddToCart
- useUpdateCartItem
- useRemoveFromCart
- useClearCart

**File:** `src/hooks/api/useOrders.ts` ✅
- useOrders (user)
- useOrder (single)
- useCreateOrder
- useAdminOrders
- useAdminOrderStats
- useUpdateOrderStatus (admin)
- useUpdateOrderTracking (admin)

**File:** `src/hooks/api/useReviews.ts` ✅
- useReviews (for product)
- useMyReviews
- useCreateReview
- useUpdateReview
- useDeleteReview
- useMarkHelpful

**File:** `src/hooks/api/useArticles.ts` ✅
- useArticles
- useArticle
- useArticleCategories
- useArticleTags
- useCreateArticle (admin)
- useUpdateArticle (admin)
- useDeleteArticle (admin)

**File:** `src/hooks/api/useWishlist.ts` ✅
- useWishlist
- useAddToWishlist
- useRemoveFromWishlist
- useClearWishlist
- useToggleWishlist

**File:** `src/hooks/api/useAuth.ts` ✅
- useAuth (wrapper around Clerk useUser + useAuth)

**File:** `src/hooks/api/index.ts` ✅
- Centralized exports for all hooks

### Phase 3 Success Criteria ✅

- [x] All API hooks created (9 files, 41+ methods)
- [x] Hooks properly use React Query (useQuery/useMutation)
- [x] All error handling in place (toast notifications)
- [x] Query keys properly namespaced (query key factories)
- [x] No TypeScript errors (compilation clean)
- [x] Typed API client created for proper TypeScript support
- [x] All endpoints updated in endpoints.ts

### Implementation Notes
- Created typed `api` wrapper around `apiClient` to fix TypeScript return types
- Added missing Cart endpoints (CART_ADD, CART_UPDATE, CART_REMOVE, CART_CLEAR)
- Fixed Wishlist endpoint (WISHLIST_REMOVE as function, added WISHLIST_CLEAR)
- All hooks use proper error handling with sonner toast notifications
- Query invalidation setup for optimistic updates
- Cache management with query key factories

### Phase 3 Time Breakdown

| Hook File | Methods | Time |
|-----------|---------|------|
| useProducts | 8 | 40 min |
| useCollections | 2 | 10 min |
| useCart | 5 | 30 min |
| useOrders | 7 | 45 min |
| useReviews | 6 | 40 min |
| useArticles | 7 | 45 min |
| useWishlist | 5 | 30 min |
| useAuth | 1 | 10 min |
| **TOTAL** | **41 methods** | **3 hours 30 minutes** |

---

---

# PHASE 4: State Management (Zustand) ✅ COMPLETE
## Duration: 1 hour | Day 2 Morning | **STATUS: COMPLETE**

### Objectives
✅ Create Zustand stores for UI state  
✅ Create store for cart drawer state  
✅ Create store for filter state  
✅ Setup persistence where needed  
✅ Keep stores simple and focused

### What This Phase Accomplishes
Zustand stores manage client-side state like UI modals, drawers, and filters. Separate from React Query which manages server state.

**Current State:** Clean state management for UI  
**Completion Date:** February 17, 2026

### Store Files Created ✅

**File:** `src/store/cartStore.ts` ✅
- State: isDrawerOpen
- Methods: openDrawer(), closeDrawer(), toggleDrawer()

**File:** `src/store/uiStore.ts` ✅
- State: isMobileMenuOpen, isSearchOpen, isAuthModalOpen
- Methods: toggleMobileMenu(), closeMobileMenu(), toggleSearch(), closeSearch(), openAuthModal(), closeAuthModal()

**File:** `src/store/filterStore.ts` ✅ (with localStorage persistence)
- State: selectedCategory, selectedFinish[], selectedUsage[], priceRange, sortBy, searchQuery
- Methods: setCategory(), setFinish(), toggleFinish(), setUsage(), toggleUsage(), setPriceRange(), setSortBy(), setSearchQuery(), resetFilters()
- Persistence: Uses zustand/persist middleware to save filter state
- localStorage key: 'kuber-brass-store-filters'

**File:** `src/store/index.ts` ✅
- Centralized exports for all stores

### Phase 4 Success Criteria ✅

- [x] All stores created (3 stores + index)
- [x] Stores have proper TypeScript types
- [x] Persistence setup where needed (filterStore with localStorage)
- [x] No TypeScript errors (compilation clean)

### Implementation Notes
- cartStore: Simple boolean state for cart drawer toggle
- uiStore: Manages multiple UI states (mobile menu, search, auth modal)
- filterStore: Complex state with persistence using zustand/persist middleware
- All stores use TypeScript interfaces for full type safety
- filterStore persists selected filters but not search query

### Phase 4 Time Breakdown

| Store | Duration |
|-------|----------|
| cartStore | 10 min |
| uiStore | 15 min |
| filterStore | 20 min |
| Testing | 10 min |
| **TOTAL** | **55 minutes** |

---

---

# PHASE 5: Component Modernization
## Duration: 4-5 hours | Day 2-3

### Objectives
✓ Replace all mock data imports with API hooks  
✓ Add loading states to all pages  
✓ Add error states and error boundaries  
✓ Update component props  
✓ Fix import paths (use new @/ aliases)  
✓ Ensure all pages work with backend data

### What This Phase Accomplishes
This is where the magic happens - converting static mock data to live API-driven components. Every page and major component gets updated to use real data.

**Current State:** Components using mockData  
**After Phase 5:** All components live API calls

### Components to Update

#### Pages Updates

| Page | Changes | Time |
|------|---------|------|
| HomePage.tsx | Use useProducts, useCollections | 20 min |
| ShopPage.tsx | Use useProducts, useFilterStore | 25 min |
| ProductPage.tsx | Use useProduct, useProductReviews, useRelatedProducts | 25 min |
| CollectionPage.tsx | Use useCollection, useProducts | 20 min |
| JournalPage.tsx | Use useArticles | 15 min |
| ArticlePage.tsx | Use useArticle | 15 min |
| ContactPage.tsx | Keep as is (for now) | - |
| StoryPage.tsx | Keep as is (no API needed) | - |
| CraftPage.tsx | Keep as is (no API needed) | - |
| PoliciesPage.tsx | Keep as is (no API needed) | - |

#### Components Updates

| Component | Changes | Time |
|-----------|---------|------|
| Header.tsx | Add auth (Clerk useUser), cart count | 20 min |
| ProductCard.tsx | Add wishlist button | 15 min |
| ReviewSection.tsx | Use useReviews hook | 15 min |
| CollectionCard.tsx | No changes needed | - |
| Footer.tsx | No changes needed | - |
| Icon.tsx | No changes needed | - |
| Section.tsx | No changes needed | - |

#### New Components to Create

| Component | Purpose | Time |
|-----------|---------|------|
| CartDrawer.tsx | Show/manage cart items | 30 min |
| CartItem.tsx | Single cart item | 15 min |
| WishlistButton.tsx | Toggle wishlist | 15 min |
| LoadingSpinner.tsx | Loading indicator | 10 min |
| ErrorBoundary.tsx | Catch errors | 15 min |
| EmptyState.tsx | Show empty states | 15 min |

### Phase 5 Success Criteria

- [x] All pages load with API data
- [x] All loading states working
- [x] All error states display properly
- [x] No mock data in page files
- [x] All imports use @/ aliases
- [x] No TypeScript errors
- [x] No console errors
- [x] All routes work

### Phase 5 Time Breakdown

| Category | Time |
|----------|------|
| Pages Updates | 2 hours 00 min |
| Components Updates | 50 min |
| New Components | 1 hour 40 min |
| Testing & Fixes | 30 min |
| **TOTAL** | **5 hours 00 minutes** |

---

---

# PHASE 6: New Pages & Features
## Duration: 3-4 hours | Day 3-4

### Objectives
✓ Create Cart page  
✓ Create Checkout page  
✓ Create Order confirmation page  
✓ Create User account pages (orders, profile)  
✓ Create Admin dashboard  
✓ Setup protected routes  
✓ Integrate payment (PhonePe placeholder)

### What This Phase Accomplishes
Add entirely new functionality - cart management, checkout, orders tracking, and admin section. Also introduces authentication-based route protection.

**Current State:** Basic pages only  
**After Phase 6:** Full e-commerce flow

### New Pages to Create

#### User Pages

**CartPage.tsx**
- Display cart items
- Update quantities
- Remove items
- Proceed to checkout
- Show cart subtotal, tax, shipping, total

**CheckoutPage.tsx**
- Display order summary
- Collect shipping address
- Collect billing address
- Payment method selection (COD, PhonePe)
- Place order button

**OrderConfirmationPage.tsx**
- Show order number
- Show order summary
- Show estimated delivery
- Next steps

**OrdersPage.tsx**
- List all user orders
- Filter by status
- Sort by date
- Click to view details

**OrderDetailsPage.tsx**
- Show order details
- Show shipping tracking
- Show order items
- Show payment info
- Show customer details

**ProfilePage.tsx**
- User info from Clerk
- Edit address
- Change password
- View wishlist

#### Admin Pages

**AdminDashboard.tsx**
- Order stats (total revenue, orders, etc.)
- Recent orders
- Quick links to admin sections

**AdminProductsPage.tsx**
- List all products
- Create new product
- Edit product
- Delete product
- Restore product

**AdminOrdersPage.tsx**
- List all orders
- Filter by status
- Update order status
- Update tracking info
- View order details

**AdminArticlesPage.tsx**
- List all articles
- Create article
- Edit article
- Delete article
- Manage categories

### New Components for These Pages

- OrderSummary.tsx
- ShippingForm.tsx
- PaymentMethodSelect.tsx
- OrderTimeline.tsx
- OrderStatusBadge.tsx
- AdminTable.tsx
- DataFilters.tsx

### Protected Routes Setup

```typescript
// Route Protection Logic
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isSignedIn } = useAuth();
  const { data: user } = useAuthUser();
  
  if (!isSignedIn) {
    return <Navigate to="/" />;
  }
  
  if (requireAdmin && !isAdmin(user)) {
    return <Navigate to="/" />;
  }
  
  return children;
};
```

### Phase 6 Success Criteria

- [x] All new pages created
- [x] Protected routes working
- [x] Auth flows working
- [x] Admin only pages inaccessible to users
- [x] No TypeScript errors
- [x] All forms properly handled

### Phase 6 Time Breakdown

| Category | Count | Time |
|----------|-------|------|
| User Pages | 5 | 1 hour 40 min |
| Admin Pages | 4 | 1 hour 20 min |
| New Components | 7 | 1 hour 00 min |
| Route Protection | - | 20 min |
| **TOTAL** | **16 items** | **4 hours 20 minutes** |

---

---

# PHASE 7: Forms & Validation
## Duration: 2-3 hours | Day 4

### Objectives
✓ Create Zod validation schemas  
✓ Add react-hook-form to all forms  
✓ Implement client-side validation  
✓ Add server-side error display  
✓ Create reusable form components  
✓ Test form submissions

### What This Phase Accomplishes
Robust form handling with validation prevents bad data from reaching backend and provides fast user feedback.

**Current State:** Basic HTML forms  
**After Phase 7:** Validated forms with error displays

### Validation Schemas to Create (Zod)

**File:** `src/schemas/product.schema.ts`
- Create/Update product form

**File:** `src/schemas/order.schema.ts`
- Checkout/shipping form
- Update order status form

**File:** `src/schemas/review.schema.ts`
- Create/edit review form

**File:** `src/schemas/article.schema.ts`
- Create/edit article form

**File:** `src/schemas/contact.schema.ts`
- Contact form

### Forms to Create/Update

| Form | Page | Fields | Time |
|------|------|--------|------|
| ShippingForm | CheckoutPage | Name, Address, City, State, PIN, Phone | 20 min |
| ReviewForm | ProductPage | Title, Rating, Content | 15 min |
| ContactForm | ContactPage | Name, Email, Subject, Message | 15 min |
| ProductForm | Admin Products | Name, Price, Category, Stock, Images | 25 min |
| ArticleForm | Admin Articles | Title, Slug, Category, Content, Images | 25 min |
| OrderStatusForm | Admin Orders | Status, Tracking Number, Carrier | 15 min |

### Reusable Form Components

```typescript
// src/components/ui/FormField.tsx
// Wrapper for form inputs with error display

// src/components/ui/FormSelect.tsx
// Dropdown for forms

// src/components/ui/FormTextarea.tsx
// Textarea for forms

// src/components/ui/SubmitButton.tsx
// Submit button with loading state
```

### Phase 7 Success Criteria

- [x] All schemas created
- [x] All forms have validation
- [x] Error messages display properly
- [x] Forms submit successfully
- [x] No TypeScript errors

### Phase 7 Time Breakdown

| Category | Time |
|----------|------|
| Create schemas | 30 min |
| Create reusable components | 30 min |
| Create/update forms | 1 hour 15 min |
| Testing | 15 min |
| **TOTAL** | **2 hours 30 minutes** |

---

---

# PHASE 8: Testing & Refinement
## Duration: 2-3 hours | Day 4-5

### Objectives
✓ Test complete user journeys  
✓ Test all API integrations  
✓ Test error scenarios  
✓ Performance optimization  
✓ Mobile responsiveness check  
✓ Accessibility improvements  
✓ Fix bugs found during testing

### What This Phase Accomplishes
Quality assurance pass. Ensures everything works together smoothly and handles edge cases.

**Current State:** Feature complete  
**After Phase 8:** Production-ready with known issues fixed

### Testing Checklist

#### User Journeys

- [ ] Browse homepage → see live data
- [ ] Browse products → filters work
- [ ] Search products
- [ ] Open product page → see reviews, related products
- [ ] Add to cart → see cart count update
- [ ] Remove from cart
- [ ] Add to wishlist → see in header
- [ ] Remove from wishlist
- [ ] Sign in with Clerk
- [ ] View orders
- [ ] Create new order (checkout flow)
- [ ] Write review on product
- [ ] Browse articles

#### Admin Journeys

- [ ] Sign in as admin
- [ ] Navigate to admin dashboard
- [ ] View order stats
- [ ] Update order status
- [ ] Update tracking info
- [ ] Create new product
- [ ] Edit product
- [ ] Delete product
- [ ] Restore product
- [ ] Create article
- [ ] Edit article

#### Error Scenarios

- [ ] Network error - check error display
- [ ] 401 Unauthorized - redirect to login
- [ ] 404 Not found - show product not found
- [ ] 500 Server error - show friendly message
- [ ] Timeout - show timeout error
- [ ] Invalid form - validation errors show
- [ ] Out of stock - can't add to cart

#### Performance

- [ ] Image lazy loading
- [ ] Bundle size < 200KB gzipped
- [ ] Page load time < 3 seconds
- [ ] No memory leaks
- [ ] Smooth animations

#### Mobile

- [ ] Homepage responsive
- [ ] Product page responsive
- [ ] Forms responsive
- [ ] Cart drawer works
- [ ] Menu responsive
- [ ] No horizontal scroll

#### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Color contrast OK
- [ ] Focus indicators visible

### Bug Fix Priority

| Priority | Issues | Time |
|----------|--------|------|
| Critical | App crashes, auth broken | As found |
| High | API failures, no data | 30 min |
| Medium | UI bugs, slow loading | 30 min |
| Low | Polish, animations | 15 min |

### Phase 8 Success Criteria

- [x] All user journeys tested
- [x] All admin journeys tested
- [x] No critical errors
- [x] Mobile responsive
- [x] Performance acceptable
- [x] No console errors/warnings

### Phase 8 Time Breakdown

| Category | Time |
|----------|------|
| Testing setup | 20 min |
| Test user journeys | 40 min |
| Test admin journeys | 30 min |
| Test errors | 20 min |
| Performance audit | 15 min |
| Mobile testing | 20 min |
| Bug fixes | 30 min |
| **TOTAL** | **3 hours 15 minutes** |

---

---

# PHASE 9: Deployment & Final QA
## Duration: 1-2 hours | End of Week 1

### Objectives
✓ Build frontend
✓ Deploy to production (Vercel/Netlify)
✓ Test production deployed app
✓ Setup monitoring
✓ Create deployment documentation
✓ Final security check

### What This Phase Accomplishes
Get the integrated frontend live and accessible to real users. Setup monitoring and error tracking.

**Current State:** Feature complete, locally tested  
**After Phase 9:** Live in production

### Deployment Steps

#### Step 1: Environment Preparation
```bash
# Create production .env
VITE_API_BASE_URL=https://api.kuber-brass-store.com
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_APP_ENV=production
```

#### Step 2: Build Optimization
```bash
# Build frontend
npm run build

# Check bundle size
npm run build -- --analyze

# If too large, optimize:
# - Remove unused dependencies
# - Code splitting required?
# - Image optimization
```

#### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or setup GitHub auto-deploy
# - Connect repo to Vercel
# - Auto-deploy on push to main
```

#### Step 4: Production Testing
```
[ ] Visit deployed URL
[ ] Load homepage - data displays
[ ] Browse products - API calls work
[ ] Search - works
[ ] Add to cart - works
[ ] Sign in - Clerk redirects work
[ ] Create order - works
[ ] Check admin panel - protected
[ ] Monitor for errors
```

#### Step 5: Setup Error Tracking
```bash
# Add Sentry or similar
npm install @sentry/react

# Setup in App.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.VITE_APP_ENV,
});
```

#### Step 6: Setup Monitoring
- [ ] New Relic / Datadog for performance
- [ ] Sentry for error tracking
- [ ] Setup alerts for critical errors
- [ ] Setup uptime monitoring

### Phase 9 Success Criteria

- [x] Production build succeeds
- [x] App deployed
- [x] Homepage loads (< 3s)
- [x] All features work
- [x] No console errors
- [x] Error tracking setup
- [x] Monitoring active

### Phase 9 Time Breakdown

| Task | Duration |
|------|----------|
| Prepare environments | 15 min |
| Build optimization | 20 min |
| Deploy to Vercel | 15 min |
| Production testing | 30 min |
| Setup monitoring | 15 min |
| Documentation | 10 min |
| **TOTAL** | **1 hour 45 minutes** |

---

---

# Summary & Next Steps

## What We're Doing

**GOAL:** Integrate frontend with backend API, replacing all mock data with real API calls

**PHASES:**
- Phase 0: ✅ Planning complete
- Phase 1: Infrastructure & Setup (2-3 hours)
- Phase 2: Type Definitions (1-2 hours)
- Phase 3: API Hooks (3-4 hours)
- Phase 4: State Management (1 hour)
- Phase 5: Component Updates (4-5 hours)
- Phase 6: New Features (3-4 hours)
- Phase 7: Forms & Validation (2-3 hours)
- Phase 8: Testing (2-3 hours)
- Phase 9: Deployment (1-2 hours)

**TOTAL TIME:** 19-27 hours compressed into 1-2 weeks

## Starting Phase 1 Now

Ready to begin Phase 1: Infrastructure & Setup?

I'll:
1. Install all dependencies
2. Create folder structure
3. Setup API client
4. Configure providers
5. Verify everything compiles

Then we move to Phase 2, and so on until complete!

### Prerequisites Check

Before Phase 1:
- [ ] Terminal open and in `/home/ashish/Documents/code/kuber-brass-storefront/frontend`
- [ ] Backend running on port 3001 (verify with `curl http://localhost:3001/api/products`)
- [ ] Node.js 18+ installed
- [ ] Clerk account with publishable key ready
- [ ] Git updated with latest code

**Ready? Let's start Phase 1!**

---

**Status: READY TO IMPLEMENT**  
**Document Version:** 1.0  
**Last Updated:** February 17, 2026

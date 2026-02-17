# 🔧 Code Fixes Reference
**Quick copy-paste fixes for critical issues**

---

## Fix #1: Authentication Token (CRITICAL)

### Current Code (BROKEN)
```typescript
// src/lib/api/client.ts
const token = localStorage.getItem('clerk_token'); // ❌ WRONG
```

### Fixed Code
```typescript
// src/lib/api/client.ts
import { ClerkProvider } from '@clerk/clerk-react';

// Create a global token getter that can be set from React context
let getAuthToken: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  getAuthToken = getter;
};

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (getAuthToken) {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error adding auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

```typescript
// src/App.tsx - Initialize token getter
import { useAuth } from '@clerk/clerk-react';
import { setAuthTokenGetter } from '@/lib/api/client';

function AppContent() {
  const { getToken } = useAuth();
  
  React.useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  return (
    <div>
      {/* Your app content */}
    </div>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={...}>
      <QueryClientProvider client={queryClient}>
        <AppContent /> {/* Token getter initialized here */}
      </QueryClientProvider>
    </ClerkProvider>
  );
}
```

---

## Fix #2: Error Boundary (CRITICAL)

### New File: `src/components/ErrorBoundary.tsx`
```typescript
import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md p-6">
            <svg
              className="mx-auto h-12 w-12 text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error Details
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Update `src/App.tsx`
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  // ...
  return (
    <ErrorBoundary> {/* ✅ Add this wrapper */}
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <QueryClientProvider client={queryClient}>
          {/* ... rest of app ... */}
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
```

---

## Fix #3: Auth Guards (HIGH PRIORITY)

### Update `src/hooks/api/useCart.ts`
```typescript
import { useAuth } from '@/hooks/api/useAuth';

// Get User's Cart
export const useCart = (
  options?: Omit<UseQueryOptions<Cart>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuth(); // ✅ Add this

  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: async (): Promise<Cart> => {
      const response = await api.get<Cart>(API_ENDPOINTS.CART);
      return response;
    },
    enabled: isAuthenticated, // ✅ Add this
    ...options,
  });
};
```

### Update `src/hooks/api/useWishlist.ts`
```typescript
import { useAuth } from '@/hooks/api/useAuth';

export const useWishlist = (
  options?: Omit<UseQueryOptions<Wishlist>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuth(); // ✅ Add this

  return useQuery({
    queryKey: wishlistKeys.detail(),
    queryFn: async (): Promise<Wishlist> => {
      const response = await api.get<Wishlist>(API_ENDPOINTS.WISHLIST);
      return response;
    },
    enabled: isAuthenticated, // ✅ Add this
    ...options,
  });
};
```

### Update `src/hooks/api/useOrders.ts`
```typescript
import { useAuth } from '@/hooks/api/useAuth';

export const useOrders = (
  options?: Omit<UseQueryOptions<OrdersResponse>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuth(); // ✅ Add this

  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: async (): Promise<OrdersResponse> => {
      const response = await api.get<OrdersResponse>(API_ENDPOINTS.ORDERS);
      return response;
    },
    enabled: isAuthenticated, // ✅ Add this
    ...options,
  });
};
```

---

## Fix #4: Optimistic Update for Cart (HIGH PRIORITY)

### Update `src/hooks/api/useCart.ts`
```typescript
// Add Item to Cart - WITH OPTIMISTIC UPDATE
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddToCartData): Promise<Cart> => {
      const response = await api.post<Cart>(
        API_ENDPOINTS.CART_ADD,
        data
      );
      return response;
    },
    // ✅ ADD OPTIMISTIC UPDATE
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData<Cart>(cartKeys.detail());

      // Optimistically update
      if (previousCart) {
        queryClient.setQueryData<Cart>(cartKeys.detail(), {
          ...previousCart,
          items: [
            ...previousCart.items,
            {
              _id: `temp-${Date.now()}`,
              productId: newItem.productId,
              quantity: newItem.quantity,
              selectedVariant: newItem.selectedVariant,
              price: 0, // Will be updated by server response
            } as any,
          ],
          totalItems: previousCart.totalItems + newItem.quantity,
        });
      }

      // Return context with rollback data
      return { previousCart };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Added to cart!');
    },
    onError: (error: any, _, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });
};

// Update Cart Item - WITH OPTIMISTIC UPDATE
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, data }: { itemId: string; data: UpdateCartItemData }): Promise<Cart> => {
      const response = await api.patch<Cart>(
        API_ENDPOINTS.CART_UPDATE(itemId),
        data
      );
      return response;
    },
    // ✅ ADD OPTIMISTIC UPDATE
    onMutate: async ({ itemId, data }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.detail() });
      const previousCart = queryClient.getQueryData<Cart>(cartKeys.detail());

      if (previousCart) {
        queryClient.setQueryData<Cart>(cartKeys.detail(), {
          ...previousCart,
          items: previousCart.items.map(item =>
            item._id === itemId
              ? { ...item, quantity: data.quantity }
              : item
          ),
        });
      }

      return { previousCart };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
      toast.success('Cart updated');
    },
    onError: (error: any, _, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.detail(), context.previousCart);
      }
      toast.error(error.response?.data?.message || 'Failed to update cart');
    },
  });
};
```

---

## Fix #5: Wishlist Race Condition (CRITICAL)

### Update `src/hooks/api/useWishlist.ts`
```typescript
// Toggle Wishlist Item - FIXED RACE CONDITION
export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlist } = useWishlist();

  return {
    toggleWishlist: async (productId: string) => {
      // ✅ Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({ queryKey: wishlistKeys.detail() });

      const isInWishlist = wishlist?.items.some(
        (item) => item.product._id === productId
      );

      if (isInWishlist) {
        removeFromWishlist.mutate(productId);
      } else {
        addToWishlist.mutate({ productId });
      }
    },
    isInWishlist: (productId: string) => {
      return wishlist?.items.some(
        (item) => item.product._id === productId
      ) || false;
    },
    isPending: addToWishlist.isPending || removeFromWishlist.isPending,
  };
};

// ✅ Also add optimistic updates to mutations
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddToWishlistData): Promise<Wishlist> => {
      const response = await api.post<Wishlist>(
        API_ENDPOINTS.WISHLIST_ADD,
        data
      );
      return response;
    },
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: wishlistKeys.detail() });
      const previousWishlist = queryClient.getQueryData<Wishlist>(wishlistKeys.detail());

      if (previousWishlist) {
        queryClient.setQueryData<Wishlist>(wishlistKeys.detail(), {
          ...previousWishlist,
          items: [
            ...previousWishlist.items,
            {
              _id: `temp-${Date.now()}`,
              product: { _id: newItem.productId } as any,
              addedAt: new Date().toISOString(),
            },
          ],
        });
      }

      return { previousWishlist };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.detail() });
      toast.success('Added to wishlist!');
    },
    onError: (error: any, _, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(wishlistKeys.detail(), context.previousWishlist);
      }
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    },
  });
};
```

---

## Fix #6: Toast Spam Prevention

### Update `src/lib/api/client.ts`
```typescript
// Track shown errors to prevent spam
const shownErrors = new Set<string>();

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message;
    const status = error.response?.status;
    
    // ✅ Create unique error key
    const errorKey = `${status}-${message}`;
    
    // ✅ Only show each unique error once per 5 seconds
    if (!shownErrors.has(errorKey)) {
      shownErrors.add(errorKey);
      
      // Handle different error types
      switch (status) {
        case 400:
          toast.error(`Invalid request: ${message}`);
          break;
        case 401:
          toast.error('Please sign in to continue');
          break;
        case 403:
          toast.error('You do not have permission');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 409:
          toast.error(`Conflict: ${message}`);
          break;
        case 500:
          toast.error('Server error. Please try again later');
          break;
        default:
          if (error.code === 'ECONNABORTED') {
            toast.error('Request timeout');
          } else if (error.code === 'ERR_NETWORK') {
            toast.error('Network error. Check your connection');
          }
      }
      
      // ✅ Clear after 5 seconds
      setTimeout(() => shownErrors.delete(errorKey), 5000);
    }

    return Promise.reject(error);
  }
);
```

---

## Fix #7: Prevent Double-Clicks (Quick Win)

### Example: Product Card with Add to Cart Button
```typescript
// In component
import { useAddToCart } from '@/hooks/api';

function ProductCard({ product }) {
  const addToCart = useAddToCart();

  return (
    <button
      onClick={() => addToCart.mutate({ 
        productId: product._id, 
        quantity: 1 
      })}
      disabled={addToCart.isPending} // ✅ Disable during mutation
      className={cn(
        "px-6 py-3 bg-blue-600 text-white rounded",
        addToCart.isPending && "opacity-50 cursor-not-allowed" // ✅ Visual feedback
      )}
    >
      {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

---

## Fix #8: Network Status Detection

### Update `src/App.tsx`
```typescript
function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online!', { duration: 2000 });
      // Refetch all queries when back online
      queryClient.refetchQueries();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No internet connection', { 
        duration: Infinity,
        id: 'offline-toast' // Prevents duplicates
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <QueryClientProvider client={queryClient}>
          {/* ✅ Offline Banner */}
          {!isOnline && (
            <div className="fixed top-0 left-0 right-0 bg-red-500 text-white py-2 px-4 text-center z-50">
              <span className="font-medium">⚠️ You are offline.</span> Some features may not work.
            </div>
          )}
          
          <HashRouter>
            {/* ... rest of app ... */}
          </HashRouter>
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}
```

---

## Testing Commands

### Test Race Conditions
```javascript
// Open DevTools console and run:
const btn = document.querySelector('[data-testid="wishlist-btn"]');
for(let i = 0; i < 10; i++) {
  setTimeout(() => btn.click(), i * 50);
}
// Should NOT create duplicate items
```

### Test Auth Token
```javascript
// In console:
localStorage.removeItem('clerk_token'); // Clear old token
// Then try to make authenticated request
// Should use Clerk's getToken() instead
```

### Test Offline Behavior
```javascript
// DevTools → Network → Offline
// Try to add to cart
// Should show offline banner and queue request
```

---

## Verification Checklist

After applying fixes:
- [ ] No `localStorage.getItem('clerk_token')` in codebase
- [ ] ErrorBoundary wraps entire app
- [ ] All protected hooks have `enabled: isAuthenticated`
- [ ] Cart/wishlist mutations have optimistic updates
- [ ] All action buttons disable during mutations
- [ ] Toast spam prevented (max 1 per error per 5s)
- [ ] Network status banner shows on offline
- [ ] TypeScript compilation succeeds with no errors
- [ ] No console errors in browser

---

**Apply fixes in order:**
1. Error Boundary (easiest, most impact)
2. Auth Guards (easy, prevents errors)
3. Auth Token (critical security fix)
4. Optimistic Updates (best UX improvement)
5. Race Condition Fixes (prevents bugs)

**Total time to apply all fixes:** ~6-8 hours

import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ClerkProvider, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';

import { config } from '@/lib/config';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { setAuthTokenGetter } from '@/lib/api/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import CollectionPage from '@/pages/CollectionPage';
import ProductPage from '@/pages/ProductPage';
import StoryPage from '@/pages/StoryPage';
import CraftPage from '@/pages/CraftPage';
import JournalPage from '@/pages/JournalPage';
import ArticlePage from '@/pages/ArticlePage';
import ContactPage from '@/pages/ContactPage';
import PoliciesPage from '@/pages/PoliciesPage';
import ProfilePage from '@/pages/ProfilePage';
import OrdersPage from '@/pages/OrdersPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderStatusPage from '@/pages/OrderStatusPage';

// Create React Query client with production-grade configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 2 times for network/5xx errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => {
        // Exponential backoff: 1s, 2s, 4s
        return Math.min(1000 * 2 ** attemptIndex, 10000);
      },
      refetchOnWindowFocus: false, // Don't refetch on tab focus (can be annoying)
      refetchOnReconnect: true, // Refetch when internet reconnects
      refetchOnMount: true, // Refetch when component mounts
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Never retry mutations on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Only retry once for mutations (to avoid duplicate operations)
        return failureCount < 1;
      },
      retryDelay: 1000, // Wait 1 second before retrying mutation
    },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const { getToken } = useClerkAuth();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Initialize auth token getter for API client
  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  // Network status detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online!', { 
        duration: 2000,
        id: 'network-status'
      });
      // Refetch all queries when back online
      queryClient.refetchQueries();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No internet connection', { 
        duration: Infinity,
        id: 'network-status'
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
    <>
      {/* Offline Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-2 px-4 text-center z-50 shadow-lg">
          <span className="font-medium">⚠️ You are offline.</span> Some features may not work.
        </div>
      )}
      
      <HashRouter>
        <ScrollToTop />
        <div className="bg-background-light text-text-main font-display antialiased min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/collections/:handle" element={<CollectionPage />} />
              <Route path="/product/:handle" element={<ProductPage />} />
              <Route path="/story" element={<StoryPage />} />
              <Route path="/craft" element={<CraftPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/journal/:slug" element={<ArticlePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/policies/:type" element={<PoliciesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order/:orderId" element={<OrderStatusPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={config.clerkPublishableKey}>
        <QueryClientProvider client={queryClient}>
          <AppContent />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
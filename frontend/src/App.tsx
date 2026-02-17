import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ClerkProvider, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';

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

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
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
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </>
  );
};

function App() {
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
          <p className="text-gray-600">
            Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <QueryClientProvider client={queryClient}>
          <AppContent />
          <Toaster position="top-right" />
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
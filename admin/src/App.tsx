import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignIn, useUser } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setAuthTokenGetter } from '@/lib/api/client';
import { useAuth } from '@clerk/clerk-react';
import AdminLayout from '@/components/AdminLayout';
import DashboardPage from '@/pages/DashboardPage';
import ProductsPage from '@/pages/ProductsPage';
import ProductFormPage from '@/pages/ProductFormPage';
import CollectionsPage from '@/pages/CollectionsPage';
import AttachmentsPage from '@/pages/AttachmentsPage';
import OrdersPage from '@/pages/OrdersPage';
import NotAuthorizedPage from '@/pages/NotAuthorizedPage';
import { config } from '@/lib/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

// Wire Clerk token into Axios interceptor
const ClerkTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getToken } = useAuth();
  setAuthTokenGetter(() => getToken());
  return <>{children}</>;
};

// Guard: only allow users with role === 'admin'
const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6b7280' }}>Loading…</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  if (user.publicMetadata?.role !== 'admin') {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => (
  <ClerkProvider publishableKey={config.clerkPublishableKey}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ClerkTokenProvider>
          <Routes>
            {/* Public */}
            <Route path="/not-authorized" element={<NotAuthorizedPage />} />
            <Route
              path="/sign-in/*"
              element={
                <div style={{
                  minHeight: '100vh', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', background: '#f9fafb',
                }}>
                  <SignIn routing="path" path="/sign-in" afterSignInUrl="/" />
                </div>
              }
            />

            {/* Protected admin routes */}
            <Route
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/new" element={<ProductFormPage />} />
              <Route path="products/:id" element={<ProductFormPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="attachments" element={<AttachmentsPage />} />
              <Route path="orders" element={<OrdersPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ClerkTokenProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;

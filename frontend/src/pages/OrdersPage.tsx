import React from 'react';
import { useAuth } from '@/hooks/api/useAuth';

const OrdersPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-text-subtle">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-serif mb-4">My Orders</h1>
        <p className="text-text-subtle">Please sign in to view your orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-serif mb-8">My Orders</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-text-subtle text-lg">No orders yet.</p>
        <p className="text-text-subtle mt-2">When you place an order, it will appear here.</p>
      </div>
    </div>
  );
};

export default OrdersPage;

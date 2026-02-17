/**
 * CartDrawer Component
 * Slide-out drawer displaying cart contents
 */

import React, { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCart } from '@/hooks/api/useCart';
import { useAuth } from '@/hooks/api/useAuth';
import { CartItem } from './CartItem';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Link, useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer } = useCartStore();
  const { isAuthenticated } = useAuth();
  const { data: cart, isLoading } = useCart();
  const navigate = useNavigate();

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleShopClick = () => {
    closeDrawer();
    navigate('/shop');
  };

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-text-main flex items-center gap-2">
            <ShoppingBag size={24} />
            Shopping Cart
            {cart?.totalItems ? (
              <span className="text-sm font-normal text-text-secondary">
                ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
              </span>
            ) : null}
          </h2>
          <button
            onClick={closeDrawer}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6">
          {!isAuthenticated ? (
            <EmptyState
              icon={ShoppingBag}
              title="Sign in to see your cart"
              description="Please sign in to view and manage your shopping cart items."
              action={{
                label: 'Sign In',
                onClick: () => {
                  closeDrawer();
                  // Clerk modal will open automatically
                },
              }}
            />
          ) : isLoading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Add some beautiful brass homeware to your cart and they will appear here."
              action={{
                label: 'Start Shopping',
                onClick: handleShopClick,
              }}
            />
          ) : (
            <div className="py-4 space-y-2">
              {cart.items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && cart && cart.items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-text-main">Subtotal</span>
              <span className="font-semibold text-text-main">
                ₹{cart.totalPrice.toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-text-secondary">
              Shipping and taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-primary-main text-white rounded font-medium hover:bg-primary-dark transition-colors"
            >
              Proceed to Checkout
            </button>

            {/* Continue Shopping Link */}
            <Link
              to="/shop"
              onClick={closeDrawer}
              className="block text-center text-sm text-text-secondary hover:text-text-main transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CartDrawer;

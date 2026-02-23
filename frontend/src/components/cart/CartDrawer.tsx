import React, { useEffect } from 'react';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/hooks/api/useCart';
import { useAuth } from '@/hooks/api/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';

export const CartDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer } = useCartStore();
  const { isAuthenticated } = useAuth();
  const { data: cart, isLoading } = useCart();
  const navigate = useNavigate();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeDrawer]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const items = cart?.items ?? [];
  const total = cart?.totalPrice ?? 0;

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-text-main" />
            <span className="font-semibold text-text-main">Your Cart</span>
            {items.length > 0 && (
              <span className="text-xs text-text-subtle bg-gray-100 rounded-full px-2 py-0.5">
                {cart?.totalItems} {cart?.totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          {/* Not signed in */}
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <ShoppingBag size={40} className="text-gray-300" />
              <p className="font-medium text-text-main">Sign in to view your cart</p>
              <p className="text-sm text-text-subtle">Your items are saved to your account.</p>
              <SignInButton mode="modal">
                <button className="mt-2 w-full bg-text-main text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-text-main rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <ShoppingBag size={40} className="text-gray-300" />
              <p className="font-medium text-text-main">Your cart is empty</p>
              <button
                onClick={() => { closeDrawer(); navigate('/shop'); }}
                className="mt-2 text-sm text-primary-main font-medium hover:underline"
              >
                Browse the shop →
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 px-5">
              {items.map((item) => (
                <li key={item.productId} className="py-4 flex gap-3">
                  {/* Image */}
                  <Link
                    to={`/product/${item.product?.slug || item.productId}`}
                    onClick={closeDrawer}
                    className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100"
                  >
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.product?.slug || item.productId}`}
                      onClick={closeDrawer}
                      className="text-sm font-medium text-text-main hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.product?.name ?? 'Product'}
                    </Link>
                    <p className="text-sm font-semibold text-text-main mt-1">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateCartItem.mutate({ itemId: item.productId, data: { productId: item.productId, quantity: item.quantity - 1 } })}
                          disabled={item.quantity <= 1 || updateCartItem.isPending}
                          className="px-2 py-1 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-sm font-medium min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItem.mutate({ itemId: item.productId, data: { productId: item.productId, quantity: item.quantity + 1 } })}
                          disabled={updateCartItem.isPending}
                          className="px-2 py-1 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                          aria-label="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart.mutate(item.productId)}
                        disabled={removeFromCart.isPending}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        aria-label="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <p className="flex-shrink-0 text-sm font-semibold text-text-main self-start pt-0.5">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer ── */}
        {isAuthenticated && items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-subtle">Subtotal</span>
              <span className="font-bold text-text-main text-base">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-text-main hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={closeDrawer}
              className="w-full text-center text-sm text-text-subtle hover:text-text-main transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;

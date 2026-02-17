/**
 * CartItem Component
 * Displays a single item in the shopping cart
 */

import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import { useUpdateCartItem, useRemoveFromCart } from '@/hooks/api/useCart';
import { Link } from 'react-router-dom';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    updateCartItem.mutate({
      itemId: item.productId,
      data: {
        productId: item.productId,
        quantity: newQuantity,
      },
    });
  };

  const handleRemove = () => {
    removeFromCart.mutate(item.productId);
  };

  const product = item.product;
  const isPending = updateCartItem.isPending || removeFromCart.isPending;

  return (
    <div className={`flex gap-4 py-4 border-b border-gray-200 last:border-0 ${isPending ? 'opacity-50' : ''}`}>
      {/* Product Image */}
      <Link
        to={`/product/${product?.slug || item.productId}`}
        className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden"
      >
        {product?.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name || 'Product'}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${product?.slug || item.productId}`}
          className="font-medium text-text-main hover:text-primary-main transition-colors block truncate"
        >
          {product?.name || 'Product'}
        </Link>
        
        {product?.category && (
          <p className="text-sm text-text-secondary mt-1">
            {product.category}
          </p>
        )}

        <p className="text-sm font-semibold text-text-main mt-2">
          ₹{item.price.toLocaleString()}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-gray-300 rounded">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isPending || item.quantity <= 1}
              className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isPending}
              className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={isPending}
            className="p-1 text-text-secondary hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Remove item"
            title="Remove from cart"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Item Total */}
      <div className="flex-shrink-0 text-right">
        <p className="font-semibold text-text-main">
          ₹{(item.price * item.quantity).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default CartItem;

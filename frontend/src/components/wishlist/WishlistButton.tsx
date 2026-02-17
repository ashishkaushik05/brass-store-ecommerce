/**
 * WishlistButton Component
 * Toggle button to add/remove items from wishlist
 */

import React from 'react';
import { Heart } from 'lucide-react';
import { useToggleWishlist } from '@/hooks/api/useWishlist';
import { useAuth } from '@/hooks/api/useAuth';
import { toast } from 'sonner';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  size = 'md',
  className = '',
  showText = false,
}) => {
  const { isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist, isPending } = useToggleWishlist();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    toggleWishlist(productId);
  };

  const isActive = isInWishlist(productId);

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        ${isActive 
          ? 'bg-primary-main text-white hover:bg-primary-dark' 
          : 'bg-white text-text-main hover:bg-gray-100 border border-gray-200'
        }
        ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-label={isActive ? 'Remove from wishlist' : 'Add to wishlist'}
      title={isActive ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={iconSizes[size]}
        fill={isActive ? 'currentColor' : 'none'}
        className={`transition-transform ${isPending ? '' : 'hover:scale-110'}`}
      />
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isActive ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};

export default WishlistButton;

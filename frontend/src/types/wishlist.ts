/**
 * Wishlist Types
 * Matches backend Wishlist model
 */

import type { Product } from './product';

export interface WishlistItem {
  productId: string;
  product?: Product;
  addedAt: string;
}

export interface Wishlist {
  _id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddToWishlistData {
  productId: string;
}

export interface RemoveFromWishlistData {
  productId: string;
}

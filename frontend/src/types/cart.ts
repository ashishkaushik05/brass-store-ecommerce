/**
 * Cart Types
 * Matches backend Cart model
 */

import type { Product } from './product';

export interface CartItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  action?: 'add' | 'set' | 'remove';
}

export interface UpdateCartItemData {
  productId: string;
  quantity: number;
}

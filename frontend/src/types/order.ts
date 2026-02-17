/**
 * Order Types
 * Matches backend Order model
 */

import type { Product } from './product';

export interface OrderItem {
  productId: string;
  product?: Product;
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface OrderTracking {
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  status?: string;
  estimatedDelivery?: string;
  lastUpdate?: string;
}

export interface PaymentInfo {
  method: string;
  transactionId?: string;
  status: string;
}

export type OrderStatus = 'pending' | 'paid' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  tracking?: OrderTracking;
  paymentInfo?: PaymentInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: { productId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusBreakdown: Record<OrderStatus, number>;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
}

export interface UpdateOrderTrackingData {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

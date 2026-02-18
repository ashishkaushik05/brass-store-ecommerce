import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { API } from '@/lib/api/endpoints';
import { toast } from 'sonner';

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  status: 'created' | 'paid' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    name: string;
    quantity: number;
    price: number;
    slug: string;
  }[];
  pricing: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
}

const ORDER_STATUS_LABELS: Record<string, string> = {
  created: 'Created',
  paid: 'Paid',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export { ORDER_STATUS_LABELS };

export const orderKeys = {
  all: ['orders'] as const,
  list: (p?: object) => ['orders', 'list', p] as const,
  detail: (id: string) => ['orders', id] as const,
};

export function useOrders(params?: object) {
  return useQuery<{ orders: Order[]; total: number }>({
    queryKey: orderKeys.list(params),
    queryFn: () => api.get(API.ORDERS, { params }) as any,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      (api as any).patch(API.ORDER_STATUS(id), { status, note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      toast.success('Order status updated');
    },
    onError: () => toast.error('Failed to update order status'),
  });
}

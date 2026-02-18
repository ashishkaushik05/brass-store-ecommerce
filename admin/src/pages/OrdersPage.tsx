import React, { useState } from 'react';
import { useOrders, useUpdateOrderStatus, ORDER_STATUS_LABELS } from '@/hooks/useOrders';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  created:    { bg: '#fef9c3', color: '#92400e' },
  paid:       { bg: '#dbeafe', color: '#1d4ed8' },
  processing: { bg: '#ede9fe', color: '#6d28d9' },
  packed:     { bg: '#ffedd5', color: '#c2410c' },
  shipped:    { bg: '#f0fdf4', color: '#15803d' },
  delivered:  { bg: '#dcfce7', color: '#16a34a' },
  cancelled:  { bg: '#fee2e2', color: '#dc2626' },
};

const OrdersPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data, isLoading } = useOrders({
    page,
    limit: 20,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });
  const updateStatus = useUpdateOrderStatus();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Orders</h1>
        <span style={{ fontSize: 13, color: '#6b7280' }}>{data?.total ?? 0} total</span>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['all', ...Object.keys(ORDER_STATUS_LABELS)].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            style={{
              padding: '5px 12px', fontSize: 12, cursor: 'pointer', borderRadius: 5,
              border: '1px solid #e5e7eb',
              background: statusFilter === s ? '#111827' : '#fff',
              color: statusFilter === s ? '#fff' : '#374151',
              fontWeight: statusFilter === s ? 600 : 400,
            }}
          >
            {s === 'all' ? 'All' : ORDER_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {isLoading ? <p style={{ color: '#6b7280' }}>Loading…</p> : (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={th}>Order #</th>
                <th style={th}>Date</th>
                <th style={th}>Customer</th>
                <th style={th}>Items</th>
                <th style={{ ...th, textAlign: 'right' }}>Total</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.orders?.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    style={{ borderTop: '1px solid #f3f4f6', cursor: 'pointer' }}
                    onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                  >
                    <td style={td}><span style={{ fontWeight: 600, color: '#2563eb' }}>{order.orderNumber}</span></td>
                    <td style={{ ...td, color: '#6b7280' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={td}>{order.shippingAddress?.name}</td>
                    <td style={td}>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600 }}>₹{order.pricing?.total?.toLocaleString()}</td>
                    <td style={td}>
                      <span style={{
                        background: STATUS_COLORS[order.status]?.bg ?? '#f3f4f6',
                        color: STATUS_COLORS[order.status]?.color ?? '#374151',
                        padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                      }}>{ORDER_STATUS_LABELS[order.status] ?? order.status}</span>
                    </td>
                    <td style={td}>
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus.mutate({ id: order._id, status: e.target.value })}
                        style={{ fontSize: 12, padding: '3px 6px', border: '1px solid #d1d5db', borderRadius: 4, cursor: 'pointer' }}
                      >
                        {Object.keys(ORDER_STATUS_LABELS).map((s) => (
                          <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expandedId === order._id && (
                    <tr style={{ background: '#f9fafb' }}>
                      <td colSpan={7} style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 12 }}>Items</div>
                            {order.items?.map((item, i) => (
                              <div key={i} style={{ fontSize: 12, color: '#374151', marginBottom: 3 }}>
                                {item.name} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString()}
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 12 }}>Shipping</div>
                            <div style={{ fontSize: 12, color: '#374151' }}>
                              {order.shippingAddress?.name}<br />
                              {order.shippingAddress?.addressLine1}<br />
                              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}<br />
                              📞 {order.shippingAddress?.phone}
                            </div>
                          </div>
                        </div>
                        <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
                          Subtotal: ₹{order.pricing?.subtotal?.toLocaleString()} |
                          Shipping: ₹{order.pricing?.shipping?.toLocaleString()} |
                          Tax: ₹{order.pricing?.tax?.toLocaleString()} |
                          <strong> Total: ₹{order.pricing?.total?.toLocaleString()}</strong>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {!data?.orders?.length && (
                <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {data && data.total > 20 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          {page > 1 && <button onClick={() => setPage(p => p - 1)} style={btnStyle}>← Prev</button>}
          <span style={{ alignSelf: 'center', fontSize: 13, color: '#6b7280' }}>Page {page}</span>
          {page * 20 < data.total && <button onClick={() => setPage(p => p + 1)} style={btnStyle}>Next →</button>}
        </div>
      )}
    </div>
  );
};

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', color: '#6b7280', fontWeight: 500, fontSize: 12 };
const td: React.CSSProperties = { padding: '10px 16px' };
const btnStyle: React.CSSProperties = { padding: '6px 14px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, cursor: 'pointer', fontSize: 13 };

export default OrdersPage;

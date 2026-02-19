import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useAttachments } from '@/hooks/useAttachments';
import { useCollections } from '@/hooks/useCollections';

const StatCard: React.FC<{ label: string; value: string | number; color?: string }> = ({
  label, value, color = '#111827'
}) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: '20px 24px',
    flex: 1,
    minWidth: 160,
  }}>
    <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { data: productsData } = useProducts({ limit: 1 });
  const { data: ordersData } = useOrders({ limit: 1 });
  const { data: attachmentsData } = useAttachments({ status: 'unlinked', limit: 1 });
  const { data: collectionsData } = useCollections();

  const totalRevenue = ordersData?.orders
    ?.filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.pricing?.total ?? 0), 0) ?? 0;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: 28 }}>Welcome to Kuber Brass Store Admin</p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Total Products" value={productsData?.total ?? '—'} />
        <StatCard label="Total Orders" value={ordersData?.total ?? '—'} />
        <StatCard label="Collections" value={collectionsData?.collections?.length ?? '—'} />
        <StatCard
          label="Unlinked Assets"
          value={attachmentsData?.total ?? '—'}
          color={attachmentsData?.total ? '#ef4444' : '#111827'}
        />
        <StatCard
          label="Revenue (visible orders)"
          value={`₹${totalRevenue.toLocaleString()}`}
          color="#16a34a"
        />
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Recent Orders</h2>
        {ordersData?.orders?.length ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6b7280' }}>Order #</th>
                <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6b7280' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '6px 8px', color: '#6b7280' }}>Total</th>
                <th style={{ textAlign: 'left', padding: '6px 8px', color: '#6b7280' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.orders.slice(0, 8).map((o) => (
                <tr key={o._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '8px' }}>{o.orderNumber}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      background: o.status === 'delivered' ? '#dcfce7' : o.status === 'cancelled' ? '#fee2e2' : '#fef9c3',
                      color: o.status === 'delivered' ? '#16a34a' : o.status === 'cancelled' ? '#dc2626' : '#92400e',
                      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                    }}>{o.status}</span>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>₹{o.pricing?.total?.toLocaleString()}</td>
                  <td style={{ padding: '8px', color: '#6b7280' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#6b7280' }}>No orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

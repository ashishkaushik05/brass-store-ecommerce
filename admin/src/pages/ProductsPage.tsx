import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';

const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ page, limit: 20, search: search || undefined });
  const deleteProduct = useDeleteProduct();

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Products</h1>
        <Link
          to="/products/new"
          style={{
            padding: '8px 18px', background: '#111827', color: '#fff',
            borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 500,
          }}
        >
          + New Product
        </Link>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products…"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        style={{
          width: '100%', maxWidth: 360, padding: '8px 12px',
          border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13,
          outline: 'none', background: '#fff', marginBottom: 16,
        }}
      />

      {isLoading ? (
        <p style={{ color: '#6b7280' }}>Loading…</p>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: '#6b7280', fontWeight: 500 }}>Product</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: '#6b7280', fontWeight: 500 }}>SKU</th>
                <th style={{ textAlign: 'left', padding: '10px 16px', color: '#6b7280', fontWeight: 500 }}>Category</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: '#6b7280', fontWeight: 500 }}>Price</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: '#6b7280', fontWeight: 500 }}>Stock</th>
                <th style={{ textAlign: 'center', padding: '10px 16px', color: '#6b7280', fontWeight: 500 }}>Status</th>
                <th style={{ textAlign: 'right', padding: '10px 16px', color: '#6b7280', fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.products?.map((p) => (
                <tr key={p._id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p.images?.[0] && (
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.name}</div>
                        <div style={{ color: '#9ca3af', fontSize: 11 }}>{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{p.sku}</td>
                  <td style={{ padding: '10px 16px' }}>{p.category}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>₹{p.price.toLocaleString()}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', color: p.stock < 5 ? '#ef4444' : '#111827' }}>
                    {p.stock}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <span style={{
                      background: p.isActive ? '#dcfce7' : '#f3f4f6',
                      color: p.isActive ? '#16a34a' : '#6b7280',
                      padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                    }}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    <Link
                      to={`/products/${p.slug}`}
                      style={{ color: '#2563eb', textDecoration: 'none', marginRight: 12, fontSize: 12 }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => { if (window.confirm(`Delete "${p.name}"?`)) deleteProduct.mutate(p.slug); }}
                      style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!data?.products?.length && (
                <tr>
                  <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                    No products found.
                  </td>
                </tr>
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

const btnStyle: React.CSSProperties = {
  padding: '6px 14px', background: '#fff', border: '1px solid #e5e7eb',
  borderRadius: 6, cursor: 'pointer', fontSize: 13,
};

export default ProductsPage;

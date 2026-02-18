import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Sidebar from './Sidebar';

const AdminLayout: React.FC = () => {
  const { user } = useUser();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          padding: '0 24px',
          height: 56,
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 12,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            {user?.primaryEmailAddress?.emailAddress}
          </span>
          {user?.imageUrl && (
            <img
              src={user.imageUrl}
              alt="avatar"
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
            />
          )}
        </header>

        {/* Main content */}
        <main style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

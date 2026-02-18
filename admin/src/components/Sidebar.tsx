import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⬛' },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/collections', label: 'Collections', icon: '🗂️' },
  { to: '/orders', label: 'Orders', icon: '🧾' },
  { to: '/attachments', label: 'Attachments', icon: '🖼️' },
  { to: '/reviews', label: 'Reviews', icon: '⭐' },
];

const Sidebar: React.FC = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#111827',
      color: '#f9fafb',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>PITALYA</div>
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Admin Dashboard</div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 20px',
              color: isActive ? '#f9fafb' : '#9ca3af',
              background: isActive ? '#1f2937' : 'transparent',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
              transition: 'all 0.15s',
            })}
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1f2937' }}>
        <button
          onClick={() => signOut(() => navigate('/login'))}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'transparent',
            color: '#ef4444',
            border: '1px solid #374151',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            textAlign: 'left',
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

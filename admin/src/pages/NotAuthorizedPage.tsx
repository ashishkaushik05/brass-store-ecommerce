import React from 'react';

const NotAuthorizedPage: React.FC = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', background: '#f9fafb',
  }}>
    <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Not Authorized</h1>
    <p style={{ color: '#6b7280', textAlign: 'center', maxWidth: 380 }}>
      Your account does not have admin access. Contact the system administrator to request access.
    </p>
    <p style={{ color: '#9ca3af', fontSize: 12, marginTop: 24 }}>
      Admin role must be set in Clerk → Users → Public Metadata: <code>{"{ \"role\": \"admin\" }"}</code>
    </p>
  </div>
);

export default NotAuthorizedPage;

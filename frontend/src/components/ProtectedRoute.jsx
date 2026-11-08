import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--forest-green)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}></div>
        <p style={{ color: 'var(--earth-muted)', fontSize: '0.9rem' }}>Verifying session...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    const hasRole = allowedRoles.includes(userRole) || user?.is_admin_user || userRole === 'ADMIN';

    if (!hasRole) {
      return (
        <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            backgroundColor: '#FFF',
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--error-bg)',
              color: 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <ShieldAlert size={32} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Access Denied</h2>
            <p style={{ marginBottom: '1.75rem', fontSize: '0.95rem' }}>
              Your account role (<strong>{userRole}</strong>) does not have authorization to view this section.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/" className="btn btn-outline">
                <ArrowLeft size={16} /> Return Home
              </Link>
              {userRole === 'CUSTOMER' && (
                <Link to="/marketplace" className="btn btn-primary">
                  Go to Marketplace
                </Link>
              )}
              {userRole === 'SELLER' && (
                <Link to="/seller/dashboard" className="btn btn-primary">
                  Seller Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;

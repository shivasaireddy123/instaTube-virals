import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  ShoppingCart, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Store, 
  ShieldAlert, 
  Compass, 
  Package, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isCustomer, isSeller, isAdmin, sellerStatus, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px'
      }}>
        {/* Brand Logo */}
        <Link to={isAuthenticated && isCustomer ? '/marketplace' : '/'} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: 'var(--forest-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.45rem',
              fontWeight: '700',
              color: 'var(--forest-green)',
              letterSpacing: '-0.02em',
              display: 'block',
              lineHeight: 1.1
            }}>
              InstaTube <span style={{ color: 'var(--terracotta)' }}>Virals</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--earth-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              Artisan & Farm Direct
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          {/* Guest Links */}
          {!isAuthenticated && (
            <>
              <Link to="/" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/') ? 'var(--forest-green)' : 'var(--earth-dark)',
                borderBottom: isActive('/') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                Home
              </Link>
              <Link to="/about" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/about') ? 'var(--forest-green)' : 'var(--earth-dark)',
                borderBottom: isActive('/about') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                Our Story
              </Link>
              <Link to="/register-seller" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: 'var(--terracotta)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Store size={17} /> Become a Seller
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            </>
          )}

          {/* Customer Links */}
          {isAuthenticated && isCustomer && (
            <>
              <Link to="/marketplace" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/marketplace') ? 'var(--forest-green)' : 'var(--earth-dark)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderBottom: isActive('/marketplace') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                <Compass size={18} /> Marketplace
              </Link>
              <Link to="/orders" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/orders') ? 'var(--forest-green)' : 'var(--earth-dark)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderBottom: isActive('/orders') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                <Package size={18} /> My Orders
              </Link>
              <Link to="/cart" style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--bg-muted)',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--forest-green)'
              }}>
                <ShoppingCart size={19} />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span style={{
                    backgroundColor: 'var(--terracotta)',
                    color: '#FFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    padding: '0.15rem 0.5rem',
                    marginLeft: '0.2rem'
                  }}>
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" style={{
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--earth-dark)'
              }}>
                <UserIcon size={18} /> {user?.first_name || 'Account'}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Sign Out">
                <LogOut size={16} /> Sign Out
              </button>
            </>
          )}

          {/* Seller Links */}
          {isAuthenticated && isSeller && (
            <>
              <Link to="/seller/dashboard" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/seller/dashboard') ? 'var(--forest-green)' : 'var(--earth-dark)',
                borderBottom: isActive('/seller/dashboard') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                Seller Hub
              </Link>
              <Link to="/seller/products" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/seller/products') ? 'var(--forest-green)' : 'var(--earth-dark)',
                borderBottom: isActive('/seller/products') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                My Products
              </Link>
              <Link to="/seller/orders" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/seller/orders') ? 'var(--forest-green)' : 'var(--earth-dark)',
                borderBottom: isActive('/seller/orders') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                Store Orders
              </Link>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 600,
                backgroundColor: sellerStatus === 'APPROVED' ? 'var(--success-bg)' : 'var(--warning-bg)',
                color: sellerStatus === 'APPROVED' ? 'var(--success)' : 'var(--warning)'
              }}>
                {sellerStatus === 'APPROVED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                <span>{sellerStatus === 'APPROVED' ? 'Verified Seller' : 'Pending Approval'}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={16} /> Sign Out
              </button>
            </>
          )}

          {/* Admin Links */}
          {isAuthenticated && isAdmin && (
            <>
              <Link to="/admin/dashboard" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/admin/dashboard') ? 'var(--forest-green)' : 'var(--earth-dark)',
                borderBottom: isActive('/admin/dashboard') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                Overview
              </Link>
              <Link to="/admin/sellers" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/admin/sellers') ? 'var(--forest-green)' : 'var(--earth-dark)',
                borderBottom: isActive('/admin/sellers') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                Sellers Review
              </Link>
              <Link to="/admin/products" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/admin/products') ? 'var(--forest-green)' : 'var(--earth-dark)',
                borderBottom: isActive('/admin/products') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                Products Curation
              </Link>
              <Link to="/admin/categories" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/admin/categories') ? 'var(--forest-green)' : 'var(--earth-dark)',
                borderBottom: isActive('/admin/categories') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                Categories
              </Link>
              <Link to="/admin/orders" style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: isActive('/admin/orders') ? 'var(--forest-green)' : 'var(--earth-dark)',
                borderBottom: isActive('/admin/orders') ? '2px solid var(--forest-green)' : 'none',
                paddingBottom: '4px'
              }}>
                Orders
              </Link>
              <div style={{
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'var(--terracotta)',
                color: '#FFF'
              }}>
                ADMIN
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={16} /> Sign Out
              </button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--earth-dark)'
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-light)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {!isAuthenticated ? (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Our Story</Link>
              <Link to="/register-seller" onClick={() => setMobileMenuOpen(false)}>Become a Seller</Link>
              <Link to="/login" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          ) : isCustomer ? (
            <>
              <Link to="/marketplace" onClick={() => setMobileMenuOpen(false)}>Marketplace</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Cart ({cartCount})</Link>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="btn btn-outline">Sign Out</button>
            </>
          ) : isSeller ? (
            <>
              <Link to="/seller/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/seller/products" onClick={() => setMobileMenuOpen(false)}>My Products</Link>
              <Link to="/seller/orders" onClick={() => setMobileMenuOpen(false)}>Store Orders</Link>
              <button onClick={handleLogout} className="btn btn-outline">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>Overview</Link>
              <Link to="/admin/sellers" onClick={() => setMobileMenuOpen(false)}>Sellers</Link>
              <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link to="/admin/categories" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link to="/admin/orders" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
              <button onClick={handleLogout} className="btn btn-outline">Sign Out</button>
            </>
          )}
        </div>
      )}

      {/* Responsive CSS helper */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

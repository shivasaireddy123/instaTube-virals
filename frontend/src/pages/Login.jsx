import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Lock, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const loggedUser = await login(email, password);

      // Route based on user role
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'ADMIN' || loggedUser.is_admin_user) {
        navigate('/admin/dashboard', { replace: true });
      } else if (loggedUser.role === 'SELLER') {
        navigate('/seller/dashboard', { replace: true });
      } else {
        navigate('/marketplace', { replace: true });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Fill for easy testing
  const setDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: 'var(--forest-green)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <ShoppingBag size={26} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--earth-muted)', fontSize: '0.925rem' }}>
            Sign in to access your curated marketplace, orders, and dashboard.
          </p>
        </div>

        {/* Demo Quick-Fill Bar */}
        <div style={{
          backgroundColor: 'var(--bg-cream)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--forest-green)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <UserCheck size={14} /> Quick Demo Logins:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setDemoCredentials('customer@instatube.com', 'Customer@12345')}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                backgroundColor: '#FFF',
                cursor: 'pointer'
              }}
            >
              Buyer (Aria)
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('artisan@instatube.com', 'Seller@12345')}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                backgroundColor: '#FFF',
                cursor: 'pointer'
              }}
            >
              Seller (EarthCrafts)
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('newcrafter@instatube.com', 'Seller@12345')}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                backgroundColor: '#FFF',
                cursor: 'pointer'
              }}
            >
              Pending Seller (TimberWood)
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin@instatube.com', 'Admin@12345')}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.55rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--terracotta)',
                color: 'var(--terracotta)',
                backgroundColor: '#FFF',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Admin (Eleanor)
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={18} color="var(--earth-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} color="var(--earth-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '1.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--earth-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--forest-green)', fontWeight: 600 }}>
            Register as Customer
          </Link>{' '}
          or{' '}
          <Link to="/register-seller" style={{ color: 'var(--terracotta)', fontWeight: 600 }}>
            Join as Seller
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

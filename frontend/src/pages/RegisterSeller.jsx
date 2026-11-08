import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, User, Mail, Lock, Phone, MapPin, FileText, AlertCircle, ArrowRight } from 'lucide-react';

const RegisterSeller = () => {
  const { registerSeller } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    business_name: '',
    business_description: '',
    business_address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.business_name || !formData.phone || !formData.business_address) {
      setError('Please fill in all required fields (Name, Email, Password, Phone, Store Name, and Store Address).');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await registerSeller(formData);
      navigate('/seller/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        const val = data[firstKey];
        setError(Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val));
      } else {
        setError('Seller registration failed. Please review your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '580px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: 'var(--terracotta-light)',
            color: 'var(--terracotta)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <Store size={26} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Become an Approved Seller</h1>
          <p style={{ color: 'var(--earth-muted)', fontSize: '0.925rem' }}>
            List your handmade craft, organic harvest, or artisan products on our curated platform.
          </p>
        </div>

        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Creator Personal Details */}
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--forest-green)',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '0.35rem'
          }}>
            1. Creator Details
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Your Full Name *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="e.g. Mateo Rivera"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <User size={18} color="var(--earth-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="+1 555-0188"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
                <Phone size={18} color="var(--earth-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Login Email *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="seller@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail size={18} color="var(--earth-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password (min 6 chars) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Lock size={18} color="var(--earth-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          {/* Business & Workshop Details */}
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--terracotta)',
            marginTop: '1rem',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '0.35rem'
          }}>
            2. Workshop / Farm Profile
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="business_name">Store / Brand Name *</label>
            <div style={{ position: 'relative' }}>
              <input
                id="business_name"
                name="business_name"
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="e.g. GreenValley Organics"
                value={formData.business_name}
                onChange={handleChange}
                required
              />
              <Store size={18} color="var(--earth-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="business_description">Craft / Agriculture Description</label>
            <div style={{ position: 'relative' }}>
              <textarea
                id="business_description"
                name="business_description"
                rows="2"
                className="form-textarea"
                style={{ paddingLeft: '2.5rem', resize: 'vertical' }}
                placeholder="Tell us what you craft or grow, your techniques, and material sourcing..."
                value={formData.business_description}
                onChange={handleChange}
              />
              <FileText size={18} color="var(--earth-muted)" style={{ position: 'absolute', left: '0.85rem', top: '1rem' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="business_address">Workshop / Farm Address *</label>
            <div style={{ position: 'relative' }}>
              <textarea
                id="business_address"
                name="business_address"
                rows="2"
                className="form-textarea"
                style={{ paddingLeft: '2.5rem', resize: 'vertical' }}
                placeholder="Full workshop or farm dispatch address"
                value={formData.business_address}
                onChange={handleChange}
                required
              />
              <MapPin size={18} color="var(--earth-muted)" style={{ position: 'absolute', left: '0.85rem', top: '1rem' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-terracotta btn-lg"
            style={{ width: '100%', marginBottom: '1.5rem' }}
          >
            {loading ? 'Submitting Application...' : 'Submit Seller Application'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--earth-muted)' }}>
          Already registered as a seller?{' '}
          <Link to="/login" style={{ color: 'var(--forest-green)', fontWeight: 600 }}>
            Sign In to Seller Hub
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSeller;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  ArrowLeft, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight 
} from 'lucide-react';

const Checkout = () => {
  const { cart, fetchCart, showToast } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const items = cart.items || [];

  const [formData, setFormData] = useState({
    shipping_name: user?.first_name || '',
    shipping_phone: user?.phone || user?.customer_profile?.phone || '',
    street_address: user?.customer_profile?.address || '',
    city: '',
    state: '',
    pincode: '',
    payment_method: 'COD',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved address if available
  useEffect(() => {
    const loadAddress = async () => {
      try {
        const res = await api.get('/accounts/addresses/');
        if (res.data && res.data.length > 0) {
          const defaultAddr = res.data.find((a) => a.is_default) || res.data[0];
          setFormData((prev) => ({
            ...prev,
            shipping_name: defaultAddr.full_name || prev.shipping_name,
            shipping_phone: defaultAddr.phone || prev.shipping_phone,
            street_address: defaultAddr.street_address || prev.street_address,
            city: defaultAddr.city || '',
            state: defaultAddr.state || '',
            pincode: defaultAddr.pincode || '',
          }));
        }
      } catch (err) {
        console.error('Failed to load address', err);
      }
    };
    loadAddress();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.shipping_name || !formData.shipping_phone || !formData.street_address) {
      setError('Please provide recipient name, contact phone, and full delivery address.');
      return;
    }

    const fullShippingAddress = `${formData.street_address}${formData.city ? `, ${formData.city}` : ''}${formData.state ? `, ${formData.state}` : ''}${formData.pincode ? ` - ${formData.pincode}` : ''}`;

    try {
      setLoading(true);
      const res = await api.post('/orders/checkout/', {
        shipping_name: formData.shipping_name,
        shipping_phone: formData.shipping_phone,
        shipping_address: fullShippingAddress,
        payment_method: formData.payment_method,
      });

      // Clear local cart state
      await fetchCart();
      showToast(res.data.message || 'Order placed successfully!', 'success');
      navigate('/orders', { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to place order. Please review your cart.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#FFF', padding: '3rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>No Items to Checkout</h2>
          <p style={{ color: 'var(--earth-muted)', marginBottom: '1.5rem' }}>Your shopping cart is currently empty.</p>
          <Link to="/marketplace" className="btn btn-primary">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/cart" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--earth-muted)',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            <ArrowLeft size={16} /> Return to Cart
          </Link>
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Checkout & Confirmation</h1>

        {error && (
          <div className="alert-box alert-error" style={{ marginBottom: '1.5rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start'
          }}>
            {/* Left: Shipping & Payment */}
            <div style={{ gridColumn: 'span 2' }}>
              {/* Shipping Address */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={22} color="var(--forest-green)" /> Delivery Address
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="shipping_name">Recipient Full Name *</label>
                    <input
                      id="shipping_name"
                      name="shipping_name"
                      type="text"
                      className="form-input"
                      value={formData.shipping_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="shipping_phone">Contact Phone *</label>
                    <input
                      id="shipping_phone"
                      name="shipping_phone"
                      type="tel"
                      className="form-input"
                      value={formData.shipping_phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="street_address">Street Address *</label>
                  <textarea
                    id="street_address"
                    name="street_address"
                    rows="2"
                    className="form-textarea"
                    placeholder="House/Apt number, building, street, area"
                    value={formData.street_address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Springfield"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="state">State / Province</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Oregon"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="pincode">Pincode / Postal Code</label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      className="form-input"
                      placeholder="e.g. 97477"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                padding: '2rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={22} color="var(--terracotta)" /> Payment Method
                </h2>

                <div style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--forest-green)',
                  backgroundColor: 'var(--forest-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--forest-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFF'
                    }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFF' }}></div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--forest-green)' }}>Cash on Delivery (COD)</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--earth-muted)' }}>Pay comfortably upon package inspection at your door.</div>
                    </div>
                  </div>
                  <span className="badge badge-approved">Safe & Trusted</span>
                </div>
              </div>
            </div>

            {/* Right: Order Review */}
            <div>
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                padding: '2rem',
                position: 'sticky',
                top: '90px'
              }}>
                <h2 style={{ fontSize: '1.45rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
                  Order Summary
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: '240px', overflowY: 'auto' }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span style={{ color: 'var(--earth-dark)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.quantity}x {item.product.name}
                      </span>
                      <span style={{ fontWeight: 600 }}>${parseFloat(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  fontSize: '0.9rem',
                  color: 'var(--earth-muted)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Shipping</span>
                    <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', color: 'var(--earth-dark)', fontWeight: 700, paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <span>Total Amount</span>
                    <span style={{ color: 'var(--forest-green)', fontFamily: 'var(--font-serif)', fontSize: '1.65rem' }}>
                      ${parseFloat(cart.total_price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '1.75rem' }}
                >
                  {loading ? 'Processing Order...' : 'Place Order (COD)'} <ArrowRight size={18} />
                </button>

                <p style={{ fontSize: '0.785rem', color: 'var(--earth-muted)', textAlign: 'center', marginTop: '1rem' }}>
                  By clicking Place Order, your order will be reserved and sent directly to the artisans for packaging.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

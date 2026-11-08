import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { 
  Truck, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Package 
} from 'lucide-react';

const SellerOrders = () => {
  const { showToast } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders/seller/items/');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load seller orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      setUpdatingId(itemId);
      const res = await api.patch(`/orders/seller/items/${itemId}/status/`, {
        fulfillment_status: newStatus,
      });
      showToast(res.data.message || `Status updated to ${newStatus}`, 'success');
      setItems(items.map((it) => (it.id === itemId ? { ...it, fulfillment_status: newStatus } : it)));
    } catch (err) {
      console.error(err);
      showToast('Failed to update fulfillment status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <Link to="/seller/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--earth-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
              <ArrowLeft size={15} /> Back to Seller Hub
            </Link>
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.25rem' }}>Store Orders & Fulfillment</h1>
          <p style={{ color: 'var(--earth-muted)' }}>Manage dispatch, shipping milestones, and delivery statuses for your customer orders.</p>
        </div>

        {loading ? (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--forest-green)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem auto'
            }}></div>
            <p style={{ color: 'var(--earth-muted)' }}>Loading store orders...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : items.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <Truck size={48} color="var(--earth-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Orders Found</h3>
            <p style={{ color: 'var(--earth-muted)', maxWidth: '400px', margin: '0 auto' }}>
              You haven't received any customer orders yet. Once conscious shoppers purchase your goods, they will appear here.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Update Fulfillment</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: 'var(--radius-sm)',
                              objectFit: 'cover',
                              border: '1px solid var(--border-color)',
                              flexShrink: 0
                            }}
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)' }}>Item #{item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>${parseFloat(item.purchase_price).toFixed(2)}</td>
                    <td style={{ fontWeight: 600 }}>{item.quantity}</td>
                    <td style={{ fontWeight: 700, color: 'var(--forest-green)', fontFamily: 'var(--font-serif)', fontSize: '1.05rem' }}>
                      ${parseFloat(item.subtotal).toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge ${item.fulfillment_status === 'DELIVERED' ? 'badge-approved' : item.fulfillment_status === 'CANCELLED' ? 'badge-error' : 'badge-pending'}`}>
                        {item.fulfillment_status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <select
                        className="form-select"
                        style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem', display: 'inline-block' }}
                        value={item.fulfillment_status}
                        disabled={updatingId === item.id}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      >
                        <option value="PENDING">Pending Packaging</option>
                        <option value="PROCESSING">In Workshop / Processing</option>
                        <option value="SHIPPED">Dispatched / Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;

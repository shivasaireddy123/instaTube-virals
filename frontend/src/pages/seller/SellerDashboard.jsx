import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  ShoppingBag, 
  Store, 
  Truck, 
  DollarSign 
} from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/seller/');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load seller stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--forest-green)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem auto'
        }}></div>
        <p style={{ color: 'var(--earth-muted)' }}>Loading Seller Hub...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const stats = data?.stats || {};
  const profile = data?.seller_profile || {};
  const isApproved = profile.approval_status === 'APPROVED';
  const isPending = profile.approval_status === 'PENDING';
  const isRejected = profile.approval_status === 'REJECTED';

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Store Title & Status Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 2.5rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <span className={`badge ${isApproved ? 'badge-approved' : isRejected ? 'badge-error' : 'badge-pending'}`}>
                {isApproved ? 'Verified Approved Seller' : isRejected ? 'Application Rejected' : 'Awaiting Administrator Review'}
              </span>
            </div>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '0.25rem' }}>
              {profile.business_name || `${user?.first_name}'s Workshop`}
            </h1>
            <p style={{ color: 'var(--earth-muted)', fontSize: '0.95rem' }}>
              Seller Management Hub &bull; Oversee your handcrafted inventory and order fulfillment
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isApproved ? (
              <Link to="/seller/products/add" className="btn btn-primary">
                <Plus size={18} /> Add New Product
              </Link>
            ) : (
              <button
                className="btn btn-primary"
                disabled
                title="Account approval required to list products"
              >
                <Plus size={18} /> Add New Product
              </button>
            )}
            <Link to="/seller/products" className="btn btn-outline">
              <Package size={16} /> Manage Catalog
            </Link>
          </div>
        </div>

        {/* Pending / Rejected Notice Banner */}
        {isPending && (
          <div className="alert-box alert-warning" style={{ marginBottom: '2rem' }}>
            <AlertTriangle size={22} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                Seller Account Under Review
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                Your seller application has been received and is currently undergoing review by the platform administrator. You will be able to list and publish products in the marketplace once verified.
              </div>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="alert-box alert-error" style={{ marginBottom: '2rem' }}>
            <AlertTriangle size={22} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                Seller Application Not Approved
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                Reason: {profile.rejection_reason || 'Please contact platform administration for guidance.'}
              </div>
            </div>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid-cols-4" style={{ marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--earth-muted)', textTransform: 'uppercase' }}>Total Products</span>
              <div style={{ padding: '0.4rem', backgroundColor: 'var(--forest-light)', borderRadius: '8px', color: 'var(--forest-green)' }}>
                <Package size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--earth-dark)' }}>
              {stats.total_products || 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)', marginTop: '0.35rem' }}>
              In your seller catalog
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--earth-muted)', textTransform: 'uppercase' }}>Approved Active</span>
              <div style={{ padding: '0.4rem', backgroundColor: 'var(--success-bg)', borderRadius: '8px', color: 'var(--success)' }}>
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--forest-green)' }}>
              {stats.approved_products || 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)', marginTop: '0.35rem' }}>
              Live in marketplace
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--earth-muted)', textTransform: 'uppercase' }}>Pending Review</span>
              <div style={{ padding: '0.4rem', backgroundColor: 'var(--warning-bg)', borderRadius: '8px', color: 'var(--warning)' }}>
                <Clock size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>
              {stats.pending_products || 0}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)', marginTop: '0.35rem' }}>
              Awaiting admin review
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--earth-muted)', textTransform: 'uppercase' }}>Earned Revenue</span>
              <div style={{ padding: '0.4rem', backgroundColor: 'var(--terracotta-light)', borderRadius: '8px', color: 'var(--terracotta)' }}>
                <DollarSign size={20} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--terracotta)', fontFamily: 'var(--font-serif)' }}>
              ${stats.total_revenue ? stats.total_revenue.toFixed(2) : '0.00'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)', marginTop: '0.35rem' }}>
              From {stats.units_sold || 0} items fulfilled
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-cream)'
          }}>
            <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Truck size={20} color="var(--forest-green)" /> Recent Store Orders
            </h2>
            <Link to="/seller/orders" className="btn btn-outline btn-sm">
              View All Orders
            </Link>
          </div>

          {(!data?.recent_orders || data.recent_orders.length === 0) ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--earth-muted)' }}>
              No orders have been placed for your products yet. Keep crafting!
            </div>
          ) : (
            <div className="table-responsive" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent_orders.map((item) => (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                      <td>${parseFloat(item.purchase_price).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td style={{ fontWeight: 700, color: 'var(--forest-green)' }}>
                        ${parseFloat(item.subtotal).toFixed(2)}
                      </td>
                      <td>
                        <span className={`badge ${item.fulfillment_status === 'DELIVERED' ? 'badge-approved' : item.fulfillment_status === 'CANCELLED' ? 'badge-error' : 'badge-pending'}`}>
                          {item.fulfillment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

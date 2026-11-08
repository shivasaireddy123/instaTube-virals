import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck 
} from 'lucide-react';

const AdminDashboard = () => {
  const { showToast } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/admin/');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Quick Approve / Reject Seller
  const handleSellerApproval = async (sellerId, status) => {
    try {
      setActionLoading(true);
      await api.post(`/sellers/admin/approve/${sellerId}/`, {
        approval_status: status,
      });
      showToast(`Seller status updated to ${status}!`, 'success');
      fetchStats();
    } catch (err) {
      showToast('Failed to update seller status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Approve / Reject Product
  const handleProductApproval = async (productId, status) => {
    try {
      setActionLoading(true);
      await api.post(`/products/admin/approve/${productId}/`, {
        status: status,
      });
      showToast(`Product ${status.toLowerCase()}!`, 'success');
      fetchStats();
    } catch (err) {
      showToast('Failed to update product status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !data) {
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
        <p style={{ color: 'var(--earth-muted)' }}>Loading platform analytics...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const stats = data?.stats || {};
  const pendingSellers = data?.pending_sellers || [];
  const pendingProducts = data?.pending_products || [];
  const recentOrders = data?.recent_orders || [];

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--terracotta)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
              <ShieldCheck size={18} /> Central Platform Control
            </div>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '0.25rem' }}>Marketplace Overview</h1>
            <p style={{ color: 'var(--earth-muted)' }}>
              Manage seller applications, product approvals, and platform transactions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin/sellers" className="btn btn-outline">
              Review Sellers ({stats.pending_sellers_count || 0})
            </Link>
            <Link to="/admin/products" className="btn btn-primary">
              Curation Queue ({stats.pending_products_count || 0})
            </Link>
          </div>
        </div>

        {/* 6 Metric KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--earth-muted)', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Customers</span>
              <Users size={18} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>{stats.total_customers || 0}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--terracotta)', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Sellers</span>
              <Store size={18} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>{stats.total_sellers || 0}</div>
            <div style={{ fontSize: '0.75rem', color: stats.pending_sellers_count > 0 ? 'var(--warning)' : 'var(--earth-muted)' }}>
              {stats.pending_sellers_count || 0} pending review
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--forest-green)', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Products</span>
              <Package size={18} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>{stats.total_products || 0}</div>
            <div style={{ fontSize: '0.75rem', color: stats.pending_products_count > 0 ? 'var(--warning)' : 'var(--earth-muted)' }}>
              {stats.pending_products_count || 0} awaiting approval
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Live Approved</span>
              <CheckCircle2 size={18} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--forest-green)' }}>
              {stats.approved_products || 0}
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--earth-muted)', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Orders Placed</span>
              <ShoppingBag size={18} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700 }}>{stats.total_orders || 0}</div>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#FFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--terracotta)', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Total GMV</span>
              <DollarSign size={18} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--terracotta)', fontFamily: 'var(--font-serif)' }}>
              ${stats.total_revenue ? stats.total_revenue.toFixed(2) : '0.00'}
            </div>
          </div>
        </div>

        {/* 2-Column Split: Pending Sellers & Pending Products */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}>
          {/* Pending Sellers Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: 'var(--bg-cream)',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--warning)" /> Pending Sellers ({pendingSellers.length})
              </h2>
              <Link to="/admin/sellers" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest-green)' }}>
                View All
              </Link>
            </div>

            {pendingSellers.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--earth-muted)' }}>
                All seller registrations have been reviewed.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {pendingSellers.map((seller) => (
                  <div
                    key={seller.id}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderBottom: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{seller.business_name}</div>
                      <div style={{ fontSize: '0.825rem', color: 'var(--earth-muted)' }}>
                        Owner: {seller.user?.first_name} &bull; {seller.phone}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--earth-dark)', marginTop: '0.2rem' }}>
                        {seller.business_description || 'Artisan crafter / grower'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                      <button
                        onClick={() => handleSellerApproval(seller.id, 'APPROVED')}
                        disabled={actionLoading}
                        className="btn btn-sm"
                        style={{ backgroundColor: 'var(--forest-green)', color: '#FFF' }}
                        title="Approve Seller"
                      >
                        <CheckCircle2 size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleSellerApproval(seller.id, 'REJECTED')}
                        disabled={actionLoading}
                        className="btn btn-sm btn-outline"
                        style={{ color: 'var(--error)' }}
                        title="Reject Seller"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Products Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: 'var(--bg-cream)',
              borderBottom: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color="var(--terracotta)" /> Pending Products ({pendingProducts.length})
              </h2>
              <Link to="/admin/products" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest-green)' }}>
                View All
              </Link>
            </div>

            {pendingProducts.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--earth-muted)' }}>
                All product submissions have been approved or reviewed.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {pendingProducts.map((product) => {
                  const img = product.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80';
                  return (
                    <div
                      key={product.id}
                      style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={img}
                          alt={product.name}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                            border: '1px solid var(--border-color)'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{product.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)' }}>
                            ${parseFloat(product.price).toFixed(2)} &bull; Maker: {product.seller?.business_name}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                        <button
                          onClick={() => handleProductApproval(product.id, 'APPROVED')}
                          disabled={actionLoading}
                          className="btn btn-sm btn-primary"
                          title="Approve Product"
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleProductApproval(product.id, 'REJECTED')}
                          disabled={actionLoading}
                          className="btn btn-sm btn-outline"
                          style={{ color: 'var(--error)' }}
                          title="Reject Product"
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.25rem 1.75rem',
            backgroundColor: 'var(--bg-cream)',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={20} color="var(--forest-green)" /> Recent Marketplace Transactions
            </h2>
            <Link to="/admin/orders" className="btn btn-outline btn-sm">
              All Orders
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--earth-muted)' }}>
              No orders placed yet.
            </div>
          ) : (
            <div className="table-responsive" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((ord) => (
                    <tr key={ord.id}>
                      <td style={{ fontWeight: 700 }}>#{ord.order_number}</td>
                      <td>{ord.shipping_name || ord.customer_name}</td>
                      <td>{ord.items?.length || 0} item(s)</td>
                      <td style={{ fontWeight: 700, color: 'var(--forest-green)' }}>
                        ${parseFloat(ord.total_amount).toFixed(2)}
                      </td>
                      <td>{new Date(ord.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${ord.order_status === 'DELIVERED' ? 'badge-approved' : ord.order_status === 'CANCELLED' ? 'badge-error' : 'badge-pending'}`}>
                          {ord.order_status}
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

export default AdminDashboard;

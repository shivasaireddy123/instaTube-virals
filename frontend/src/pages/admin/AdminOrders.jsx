import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  DollarSign 
} from 'lucide-react';

const AdminOrders = () => {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await api.get('/orders/admin/all/', { params });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.patch(`/orders/admin/${orderId}/status/`, {
        order_status: newStatus,
      });
      showToast(res.data.message || `Order status updated to ${newStatus}`, 'success');
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o)));
    } catch (err) {
      showToast('Failed to update order status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--earth-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
              <ArrowLeft size={15} /> Back to Admin Overview
            </Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.4rem', marginBottom: '0.25rem' }}>Marketplace Order Operations</h1>
              <p style={{ color: 'var(--earth-muted)' }}>Monitor marketplace order fulfillment, COD dispatches, and transactions.</p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterStatus('')}
                className={`btn btn-sm ${filterStatus === '' ? 'btn-primary' : 'btn-outline'}`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilterStatus('PLACED')}
                className={`btn btn-sm ${filterStatus === 'PLACED' ? 'btn-primary' : 'btn-outline'}`}
              >
                Placed
              </button>
              <button
                onClick={() => setFilterStatus('PROCESSING')}
                className={`btn btn-sm ${filterStatus === 'PROCESSING' ? 'btn-primary' : 'btn-outline'}`}
              >
                Processing
              </button>
              <button
                onClick={() => setFilterStatus('SHIPPED')}
                className={`btn btn-sm ${filterStatus === 'SHIPPED' ? 'btn-primary' : 'btn-outline'}`}
              >
                Shipped
              </button>
              <button
                onClick={() => setFilterStatus('DELIVERED')}
                className={`btn btn-sm ${filterStatus === 'DELIVERED' ? 'btn-primary' : 'btn-outline'}`}
              >
                Delivered
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
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
            <p style={{ color: 'var(--earth-muted)' }}>Loading orders...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <ShoppingBag size={48} color="var(--earth-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Orders Found</h3>
            <p style={{ color: 'var(--earth-muted)' }}>No orders match the selected filter criteria.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Order Summary Row */}
                  <div style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    backgroundColor: isExpanded ? 'var(--bg-cream)' : '#FFFFFF',
                    transition: 'var(--transition)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Order ID
                        </span>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--earth-dark)' }}>
                          #{order.order_number}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Customer
                        </span>
                        <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>
                          {order.shipping_name || order.customer_name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--earth-muted)' }}>
                          {order.customer_email}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Total Amount
                        </span>
                        <div style={{ fontWeight: 700, color: 'var(--forest-green)', fontSize: '1.15rem', fontFamily: 'var(--font-serif)' }}>
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Placed Date
                        </span>
                        <div style={{ fontSize: '0.875rem', color: 'var(--earth-dark)' }}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Status Selector */}
                      <select
                        className="form-select"
                        style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                        value={order.order_status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="PLACED">Placed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>

                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        {isExpanded ? <>Less <ChevronUp size={15} /></> : <>Details <ChevronDown size={15} /></>}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Item Breakdown */}
                  {isExpanded && (
                    <div style={{
                      padding: '1.5rem',
                      borderTop: '1px solid var(--border-light)',
                      backgroundColor: '#FCFAF7'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', color: 'var(--earth-muted)', marginBottom: '0.75rem' }}>
                            Ordered Items ({order.items?.length || 0})
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {order.items?.map((it) => (
                              <div key={it.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <div>
                                  <span style={{ fontWeight: 600 }}>{it.product_name}</span> &times; {it.quantity}
                                  <div style={{ fontSize: '0.75rem', color: 'var(--earth-muted)' }}>
                                    Maker: {it.seller_name} &bull; Status: {it.fulfillment_status}
                                  </div>
                                </div>
                                <span style={{ fontWeight: 700, color: 'var(--forest-green)' }}>
                                  ${parseFloat(it.subtotal).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 style={{ fontSize: '0.95rem', color: 'var(--earth-muted)', marginBottom: '0.75rem' }}>
                            Destination & Delivery Info
                          </h4>
                          <p style={{ fontSize: '0.9rem', color: 'var(--earth-dark)', lineHeight: '1.5' }}>
                            <strong>Recipient:</strong> {order.shipping_name} ({order.shipping_phone})<br />
                            <strong>Address:</strong> {order.shipping_address}<br />
                            <strong>Payment Method:</strong> {order.payment_method}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

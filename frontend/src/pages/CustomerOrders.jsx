import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { 
  Package, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  ShoppingBag, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';

const CustomerOrders = () => {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation modal state
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/orders/my-orders/');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;
    try {
      setCancelling(true);
      const res = await api.post(`/orders/my-orders/${cancelModalOrder.id}/cancel/`);
      showToast(res.data.message || 'Order cancelled successfully.', 'info');
      setOrders(orders.map((o) => (
        o.id === cancelModalOrder.id
          ? {
              ...o,
              order_status: 'CANCELLED',
              items: o.items?.map((it) => ({ ...it, fulfillment_status: 'CANCELLED' }))
            }
          : o
      )));
      setCancelModalOrder(null);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to cancel order.', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="badge badge-approved"><CheckCircle2 size={12} /> Delivered</span>;
      case 'SHIPPED':
        return <span className="badge badge-approved"><Truck size={12} /> In Transit</span>;
      case 'PROCESSING':
        return <span className="badge badge-pending"><Clock size={12} /> Processing</span>;
      case 'CANCELLED':
        return <span className="badge badge-error"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge badge-neutral"><Clock size={12} /> Order Placed</span>;
    }
  };

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
        <p style={{ color: 'var(--earth-muted)' }}>Retrieving your order history...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '520px',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          padding: '4rem 2rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--earth-muted)',
            margin: '0 auto 1.5rem auto'
          }}>
            <Package size={40} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>No Orders Yet</h2>
          <p style={{ color: 'var(--earth-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6' }}>
            You haven't placed any orders yet. Discover our makers' handmade pottery, farm foods, and textiles.
          </p>
          <Link to="/marketplace" className="btn btn-primary btn-lg">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>My Order History</h1>
            <p style={{ color: 'var(--earth-muted)' }}>Track packages, cancel pending shipments, and view past purchases.</p>
          </div>
          <Link to="/marketplace" className="btn btn-outline">
            <ShoppingBag size={16} /> Browse Marketplace
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => {
            const canCancel = order.order_status === 'PLACED' || order.order_status === 'PROCESSING';

            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden'
                }}
              >
                {/* Order Header */}
                <div style={{
                  padding: '1.25rem 1.75rem',
                  backgroundColor: 'var(--bg-cream)',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Order Placed
                      </span>
                      <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>
                        {new Date(order.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Total Amount
                      </span>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--forest-green)', fontFamily: 'var(--font-serif)' }}>
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                        Payment
                      </span>
                      <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>
                        {order.payment_method}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--earth-muted)', fontWeight: 600 }}>
                      #{order.order_number}
                    </span>
                    {getStatusBadge(order.order_status)}

                    {canCancel && (
                      <button
                        onClick={() => setCancelModalOrder(order)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--terracotta)', borderColor: 'var(--terracotta)' }}
                        title="Cancel this order before dispatch"
                      >
                        <XCircle size={14} /> Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                {/* Order Body: Items & Shipping info */}
                <div style={{ padding: '1.5rem 1.75rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    {/* Items List */}
                    <div>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--earth-muted)' }}>
                        Purchased Items
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {order.items?.map((item) => (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {item.product_image && (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                style={{
                                  width: '56px',
                                  height: '56px',
                                  borderRadius: 'var(--radius-sm)',
                                  objectFit: 'cover',
                                  border: '1px solid var(--border-color)',
                                  flexShrink: 0
                                }}
                              />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                {item.product_name}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)' }}>
                                From: <strong>{item.seller_name}</strong> &bull; Qty: {item.quantity} &times; ${parseFloat(item.purchase_price).toFixed(2)}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 700, color: 'var(--forest-green)', fontFamily: 'var(--font-serif)' }}>
                                ${parseFloat(item.subtotal).toFixed(2)}
                              </div>
                              <span style={{ fontSize: '0.75rem' }} className={`badge ${item.fulfillment_status === 'DELIVERED' ? 'badge-approved' : item.fulfillment_status === 'CANCELLED' ? 'badge-error' : 'badge-neutral'}`}>
                                {item.fulfillment_status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Details */}
                    <div style={{
                      backgroundColor: 'var(--bg-cream)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.25rem 1.5rem',
                      border: '1px solid var(--border-color)',
                      height: 'fit-content'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', color: 'var(--earth-dark)' }}>
                        <MapPin size={16} color="var(--terracotta)" /> Destination Address
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        {order.shipping_name} ({order.shipping_phone})
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--earth-muted)', lineHeight: '1.5' }}>
                        {order.shipping_address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cancellation Confirmation Modal */}
        {cancelModalOrder && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem' }}>Cancel Order #{cancelModalOrder.order_number}</h3>
                <button
                  onClick={() => setCancelModalOrder(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--earth-dark)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  Are you sure you want to cancel this order? The reserved handcrafted items will be returned to the artisan's available inventory immediately.
                </p>

                <div style={{
                  backgroundColor: 'var(--bg-cream)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--earth-dark)' }}>
                    Items in this cancellation:
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--earth-muted)' }}>
                    {cancelModalOrder.items?.map((it) => (
                      <li key={it.id} style={{ marginBottom: '0.2rem' }}>
                        {it.quantity}x {it.product_name} &bull; ${parseFloat(it.subtotal).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setCancelModalOrder(null)}
                  className="btn btn-outline"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="btn btn-terracotta"
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Order Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders;

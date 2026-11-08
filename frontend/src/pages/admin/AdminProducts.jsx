import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { 
  Package, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  Trash2, 
  Store, 
  AlertCircle 
} from 'lucide-react';

const AdminProducts = () => {
  const { showToast } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const res = await api.get('/products/admin/all/', { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load admin products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterStatus]);

  const handleUpdateStatus = async (productId, status) => {
    try {
      setActionLoading(true);
      const res = await api.post(`/products/admin/approve/${productId}/`, {
        status: status,
      });
      showToast(res.data.message || `Product marked as ${status}`, 'success');
      setProducts(products.map((p) => (p.id === productId ? { ...p, status: status } : p)));
    } catch (err) {
      showToast('Failed to update product status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteId) return;
    try {
      setActionLoading(true);
      await api.delete(`/products/seller/my-products/${deleteId}/`);
      showToast('Product deleted from marketplace.', 'info');
      setProducts(products.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      showToast('Failed to delete product.', 'error');
    } finally {
      setActionLoading(false);
    }
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
              <h1 style={{ fontSize: '2.4rem', marginBottom: '0.25rem' }}>Product Curation & Approvals</h1>
              <p style={{ color: 'var(--earth-muted)' }}>Review handcrafted products submitted by sellers before they appear in customer marketplace.</p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setFilterStatus('')}
                className={`btn btn-sm ${filterStatus === '' ? 'btn-primary' : 'btn-outline'}`}
              >
                All Products
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`btn btn-sm ${filterStatus === 'PENDING' ? 'btn-primary' : 'btn-outline'}`}
                style={filterStatus === 'PENDING' ? { backgroundColor: 'var(--warning)', borderColor: 'var(--warning)' } : {}}
              >
                Pending Review
              </button>
              <button
                onClick={() => setFilterStatus('APPROVED')}
                className={`btn btn-sm ${filterStatus === 'APPROVED' ? 'btn-primary' : 'btn-outline'}`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilterStatus('REJECTED')}
                className={`btn btn-sm ${filterStatus === 'REJECTED' ? 'btn-primary' : 'btn-outline'}`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Products Table */}
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
            <p style={{ color: 'var(--earth-muted)' }}>Loading product submissions...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '4rem 2rem',
            textAlign: 'center'
          }}>
            <Package size={48} color="var(--earth-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Products Found</h3>
            <p style={{ color: 'var(--earth-muted)' }}>No products found matching the current filter criteria.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Seller Store</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th style={{ textAlign: 'right' }}>Curation Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const img = product.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80';
                  return (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={img}
                            alt={product.name}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: 'var(--radius-sm)',
                              objectFit: 'cover',
                              border: '1px solid var(--border-color)',
                              flexShrink: 0
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{product.name}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)' }}>ID: #{product.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{product.seller?.business_name || 'Artisan'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)' }}>{product.seller?.email}</div>
                      </td>
                      <td>{product.category?.name || 'Uncategorized'}</td>
                      <td style={{ fontWeight: 700, color: 'var(--forest-green)' }}>
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td>{product.stock} units</td>
                      <td>
                        <span className={`badge ${product.status === 'APPROVED' ? 'badge-approved' : product.status === 'REJECTED' ? 'badge-error' : 'badge-pending'}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>{new Date(product.created_at).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          {product.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateStatus(product.id, 'APPROVED')}
                              disabled={actionLoading}
                              className="btn btn-sm btn-primary"
                              title="Approve Product"
                            >
                              <CheckCircle2 size={14} /> Approve
                            </button>
                          )}
                          {product.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleUpdateStatus(product.id, 'REJECTED')}
                              disabled={actionLoading}
                              className="btn btn-sm btn-outline"
                              style={{ color: 'var(--error)' }}
                              title="Reject Product"
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="btn btn-sm btn-outline"
                            style={{ color: 'var(--error)' }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem' }}>Delete Product</h3>
                <button onClick={() => setDeleteId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--earth-dark)', fontSize: '0.95rem' }}>
                  Are you sure you want to remove this product permanently from the marketplace?
                </p>
              </div>
              <div className="modal-footer">
                <button onClick={() => setDeleteId(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  disabled={actionLoading}
                  className="btn btn-terracotta"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;

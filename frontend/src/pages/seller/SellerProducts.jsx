import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  Package, 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';

const SellerProducts = () => {
  const { isSellerApproved } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/seller/my-products/');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load seller products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/products/seller/my-products/${deleteId}/`);
      showToast('Product successfully removed from catalog.', 'info');
      setProducts(products.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      showToast('Failed to delete product.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <Link to="/seller/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--earth-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
                <ArrowLeft size={15} /> Back to Seller Hub
              </Link>
            </div>
            <h1 style={{ fontSize: '2.4rem', marginBottom: '0.25rem' }}>Manage Store Products</h1>
            <p style={{ color: 'var(--earth-muted)' }}>Add, edit, or track curation status for your artisan creations.</p>
          </div>

          <div>
            {isSellerApproved ? (
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
          </div>
        </div>

        {/* Table of Products */}
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
            <p style={{ color: 'var(--earth-muted)' }}>Loading products...</p>
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
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Products Listed</h3>
            <p style={{ color: 'var(--earth-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              {isSellerApproved
                ? 'Your store catalog is currently empty. Click "Add New Product" to list your first handcrafted creation!'
                : 'Your store catalog is currently empty. Once your seller application is approved by admin, you can list products.'}
            </p>
            {isSellerApproved && (
              <Link to="/seller/products/add" className="btn btn-primary">
                <Plus size={16} /> Create First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Approval Status</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
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
                              border: '1px solid var(--border-color)'
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>{product.name}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--earth-muted)' }}>ID: #{product.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{product.category?.name || 'Uncategorized'}</td>
                      <td style={{ fontWeight: 700, color: 'var(--forest-green)' }}>
                        ${parseFloat(product.price).toFixed(2)}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: product.stock > 0 ? 'inherit' : 'var(--error)' }}>
                          {product.stock} units
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${product.status === 'APPROVED' ? 'badge-approved' : product.status === 'REJECTED' ? 'badge-error' : 'badge-pending'}`}>
                          {product.status}
                        </span>
                        {product.admin_notes && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--earth-muted)', marginTop: '0.2rem' }}>
                            {product.admin_notes}
                          </div>
                        )}
                      </td>
                      <td>{new Date(product.created_at).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <Link
                            to={`/seller/products/edit/${product.id}`}
                            className="btn btn-outline btn-sm"
                            title="Edit Product"
                          >
                            <Edit2 size={14} /> Edit
                          </Link>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--error)', borderColor: 'var(--border-color)' }}
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
                <h3 style={{ fontSize: '1.25rem' }}>Confirm Delete</h3>
                <button onClick={() => setDeleteId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--earth-dark)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  Are you sure you want to permanently delete this product from your catalog? This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button onClick={() => setDeleteId(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn btn-terracotta"
                >
                  {deleting ? 'Deleting...' : 'Delete Product'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;

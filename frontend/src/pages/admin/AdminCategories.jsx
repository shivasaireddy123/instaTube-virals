import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { 
  Tag, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  AlertCircle 
} from 'lucide-react';

const AdminCategories = () => {
  const { showToast } = useCart();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add/Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: 'Tag' });
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', icon: 'Tag' });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description, icon: cat.icon || 'Tag' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setSaving(true);
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}/`, formData);
        showToast('Category updated successfully!', 'success');
      } else {
        await api.post('/categories/create/', formData);
        showToast('New category created!', 'success');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      showToast('Failed to save category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/categories/${deleteId}/`);
      showToast('Category removed.', 'info');
      setCategories(categories.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      showToast('Failed to delete category.', 'error');
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
              <h1 style={{ fontSize: '2.4rem', marginBottom: '0.25rem' }}>Category Taxonomy</h1>
              <p style={{ color: 'var(--earth-muted)' }}>Organize marketplace goods into distinct artisan traditions and harvest categories.</p>
            </div>
            <button onClick={openAddModal} className="btn btn-primary">
              <Plus size={18} /> Add Category
            </button>
          </div>
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
            <p style={{ color: 'var(--earth-muted)' }}>Loading categories...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Slug URL</th>
                  <th>Description</th>
                  <th>Active Products</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ fontWeight: 700, color: 'var(--earth-dark)' }}>
                      {cat.name}
                    </td>
                    <td>
                      <code style={{ backgroundColor: 'var(--bg-muted)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                        {cat.slug}
                      </code>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--earth-muted)', maxWidth: '320px' }}>
                      {cat.description || 'No description provided'}
                    </td>
                    <td>
                      <span className="badge badge-tag">
                        {cat.products_count} live items
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="btn btn-sm btn-outline"
                          title="Edit Category"
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(cat.id)}
                          className="btn btn-sm btn-outline"
                          style={{ color: 'var(--error)' }}
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem' }}>
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Category Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Handwoven Textiles"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      rows="3"
                      className="form-textarea"
                      placeholder="Brief overview of artisan products belonging to this category..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    {saving ? 'Saving...' : 'Save Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3 style={{ fontSize: '1.25rem' }}>Delete Category</h3>
                <button onClick={() => setDeleteId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p style={{ color: 'var(--earth-dark)', fontSize: '0.95rem' }}>
                  Are you sure you want to delete this category? Products associated with it will become uncategorized.
                </p>
              </div>
              <div className="modal-footer">
                <button onClick={() => setDeleteId(null)} className="btn btn-outline">
                  Cancel
                </button>
                <button onClick={handleDelete} className="btn btn-terracotta">
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;

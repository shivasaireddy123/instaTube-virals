import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { 
  ArrowLeft, 
  Upload, 
  Package, 
  AlertCircle, 
  Check, 
  Save 
} from 'lucide-react';

const SellerProductForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useCart();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    stock: '',
    description: '',
    image_url: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState('');

  // Fetch categories & existing product (if editing)
  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await api.get('/categories/');
        setCategories(catRes.data);

        if (isEditing) {
          const prodRes = await api.get(`/products/seller/my-products/${id}/`);
          const p = prodRes.data;
          setFormData({
            name: p.name || '',
            category_id: p.category?.id || '',
            price: p.price || '',
            stock: p.stock || '',
            description: p.description || '',
            image_url: p.image_url || '',
          });
          if (p.image) {
            setImagePreview(p.image);
          } else if (p.image_url) {
            setImagePreview(p.image_url);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load form details.');
      } finally {
        setInitialLoading(false);
      }
    };
    init();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.price || !formData.stock || !formData.description) {
      setError('Please fill in product name, price, stock quantity, and description.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('name', formData.name);
      if (formData.category_id) {
        data.append('category_id', formData.category_id);
      }
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('description', formData.description);

      if (imageFile) {
        data.append('image', imageFile);
      }
      if (formData.image_url) {
        data.append('image_url', formData.image_url);
      }

      const headers = { 'Content-Type': 'multipart/form-data' };

      if (isEditing) {
        await api.patch(`/products/seller/my-products/${id}/`, data, { headers });
        showToast('Product updated! Submitted for curator review.', 'success');
      } else {
        await api.post('/products/seller/my-products/', data, { headers });
        showToast('Product successfully created! Awaiting admin curation.', 'success');
      }

      navigate('/seller/products');
    } catch (err) {
      console.error(err);
      const resData = err.response?.data;
      if (typeof resData === 'object') {
        const firstKey = Object.keys(resData)[0];
        const val = resData[firstKey];
        setError(Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val));
      } else {
        setError('Failed to save product. Please check your inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
        <p style={{ color: 'var(--earth-muted)' }}>Preparing product editor...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container-sm">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/seller/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--earth-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Products List
          </Link>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          padding: '2.5rem'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.4rem' }}>
              {isEditing ? 'Edit Artisan Product' : 'Add New Artisan Product'}
            </h1>
            <p style={{ color: 'var(--earth-muted)', fontSize: '0.95rem' }}>
              {isEditing
                ? 'Updates will be resubmitted for admin curation review.'
                : 'List your handcrafted goods or organic farm harvests.'}
            </p>
          </div>

          {error && (
            <div className="alert-box alert-error" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Product Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="e.g. Handmade Terracotta Ceramic Planter"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="category_id">Category</label>
                <select
                  id="category_id"
                  name="category_id"
                  className="form-select"
                  value={formData.category_id}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">Price (USD $) *</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="form-input"
                  placeholder="34.50"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="stock">Available Stock *</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="15"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Image Upload and Preview */}
            <div className="form-group">
              <label className="form-label">Product Photography</label>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {imagePreview && (
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0
                  }}>
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ fontSize: '0.85rem' }}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--earth-muted)', marginTop: '0.35rem' }}>
                    Upload PNG, JPG or WEBP image file.
                  </div>
                </div>
              </div>

              {/* Or external URL */}
              <div style={{ marginTop: '0.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--earth-muted)' }}>
                  Or Direct Image Web URL:
                </label>
                <input
                  type="url"
                  name="image_url"
                  className="form-input"
                  placeholder="https://example.com/artisan-photo.jpg"
                  value={formData.image_url}
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value) setImagePreview(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="description">Detailed Description & Maker Notes *</label>
              <textarea
                id="description"
                name="description"
                rows="5"
                className="form-textarea"
                placeholder="Describe your craft technique, materials used, dimensions, care instructions, and organic origins..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Link to="/seller/products" className="btn btn-outline">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Saving Creation...' : isEditing ? 'Save Product Changes' : 'Submit Product for Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerProductForm;

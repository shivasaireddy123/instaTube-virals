import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Store, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Plus, 
  Minus, 
  Leaf, 
  AlertCircle 
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setError('Product not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product?.stock || 1)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    setAdding(true);
    await addToCart(product.id, quantity);
    setTimeout(() => setAdding(false), 800);
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
        <p style={{ color: 'var(--earth-muted)' }}>Loading product details...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
          backgroundColor: '#FFF',
          padding: '2.5rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)'
        }}>
          <AlertCircle size={48} color="var(--error)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Item Unavailable</h2>
          <p style={{ color: 'var(--earth-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/marketplace" className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const imageUrl = product.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80';

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: 'none',
              color: 'var(--earth-muted)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>
        </div>

        {/* Product Details Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '3.5rem',
          alignItems: 'start'
        }}>
          {/* Product Image Frame */}
          <div>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              paddingTop: '85%' /* Ratio */
            }}>
              <img
                src={imageUrl}
                alt={product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              {isOutOfStock && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(42, 31, 23, 0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase'
                }}>
                  Sold Out
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div>
            {/* Category and Stock Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              {product.category && (
                <span className="badge badge-tag">
                  {product.category.name}
                </span>
              )}
              <span className={`badge ${isOutOfStock ? 'badge-error' : 'badge-approved'}`}>
                {isOutOfStock ? 'Out of Stock' : `${product.stock} Units in Stock`}
              </span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '1rem' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{
              fontSize: '2.25rem',
              fontWeight: 700,
              color: 'var(--forest-green)',
              fontFamily: 'var(--font-serif)',
              marginBottom: '1.5rem'
            }}>
              ${parseFloat(product.price).toFixed(2)}
            </div>

            {/* Maker Profile Box */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--terracotta-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--terracotta)'
              }}>
                <Store size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Crafted & Sold By
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--earth-dark)' }}>
                  {product.seller?.business_name || 'Independent Artisan'}
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>About this Creation</h3>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.75',
                color: 'var(--earth-dark)',
                whiteSpace: 'pre-line'
              }}>
                {product.description}
              </p>
            </div>

            {/* Purchase & Quantity Actions */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '2rem'
            }}>
              {!isOutOfStock ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Quantity selector */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-cream)',
                    padding: '0.25rem'
                  }}>
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: '#FFF',
                        cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--earth-dark)',
                        opacity: quantity <= 1 ? 0.4 : 1
                      }}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: '#FFF',
                        cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--earth-dark)',
                        opacity: quantity >= product.stock ? 0.4 : 1
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Add to cart button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1, minWidth: '200px' }}
                  >
                    {adding ? (
                      <>
                        <Check size={20} /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} /> Add to Cart (${(parseFloat(product.price) * quantity).toFixed(2)})
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="alert-box alert-warning" style={{ marginBottom: 0 }}>
                  <AlertCircle size={20} />
                  <span>This artisan item is currently sold out. Check back soon as small-batch inventory is replenished.</span>
                </div>
              )}
            </div>

            {/* Buyer Guarantees */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              fontSize: '0.85rem',
              color: 'var(--earth-muted)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={18} color="var(--forest-green)" /> Cash on Delivery Available
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--forest-green)" /> Authenticity Guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, Store } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const isOutOfStock = product.stock <= 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;

    setAdding(true);
    await addToCart(product.id, 1);
    setTimeout(() => setAdding(false), 800);
  };

  const imageUrl = product.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="card product-card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Image Container */}
      <Link to={`/product/${product.id}`} style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        paddingTop: '80%', /* 4:3 Aspect Ratio */
        overflow: 'hidden',
        backgroundColor: '#EFEAE2'
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
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          className="product-img"
          loading="lazy"
        />

        {/* Category Pill */}
        {product.category && (
          <span style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            color: 'var(--forest-green)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.725rem',
            fontWeight: 700,
            letterSpacing: '0.03em',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {product.category.name}
          </span>
        )}

        {/* Stock Badge */}
        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(42, 31, 23, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Sold Out
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }}>
        {/* Seller Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.785rem',
          color: 'var(--earth-muted)',
          marginBottom: '0.4rem'
        }}>
          <Store size={13} color="var(--terracotta)" />
          <span>{product.seller?.business_name || 'Independent Artisan'}</span>
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.id}`} style={{
          fontSize: '1.05rem',
          fontWeight: 600,
          color: 'var(--earth-dark)',
          marginBottom: '0.75rem',
          lineHeight: '1.35',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {product.name}
        </Link>

        {/* Pricing & Cart Action */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-light)'
        }}>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--forest-green)',
              fontFamily: 'var(--font-serif)'
            }}>
              ${parseFloat(product.price).toFixed(2)}
            </div>
            <div style={{ fontSize: '0.725rem', color: isOutOfStock ? 'var(--error)' : 'var(--earth-muted)' }}>
              {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || adding}
            className={`btn btn-sm ${adding ? 'btn-outline-forest' : 'btn-primary'}`}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-full)'
            }}
            title={isOutOfStock ? 'Item is out of stock' : 'Add to Shopping Cart'}
          >
            {adding ? (
              <>
                <Check size={15} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={15} /> Add
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .product-card:hover .product-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;

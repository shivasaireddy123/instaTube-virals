import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const items = cart.items || [];
  const isEmpty = items.length === 0;

  if (loading && isEmpty) {
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
        <p style={{ color: 'var(--earth-muted)' }}>Loading your shopping cart...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isEmpty) {
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
            <ShoppingBag size={40} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--earth-muted)', marginBottom: '2rem', fontSize: '1rem', lineHeight: '1.6' }}>
            Looks like you haven't added any handmade ceramics, organic farm goods, or handcrafted woodwork yet.
          </p>
          <Link to="/marketplace" className="btn btn-primary btn-lg">
            Explore Marketplace <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Shopping Cart</h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Items List */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-cream)'
              }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--earth-dark)' }}>
                  Cart Items ({cart.total_items})
                </span>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--earth-muted)',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Clear All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map((item) => {
                  const product = item.product;
                  const itemImg = product.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80';

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid var(--border-light)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.25rem'
                      }}
                    >
                      {/* Product Thumbnail & Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '240px', flex: 1 }}>
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={itemImg}
                            alt={product.name}
                            style={{
                              width: '74px',
                              height: '74px',
                              borderRadius: 'var(--radius-md)',
                              objectFit: 'cover',
                              border: '1px solid var(--border-color)',
                              flexShrink: 0
                            }}
                          />
                        </Link>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--earth-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                            {product.seller_name}
                          </div>
                          <Link to={`/product/${product.id}`} style={{
                            fontSize: '1.05rem',
                            fontWeight: 600,
                            color: 'var(--earth-dark)',
                            display: 'block',
                            marginBottom: '0.25rem'
                          }}>
                            {product.name}
                          </Link>
                          <div style={{ fontSize: '0.9rem', color: 'var(--forest-green)', fontWeight: 700 }}>
                            ${parseFloat(product.price).toFixed(2)} each
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--bg-cream)',
                          padding: '0.2rem'
                        }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: 'none',
                              backgroundColor: '#FFF',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--earth-dark)'
                            }}
                            title="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= product.stock}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: 'none',
                              backgroundColor: '#FFF',
                              cursor: item.quantity >= product.stock ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--earth-dark)',
                              opacity: item.quantity >= product.stock ? 0.4 : 1
                            }}
                            title="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div style={{ minWidth: '80px', textAlign: 'right' }}>
                          <div style={{
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: 'var(--forest-green)',
                            fontFamily: 'var(--font-serif)'
                          }}>
                            ${parseFloat(item.subtotal).toFixed(2)}
                          </div>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--earth-muted)',
                            cursor: 'pointer',
                            padding: '0.4rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--radius-sm)'
                          }}
                          title="Remove item"
                        >
                          <Trash2 size={18} color="var(--error)" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link to="/marketplace" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--forest-green)',
              fontWeight: 600,
              fontSize: '0.95rem'
            }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          {/* Cart Summary Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            padding: '2rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--earth-muted)' }}>
                <span>Subtotal ({cart.total_items} items)</span>
                <span style={{ color: 'var(--earth-dark)', fontWeight: 600 }}>${parseFloat(cart.total_price).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--earth-muted)' }}>
                <span>Artisan Direct Shipping</span>
                <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--earth-muted)' }}>
                <span>Payment Processing</span>
                <span style={{ color: 'var(--forest-green)', fontWeight: 600 }}>Cash on Delivery</span>
              </div>
            </div>

            <div style={{
              borderTop: '2px dashed var(--border-color)',
              paddingTop: '1.25rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>Total</span>
              <span style={{
                fontSize: '1.85rem',
                fontWeight: 700,
                color: 'var(--forest-green)',
                fontFamily: 'var(--font-serif)'
              }}>
                ${parseFloat(cart.total_price).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: 'var(--earth-muted)'
            }}>
              <ShieldCheck size={16} color="var(--forest-green)" /> Safe & Verified Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

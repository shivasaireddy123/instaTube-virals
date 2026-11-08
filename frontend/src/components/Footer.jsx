import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Heart, Sparkles, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#2A1F17',
      color: '#F4ECE4',
      marginTop: 'auto',
      borderTop: '1px solid #3E2F23',
      paddingTop: '4rem',
      paddingBottom: '2.5rem'
    }}>
      <div className="container">
        {/* Value Props Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '0.75rem',
              borderRadius: '12px',
              color: 'var(--accent-gold)'
            }}>
              <Leaf size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', marginBottom: '0.25rem' }}>100% Authentic & Natural</h4>
              <p style={{ color: '#C8BEB5', fontSize: '0.85rem' }}>Direct from organic soil, small farms, and heritage hands.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '0.75rem',
              borderRadius: '12px',
              color: 'var(--accent-gold)'
            }}>
              <Heart size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', marginBottom: '0.25rem' }}>Empowering Local Creators</h4>
              <p style={{ color: '#C8BEB5', fontSize: '0.85rem' }}>Independent artisans receive fair value for their mastery.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '0.75rem',
              borderRadius: '12px',
              color: 'var(--accent-gold)'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFF', fontSize: '1.05rem', marginBottom: '0.25rem' }}>Cash on Delivery Safe</h4>
              <p style={{ color: '#C8BEB5', fontSize: '0.85rem' }}>Pay seamlessly at your doorstep once verified in hand.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Col */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF'
              }}>
                <ShoppingBag size={20} />
              </div>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#FFF'
              }}>
                InstaTube Virals
              </span>
            </div>
            <p style={{ color: '#B5A89E', fontSize: '0.9rem', lineHeight: '1.6' }}>
              A curated digital village bridging independent farmers, master craftsmen, and creators directly with conscious households.
            </p>
          </div>

          {/* Shoppers */}
          <div>
            <h4 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '1rem' }}>Marketplace</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: '#B5A89E' }}>
              <li><Link to="/marketplace" style={{ transition: 'color 0.2s' }}>Explore Collections</Link></li>
              <li><Link to="/about">Our Philosophy</Link></li>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/login">Sign In</Link></li>
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h4 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '1rem' }}>For Creators & Sellers</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: '#B5A89E' }}>
              <li><Link to="/register-seller">Become an Approved Seller</Link></li>
              <li><Link to="/seller/dashboard">Seller Portal</Link></li>
              <li><Link to="/about">Artisan Standards</Link></li>
              <li><Link to="/login">Seller Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '1rem' }}>Community & Care</h4>
            <p style={{ color: '#B5A89E', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Have questions or want to partner?
            </p>
            <p style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: 600 }}>
              hello@instatubevirals.com
            </p>
            <p style={{ color: '#B5A89E', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Sedona &bull; Hood River &bull; Asheville
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#8A7D73',
          fontSize: '0.825rem',
          gap: '1rem'
        }}>
          <div>&copy; {new Date().getFullYear()} InstaTube Virals Marketplace. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Sustainable Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

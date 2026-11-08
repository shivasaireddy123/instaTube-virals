import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Users, ShieldCheck, ArrowRight, Award } from 'lucide-react';

const About = () => {
  return (
    <div>
      {/* Header Banner */}
      <section style={{
        backgroundColor: 'var(--bg-muted)',
        padding: '5rem 0 4rem 0',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div className="container-sm">
          <span style={{
            color: 'var(--forest-green)',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Our Origins & Mission
          </span>
          <h1 style={{ fontSize: '3rem', marginTop: '0.75rem', marginBottom: '1.25rem' }}>
            Rooted in Soil. Shaped by Hands.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--earth-muted)', lineHeight: '1.7' }}>
            We started <strong>InstaTube Virals</strong> with a conviction: mass-manufactured, anonymous goods can never replace the soul, care, and sustainability of true artisan crafts and organic farm harvests.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '5rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1.25rem' }}>
              The Problem with Modern Commerce
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--earth-muted)', marginBottom: '1.25rem', lineHeight: '1.8' }}>
              In conventional e-commerce, small-scale farmers and authentic creators are overshadowed by industrialized factories and predatory algorithms. Middlemen take exorbitant fees, forcing artisans to compromise their craftsmanship just to survive.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--earth-muted)', lineHeight: '1.8' }}>
              InstaTube Virals changes the equation: by establishing a curated, verified marketplace where makers set their own prices and ship directly from their workshops to conscious homes, we restore pride and financial independence to local economies.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80"
              alt="Artisan woodworking"
              style={{
                width: '100%',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-cream)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Our Core Pillars</h2>
            <p style={{ color: 'var(--earth-muted)' }}>Every decision at InstaTube Virals is guided by these foundational values.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card" style={{ padding: '2rem', backgroundColor: '#FFF' }}>
              <div style={{ color: 'var(--forest-green)', marginBottom: '1rem' }}>
                <Leaf size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Earthy Sustainability</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--earth-muted)', lineHeight: '1.6' }}>
                We prioritize zero-pesticide agriculture, regenerative harvesting, food-safe glazes, and sustainably sourced timber.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', backgroundColor: '#FFF' }}>
              <div style={{ color: 'var(--terracotta)', marginBottom: '1rem' }}>
                <Users size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Direct Maker Empowerment</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--earth-muted)', lineHeight: '1.6' }}>
                No opaque corporate layers. Your purchase directly supports the livelihood of master craftswomen, men, and farm families.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', backgroundColor: '#FFF' }}>
              <div style={{ color: 'var(--forest-green)', marginBottom: '1rem' }}>
                <Award size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Human Verification</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--earth-muted)', lineHeight: '1.6' }}>
                Every seller is personally vetted and approved before their products can reach your family table.
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/register-seller" className="btn btn-primary btn-lg">
              Become Part of Our Maker Collective <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

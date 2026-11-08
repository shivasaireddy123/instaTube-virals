import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Leaf, 
  Heart, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  Palette, 
  Hammer, 
  Coffee, 
  Feather, 
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isCustomer } = useAuth();

  const categories = [
    { title: 'Handcrafted Pottery', desc: 'Wheel-thrown stoneware and terracotta dining wares', icon: <Palette size={28} color="#C85A32" />, count: 'Heritage Ceramics' },
    { title: 'Organic Farm Harvest', desc: 'Estate cold-pressed oils, grains, and heirloom farm goods', icon: <Leaf size={28} color="#234E32" />, count: 'Soil to Table' },
    { title: 'Botanical Skincare', desc: 'Wild herb balms, calendula infusions, and artisanal soaps', icon: <Sparkles size={28} color="#C85A32" />, count: 'All Natural' },
    { title: 'Artisanal Woodwork', desc: 'Carved black walnut boards, serving spoons, and rustic trays', icon: <Hammer size={28} color="#4A3728" />, count: 'Solid Woods' },
    { title: 'Handwoven Textiles', desc: 'Handloom waffle blankets, natural linen, and organic throws', icon: <Feather size={28} color="#234E32" />, count: 'Natural Fibers' },
    { title: 'Honey & Herbal Teas', desc: 'Raw wildflower honeycombs and alpine mountain loose teas', icon: <Coffee size={28} color="#C85A32" />, count: 'Pure & Raw' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #F5EFEB 0%, #FAF7F2 100%)',
        padding: '5rem 0 6rem 0',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center'
        }}>
          {/* Hero Content */}
          <div style={{ maxWidth: '580px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--forest-light)',
              color: 'var(--forest-green)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              letterSpacing: '0.02em'
            }}>
              <Leaf size={16} /> Direct from Artisans & Family Farms
            </div>

            <h1 style={{
              fontSize: '3.25rem',
              lineHeight: '1.1',
              color: 'var(--earth-dark)',
              marginBottom: '1.5rem',
              fontWeight: 700
            }}>
              Discover Handmade. <br />
              Shop Naturally. <br />
              <span style={{ color: 'var(--forest-green)', fontStyle: 'italic' }}>Support Creators.</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              lineHeight: '1.7',
              color: 'var(--earth-muted)',
              marginBottom: '2.25rem'
            }}>
              Welcome to <strong>InstaTube Virals</strong>, the premier multi-vendor sanctuary connecting independent makers, organic farmers, and passionate crafters directly to conscious households.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              {isAuthenticated && isCustomer ? (
                <Link to="/marketplace" className="btn btn-primary btn-lg">
                  Explore Marketplace <ArrowRight size={18} />
                </Link>
              ) : (
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started <ArrowRight size={18} />
                </Link>
              )}
              <Link to="/register-seller" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--earth-muted)' }}>
                <Store size={18} color="var(--terracotta)" /> Become a Seller
              </Link>
            </div>

            {/* Trust Points */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginTop: '2.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.875rem',
              color: 'var(--earth-dark)',
              fontWeight: 600
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--forest-green)" /> Verified Makers
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--forest-green)" /> Cash on Delivery
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--forest-green)" /> 100% Handcrafted
              </span>
            </div>
          </div>

          {/* Hero Visual Imagery */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
              border: '8px solid #FFFFFF',
              position: 'relative'
            }}>
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
                alt="Artisan ceramic craft pottery studio"
                style={{
                  width: '100%',
                  height: '460px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>

            {/* Floating Highlight Card */}
            <div style={{
              position: 'absolute',
              bottom: '-1.5rem',
              left: '-1.5rem',
              backgroundColor: '#FFFFFF',
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: '280px'
            }}>
              <div style={{
                backgroundColor: 'var(--terracotta-light)',
                padding: '0.75rem',
                borderRadius: '12px',
                color: 'var(--terracotta)'
              }}>
                <Heart size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--earth-dark)' }}>Support Real People</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--earth-muted)' }}>Over 85% revenue goes direct to creator hands</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview (Visual illustrations - No individual product listings) */}
      <section style={{ padding: '6rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 4rem auto' }}>
            <span style={{
              color: 'var(--forest-green)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Crafted with Intention
            </span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Explore Curated Artisan Categories
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--earth-muted)' }}>
              From morning rituals to cozy living spaces, discover authentic goods crafted by independent artisans and certified organic growers.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {categories.map((cat, idx) => (
              <div key={idx} className="card" style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                backgroundColor: 'var(--bg-cream)',
                borderColor: 'var(--border-color)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {cat.icon}
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--earth-muted)',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    {cat.count}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>{cat.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--earth-muted)', lineHeight: '1.5' }}>
                    {cat.desc}
                  </p>
                </div>

                <div style={{
                  marginTop: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--forest-green)'
                }}>
                  {isAuthenticated ? (
                    <Link to="/marketplace" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      Browse Collection <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      Sign in to Shop <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose InstaTube Virals */}
      <section style={{
        padding: '6rem 0',
        backgroundColor: 'var(--bg-cream)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem auto' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Why Shop on InstaTube Virals?
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--earth-muted)' }}>
              A marketplace intentionally engineered around community trust, sustainable livelihoods, and genuine quality.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            <div className="card" style={{ padding: '2rem', backgroundColor: '#FFF' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--forest-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--forest-green)',
                marginBottom: '1.25rem'
              }}>
                <Leaf size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Direct from Maker</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--earth-muted)', lineHeight: '1.6' }}>
                Every item is created and fulfilled directly by independent workshops and farms, eliminating unnecessary distribution markups.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', backgroundColor: '#FFF' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--terracotta-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--terracotta)',
                marginBottom: '1.25rem'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Strict Curation & Approval</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--earth-muted)', lineHeight: '1.6' }}>
                Every seller and product undergoes manual review and approval by our platform curators to ensure authenticity and safety.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', backgroundColor: '#FFF' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--forest-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--forest-green)',
                marginBottom: '1.25rem'
              }}>
                <ShoppingBag size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Cash on Delivery</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--earth-muted)', lineHeight: '1.6' }}>
                Zero upfront payment risks. Inspect your shipment right at your doorstep before handing over payment with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '6rem 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 4rem auto' }}>
            <span style={{ color: 'var(--terracotta)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Simple & Transparent
            </span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
              How InstaTube Virals Works
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--earth-muted)' }}>
              Bridging the distance between traditional workshops and your home in 3 simple steps.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem'
          }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--forest-green)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                margin: '0 auto 1.5rem auto'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Join & Browse</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--earth-muted)', lineHeight: '1.6' }}>
                Sign in to unlock our authenticated marketplace, discover small-batch products, and filter by your favorite maker traditions.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--terracotta)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                margin: '0 auto 1.5rem auto'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Order with Zero Friction</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--earth-muted)', lineHeight: '1.6' }}>
                Add items from multiple independent creators into a single unified cart and checkout smoothly with Cash on Delivery.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-olive)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                margin: '0 auto 1.5rem auto'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Crafted & Shipped Direct</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--earth-muted)', lineHeight: '1.6' }}>
                Artisans carefully package and dispatch your order with personal pride and trackable fulfillment updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Call-to-Action Banner */}
      <section style={{
        backgroundColor: 'var(--forest-green)',
        color: '#FFFFFF',
        padding: '5rem 0',
        position: 'relative'
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2.5rem'
        }}>
          <div style={{ maxWidth: '620px' }}>
            <span style={{
              color: 'var(--accent-gold)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Join our Creator Collective
            </span>
            <h2 style={{ fontSize: '2.65rem', color: '#FFF', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Are you a farmer, artisan, or creator?
            </h2>
            <p style={{ color: '#E0EDE4', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Turn your craft into a thriving livelihood. Sell directly to conscious patrons with complete control over your catalog, pricing, and fulfillment.
            </p>
          </div>

          <div>
            <Link to="/register-seller" className="btn btn-terracotta btn-lg" style={{ padding: '1rem 2.25rem', fontSize: '1.1rem' }}>
              Register as Seller <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

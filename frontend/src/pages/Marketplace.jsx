import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Tag, 
  Compass, 
  PackageX, 
  Sparkles 
} from 'lucide-react';

const Marketplace = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-created_at');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('in_stock') === 'true');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories/');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with active filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.q = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (sortBy) params.sort = sortBy;
      if (inStockOnly) params.in_stock = 'true';
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;

      const res = await api.get('/products/', { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, inStockOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('-created_at');
    setInStockOnly(false);
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
    // Trigger immediate reload
    setTimeout(() => {
      api.get('/products/').then((res) => setProducts(res.data));
    }, 50);
  };

  return (
    <div style={{ padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 2.5rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--terracotta)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '0.25rem'
            }}>
              <Compass size={17} /> Authenticated Marketplace
            </div>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>
              Welcome back, {user?.first_name || 'Friend'}!
            </h1>
            <p style={{ color: 'var(--earth-muted)', fontSize: '0.95rem' }}>
              Explore small-batch goods directly from certified family farms and heritage artisans.
            </p>
          </div>

          {/* Quick search input */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '380px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                placeholder="Search products, makers..."
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} color="var(--earth-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        {/* Category Pills Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.75rem',
          scrollbarWidth: 'none'
        }}>
          <button
            onClick={() => setSelectedCategory('')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: selectedCategory === '' ? 'var(--forest-green)' : 'var(--border-color)',
              backgroundColor: selectedCategory === '' ? 'var(--forest-green)' : '#FFFFFF',
              color: selectedCategory === '' ? '#FFFFFF' : 'var(--earth-dark)',
              fontWeight: 600,
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            All Collections
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(String(cat.id))}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedCategory === String(cat.id) ? 'var(--forest-green)' : 'var(--border-color)',
                backgroundColor: selectedCategory === String(cat.id) ? 'var(--forest-green)' : '#FFFFFF',
                color: selectedCategory === String(cat.id) ? '#FFFFFF' : 'var(--earth-dark)',
                fontWeight: 600,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {cat.name} ({cat.products_count})
            </button>
          ))}
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem' }}>
            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--earth-muted)' }}>Sort by:</span>
              <select
                className="form-select"
                style={{ padding: '0.4rem 0.85rem', width: 'auto', fontSize: '0.875rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="-created_at">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>

            {/* In stock toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--forest-green)' }}
              />
              <span>In Stock Only</span>
            </label>

            {/* Price Range Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ color: 'var(--earth-muted)', fontWeight: 600 }}>Price:</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{ width: '70px', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: '70px', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              />
              <button
                type="button"
                onClick={fetchProducts}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.35rem 0.65rem' }}
              >
                Apply
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--earth-muted)', fontSize: '0.85rem' }}>
              Showing <strong>{products.length}</strong> items
            </span>
            {(selectedCategory || searchQuery || minPrice || maxPrice || inStockOnly) && (
              <button
                onClick={resetFilters}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--terracotta)' }}
              >
                <RotateCcw size={14} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--border-color)',
              borderTopColor: 'var(--forest-green)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem auto'
            }}></div>
            <p style={{ color: 'var(--earth-muted)' }}>Curating handmade catalog...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : products.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--earth-muted)',
              margin: '0 auto 1.25rem auto'
            }}>
              <PackageX size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Products Found</h3>
            <p style={{ color: 'var(--earth-muted)', maxWidth: '420px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem' }}>
              We couldn't find any artisan items matching your search criteria. Try removing filters or searching for different keywords.
            </p>
            <button onClick={resetFilters} className="btn btn-primary">
              <RotateCcw size={16} /> Show All Products
            </button>
          </div>
        ) : (
          <div className="grid-cols-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [cart, setCart] = useState({ items: [], total_price: '0.00', total_items: 0 });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await api.get('/cart/');
      setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], total_price: '0.00', total_items: 0 });
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post('/cart/add/', { product_id: productId, quantity });
      setCart(res.data.cart);
      showToast(res.data.message || 'Added to cart!', 'success');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add item to cart';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.patch(`/cart/items/${itemId}/`, { quantity });
      setCart(res.data.cart);
      showToast(res.data.message || 'Cart updated', 'info');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update quantity';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await api.delete(`/cart/items/${itemId}/remove/`);
      setCart(res.data.cart);
      showToast('Item removed from cart', 'info');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to remove item';
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.post('/cart/clear/');
      setCart(res.data.cart);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toasts,
        showToast,
        removeToast,
        cartCount: cart.total_items || 0,
        cartTotal: cart.total_price || '0.00',
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

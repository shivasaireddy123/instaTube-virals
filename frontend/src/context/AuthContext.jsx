import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user_info');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync session on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const res = await api.get('/accounts/profile/');
          setUser(res.data);
          localStorage.setItem('user_info', JSON.stringify(res.data));
        } catch (err) {
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchUserProfile();

    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/accounts/login/', { email, password });
    const { access, refresh, user: loggedUser } = res.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_info', JSON.stringify(loggedUser));
    setToken(access);
    setUser(loggedUser);
    return loggedUser;
  };

  const registerCustomer = async (data) => {
    const res = await api.post('/accounts/register/customer/', data);
    const { access, refresh, user: registeredUser } = res.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_info', JSON.stringify(registeredUser));
    setToken(access);
    setUser(registeredUser);
    return registeredUser;
  };

  const registerSeller = async (data) => {
    const res = await api.post('/accounts/register/seller/', data);
    const { access, refresh, user: registeredUser } = res.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user_info', JSON.stringify(registeredUser));
    setToken(access);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/accounts/profile/');
      setUser(res.data);
      localStorage.setItem('user_info', JSON.stringify(res.data));
      return res.data;
    } catch {
      return null;
    }
  };

  const isCustomer = user?.role === 'CUSTOMER';
  const isSeller = user?.role === 'SELLER';
  const isAdmin = user?.role === 'ADMIN' || Boolean(user?.is_admin_user);
  const sellerStatus = user?.seller_profile?.approval_status || 'PENDING';
  const isSellerApproved = isSeller && sellerStatus === 'APPROVED';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerCustomer,
        registerSeller,
        logout,
        refreshProfile,
        isAuthenticated: Boolean(token && user),
        isCustomer,
        isSeller,
        isAdmin,
        sellerStatus,
        isSellerApproved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ToastNotification from './components/ToastNotification';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import RegisterCustomer from './pages/RegisterCustomer';
import RegisterSeller from './pages/RegisterSeller';

// Customer / Authenticated Marketplace Pages
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerOrders from './pages/CustomerOrders';
import Profile from './pages/Profile';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerProductForm from './pages/seller/SellerProductForm';
import SellerOrders from './pages/seller/SellerOrders';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSellers from './pages/admin/AdminSellers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public Access Only */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterCustomer />} />
                <Route path="/register-seller" element={<RegisterSeller />} />

                {/* Login-Protected Marketplace (Guests Forbidden) */}
                <Route
                  path="/marketplace"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                      <Marketplace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/product/:id"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                      <ProductDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                      <CustomerOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedRoles={['CUSTOMER', 'SELLER', 'ADMIN']}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Seller Portal */}
                <Route
                  path="/seller/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['SELLER']}>
                      <SellerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products"
                  element={
                    <ProtectedRoute allowedRoles={['SELLER']}>
                      <SellerProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products/add"
                  element={
                    <ProtectedRoute allowedRoles={['SELLER']}>
                      <SellerProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/products/edit/:id"
                  element={
                    <ProtectedRoute allowedRoles={['SELLER']}>
                      <SellerProductForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/seller/orders"
                  element={
                    <ProtectedRoute allowedRoles={['SELLER']}>
                      <SellerOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Portal */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/sellers"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminSellers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminCategories />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <ToastNotification />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

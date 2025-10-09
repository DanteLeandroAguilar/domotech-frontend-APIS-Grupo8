import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';

// Pages
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderSummary from '../pages/OrderSummary';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';

// Admin Pages
import ProductManagement from '../pages/admin/ProductManagement';
import AdminDashboard from '../pages/admin/AdminDashboard';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Protegidas - BUYER */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute requiredRole="BUYER">
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-summary"
          element={
            <PrivateRoute requiredRole="BUYER">
              <OrderSummary />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Rutas Protegidas - SELLER */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="SELLER">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute requiredRole="SELLER">
              <ProductManagement />
            </PrivateRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
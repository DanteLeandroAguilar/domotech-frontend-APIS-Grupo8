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
import CategoryManagement from '../pages/admin/CategoryManagement';

export const AppRoutes = ({ cartItemsCount, updateCartCount }) => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />} />
        <Route path="/catalog" element={<Catalog cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />} />
        <Route path="/product/:id" element={<ProductDetail cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />} />
        <Route path="/login" element={<Login cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />} />
        <Route path="/register" element={<Register cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />} />

        {/* Rutas Protegidas - BUYER */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute requiredRole="BUYER">
              <Checkout cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-summary"
          element={
            <PrivateRoute requiredRole="BUYER">
              <OrderSummary cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />
            </PrivateRoute>
          }
        />

        {/* Rutas Protegidas - SELLER */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="SELLER">
              <AdminDashboard cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute requiredRole="SELLER">
              <ProductManagement cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <PrivateRoute requiredRole="SELLER">
              <CategoryManagement cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />
            </PrivateRoute>
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
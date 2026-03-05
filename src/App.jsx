import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';

// Client pages
import Home from './client/pages/Home';
import Login from './client/pages/Login';
import OAuthCallback from './client/pages/OAuthCallback';
import Category from './client/pages/Category';
import ProductDetail from './client/pages/ProductDetail';
import Cart from './client/pages/Cart';
import Checkout from './client/pages/Checkout';
import OrderComplete from './client/pages/OrderComplete';
import MyPage from './client/pages/MyPage';

// Admin pages
import AdminLogin from './admin/pages/AdminLogin';
import Dashboard from './admin/pages/Dashboard';
import ProductList from './admin/pages/ProductList';
import ProductForm from './admin/pages/ProductForm';
import OrderList from './admin/pages/OrderList';
import OrderDetail from './admin/pages/OrderDetail';
import Inventory from './admin/pages/Inventory';
import MemberList from './admin/pages/MemberList';

// Components
import ProtectedRoute from './client/components/ProtectedRoute';
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';

export default function App() {
  const fetchUser = useAuthStore(s => s.fetchUser);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 고객 라우트 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/order-complete/:orderId" element={<ProtectedRoute><OrderComplete /></ProtectedRoute>} />
        <Route path="/mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />

        {/* 관리자 라우트 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
        <Route path="/admin/products" element={<AdminProtectedRoute><ProductList /></AdminProtectedRoute>} />
        <Route path="/admin/products/new" element={<AdminProtectedRoute><ProductForm /></AdminProtectedRoute>} />
        <Route path="/admin/products/:id/edit" element={<AdminProtectedRoute><ProductForm /></AdminProtectedRoute>} />
        <Route path="/admin/orders" element={<AdminProtectedRoute><OrderList /></AdminProtectedRoute>} />
        <Route path="/admin/orders/:id" element={<AdminProtectedRoute><OrderDetail /></AdminProtectedRoute>} />
        <Route path="/admin/inventory" element={<AdminProtectedRoute><Inventory /></AdminProtectedRoute>} />
        <Route path="/admin/members" element={<AdminProtectedRoute><MemberList /></AdminProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

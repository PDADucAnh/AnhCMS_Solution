import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { authEvents } from './utils/eventEmitter';
import ErrorFallback from './components/ErrorFallback';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';

const Home = lazy(() => import('./pages/home/index'));
const Shop = lazy(() => import('./pages/shop/index'));
const ProductDetail = lazy(() => import('./pages/product-detail/index'));
const Blog = lazy(() => import('./pages/blog/index'));
const BlogDetail = lazy(() => import('./pages/blog-detail/index'));
const Cart = lazy(() => import('./pages/cart/index'));
const Checkout = lazy(() => import('./pages/checkout/index'));
const Login = lazy(() => import('./pages/login/index'));
const Register = lazy(() => import('./pages/register/index'));

const PageLoader: React.FC = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div className="text-center">
      <div className="spinner-border text-dark mb-3" role="status" style={{ width: '2rem', height: '2rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted font-body-sm text-[11px] tracking-widest text-uppercase">ANHCMS NARRATIVE...</p>
    </div>
  </div>
);

const AuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = authEvents.on('unauthorized', () => navigate('/login'));
    return unsubscribe;
  }, [navigate]);
  return null;
};

const NotFound: React.FC = () => (
  <div className="container text-center py-5 my-5">
    <img
      src="https://cdn-icons-png.flaticon.com/512/580/580185.png"
      alt="404"
      className="mb-4"
      style={{ width: '100px', opacity: 0.6 }}
    />
    <h2 className="fw-bold text-secondary">404 - KHÔNG TÌM THẤY TRANG</h2>
    <p className="text-muted">Đường dẫn bạn truy cập không tồn tại trên hệ thống AnhCMS.</p>
    <Link to="/" className="btn btn-dark btn-sm mt-2 text-decoration-none">Quay lại Trang Chủ</Link>
  </div>
);

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <Router>
          <AuthRedirectHandler />
          <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => console.error('[Global Error]', error)}>
            <Toaster
              position="top-right"
              gutter={12}
              containerClassName="font-body-md"
              toastOptions={{
                duration: 4000,
                style: { fontFamily: 'Inter', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', background: '#1a1c1c', color: '#f9f9f9' },
                success: { iconTheme: { primary: '#000', secondary: '#fff' }, style: { background: '#000' } },
                error: { iconTheme: { primary: '#ba1a1a', secondary: '#fff' }, style: { background: '#ba1a1a' } },
              }}
            />
            <div className="d-flex flex-column min-vh-100 bg-light">
              <Header />
              <main className="flex-grow-1">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </ErrorBoundary>
        </Router>
      </CartProvider>
    </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

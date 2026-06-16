import React, { lazy, Suspense } from 'react';
// Import các thành phần lõi của thư viện điều hướng đường dẫn
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 2. IMPORT CONTEXT
import { CartProvider } from './context/CartContext';

// 1. IMPORT CÁC TRANG CHỨC NĂNG (LAZY LOADING ĐỂ TỐI ƯU HÓA BUNDLE SIZE)
const Home = lazy(() => import('./pages/home/index'));
const Shop = lazy(() => import('./pages/shop/index'));
const ProductDetail = lazy(() => import('./pages/product-detail/index'));
const Blog = lazy(() => import('./pages/blog/index'));
const BlogDetail = lazy(() => import('./pages/blog-detail/index'));
const Cart = lazy(() => import('./pages/cart/index'));
const Checkout = lazy(() => import('./pages/checkout/index'));
const Login = lazy(() => import('./pages/login/index'));
const Register = lazy(() => import('./pages/register/index'));

// Loading fallback component
const PageLoader = () => (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
            <div className="spinner-border text-dark mb-3" role="status" style={{ width: '2rem', height: '2rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted font-body-sm text-[11px] tracking-widest text-uppercase">ANHCMS NARRATIVE...</p>
        </div>
    </div>
);

function App() {
    return (
        <CartProvider>
            {/* Khởi tạo bộ định tuyến bao bọc toàn bộ ứng dụng Web */}
            <Router>
                <div className="d-flex flex-column min-vh-100 bg-light">
                    {/* KHU VỰC NỘI DUNG ĐỘNG (Bọc trong Suspense để hỗ trợ trì hoãn tải) */}
                    <main className="flex-grow-1">
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                {/* Cấu hình Trang chủ - Khớp hoàn toàn với địa chỉ "/" */}
                                <Route path="/" element={<Home />} />

                                {/* Cấu hình Trang Cửa hàng - Địa chỉ "/shop" */}
                                <Route path="/shop" element={<Shop />} />

                                {/* Cấu hình Trang Chi tiết sản phẩm - Sử dụng tham số động ":id" */}
                                <Route path="/product/:id" element={<ProductDetail />} />

                                {/* Cấu hình Trang Danh sách tin tức - Địa chỉ "/blog" */}
                                <Route path="/blog" element={<Blog />} />

                                {/* Cấu hình Trang Chi tiết bài viết - Địa chỉ "/blog/:id" */}
                                <Route path="/blog/:id" element={<BlogDetail />} />

                                {/* Cấu hình Trang Giỏ hàng cá nhân - Địa chỉ "/cart" */}
                                <Route path="/cart" element={<Cart />} />

                                {/* Cấu hình Trang Điền thông tin thanh toán - Địa chỉ "/checkout" */}
                                <Route path="/checkout" element={<Checkout />} />

                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />

                                {/* XỬ LÝ KỊCH BẢN TRANG LỖI 404 (Khi sinh viên gõ sai URL) */}
                                <Route path="*" element={
                                    <div className="container text-center py-5 my-5">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/580/580185.png"
                                            alt="404"
                                            className="mb-4"
                                            style={{ width: '100px', opacity: 0.6 }}
                                        />
                                        <h2 className="fw-bold text-secondary">404 - KHÔNG TÌM THẤY TRANG</h2>
                                        <p className="text-muted">Đường dẫn bạn truy cập không tồn tại trên hệ thống AnhCMS.</p>
                                        <a href="/" className="btn btn-dark btn-sm mt-2 text-decoration-none">Quay lại Trang Chủ</a>
                                    </div>
                                } />
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;

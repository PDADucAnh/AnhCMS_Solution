import React from 'react';
import CategoryProductList from './components/CategoryProductList';
import PostList from './components/PostList';
import BlogCategoryList from './components/BlogCategoryList';
import './App.css'; // File chứa các style tùy biến riêng của dự án

function App() {
    return (
        <div className="container mt-5">
            {/* Phần Header của Website */}
            <header className="pb-3 mb-4 border-bottom">
                <span className="fs-4 font-weight-bold text-dark text-uppercase">
                    🛒 HỆ THỐNG CỬA HÀNG TRỰC TUYẾN - ANH_CMS RETAIL
                </span>
            </header>

            <div className="row">
                {/* Cột bên trái (Chức năng Sidebar): Hiển thị bộ lọc danh mục sản phẩm và danh mục blog */}
                <div className="col-md-4">
                    <CategoryProductList />
                    <BlogCategoryList />
                </div>

                {/* Cột bên phải (Chức năng Content): Hiển thị danh sách bài viết blog */}
                <div className="col-md-8">
                    <h3 className="mb-4 font-weight-bold text-dark text-uppercase" style={{ letterSpacing: '1px' }}>
                        <i className="fa-solid fa-newspaper text-primary mr-2"></i> Tin tức mới nhất
                    </h3>
                    <PostList />
                </div>
            </div>
        </div>
    );
}

export default App;

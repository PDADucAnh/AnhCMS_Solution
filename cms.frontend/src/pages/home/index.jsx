import React, { useState } from 'react';


// IMPORT ĐỦ 6 TẦNG THEO ĐÚNG THỨ TỰ HƯỚNG DẪN
import Header from '../../components/Header';
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';
import Footer from '../../components/Footer';


function Home() {
    // State để truyền ID danh mục từ CategoryMenu xuống ProductGrid
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const handleCategorySelect = (id) => {
        setSelectedCategoryId(id);
    };

    return (
        <div className="homepage-container">
            {/* TẦNG 1: Thanh tiện ích, logo, ô tìm kiếm và giỏ hàng nhanh */}
            <Header />


            {/* TẦNG 2: Banner quảng cáo lớn, hình khối trang trí và nút kêu gọi mua hàng */}
            <HeroBanner />


            {/* TẦNG 3: Menu ngang hiển thị danh mục sản phẩm (Gọi API /api/CategoriesProducts) */}
            <CategoryMenu onSelectCategory={handleCategorySelect} activeId={selectedCategoryId} />


            {/* TẦNG 4: Lưới hiển thị danh sách sản phẩm thời trang (Gọi API /api/Products) */}
            <ProductGrid categoryId={selectedCategoryId} />


            {/* TẦNG 5: Khối hiển thị các bài viết tin tức xu hướng mặc đẹp (Gọi API /api/Posts) */}
            <LatestBlog />


            {/* TẦNG 6: Chân trang quản trị thông tin liên hệ, hotline và chính sách cửa hàng */}
            <Footer />
        </div>
    );
}


export default Home;

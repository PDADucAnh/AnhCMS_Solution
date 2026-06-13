import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
// IMPORT file thành phần component  CON VÀO ĐỂ SỬ DỤNG
import ProductCard from '../../components/ProductCard';


function ProductGrid({ categoryId }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi hệ thống khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);


    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Đang tải danh sách trang phục mới nhất...</p>
            </div>
        );
    }

    // Lọc sản phẩm theo CategoryId nếu có
    const displayProducts = categoryId 
        ? products.filter(p => p.categoryProductId === categoryId)
        : products;


    return (
        <section className="product-grid-wrapper py-4">
            <div className="container">

                <div className="section-heading mb-4 d-flex justify-content-between align-items-center border-bottom pb-2">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088' }}>
                        <i className="fas fa-sparkles mr-2 text-warning"></i> Sản phẩm nổi bật
                    </h4>
                    <span className="text-muted" style={{ fontSize: '14px' }}>
                        Hiển thị ({displayProducts.length}) sản phẩm
                    </span>
                </div>


                {/* KHUNG LƯỚI GRID SYSTEM */}
                <div className="row">
                    {displayProducts.map((product) => (
                        <div className="col-xl-3 col-lg-4 col-sm-6 col-12 mb-4" key={product.id}>
                            {/* CHÈN ĐÚNG file thành phần component  CON TẠI ĐÂY VÀ TRUYỀN DỮ LIỆU ĐI */}
                            <ProductCard item={product} />
                        </div>
                    ))}
                    {displayProducts.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <i className="fas fa-box-open fa-3x text-light mb-3"></i>
                            <p className="text-muted text-uppercase small font-weight-bold">Không tìm thấy sản phẩm nào trong mục này</p>
                        </div>
                    )}
                </div>


            </div>
        </section>
    );
}


export default ProductGrid;

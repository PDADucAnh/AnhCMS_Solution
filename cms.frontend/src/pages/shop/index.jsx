import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import productService from '../../services/productService';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data;
        if (selectedCategoryId) {
          data = await productService.getProductsByCategory(selectedCategoryId);
        } else {
          data = await productService.getAllProducts();
        }
        setProducts(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategoryId]);

  const handleCategoryChange = (id) => {
    setSelectedCategoryId(id);
  };

  return (
    <>
      <Header />
      <div className="container py-5 mt-4">
        <h3 className="font-weight-bold mb-4 text-uppercase text-center" style={{ color: '#005088' }}>
          Cửa hàng thời trang
        </h3>
        <div className="row">
          <div className="col-lg-3">
            <ShopSidebar onCategoryChange={handleCategoryChange} activeId={selectedCategoryId} />
          </div>
          <div className="col-lg-9">
            <ShopHeader count={products.length} />
            <ProductList products={products} isLoading={loading} error={error} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShopPage;

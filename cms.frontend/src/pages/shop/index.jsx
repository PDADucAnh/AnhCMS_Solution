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
          // Assuming getProductsByCategory exists, if not we filter locally
          const all = await productService.getAllProducts();
          data = all.filter(p => p.categoryProductId === selectedCategoryId);
        } else {
          data = await productService.getAllProducts();
        }
        setProducts(data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách sản phẩm:", err);
        setError("Unable to curate the collection at this time.");
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
    <div className="bg-background text-on-background font-body-md antialiased pt-20">
      <Header />
      <main className="max-w-[1440px] mx-auto px-margin py-xl">
        <header className="mb-xl text-center space-y-md">
            <h3 className="text-label-sm uppercase tracking-[0.3em] text-secondary">Curated Boutique</h3>
            <h2 className="font-display-xl text-display-xl uppercase tracking-tighter">The Collection</h2>
            <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        </header>

        <div className="flex flex-col lg:flex-row gap-xl">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <ShopSidebar onCategoryChange={handleCategoryChange} activeId={selectedCategoryId} />
          </aside>
          
          <div className="flex-1 space-y-lg">
            <ShopHeader count={products.length} />
            <ProductList products={products} isLoading={loading} error={error} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;

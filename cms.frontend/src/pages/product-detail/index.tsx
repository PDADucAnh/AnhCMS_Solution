import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/apiUtils';

const formatImageUrl = (url?: string, fallback?: string): string => {
  return getImageUrl(url) || fallback || '';
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [data, allProducts] = await Promise.all([
          productService.getProductById(id as string),
          productService.getAllProducts()
        ]);
        setProduct(data);
        // Filter out current product and take 4 related ones
        setRelatedProducts(allProducts.filter((p: any) => p.id !== parseInt(id as string)).slice(0, 4));
      } catch (err) {
        console.error("Lỗi khi tải thông tin sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const toggleTab = (tabId: string) => {
    setActiveTab(activeTab === tabId ? '' : tabId);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`Added ${quantity} [${product.name}] to cart!`);
    }
  };

  const handleDirectBuy = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-vh-100 flex items-center justify-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="font-display-xl text-headline-lg">Sản phẩm không tồn tại</h2>
        <Link to="/shop" className="text-primary underline mt-4 inline-block">Quay lại cửa hàng</Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased overflow-x-hidden pt-20">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      
      <main className="w-full max-w-[1440px] mx-auto px-5 md:px-margin pt-lg pb-xl grid grid-cols-1 md:grid-cols-12 gap-gutter relative">
        {/* Breadcrumbs */}
        <div className="md:col-span-12 font-label-sm text-label-sm text-secondary uppercase tracking-widest flex items-center space-x-2 mb-md">
          <Link className="hover:text-primary transition-colors text-decoration-none" to="/">Home</Link>
          <span>/</span>
          <Link className="hover:text-primary transition-colors text-decoration-none" to="/shop">Shop</Link>
          <span>/</span>
          <span className="text-primary truncate">{product.name}</span>
        </div>

        {/* Left: Product Image */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-gutter">
          <div className="w-full aspect-[4/5] bg-surface-container relative group overflow-hidden">
            <img 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src={formatImageUrl(product.imageUrl, "https://via.placeholder.com/800x1000")} 
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:col-span-5 lg:col-span-4 md:sticky md:top-32 h-fit flex flex-col pt-md md:pt-0">
          <div className="mb-lg">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-2 block">SKU: ANH-{product.id}</span>
            <h1 className="font-display-xl-mobile md:font-headline-lg text-display-xl-mobile md:text-headline-lg text-primary mb-4">{product.name}</h1>
            <div className="flex gap-3 items-center">
              <p className="font-body-lg text-body-lg text-primary mb-0">
                {(product.discountPrice || product.price).toLocaleString()} ₫
              </p>
              {product.discountPrice > 0 && (
                <p className="font-body-md text-body-md text-secondary line-through mb-0 opacity-60">
                  {product.price.toLocaleString()} ₫
                </p>
              )}
            </div>
          </div>

          {/* Color Selection (Mocked) */}
          <div className="mb-md">
            <div className="flex justify-between items-center mb-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Color: Default</span>
            </div>
            <div className="flex space-x-3">
              <button aria-label="Default" className="w-8 h-8 rounded-full border border-primary relative bg-transparent">
                <span className="absolute inset-[2px] rounded-full bg-[#000000]"></span>
              </button>
            </div>
          </div>

          {/* Size Selection (Mocked) */}
          <div className="mb-lg">
            <div className="flex justify-between items-center mb-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Size</span>
              <button className="font-label-sm text-label-sm uppercase tracking-widest text-secondary hover:text-primary underline underline-offset-4 transition-colors bg-transparent border-0">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size}
                  className={`py-3 border ${size === 'S' ? 'border-primary bg-primary text-on-primary' : 'border-outline hover:border-primary text-primary'} font-label-sm text-label-sm transition-colors uppercase bg-transparent`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-sm mb-xl">
            <div className="flex gap-sm h-14">
              {/* Quantity Selector */}
              <div className="w-1/3 border border-primary flex items-center justify-between px-3">
                <button 
                  aria-label="Decrease quantity" 
                  className="text-primary hover:text-secondary p-1 bg-transparent border-0"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="font-body-md text-body-md">{quantity}</span>
                <button 
                  aria-label="Increase quantity" 
                  className="text-primary hover:text-secondary p-1 bg-transparent border-0"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              {/* Add to Cart */}
              <button 
                className="w-2/3 bg-primary text-on-primary border border-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-transparent hover:text-primary transition-colors duration-300"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
            {/* Buy Now Ghost Button */}
            <button 
                onClick={handleDirectBuy}
                className="w-full h-14 bg-transparent text-primary border border-primary font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors duration-300"
            >
              Buy Now
            </button>
            {/* Wishlist */}
            <button className="flex items-center justify-center gap-2 text-secondary hover:text-primary transition-colors mt-xs py-2 bg-transparent border-0">
              <span className="material-symbols-outlined">favorite</span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest">Add to Wishlist</span>
            </button>
          </div>

          {/* Accordion */}
          <div className="border-t border-outline-variant pt-sm">
            {/* Description */}
            <button className="w-full py-sm flex justify-between items-center group bg-transparent border-0" onClick={() => toggleTab('desc')}>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Description</span>
              <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-transform duration-300">
                {activeTab === 'desc' ? 'remove' : 'add'}
              </span>
            </button>
            {activeTab === 'desc' && (
              <div className="pb-md text-secondary font-body-md text-body-md leading-relaxed">
                {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
              </div>
            )}

            {/* Specifications */}
            <div className="border-t border-surface-variant">
              <button className="w-full py-sm flex justify-between items-center group bg-transparent border-0" onClick={() => toggleTab('specs')}>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Specifications</span>
                <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-transform duration-300">
                  {activeTab === 'specs' ? 'remove' : 'add'}
                </span>
              </button>
              {activeTab === 'specs' && (
                <div className="pb-md text-secondary font-body-md text-body-md">
                  <ul className="list-none space-y-2 p-0 m-0">
                    <li><span className="text-primary font-medium">Material:</span> Premium Fabric</li>
                    <li><span className="text-primary font-medium">Care:</span> Dry clean only</li>
                    <li><span className="text-primary font-medium">Origin:</span> Imported</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="border-t border-surface-variant border-b mb-xl">
              <button className="w-full py-sm flex justify-between items-center group bg-transparent border-0" onClick={() => toggleTab('shipping')}>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Shipping & Returns</span>
                <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-transform duration-300">
                  {activeTab === 'shipping' ? 'remove' : 'add'}
                </span>
              </button>
              {activeTab === 'shipping' && (
                <div className="pb-md text-secondary font-body-md text-body-md">
                  Giao hàng miễn phí cho đơn hàng trên 2.000.000 ₫. Đổi trả trong vòng 7 ngày nếu có lỗi sản xuất.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Related Products Section */}
      <section className="w-full border-t border-secondary-container bg-surface py-xl">
        <div className="max-w-[1440px] mx-auto px-5 md:px-margin">
          <div className="flex justify-between items-end mb-lg">
            <h2 className="font-headline-sm text-headline-sm uppercase tracking-widest text-primary">Complete the Look</h2>
          </div>
          <div className="flex gap-gutter overflow-x-auto hide-scrollbar pb-sm snap-x">
            {relatedProducts.map((rp) => (
              <Link key={rp.id} to={`/product/${rp.id}`} className="min-w-[280px] md:min-w-[320px] w-[280px] md:w-[320px] snap-start group cursor-pointer text-decoration-none">
                <div className="w-full aspect-[4/5] bg-surface-container relative mb-4 overflow-hidden">
                  <img 
                    alt={rp.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    src={formatImageUrl(rp.imageUrl, "https://via.placeholder.com/400x500")} 
                  />
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform border-0"
                      onClick={(e) => { e.preventDefault(); addToCart(rp); }}
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                    </button>
                  </div>
                </div>
                <h3 className="font-body-md text-body-md text-primary mb-1">{rp.name}</h3>
                <p className="font-body-md text-body-md text-secondary">{(rp.discountPrice || rp.price).toLocaleString()} ₫</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;

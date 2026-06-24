import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getImageUrl } from '../../utils/apiUtils';
import toast from 'react-hot-toast';

const formatImageUrl = (url?: string): string => {
  return getImageUrl(url) || '';
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const { data: product, isLoading } = useProduct(id as string);
  const [quantity, setQuantity] = useState(1);
  const [showDesc, setShowDesc] = useState(true);

  useEffect(() => {
    setQuantity(1);
    setShowDesc(true);
    window.scrollTo(0, 0);
  }, [id]);

  const isOutOfStock = product ? product.stockQuantity === 0 : false;
  const isLowStock = product ? product.stockQuantity > 0 && product.stockQuantity <= 5 : false;
  const maxQuantity = product ? product.stockQuantity : 1;

  const canAddToCart = product && quantity <= product.stockQuantity && product.stockQuantity > 0;

  const handleQuantityChange = useCallback((delta: number) => {
    if (!product) return;
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > product.stockQuantity) {
        toast.error(`Trong kho chỉ còn ${product.stockQuantity} sản phẩm`);
        return product.stockQuantity;
      }
      return next;
    });
  }, [product]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (quantity > product.stockQuantity) {
      toast.error(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho`);
      return;
    }
    addToCart(product, quantity);
    toast.success(`Đã thêm "${product.name}" (x${quantity}) vào giỏ hàng`);
  }, [product, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    if (quantity > product.stockQuantity) {
      toast.error(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho`);
      return;
    }
    addToCart(product, quantity);
    navigate('/checkout');
  }, [product, quantity, addToCart, navigate]);

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-md" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">Curating Product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-xl px-margin">
        <h2 className="font-display-xl text-headline-lg uppercase tracking-tight">Product Not Found</h2>
        <Link to="/shop" className="text-primary font-label-sm uppercase tracking-widest mt-4 inline-block text-decoration-none btn-link-luxury">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased overflow-x-hidden pt-20">
      <main className="w-full max-w-[1200px] mx-auto px-5 md:px-margin pt-lg pb-xl grid grid-cols-1 md:grid-cols-12 gap-8 relative">
        <div className="md:col-span-12 font-label-sm text-label-sm text-secondary uppercase tracking-widest flex items-center space-x-2 mb-md">
          <Link className="hover:text-primary transition-colors text-decoration-none" to="/">Home</Link>
          <span>/</span>
          <Link className="hover:text-primary transition-colors text-decoration-none" to="/shop">Shop</Link>
          <span>/</span>
          <span className="text-primary truncate">{product.name}</span>
        </div>

        <div className="md:col-span-7">
          <div className="w-full aspect-[4/5] bg-surface-container relative overflow-hidden">
            <img
              alt={product.name}
              className="w-full h-full object-cover"
              src={formatImageUrl(product.imageUrl)}
            />
            {(isOutOfStock || isLowStock) && (
              <div className={`absolute top-4 left-4 px-3 py-1 font-label-sm text-label-sm uppercase tracking-widest rounded-sm ${isOutOfStock ? 'bg-error text-on-error' : 'bg-warning text-on-warning'}`}>
                {isOutOfStock ? 'Hết hàng' : `Chỉ còn ${product.stockQuantity} sản phẩm`}
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-5 md:sticky md:top-32 h-fit flex flex-col gap-6">
          <div>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mb-2">SKU: ANH-{product.id}</span>
            <h1 className="font-display-xl-mobile md:font-headline-lg text-display-xl-mobile md:text-headline-lg text-primary mb-3">{product.name}</h1>
            <div className="flex gap-3 items-center mb-3">
              <p className="font-body-lg text-body-lg text-primary mb-0 font-semibold">
                {(product.discountPrice || product.price).toLocaleString()} ₫
              </p>
              {product.discountPrice! > 0 && (
                <p className="font-body-md text-body-md text-secondary line-through mb-0 opacity-60">
                  {product.price.toLocaleString()} ₫
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-error' : product.stockQuantity <= 10 ? 'bg-warning' : 'bg-success'}`} />
              <span className="font-label-sm text-label-sm text-secondary">
                {isOutOfStock ? 'Hết hàng' : `Còn ${product.stockQuantity} sản phẩm trong kho`}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Số lượng</span>
            <div className="flex gap-3 h-14">
              <div className="w-[140px] border border-primary flex items-center justify-between px-3">
                <button
                  aria-label="Decrease quantity"
                  className="text-primary hover:text-secondary p-1 bg-transparent border-0 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                  onClick={() => handleQuantityChange(-1)}
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                </button>
                <span className="font-body-md text-body-md font-medium">{quantity}</span>
                <button
                  aria-label="Increase quantity"
                  className="text-primary hover:text-secondary p-1 bg-transparent border-0 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={quantity >= product.stockQuantity}
                  onClick={() => handleQuantityChange(1)}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <button
                className="flex-1 bg-primary text-on-primary border border-primary font-label-sm text-label-sm uppercase tracking-widest btn-luxury btn-primary-luxury disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={!canAddToCart}
                onClick={handleAddToCart}
              >
                {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
              </button>
            </div>
            <button
              disabled={!canAddToCart}
              onClick={handleBuyNow}
              className="w-full h-14 bg-transparent text-primary border border-primary font-label-sm text-label-sm uppercase tracking-widest btn-luxury btn-outline-luxury disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Mua ngay
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2 bg-transparent border-0 btn-link-luxury"
              onClick={() => toggleFavorite(product)}
            >
              <span className={`material-symbols-outlined ${isFavorite(product.id) ? 'text-error' : 'text-secondary'}`}>
                {isFavorite(product.id) ? 'favorite' : 'favorite'}
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest">
                {isFavorite(product.id) ? 'Đã lưu' : 'Yêu thích'}
              </span>
            </button>
          </div>

          <div className="border-t border-outline-variant pt-4">
            <button
              className="w-full py-3 flex justify-between items-center bg-transparent border-0"
              onClick={() => setShowDesc(!showDesc)}
            >
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Mô tả</span>
              <span className="material-symbols-outlined text-secondary transition-transform duration-300">
                {showDesc ? 'remove' : 'add'}
              </span>
            </button>
            {showDesc && (
              <div className="pb-4 text-secondary font-body-md text-body-md leading-relaxed">
                {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;

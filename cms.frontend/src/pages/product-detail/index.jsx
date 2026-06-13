import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { useCart } from '../../context/CartContext';
import ProductInfo from './ProductInfo';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const IMAGE_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7111";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <>
      <Header />
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
      <Footer />
    </>
  );

  if (error) return (
    <>
      <Header />
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <button onClick={() => navigate(-1)} className="btn btn-outline-primary">
          <i className="fas fa-arrow-left mr-2"></i> Quay lại
        </button>
      </div>
      <Footer />
    </>
  );

  if (!product) return null;

  const imageUrl = product.imageUrl?.startsWith('http') 
    ? product.imageUrl 
    : `${IMAGE_BASE_URL}${product.imageUrl || ''}`;

  return (
    <>
      <Header />
      <div className="container py-5 mt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb bg-transparent p-0 mb-4">
            <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Trang chủ</a></li>
            <li className="breadcrumb-item"><a href="/shop" className="text-decoration-none text-muted">Cửa hàng</a></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="border rounded overflow-hidden shadow-sm bg-light">
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="img-fluid w-100"
                style={{ minHeight: '500px', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div className="col-md-6 pl-md-5">
            <ProductInfo product={product} onAddToCart={addToCart} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;

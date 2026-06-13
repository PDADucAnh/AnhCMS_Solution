import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';
import CartTable from './CartTable';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const handleCheckout = async () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="container py-5 my-5 text-center">
          <i className="fas fa-shopping-bag fa-5x text-light mb-4"></i>
          <h2 className="font-weight-bold">Giỏ hàng của bạn đang trống</h2>
          <p className="text-muted mb-4">Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link to="/shop" className="btn btn-primary px-5 py-2" style={{ backgroundColor: '#2d6a4f', borderColor: '#2d6a4f' }}>
            BẮT ĐẦU MUA SẮM
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-5 mt-4">
        <h3 className="font-weight-bold mb-4 text-uppercase" style={{ color: '#005088' }}>
          <i className="fas fa-shopping-cart mr-2"></i> Giỏ hàng của bạn
        </h3>

        <div className="row">
          <div className="col-lg-8">
            <CartTable 
              items={cartItems} 
              onUpdateQuantity={updateQuantity} 
              onRemove={removeFromCart} 
            />
            
            <Link to="/shop" className="btn btn-link text-decoration-none mt-3 p-0" style={{ color: '#2d6a4f' }}>
              <i className="fas fa-arrow-left mr-2"></i> Tiếp tục mua sắm
            </Link>
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card shadow-sm border-0 bg-light p-4">
              <h5 className="font-weight-bold mb-4">Tóm tắt đơn hàng</h5>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Tạm tính</span>
                <span className="font-weight-bold">{cartTotal.toLocaleString()} ₫</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Phí vận chuyển</span>
                <span className="text-success font-weight-bold">Miễn phí</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="h5 font-weight-bold">Tổng cộng</span>
                <span className="h5 font-weight-bold text-danger">
                  {cartTotal.toLocaleString()} ₫
                </span>
              </div>
              
              <button 
                className="btn btn-primary btn-lg w-100 font-weight-bold"
                onClick={handleCheckout}
                style={{ 
                  backgroundColor: '#2d6a4f', 
                  borderColor: '#2d6a4f',
                  fontSize: '16px'
                }}
              >
                TIẾN HÀNH THANH TOÁN
              </button>
              
              <div className="alert alert-info mt-4 small border-0">
                <i className="fas fa-info-circle mr-2"></i> 
                Miễn phí vận chuyển cho đơn hàng từ 500.000 ₫.
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShoppingCartPage;

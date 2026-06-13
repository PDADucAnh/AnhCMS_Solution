import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API
      // Since we don't have a login system for Customers yet, we'll use a mocked CustomerId (e.g., 1)
      // In a real app, this would come from the logged-in user state or a guest registration
      const orderData = {
        customerId: 1, // Mocked ID
        notes: `Giao đến: ${formData.fullname}, SĐT: ${formData.phone}, ĐC: ${formData.address}. Ghi chú: ${formData.notes}`,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.discountPrice || item.price
        }))
      };

      const result = await orderService.submitOrder(orderData);
      
      if (result) {
        alert("Chúc mừng! Đơn hàng của bạn đã được tiếp nhận.");
        clearCart();
        navigate('/');
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container py-5 mt-4">
        <h3 className="font-weight-bold mb-4 text-uppercase" style={{ color: '#005088' }}>
          <i className="fas fa-credit-card mr-2"></i> Thanh toán đơn hàng
        </h3>
        
        <form onSubmit={handleSubmitOrder}>
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 p-4 mb-4">
                <h5 className="font-weight-bold mb-4 border-bottom pb-2">Thông tin giao hàng</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="font-weight-bold small text-uppercase">Họ và tên</label>
                    <input 
                      type="text" 
                      name="fullname"
                      className="form-control" 
                      placeholder="Nhập họ tên người nhận" 
                      required
                      value={formData.fullname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="font-weight-bold small text-uppercase">Số điện thoại</label>
                    <input 
                      type="text" 
                      name="phone"
                      className="form-control" 
                      placeholder="09xx xxx xxx" 
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="font-weight-bold small text-uppercase">Địa chỉ nhận hàng</label>
                  <input 
                    type="text" 
                    name="address"
                    className="form-control" 
                    placeholder="Số nhà, tên đường..." 
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-0">
                  <label className="font-weight-bold small text-uppercase">Ghi chú đơn hàng</label>
                  <textarea 
                    name="notes"
                    className="form-control" 
                    rows="3" 
                    placeholder="Yêu cầu đặc biệt (ví dụ: giao giờ hành chính)"
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
              
              <div className="card shadow-sm border-0 p-4">
                <h5 className="font-weight-bold mb-4 border-bottom pb-2">Phương thức thanh toán</h5>
                <div className="custom-control custom-radio mb-3">
                  <input type="radio" id="cod" name="payment" className="custom-control-input" defaultChecked />
                  <label className="custom-control-label" htmlFor="cod">
                    <strong>Thanh toán khi nhận hàng (COD)</strong>
                    <p className="text-muted small m-0">Giao hàng và thu tiền tại nhà</p>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="card shadow-sm border-0 bg-light p-4 sticky-top" style={{ top: '100px', zIndex: 1 }}>
                <h5 className="font-weight-bold mb-4">Tóm tắt đơn hàng</h5>
                <div className="mb-4">
                  {cartItems.map(item => (
                    <div className="d-flex justify-content-between mb-2 small" key={item.id}>
                      <span className="text-muted">{item.name} x {item.quantity}</span>
                      <span>{((item.discountPrice || item.price) * item.quantity).toLocaleString()} ₫</span>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tạm tính</span>
                  <span className="font-weight-bold">{cartTotal.toLocaleString()} ₫</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Phí vận chuyển</span>
                  <span className="text-success font-weight-bold">Miễn phí</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="h5 font-weight-bold">Tổng cộng</span>
                  <span className="h5 font-weight-bold text-danger">{cartTotal.toLocaleString()} ₫</span>
                </div>
                
                <button 
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="btn btn-primary btn-lg w-100 font-weight-bold text-uppercase py-3" 
                  style={{ backgroundColor: '#005088', borderColor: '#005088', fontSize: '15px' }}
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;

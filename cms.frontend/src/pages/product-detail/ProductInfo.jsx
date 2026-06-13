import React from 'react';

function ProductInfo({ product, onAddToCart }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    return (
        <div className="product-info">
            <h2 className="font-weight-bold mb-3">{product.name}</h2>
            
            <div className="d-flex align-items-center mb-4">
                <span className="h3 font-weight-bold text-danger mr-3">
                    {formatCurrency(product.price)}
                </span>
                {product.stockQuantity > 0 ? (
                    <span className="badge badge-success px-2 py-1">Còn hàng</span>
                ) : (
                    <span className="badge badge-secondary px-2 py-1">Hết hàng</span>
                )}
            </div>

            <div className="mb-4">
                <h6 className="font-weight-bold text-uppercase small text-muted mb-2">Mô tả sản phẩm</h6>
                <p className="text-muted" style={{ lineHeight: '1.8' }}>
                    {product.description || 'Chưa có mô tả cho sản phẩm này. Đây là mẫu thiết kế cao cấp nằm trong bộ sưu tập mới nhất, mang lại vẻ ngoài thanh lịch và tự tin cho người mặc.'}
                </p>
            </div>

            <div className="mb-4 py-3 border-top border-bottom">
                <div className="row">
                    <div className="col-6 border-right text-center">
                        <small className="text-muted d-block mb-1">Mã sản phẩm</small>
                        <span className="font-weight-bold">#{product.id}</span>
                    </div>
                    <div className="col-6 text-center">
                        <small className="text-muted d-block mb-1">Tồn kho</small>
                        <span className="font-weight-bold">{product.stockQuantity} chiếc</span>
                    </div>
                </div>
            </div>

            <div className="d-flex gap-2">
                <button 
                    className="btn btn-primary btn-lg px-5 font-weight-bold mr-2" 
                    style={{ backgroundColor: '#11CAA0', borderColor: '#11CAA0', flexGrow: 1 }}
                    onClick={() => {
                        onAddToCart(product);
                        alert(`Đã thêm [${product.name}] vào giỏ hàng!`);
                    }}
                    disabled={product.stockQuantity === 0}
                >
                    <i className="fas fa-cart-plus mr-2"></i> THÊM VÀO GIỎ
                </button>
                <button className="btn btn-outline-dark btn-lg px-4">
                    <i className="far fa-heart"></i>
                </button>
            </div>
            
            <div className="mt-5 bg-light p-3 rounded border">
                <div className="d-flex align-items-center mb-2">
                    <i className="fas fa-truck text-info mr-3"></i>
                    <span className="small">Giao hàng nhanh toàn quốc (2-4 ngày)</span>
                </div>
                <div className="d-flex align-items-center">
                    <i className="fas fa-undo text-info mr-3"></i>
                    <span className="small">Đổi trả dễ dàng trong vòng 7 ngày</span>
                </div>
            </div>
        </div>
    );
}

export default ProductInfo;

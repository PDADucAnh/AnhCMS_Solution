import React from 'react';

const CartTable = ({ items, onUpdateQuantity, onRemove }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover border">
        <thead className="thead-light">
          <tr>
            <th scope="col" className="border-0">Sản phẩm</th>
            <th scope="col" className="border-0 text-center">Giá</th>
            <th scope="col" className="border-0 text-center">Số lượng</th>
            <th scope="col" className="border-0 text-right">Thành tiền</th>
            <th scope="col" className="border-0"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="align-middle">
                <div className="d-flex align-items-center">
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/60x80'} 
                    alt={item.name} 
                    className="img-fluid rounded mr-3"
                    style={{ width: '50px', height: '70px', objectFit: 'cover' }} 
                  />
                  <span className="font-weight-bold">{item.name}</span>
                </div>
              </td>
              <td className="align-middle text-center">
                {item.price.toLocaleString()} ₫
              </td>
              <td className="align-middle text-center">
                <div className="d-flex align-items-center justify-content-center">
                  <button className="btn btn-sm btn-outline-secondary py-0" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                    <i className="fas fa-minus small"></i>
                  </button>
                  <span className="mx-3">{item.quantity}</span>
                  <button className="btn btn-sm btn-outline-secondary py-0" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                    <i className="fas fa-plus small"></i>
                  </button>
                </div>
              </td>
              <td className="align-middle text-right font-weight-bold">
                {(item.price * item.quantity).toLocaleString()} ₫
              </td>
              <td className="align-middle text-right">
                <button className="btn btn-sm text-danger" onClick={() => onRemove(item.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CartTable;

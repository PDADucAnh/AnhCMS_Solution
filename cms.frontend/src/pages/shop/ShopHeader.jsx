import React from 'react';

const ShopHeader = ({ count }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 bg-light p-2 rounded">
      <span className="small text-muted">Hiển thị {count || 0} sản phẩm</span>
      <div className="d-flex align-items-center">
        <label className="mr-2 mb-0 small text-muted">Sắp xếp:</label>
        <select className="form-control form-control-sm" style={{ width: '150px' }}>
          <option>Mới nhất</option>
          <option>Giá tăng dần</option>
          <option>Giá giảm dần</option>
        </select>
      </div>
    </div>
  );
};

export default ShopHeader;

import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

const ShopSidebar = ({ onCategoryChange, activeId }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryProductService.getAllCategoryProducts();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="shop-sidebar pr-lg-3">
      <div className="mb-4">
        <h6 className="font-weight-bold text-uppercase border-bottom pb-2 mb-3">Danh mục sản phẩm</h6>
        <ul className="list-unstyled">
          <li className="mb-2">
            <button 
              className={`btn btn-link p-0 text-decoration-none small ${activeId === null ? 'font-weight-bold text-primary' : 'text-dark'}`}
              onClick={() => onCategoryChange(null)}
            >
              Tất cả sản phẩm
            </button>
          </li>
          {categories.map((cat) => (
            <li className="mb-2" key={cat.id}>
              <button 
                className={`btn btn-link p-0 text-decoration-none small ${activeId === cat.id ? 'font-weight-bold text-primary' : 'text-dark'}`}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.name}
              </button>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="text-muted small italic">Đang tải danh mục...</li>
          )}
        </ul>
      </div>

      <div className="mb-4">
        <h6 className="font-weight-bold text-uppercase border-bottom pb-2 mb-3">Lọc theo giá</h6>
        <div className="custom-control custom-checkbox mb-2">
          <input type="checkbox" className="custom-control-input" id="price1" />
          <label className="custom-control-label small" htmlFor="price1">Dưới 200.000 ₫</label>
        </div>
        <div className="custom-control custom-checkbox mb-2">
          <input type="checkbox" className="custom-control-input" id="price2" />
          <label className="custom-control-label small" htmlFor="price2">200.000 ₫ - 500.000 ₫</label>
        </div>
        <div className="custom-control custom-checkbox">
          <input type="checkbox" className="custom-control-input" id="price3" />
          <label className="custom-control-label small" htmlFor="price3">Trên 500.000 ₫</label>
        </div>
      </div>
    </div>
  );
};

export default ShopSidebar;

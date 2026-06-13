import React, { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';

const BlogSidebar = ({ onCategoryChange, activeId }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getBlogCategories();
        setCategories(data);
      } catch (err) {
        console.error("Lỗi khi tải danh mục tin tức:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="blog-sidebar pl-lg-4">
      <div className="mb-4">
        <h6 className="font-weight-bold text-uppercase border-bottom pb-2 mb-3">Danh mục tin tức</h6>
        <ul className="list-unstyled">
          <li className="mb-2">
            <button 
              className={`btn btn-link p-0 text-decoration-none small ${activeId === null ? 'font-weight-bold text-primary' : 'text-dark'}`}
              onClick={() => onCategoryChange(null)}
            >
              Tất cả bài viết
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
        </ul>
      </div>

      <div className="mb-4">
        <h6 className="font-weight-bold text-uppercase border-bottom pb-2 mb-3">Bài viết nổi bật</h6>
        <div className="small mb-3">
          <a href="#" className="text-dark font-weight-bold text-decoration-none d-block mb-1">Cách chọn váy dạ hội phù hợp vóc dáng</a>
          <span className="text-muted extra-small">12/06/2026</span>
        </div>
        <div className="small">
          <a href="#" className="text-dark font-weight-bold text-decoration-none d-block mb-1">Top 5 mẫu sơ mi công sở không thể thiếu</a>
          <span className="text-muted extra-small">10/06/2026</span>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;

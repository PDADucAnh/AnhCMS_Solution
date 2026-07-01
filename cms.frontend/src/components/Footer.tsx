import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto w-full">
      <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="font-headline-sm text-headline-sm text-primary block">PDA FLOWER</span>
            <div>
               <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-3">Bản tin</h4>
               <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                 Đăng ký để nhận giảm 20%, truy cập sớm các bộ sưu tập giới hạn và mẹo chăm sóc hữu ích
               </p>
              <div className="flex border-b border-outline-variant pb-2">
                <input
                  type="email"
                  placeholder="Địa chỉ Email"
                  className="flex-1 bg-transparent border-0 outline-none text-on-surface font-body-md text-body-md placeholder:text-outline"
                />
                <button className="bg-transparent border-0 cursor-pointer text-primary hover:opacity-80 transition-opacity p-1">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-4">Cửa hàng</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {['Hoa tươi', 'Hoa mẫu đơn', 'Cây cảnh', 'Quà tặng', 'Đăng ký', 'Giao trong ngày', 'Tất cả sản phẩm'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline">{item}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
               <h5 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-2 text-[11px]">Chọn lọc</h5>
              <ul className="space-y-2 list-none p-0 m-0">
                {['The Margot', 'The Firecracker', 'The Peace', 'The Unicorn'].map((item) => (
                  <li key={item}>
                    <Link to="/shop" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-4">Trợ giúp</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {['Liên hệ', 'Hướng dẫn chăm sóc', 'Dịch vụ khách hàng', 'Tuyển dụng'].map((item) => (
                <li key={item}>
                    <Link to={item === 'Liên hệ' ? '/contact' : '/'} className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-4">Công ty</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {['Bài viết', 'Câu chuyện', 'Báo chí', 'Thương hiệu', 'Chính sách bảo mật', 'Điều khoản &amp; Dịch vụ', 'Trợ năng', 'Sơ đồ trang'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Bài viết' ? '/blog' : '/'} className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline">
                    {item.replace('&amp;', '&')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-body-md text-body-md text-on-surface-variant">
            &copy; {new Date().getFullYear()} PDA FLOWER. Đã đăng ký bản quyền.
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant">
            Email: <a href="mailto:anh22032005@gmail.com" className="text-primary hover:opacity-80 transition-opacity no-underline">anh22032005@gmail.com</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
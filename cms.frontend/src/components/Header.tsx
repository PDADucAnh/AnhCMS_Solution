import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { favoritesCount } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const navLinkClass = (path: string) => {
    const active = isActive(path);
    return `font-label-md text-label-md transition-colors duration-300 no-underline ${
      active
        ? 'text-primary active-tab'
        : 'text-on-surface-variant hover:text-primary'
    }`;
  };

  return (
    <header className="w-full top-0 sticky z-50 bg-background/80 backdrop-blur-md">
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <Link
          className="font-headline-md text-headline-md text-primary tracking-tight no-underline"
          to="/"
        >
          PDA FLOWER
        </Link>

        <nav className="hidden md:flex gap-stack-md items-center">
          <Link className={navLinkClass('/')} to="/">Trang chủ</Link>
          <Link className={navLinkClass('/shop')} to="/shop">Cửa hàng</Link>
          <Link className={navLinkClass('/blog')} to="/blog">Bộ sưu tập</Link>
          <Link className={navLinkClass('/about')} to="/about">Giới thiệu</Link>
          <Link className={navLinkClass('/contact')} to="/contact">Liên hệ</Link>
        </nav>

        <div className="flex items-center gap-base">
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => { setSearchOpen((prev) => !prev); if (!searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50); }}
              className="p-2 cursor-pointer hover:bg-surface-container-high rounded-full transition-colors bg-transparent border-0 flex items-center justify-center text-on-surface-variant"
              aria-label="Tìm kiếm"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-[300px] bg-surface-container-lowest petal-shadow border border-outline-variant p-stack-sm z-50 rounded-xl">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-3 font-medium">Tìm kiếm</p>
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="w-full bg-surface-container-low border-none text-sm text-on-surface placeholder:text-outline py-2.5 pl-3 pr-10 font-body-md outline-none focus:ring-1 focus:ring-primary transition-all rounded-lg"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }
                    }}
                  />
                  <span className="material-symbols-outlined text-[18px] text-outline absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">search</span>
                </div>
              </div>
            )}
          </div>

          <Link
            className="p-2 cursor-pointer hover:bg-surface-container-high rounded-full transition-colors no-underline text-on-surface-variant flex items-center justify-center relative"
            to="/wishlist"
            aria-label="Yêu thích"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>favorite</span>
            {favoritesCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </Link>

          <Link
            className="p-2 cursor-pointer hover:bg-surface-container-high rounded-full transition-colors no-underline text-on-surface-variant flex items-center justify-center relative"
            to="/cart"
            aria-label="Giỏ hàng"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-error text-on-error text-[10px] font-bold rounded-full leading-none px-1">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative group" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="p-2 cursor-pointer text-primary bg-primary-fixed rounded-full transition-colors border-0 flex items-center justify-center"
                aria-label="Hồ sơ"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1', fontSize: '20px' }}>person</span>
              </button>
              <div
                className={`absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl petal-shadow border border-outline-variant z-50 overflow-hidden transition-all duration-300 ${
                  dropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
              >
                <div className="p-stack-sm border-b border-outline-variant bg-surface-container-low">
                  <p className="font-headline-sm text-sm text-on-surface">{user?.fullName || user?.username}</p>
                    <p className="text-xs text-on-surface-variant italic">{user?.role || 'Thành viên'}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-base px-stack-sm py-2 text-on-surface-variant hover:bg-primary-fixed/30 hover:text-primary transition-colors font-label-md no-underline"
                  >
                    <span className="material-symbols-outlined text-[20px]">person</span>
                    <span>Hồ sơ</span>
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-base px-stack-sm py-2 text-on-surface-variant hover:bg-primary-fixed/30 hover:text-primary transition-colors font-label-md no-underline"
                  >
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                    <span>Đơn hàng</span>
                  </Link>
                </div>
                <div className="h-px bg-outline-variant/30" />
                <div className="py-1">
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-base px-stack-sm py-2 text-error hover:bg-error-container/20 transition-colors font-label-md bg-transparent border-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              className="p-2 cursor-pointer text-primary bg-primary-fixed rounded-full transition-colors no-underline flex items-center justify-center"
              to="/login"
              aria-label="Tài khoản"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1', fontSize: '20px' }}>person</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

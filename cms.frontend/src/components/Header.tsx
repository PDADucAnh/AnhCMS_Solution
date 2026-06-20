import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProductCategories } from '../hooks/useCategories';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const { favoritesCount } = useWishlist();
  const { data: categories } = useProductCategories();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLLIElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setCategoryMenuOpen(false);
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

  const handleCategoryEnter = () => {
    clearTimeout(menuTimeout.current);
    setCategoryMenuOpen(true);
  };

  const handleCategoryLeave = () => {
    menuTimeout.current = setTimeout(() => setCategoryMenuOpen(false), 150);
  };

  const categoryList = Array.isArray(categories) ? categories : [];
  const chunkSize = Math.max(1, Math.ceil(categoryList.length / 3));
  const columns = [];
  for (let i = 0; i < categoryList.length; i += chunkSize) {
    columns.push(categoryList.slice(i, i + chunkSize));
  }

  const navLinkClass = (path: string) => {
    const active = isActive(path);
    return `btn-luxury text-decoration-none pb-1 transition-all duration-200 ${
      active
        ? 'text-primary dark:text-inverse-primary font-bold border-b-2 border-primary dark:border-inverse-primary'
        : 'text-secondary dark:text-secondary-fixed-dim font-normal border-b-2 border-transparent'
    }`;
  };

  const badgeClass = "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-error text-on-error text-[10px] font-bold rounded-full leading-none px-1";

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin h-20 bg-surface/90 backdrop-blur-md border-b border-secondary-container dark:border-outline-variant flat no shadows font-body-md text-body-md text-primary dark:text-inverse-primary bg-surface dark:bg-inverse-surface">
        <div className="flex items-center gap-margin">
          <Link className="font-display-xl text-headline-lg uppercase tracking-tighter text-primary dark:text-inverse-primary cursor-pointer transition-transform duration-200 active:scale-95 text-decoration-none select-none" to="/">AnhCMS.Fashion</Link>
        </div>
        <ul className="hidden md:flex gap-margin items-center mb-0 list-unstyled">
          <li><Link className={navLinkClass('/')} to="/">Home</Link></li>
          <li
            ref={categoryRef}
            className="relative"
            onMouseEnter={handleCategoryEnter}
            onMouseLeave={handleCategoryLeave}
          >
            <Link
              className={navLinkClass('/shop')}
              to="/shop"
              onClick={() => setCategoryMenuOpen(false)}
            >
              Category
            </Link>
            {categoryMenuOpen && categoryList.length > 0 && (
              <div
                className="absolute left-0 top-full mt-2 bg-surface-container-lowest border border-outline-variant shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-lg min-w-[520px]"
                onMouseEnter={handleCategoryEnter}
                onMouseLeave={handleCategoryLeave}
              >
                <div className="grid grid-cols-3 gap-md">
                  {columns.map((col, ci) => (
                    <div key={ci} className="space-y-2">
                      {col.map((cat: { id: number; name: string }) => (
                        <Link
                          key={cat.id}
                          to={`/shop?category=${cat.id}`}
                          onClick={() => setCategoryMenuOpen(false)}
                          className="block text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors duration-200 text-decoration-none py-1"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
          <li><Link className={navLinkClass('/blog')} to="/blog">Blog</Link></li>
          <li><Link className={navLinkClass('/about')} to="/about">About</Link></li>
        </ul>
        <div className="flex items-center gap-md">
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => { setSearchOpen((prev) => !prev); if (!searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50); }}
              className="btn-ghost-luxury text-primary dark:text-inverse-primary relative"
              aria-label="Search"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-[300px] bg-white shadow-[0px_10px_30px_rgba(0,0,0,0.12)] p-4 z-50">
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.25em] mb-3 font-medium">Search</p>
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-surface-container-low border-none text-sm text-primary placeholder:text-outline py-2.5 pl-3 pr-10 font-body-md outline-none focus:ring-1 focus:ring-primary transition-all"
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
          <Link className="btn-ghost-luxury text-primary dark:text-inverse-primary text-decoration-none relative" to="/wishlist" aria-label="Wishlist">
            <span className="material-symbols-outlined">favorite</span>
            {favoritesCount > 0 && (
              <span className={badgeClass}>{favoritesCount > 99 ? '99+' : favoritesCount}</span>
            )}
          </Link>
          <Link className="btn-ghost-luxury text-primary dark:text-inverse-primary text-decoration-none relative" to="/cart" aria-label="Cart">
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && (
              <span className={badgeClass}>{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </Link>
          {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 btn-ghost-luxury text-primary dark:text-inverse-primary"
                >
                  <span className="text-xs uppercase tracking-wider hidden md:inline">{user?.fullName || user?.username}</span>
                  <span className="material-symbols-outlined">account_circle</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 min-w-[220px] bg-surface-container-lowest border border-outline-variant shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
                    <div className="px-md py-sm border-b border-outline-variant/30">
                      <p className="text-xs uppercase tracking-wider text-secondary font-bold truncate">{user?.fullName || user?.username}</p>
                      <p className="text-[10px] uppercase tracking-widest text-outline">{user?.role}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-md py-sm text-xs uppercase tracking-widest text-secondary hover:text-primary hover:bg-surface-container transition-colors duration-200 text-decoration-none"
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      My Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-md py-sm text-xs uppercase tracking-widest text-secondary hover:text-primary hover:bg-surface-container transition-colors duration-200 text-decoration-none"
                    >
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                      My Orders
                    </Link>
                    <div className="border-t border-outline-variant/30">
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="flex items-center gap-3 w-full px-md py-sm text-xs uppercase tracking-widest text-secondary hover:text-error hover:bg-surface-container transition-colors duration-200 text-decoration-none"
                      >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
          ) : (
              <Link className="btn-ghost-luxury text-primary dark:text-inverse-primary text-decoration-none" to="/login">
                  <span className="material-symbols-outlined">person</span>
              </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;

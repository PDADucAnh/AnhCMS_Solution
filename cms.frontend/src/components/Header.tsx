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
    return `font-label-md text-label-md transition-colors duration-300 ${
      active
        ? 'text-primary border-b-2 border-primary pb-1 font-semibold'
        : 'text-on-surface-variant font-medium hover:text-primary'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 bg-surface shadow-sm w-full" style={{ boxShadow: '0px 4px 20px rgba(171,44,93,0.02)' }}>
      <div className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max mx-auto w-full">
        <Link
          className="text-headline-md font-headline-md text-primary tracking-tight no-underline"
          to="/"
        >
          PDA FLOWER
        </Link>

        <nav className="hidden md:flex gap-gutter items-center">
          <Link className={navLinkClass('/')} to="/">Home</Link>
          <Link className={navLinkClass('/shop')} to="/shop">Shop</Link>
          <Link className={navLinkClass('/blog')} to="/blog">Collections</Link>
          <Link className={navLinkClass('/about')} to="/about">About</Link>
          <Link className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 font-label-md text-label-md no-underline" to="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-4 text-primary">
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => { setSearchOpen((prev) => !prev); if (!searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50); }}
              className="hover:opacity-80 transition-opacity bg-transparent border-0 p-0 cursor-pointer flex items-center justify-center"
              aria-label="Search"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-[300px] bg-surface-container-lowest shadow-[0px_10px_30px_rgba(0,0,0,0.12)] p-4 z-50">
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-3 font-medium">Search</p>
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-surface-container-low border-none text-sm text-on-surface placeholder:text-outline py-2.5 pl-3 pr-10 font-body-md outline-none focus:ring-1 focus:ring-primary transition-all"
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
          <Link className="hover:opacity-80 transition-opacity no-underline text-primary flex items-center justify-center relative" to="/cart" aria-label="Shopping Cart">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-error text-on-error text-[10px] font-bold rounded-full leading-none px-1">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          <Link className="hover:opacity-80 transition-opacity no-underline text-primary flex items-center justify-center relative" to="/wishlist" aria-label="Wishlist">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-error text-on-error text-[10px] font-bold rounded-full leading-none px-1">
                {favoritesCount > 99 ? '99+' : favoritesCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="hover:opacity-80 transition-opacity bg-transparent border-0 p-0 cursor-pointer flex items-center justify-center text-primary"
                aria-label="Profile"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 min-w-[220px] bg-surface-container-lowest border border-outline-variant shadow-[0px_10px_30px_rgba(0,0,0,0.08)]">
                  <div className="px-md py-sm border-b border-outline-variant/30">
                    <p className="text-xs uppercase tracking-wider text-on-surface font-bold truncate">{user?.fullName || user?.username}</p>
                    <p className="text-[10px] uppercase tracking-widest text-outline">{user?.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-md py-sm text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-200 no-underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    My Profile
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-md py-sm text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-200 no-underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    My Orders
                  </Link>
                  <div className="border-t border-outline-variant/30">
                    <button
                      onClick={() => { logout(); setDropdownOpen(false); }}
                      className="flex items-center gap-3 w-full px-md py-sm text-xs uppercase tracking-widest text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors duration-200 no-underline bg-transparent border-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link className="hover:opacity-80 transition-opacity no-underline text-primary flex items-center justify-center" to="/login" aria-label="Profile">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

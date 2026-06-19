import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin h-20 bg-surface/90 backdrop-blur-md border-b border-secondary-container dark:border-outline-variant flat no shadows font-body-md text-body-md text-primary dark:text-inverse-primary bg-surface dark:bg-inverse-surface">
      <div className="flex items-center gap-margin">
        <Link className="font-display-xl text-headline-lg uppercase tracking-tighter text-primary dark:text-inverse-primary cursor-pointer transition-transform duration-200 active:scale-95 text-decoration-none select-none" to="/">AnhCMS.Fashion</Link>
      </div>
      <ul className="hidden md:flex gap-margin items-center mb-0 list-unstyled">
        <li><Link className="text-primary dark:text-inverse-primary font-bold border-b-2 border-primary dark:border-inverse-primary pb-1 btn-luxury text-decoration-none" to="/">Home</Link></li>
        <li><Link className="text-secondary dark:text-secondary-fixed-dim btn-luxury text-decoration-none" to="/shop">Shop</Link></li>
        <li><Link className="text-secondary dark:text-secondary-fixed-dim btn-luxury text-decoration-none" to="/shop">Categories</Link></li>
        <li><Link className="text-secondary dark:text-secondary-fixed-dim btn-luxury text-decoration-none" to="/blog">Blog</Link></li>
        <li><Link className="text-secondary dark:text-secondary-fixed-dim btn-luxury text-decoration-none" to="/">About</Link></li>
        <li><Link className="text-secondary dark:text-secondary-fixed-dim btn-luxury text-decoration-none" to="/contact">Contact</Link></li>
      </ul>
      <div className="flex items-center gap-md">
        <button className="btn-ghost-luxury text-primary dark:text-inverse-primary"><span className="material-symbols-outlined">search</span></button>
        <Link className="btn-ghost-luxury text-primary dark:text-inverse-primary text-decoration-none" to="/cart"><span className="material-symbols-outlined">shopping_bag</span></Link>
        {isAuthenticated ? (
            <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider hidden md:inline text-primary dark:text-inverse-primary">{user?.fullName || user?.username}</span>
                <button onClick={logout} className="btn-ghost-luxury text-primary dark:text-inverse-primary">
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </div>
        ) : (
            <Link className="btn-ghost-luxury text-primary dark:text-inverse-primary text-decoration-none" to="/login">
                <span className="material-symbols-outlined">person</span>
            </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { getImageUrl } from '../../utils/apiUtils';
import { formatCurrency } from '../../utils/currency';

const WishlistPage: React.FC = () => {
  const { favorites, removeFavorite } = useWishlist();

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20 min-h-screen">
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="mb-xl pb-8 border-b border-primary">
          <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl text-primary uppercase text-center md:text-left">
            Wishlist
          </h1>
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] text-center md:text-left mt-4">
            {favorites.length} {favorites.length === 1 ? 'Saved Item' : 'Saved Items'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <aside className="md:col-span-3 border-r border-primary pr-8 hidden md:block">
            <ul className="space-y-6">
              <li>
                <Link to="/profile" className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors duration-150 pl-4 block text-decoration-none">
                  General Info
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors duration-150 pl-4 block text-decoration-none">
                  Order History
                </Link>
              </li>
              <li>
                <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary font-bold border-l-2 border-primary pl-4 block cursor-default">
                  Wishlist
                </span>
              </li>
            </ul>
          </aside>

          <div className="md:col-span-9 md:pl-12">
            {favorites.length === 0 ? (
              <div className="text-center py-xl border border-dashed border-outline-variant">
                <span className="material-symbols-outlined text-6xl text-outline mb-md">favorite</span>
                <h2 className="font-headline-sm text-headline-sm text-secondary uppercase mb-sm">Your wishlist is empty</h2>
                <p className="font-body-md text-body-md text-secondary">Save your favorite pieces for later.</p>
                <Link to="/shop" className="inline-block mt-md bg-primary text-on-primary px-8 py-3 font-label-sm text-label-sm uppercase tracking-widest border border-primary btn-luxury btn-primary-luxury text-decoration-none">
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {favorites.map((product) => (
                  <div key={product.id} className="group">
                    <Link to={`/product/${product.id}`} className="text-decoration-none block">
                      <div className="aspect-[4/5] bg-surface-container relative overflow-hidden mb-4">
                        <img
                          src={getImageUrl(product.imageUrl)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <button
                          onClick={(e) => { e.preventDefault(); removeFavorite(product.id); }}
                          className="absolute top-3 right-3 w-9 h-9 bg-surface/80 backdrop-blur-sm border-0 flex items-center justify-center hover:bg-surface transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <span className="material-symbols-outlined text-lg text-error">favorite</span>
                        </button>
                      </div>
                    </Link>
                    <h3 className="font-body-md text-body-md text-primary mb-1 truncate">{product.name}</h3>
                    <p className="font-body-md text-body-md text-secondary">
                      {formatCurrency(product.discountPrice || product.price)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WishlistPage;

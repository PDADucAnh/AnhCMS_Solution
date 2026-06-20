import React from 'react';
import { Link } from 'react-router-dom';

const MyOrders: React.FC = () => {
  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20 min-h-screen">
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="mb-xl pb-8 border-b border-primary">
          <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl text-primary uppercase text-center md:text-left">
            ORDER HISTORY
          </h1>
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] text-center md:text-left mt-4">
            Track your orders
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
                <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary font-bold border-l-2 border-primary pl-4 block cursor-default">
                  Order History
                </span>
              </li>
              <li>
                <Link to="/wishlist" className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors duration-150 pl-4 block text-decoration-none">
                  Wishlist
                </Link>
              </li>
            </ul>
          </aside>

          <div className="md:col-span-9 md:pl-12">
            <div className="text-center py-xl border border-dashed border-outline-variant">
              <span className="material-symbols-outlined text-6xl text-outline mb-md">receipt_long</span>
              <h2 className="font-headline-sm text-headline-sm text-secondary uppercase mb-sm">No orders yet</h2>
              <p className="font-body-md text-body-md text-secondary">You haven't placed any orders yet. Start shopping!</p>
              <Link to="/shop" className="inline-block mt-md bg-primary text-on-primary px-8 py-3 font-label-sm text-label-sm uppercase tracking-widest border border-primary btn-luxury btn-primary-luxury text-decoration-none">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyOrders;
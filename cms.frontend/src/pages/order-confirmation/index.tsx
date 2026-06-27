import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20">
      <main className="max-w-[600px] mx-auto px-margin py-xl text-center">
        <div className="bg-surface-container-lowest border border-outline-variant p-xl space-y-lg">
          <div className="size-20 bg-primary/10 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
          </div>

          <div className="space-y-md">
            <h3 className="text-label-sm uppercase tracking-[0.3em] text-secondary">Transaction Complete</h3>
            <h2 className="font-display-xl text-display-xl uppercase tracking-tighter">
              Order Confirmed
            </h2>
            <div className="w-12 h-0.5 bg-primary mx-auto"></div>
          </div>

          {orderId && (
            <div className="bg-surface-container-low border border-outline-variant p-lg">
              <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Order Reference</p>
              <p className="font-bold text-3xl serif text-primary">#{orderId}</p>
            </div>
          )}

          <div className="space-y-md text-secondary max-w-md mx-auto">
            <p className="text-body-md">
              Your acquisition has been recorded and is being prepared for dispatch.
              A confirmation email will be sent to your registered address shortly.
            </p>
            <p className="text-[10px] uppercase tracking-widest">
              Estimated Delivery: 5–7 Business Days
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-md justify-center pt-md">
            <Link
              to="/shop"
              className="bg-primary text-on-primary px-xl py-4 text-label-sm uppercase tracking-[0.3em] font-bold text-decoration-none btn-luxury btn-primary-luxury"
            >
              Continue Shopping
            </Link>
            <Link
              to="/my-orders"
              className="border border-outline-variant px-xl py-4 text-label-sm uppercase tracking-[0.3em] font-bold text-decoration-none text-on-background btn-luxury"
            >
              View My Orders
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;

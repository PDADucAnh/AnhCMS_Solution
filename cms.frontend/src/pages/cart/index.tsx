import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartTable from './CartTable';

const ShoppingCartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-xl px-margin">
        <div className="size-20 bg-surface-container flex items-center justify-center text-outline mb-4 mx-auto">
          <span className="material-symbols-outlined text-4xl">shopping_bag</span>
        </div>
        <div className="space-y-md">
          <h2 className="font-display-xl text-display-xl-mobile md:text-headline-lg uppercase tracking-tighter">Your Bag is Empty</h2>
          <p className="text-secondary max-w-md mx-auto">Discover the latest collection and curate your personal luxury aesthetic.</p>
        </div>
        <Link to="/shop" className="bg-primary text-on-primary px-xl py-4 font-label-sm text-label-sm uppercase tracking-[0.3em] font-bold text-decoration-none inline-block mt-4 btn-luxury btn-primary-luxury">
          Begin Exploration
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20">
      <main className="max-w-[1440px] mx-auto px-margin py-xl">
        <header className="mb-xl text-center space-y-md">
            <h3 className="text-label-sm uppercase tracking-[0.3em] text-secondary">Aquisition Manifest</h3>
            <h2 className="font-display-xl text-display-xl uppercase tracking-tighter">Your Shopping Bag</h2>
            <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        </header>

        <div className="flex flex-col lg:flex-row gap-xl">
          <div className="flex-1 space-y-lg">
            <CartTable 
              items={cartItems} 
              onUpdateQuantity={updateQuantity} 
              onRemove={removeFromCart} 
            />
            
            <Link to="/shop" className="inline-flex items-center gap-2 font-bold text-primary text-decoration-none btn-link-luxury">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Continue Exploration
            </Link>
          </div>

          <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-surface-container-low border border-outline-variant p-lg space-y-xl sticky top-32">
              <h5 className="text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md">Manifest Summary</h5>
              
              <div className="space-y-md">
                <div className="flex justify-between items-center text-label-sm uppercase tracking-widest">
                    <span className="text-secondary">Subtotal</span>
                    <span className="font-bold">{cartTotal.toLocaleString()} ₫</span>
                </div>
                <div className="flex justify-between items-center text-label-sm uppercase tracking-widest">
                    <span className="text-secondary">Delivery Insight</span>
                    <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
                </div>
              </div>

              <div className="border-t border-outline-variant pt-lg flex justify-between items-center">
                <span className="text-label-sm uppercase tracking-[0.2em] font-bold">Total Acquisition</span>
                <span className="serif text-2xl font-bold">
                  {cartTotal.toLocaleString()} ₫
                </span>
              </div>
              
              <button 
                className="w-full bg-primary text-on-primary py-5 text-label-sm uppercase tracking-[0.3em] font-bold border border-primary btn-luxury btn-primary-luxury"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <div className="bg-white border border-outline-variant p-md flex items-start gap-md">
                <span className="material-symbols-outlined text-secondary">verified_user</span>
                <p className="text-[10px] text-secondary uppercase tracking-widest leading-relaxed">Secure transaction portal. Complimentary shipping on all acquisitions over 500.000 ₫.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCartPage;

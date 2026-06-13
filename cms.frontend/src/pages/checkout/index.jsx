import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your acquisition manifest is empty.");
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        customerId: 1, // Mocked ID
        notes: `Delivery to: ${formData.fullname}, Contact: ${formData.phone}, Location: ${formData.address}. Narrative: ${formData.notes}`,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.discountPrice || item.price
        }))
      };

      const result = await orderService.submitOrder(orderData);
      
      if (result) {
        alert("Transaction complete. Your acquisition has been recorded.");
        clearCart();
        navigate('/');
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      alert("An error occurred during the transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-background text-on-background font-body-md antialiased pt-20 min-vh-100 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-margin py-20 text-center space-y-lg">
          <div className="size-20 bg-surface-container flex items-center justify-center text-outline mb-4 rounded-full">
            <span className="material-symbols-outlined text-4xl">shopping_bag</span>
          </div>
          <div className="space-y-md">
            <h2 className="font-display-xl text-display-xl-mobile md:text-headline-lg uppercase tracking-tighter">Manifest Empty</h2>
            <p className="text-secondary italic serif max-w-md mx-auto">You cannot proceed to checkout without items in your collection.</p>
          </div>
          <Link to="/shop" className="bg-primary text-on-primary px-xl py-4 font-label-sm text-label-sm uppercase tracking-[0.3em] font-bold hover:bg-neutral-800 transition-all text-decoration-none">
            Return to Boutique
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20">
      <Header />
      
      <main className="max-w-[1440px] mx-auto px-margin py-xl">
        <header className="mb-xl text-center space-y-md">
            <h3 className="text-label-sm uppercase tracking-[0.3em] text-secondary">Secure Portal</h3>
            <h2 className="font-display-xl text-display-xl uppercase tracking-tighter">Finalize Acquisition</h2>
            <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        </header>

        <form onSubmit={handleSubmitOrder} className="flex flex-col lg:flex-row gap-xl">
            {/* Left: Shipping Info */}
            <div className="flex-1 space-y-lg">
                <div className="bg-surface-container-lowest border border-outline-variant p-xl space-y-xl">
                    <h5 className="font-display-xl text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md">Delivery Credentials</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Full Identity Name</label>
                            <input 
                                type="text" 
                                name="fullname"
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest uppercase placeholder:text-outline-variant" 
                                placeholder="Recipient Name" 
                                required
                                value={formData.fullname}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Telephonic Connection</label>
                            <input 
                                type="text" 
                                name="phone"
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest uppercase placeholder:text-outline-variant" 
                                placeholder="Contact Number" 
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-sm">
                        <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Physical Residence</label>
                        <input 
                            type="text" 
                            name="address"
                            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest uppercase placeholder:text-outline-variant" 
                            placeholder="Delivery Address" 
                            required
                            value={formData.address}
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    <div className="space-y-sm">
                        <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Narrative Notes</label>
                        <textarea 
                            name="notes"
                            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-body-md italic leading-relaxed placeholder:text-outline-variant resize-none" 
                            rows="4" 
                            placeholder="Special delivery instructions..."
                            value={formData.notes}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant p-xl space-y-lg">
                    <h5 className="font-display-xl text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md">Transaction Method</h5>
                    <label className="flex items-start gap-md p-md border border-primary bg-surface-container-low cursor-pointer">
                        <div className="flex items-center h-6">
                            <input type="radio" name="payment" defaultChecked className="size-4 text-primary focus:ring-primary border-primary bg-transparent" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-label-sm uppercase tracking-widest font-bold block">Cash on Delivery (COD)</span>
                            <span className="text-[10px] text-secondary uppercase tracking-widest block">Settle transaction upon receipt of goods.</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Right: Order Summary */}
            <aside className="w-full lg:w-96 flex-shrink-0">
                <div className="bg-surface-container-low border border-outline-variant p-lg space-y-xl sticky top-32">
                    <h5 className="text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md">Manifest Overview</h5>
                    
                    <div className="space-y-md border-b border-outline-variant pb-md max-h-60 overflow-y-auto no-scrollbar">
                        {cartItems.map(item => (
                            <div className="flex justify-between items-start gap-md" key={item.id}>
                                <div className="flex-1 space-y-1">
                                    <span className="text-label-sm uppercase tracking-widest font-bold block">{item.name}</span>
                                    <span className="text-[10px] text-secondary uppercase tracking-widest block">Qty: {item.quantity}</span>
                                </div>
                                <span className="font-bold text-sm">{((item.discountPrice || item.price) * item.quantity).toLocaleString()} ₫</span>
                            </div>
                        ))}
                    </div>

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
                        type="submit"
                        disabled={loading || cartItems.length === 0}
                        className="w-full bg-primary text-on-primary py-5 text-label-sm uppercase tracking-[0.3em] font-bold hover:bg-neutral-800 transition-all border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Confirm Transaction'}
                    </button>
                    
                    <div className="bg-white border border-outline-variant p-md flex items-start gap-md">
                        <span className="material-symbols-outlined text-secondary">lock</span>
                        <p className="text-[10px] text-secondary uppercase tracking-widest leading-relaxed">Secure end-to-end encryption. Your credentials are protected.</p>
                    </div>
                </div>
            </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;

import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { useCreateOrder } from '../../hooks/useOrders';
import { formatCurrency } from '../../utils/currency';
import { checkoutSchema, type CheckoutFormData } from '../../schemas/checkoutSchema';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, refreshProfile } = useAuth();
  const { currency } = useLocale();
  const createOrder = useCreateOrder();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (user) {
      if (user.fullName) setValue('fullname', user.fullName);
      if (user.email) setValue('email', user.email);
      if (user.phone) setValue('phone', user.phone);
      if (user.address) setValue('address', user.address);
    }
  }, [user, setValue]);

  const onSubmit = async (formData: CheckoutFormData) => {
    if (cartItems.length === 0) return;

    const orderPayload = {
      customerId: user?.id || 0,
      notes: `Delivery to: ${formData.fullname}, Email: ${formData.email}, Contact: ${formData.phone}, Location: ${formData.address}. Narrative: ${formData.notes}`,
      currency: currency.toUpperCase(),
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.discountPrice || item.price,
      })),
    };

    try {
      await createOrder.mutateAsync(orderPayload);
      clearCart();
      navigate('/');
    } catch {
      // toast handled by useCreateOrder onError
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-xl px-margin">
        <div className="size-20 bg-surface-container flex items-center justify-center text-outline mb-4 mx-auto">
          <span className="material-symbols-outlined text-4xl">shopping_bag</span>
        </div>
        <div className="space-y-md">
          <h2 className="font-display-xl text-display-xl-mobile md:text-headline-lg uppercase tracking-tighter">Manifest Empty</h2>
          <p className="text-secondary max-w-md mx-auto">You cannot proceed to checkout without items in your collection.</p>
        </div>
        <Link to="/shop" className="bg-primary text-on-primary px-xl py-4 font-label-sm text-label-sm uppercase tracking-[0.3em] font-bold text-decoration-none inline-block mt-4 btn-luxury btn-primary-luxury">
          Return to Boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20">
      <main className="max-w-[1440px] mx-auto px-margin py-xl">
        <header className="mb-xl text-center space-y-md">
            <h3 className="text-label-sm uppercase tracking-[0.3em] text-secondary">Secure Portal</h3>
            <h2 className="font-display-xl text-display-xl uppercase tracking-tighter">Finalize Acquisition</h2>
            <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-xl">
            <div className="flex-1 space-y-lg">
                <div className="bg-surface-container-lowest border border-outline-variant p-xl space-y-xl">
                    <h5 className="font-display-xl text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md">Delivery Credentials</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Full Identity Name</label>
                            <input
                                type="text"
                                {...register('fullname')}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest placeholder:text-outline-variant"
                                placeholder="Recipient Name"
                            />
                            {errors.fullname && <p className="text-error text-[10px] mt-1">{errors.fullname.message}</p>}
                        </div>
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Telephonic Connection</label>
                            <input
                                type="text"
                                {...register('phone')}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest placeholder:text-outline-variant"
                                placeholder="Contact Number"
                            />
                            {errors.phone && <p className="text-error text-[10px] mt-1">{errors.phone.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-sm">
                        <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Electronic Mail</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm tracking-widest placeholder:text-outline-variant"
                            placeholder="Email Address"
                        />
                        {errors.email && <p className="text-error text-[10px] mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-sm">
                        <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Physical Residence</label>
                        <input
                            type="text"
                            {...register('address')}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest placeholder:text-outline-variant"
                                placeholder="Delivery Address"
                        />
                        {errors.address && <p className="text-error text-[10px] mt-1">{errors.address.message}</p>}
                    </div>

                    <div className="space-y-sm">
                        <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Narrative Notes</label>
                        <textarea
                            {...register('notes')}
                            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-body-md italic leading-relaxed placeholder:text-outline-variant resize-none"
                            rows={4}
                            placeholder="Special delivery instructions..."
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
                                <span className="font-bold text-sm">{formatCurrency((item.discountPrice || item.price) * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-md">
                        <div className="flex justify-between items-center text-label-sm uppercase tracking-widest">
                            <span className="text-secondary">Subtotal</span>
                            <span className="font-bold">{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-label-sm uppercase tracking-widest">
                            <span className="text-secondary">Delivery Insight</span>
                            <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
                        </div>
                    </div>

                    <div className="border-t border-outline-variant pt-lg flex justify-between items-center">
                        <span className="text-label-sm uppercase tracking-[0.2em] font-bold">Total Acquisition</span>
                        <span className="serif text-2xl font-bold">
                            {formatCurrency(cartTotal)}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={createOrder.isPending || cartItems.length === 0}
                        className="w-full bg-primary text-on-primary py-5 text-label-sm uppercase tracking-[0.3em] font-bold border border-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed btn-luxury btn-primary-luxury"
                    >
                        {createOrder.isPending ? 'Processing...' : 'Confirm Transaction'}
                    </button>

                    <div className="bg-white border border-outline-variant p-md flex items-start gap-md">
                        <span className="material-symbols-outlined text-secondary">lock</span>
                        <p className="text-[10px] text-secondary uppercase tracking-widest leading-relaxed">Secure end-to-end encryption. Your credentials are protected.</p>
                    </div>
                </div>
            </aside>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;

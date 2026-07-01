import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCreateOrder } from '../../hooks/useOrders';
import { formatCurrency } from '../../utils/currency';
import { checkoutSchema, type CheckoutFormData } from '../../schemas/checkoutSchema';
import axiosClient from '../../api/axiosClient';
import toast from 'react-hot-toast';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, refreshProfile } = useAuth();
  const createOrder = useCreateOrder();

  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [checkingBlacklist, setCheckingBlacklist] = useState(false);

  const deliveryDistrict = localStorage.getItem('delivery_district') || '';

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'COD',
    }
  });

  const watchPaymentMethod = watch('paymentMethod');

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (!deliveryDistrict && cartItems.length > 0) {
      toast.error('Vui lòng chọn Quận/Huyện giao hàng trước khi thanh toán.');
      navigate('/cart');
    }
  }, [deliveryDistrict, cartItems, navigate]);

  const handlePhoneBlur = async (phoneVal: string) => {
    if (!phoneVal || phoneVal.length < 10) return;
    setCheckingBlacklist(true);
    try {
      const res: any = await axiosClient.get('/Orders/check-blacklist', {
        params: { phone: phoneVal }
      });
      if (res && res.isBlacklisted) {
        setIsBlacklisted(true);
        setValue('paymentMethod', 'OnlinePayment');
        toast.error('Số điện thoại này có lịch sử bùng hàng. Bạn bắt buộc phải thanh toán Online.');
      } else {
        setIsBlacklisted(false);
      }
    } catch (err) {
      console.error('Lỗi kiểm tra blacklist:', err);
    } finally {
      setCheckingBlacklist(false);
    }
  };

  useEffect(() => {
    if (user) {
      if (user.fullName) setValue('fullname', user.fullName);
      if (user.email) setValue('email', user.email);
      if (user.phone) {
        setValue('phone', user.phone);
        handlePhoneBlur(user.phone);
      }
      if (user.address) setValue('deliveryAddress', user.address);
    }
  }, [user, setValue]);

  const onSubmit = async (formData: CheckoutFormData) => {
    if (cartItems.length === 0) return;
    if (!deliveryDistrict) {
      toast.error('Vui lòng chọn Quận/Huyện trước khi đặt hàng.');
      return;
    }

    const formattedNotes = [
      `Người mua: ${formData.fullname} (SĐT: ${formData.phone}, Email: ${formData.email})`,
      `Người nhận: ${formData.recipientName} (SĐT: ${formData.recipientPhone})`,
      `Lời chúc: ${formData.greetingCard || 'Không có'}`,
      formData.notes ? `Ghi chú thêm: ${formData.notes}` : ''
    ].filter(Boolean).join(' | ');

    const orderPayload = {
      customerId: user?.id || 0,
      notes: formattedNotes,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.discountPrice || item.price,
      })),
      paymentMethod: formData.paymentMethod === 'OnlinePayment' ? 0 : 1,
      deliveryDate: formData.deliveryDate,
      deliveryTimeSlot: formData.deliveryTimeSlot,
      deliveryDistrict: deliveryDistrict,
      deliveryAddress: formData.deliveryAddress,
    };

    try {
      const result = await createOrder.mutateAsync(orderPayload);
      clearCart();
      if (formData.paymentMethod === 'OnlinePayment') {
        localStorage.removeItem('delivery_district');
        navigate(`/momo-mock?orderId=${result.orderId}`);
      } else {
        localStorage.removeItem('delivery_district');
        navigate(`/order-confirmation?orderId=${result.orderId}`);
      }
    } catch {
      // toast handled by useCreateOrder onError
    }
  };

  const phoneRegister = register('phone');

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-xl px-margin">
        <div className="size-20 bg-surface-container flex items-center justify-center text-outline mb-4 mx-auto">
          <span className="material-symbols-outlined text-4xl">shopping_bag</span>
        </div>
        <div className="space-y-md">
          <h2 className="font-display-xl text-display-xl-mobile md:text-headline-lg uppercase tracking-tighter">Giỏ hàng trống</h2>
          <p className="text-secondary max-w-md mx-auto">Bạn cần có sản phẩm trong giỏ để thanh toán.</p>
        </div>
        <Link to="/shop" className="bg-primary text-on-primary px-xl py-4 font-label-sm text-label-sm uppercase tracking-[0.3em] font-bold text-decoration-none inline-block mt-4 btn-luxury btn-primary-luxury">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20">
      <main className="max-w-[1440px] mx-auto px-margin py-xl">
        <header className="mb-xl text-center space-y-md">
            <h3 className="text-label-sm uppercase tracking-[0.3em] text-secondary">Thanh toán</h3>
            <h2 className="font-display-xl text-display-xl uppercase tracking-tighter">Hoàn tất đơn hàng</h2>
            <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-xl">
            <div className="flex-1 space-y-lg">
                {/* PHẦN 1: NGƯỜI MUA */}
                <div className="bg-surface-container-lowest border border-outline-variant p-xl space-y-xl">
                    <h5 className="font-display-xl text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md text-on-surface">1. Thông tin người mua</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Họ và tên người mua</label>
                            <input
                                type="text"
                                {...register('fullname')}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest placeholder:text-outline-variant text-on-surface"
                                placeholder="Họ tên người mua"
                            />
                            {errors.fullname && <p className="text-error text-[10px] mt-1">{errors.fullname.message}</p>}
                        </div>
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Số điện thoại người mua</label>
                            <input
                                type="text"
                                {...phoneRegister}
                                onBlur={async (e) => {
                                  phoneRegister.onBlur(e);
                                  await handlePhoneBlur(e.target.value);
                                }}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest placeholder:text-outline-variant text-on-surface"
                                placeholder="Số điện thoại"
                            />
                            {errors.phone && <p className="text-error text-[10px] mt-1">{errors.phone.message}</p>}
                            {checkingBlacklist && <p className="text-secondary text-[9px] uppercase tracking-widest mt-1">Đang kiểm tra lịch sử đơn hàng...</p>}
                            {isBlacklisted && (
                              <p className="text-error text-[10px] font-bold uppercase tracking-wider mt-1">
                                Số điện thoại này có lịch sử bùng hàng. Bạn bắt buộc phải thanh toán Online.
                              </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-sm">
                        <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Email người mua</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm tracking-widest placeholder:text-outline-variant text-on-surface"
                            placeholder="Địa chỉ Email"
                        />
                        {errors.email && <p className="text-error text-[10px] mt-1">{errors.email.message}</p>}
                    </div>
                </div>

                {/* PHẦN 2: NGƯỜI NHẬN */}
                <div className="bg-surface-container-lowest border border-outline-variant p-xl space-y-xl">
                    <h5 className="font-display-xl text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md text-on-surface">2. Thông tin người nhận</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Họ và tên người nhận</label>
                            <input
                                type="text"
                                {...register('recipientName')}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest placeholder:text-outline-variant text-on-surface"
                                placeholder="Tên người nhận hoa"
                            />
                            {errors.recipientName && <p className="text-error text-[10px] mt-1">{errors.recipientName.message}</p>}
                        </div>
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Số điện thoại người nhận</label>
                            <input
                                type="text"
                                {...register('recipientPhone')}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest placeholder:text-outline-variant text-on-surface"
                                placeholder="SĐT người nhận hoa"
                            />
                            {errors.recipientPhone && <p className="text-error text-[10px] mt-1">{errors.recipientPhone.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-sm">
                        <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Lời chúc trên thiệp</label>
                        <textarea
                            {...register('greetingCard')}
                            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-body-md italic leading-relaxed placeholder:text-outline-variant resize-none text-on-surface"
                            rows={3}
                            placeholder="Lời chúc đính kèm thiệp hoa..."
                        ></textarea>
                        {errors.greetingCard && <p className="text-error text-[10px] mt-1">{errors.greetingCard.message}</p>}
                    </div>
                </div>

                {/* PHẦN 3: GIAO HÀNG */}
                <div className="bg-surface-container-lowest border border-outline-variant p-xl space-y-xl">
                    <h5 className="font-display-xl text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md text-on-surface">3. Thời gian & Địa điểm nhận hàng</h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Quận/Huyện giao hàng (Gated)</label>
                            <input
                                type="text"
                                value={deliveryDistrict}
                                disabled
                                className="w-full bg-surface-container-low/50 border border-outline-variant px-md py-4 text-sm font-semibold tracking-widest text-on-surface/60 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Địa chỉ chi tiết</label>
                            <input
                                type="text"
                                {...register('deliveryAddress')}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest placeholder:text-outline-variant text-on-surface"
                                placeholder="Số nhà, tên đường, phường..."
                            />
                            {errors.deliveryAddress && <p className="text-error text-[10px] mt-1">{errors.deliveryAddress.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Ngày nhận hoa</label>
                            <input
                                type="date"
                                {...register('deliveryDate')}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest text-on-surface"
                            />
                            {errors.deliveryDate && <p className="text-error text-[10px] mt-1">{errors.deliveryDate.message}</p>}
                        </div>
                        <div className="space-y-sm">
                            <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Khung giờ giao hoa</label>
                            <select
                                {...register('deliveryTimeSlot')}
                                className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-sm font-semibold tracking-widest text-on-surface"
                            >
                                <option value="">-- CHỌN KHUNG GIỜ --</option>
                                <option value="08:00-10:00">08:00 - 10:00 (Sáng)</option>
                                <option value="10:00-12:00">10:00 - 12:00 (Sáng)</option>
                                <option value="13:00-15:00">13:00 - 15:00 (Chiều)</option>
                                <option value="15:00-17:00">15:00 - 17:00 (Chiều)</option>
                                <option value="17:00-19:00">17:00 - 19:00 (Tối)</option>
                                <option value="19:00-21:00">19:00 - 21:00 (Tối)</option>
                            </select>
                            {errors.deliveryTimeSlot && <p className="text-error text-[10px] mt-1">{errors.deliveryTimeSlot.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-sm">
                        <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Ghi chú thêm</label>
                        <textarea
                            {...register('notes')}
                            className="w-full bg-surface-container-low border-none focus:ring-1 focus:ring-primary px-md py-4 text-body-md italic leading-relaxed placeholder:text-outline-variant resize-none text-on-surface"
                            rows={3}
                            placeholder="Yêu cầu riêng về đơn hàng..."
                        ></textarea>
                    </div>
                </div>

                {/* PHƯƠNG THỨC THANH TOÁN */}
                <div className="bg-surface-container-lowest border border-outline-variant p-xl space-y-lg">
                    <h5 className="font-display-xl text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md text-on-surface">Phương thức thanh toán</h5>
                    
                    <div className="space-y-md">
                        {/* COD option */}
                        <label className={`flex items-start gap-md p-md border ${watchPaymentMethod === 'COD' ? 'border-primary bg-surface-container-low' : 'border-outline-variant'} cursor-pointer ${isBlacklisted ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <div className="flex items-center h-6">
                                <input
                                    type="radio"
                                    value="COD"
                                    disabled={isBlacklisted}
                                    {...register('paymentMethod')}
                                    className="size-4 text-primary focus:ring-primary border-primary bg-transparent"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-label-sm uppercase tracking-widest font-bold block text-on-surface">Thanh toán khi nhận hàng (COD)</span>
                                <span className="text-[10px] text-secondary uppercase tracking-widest block">Thanh toán bằng tiền mặt khi nhận được hoa.</span>
                            </div>
                        </label>

                        {/* Online Payment option */}
                        <label className={`flex items-start gap-md p-md border ${watchPaymentMethod === 'OnlinePayment' ? 'border-primary bg-surface-container-low' : 'border-outline-variant'} cursor-pointer`}>
                            <div className="flex items-center h-6">
                                <input
                                    type="radio"
                                    value="OnlinePayment"
                                    {...register('paymentMethod')}
                                    className="size-4 text-primary focus:ring-primary border-primary bg-transparent"
                                />
                            </div>
                            <div className="space-y-1">
                                <span className="text-label-sm uppercase tracking-widest font-bold block text-on-surface">Chuyển khoản trực tuyến / MoMo</span>
                                <span className="text-[10px] text-secondary uppercase tracking-widest block">Thanh toán an toàn qua cổng MoMo (giả lập).</span>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            <aside className="w-full lg:w-96 flex-shrink-0">
                <div className="bg-surface-container-low border border-outline-variant p-lg space-y-xl sticky top-32">
                    <h5 className="text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md text-on-surface">Chi tiết đơn hàng</h5>

                    <div className="space-y-md border-b border-outline-variant pb-md max-h-60 overflow-y-auto no-scrollbar">
                        {cartItems.map(item => (
                            <div className="flex justify-between items-start gap-md" key={item.id}>
                                <div className="flex-1 space-y-1">
                                    <span className="text-label-sm uppercase tracking-widest font-bold block text-on-surface">{item.name}</span>
                                    <span className="text-[10px] text-secondary uppercase tracking-widest block">SL: {item.quantity}</span>
                                </div>
                                <span className="font-bold text-sm text-on-surface">{formatCurrency((item.discountPrice || item.price) * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-md">
                        <div className="flex justify-between items-center text-label-sm uppercase tracking-widest">
                            <span className="text-secondary">Tạm tính</span>
                            <span className="font-bold text-on-surface">{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-label-sm uppercase tracking-widest">
                            <span className="text-secondary">Phí vận chuyển</span>
                            <span className="text-primary font-bold uppercase tracking-widest text-[10px]">Miễn phí</span>
                        </div>
                    </div>

                    <div className="border-t border-outline-variant pt-lg flex justify-between items-center">
                        <span className="text-label-sm uppercase tracking-[0.2em] font-bold text-on-surface">Tổng cộng</span>
                        <span className="serif text-2xl font-bold text-on-surface">
                            {formatCurrency(cartTotal)}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={createOrder.isPending || cartItems.length === 0}
                        className="w-full bg-primary text-on-primary py-5 text-label-sm uppercase tracking-[0.3em] font-bold border border-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed btn-luxury btn-primary-luxury"
                    >
                        {createOrder.isPending ? 'Đang xử lý...' : 'Đặt hàng'}
                    </button>

                    <div className="bg-white border border-outline-variant p-md flex items-start gap-md" style={{ backgroundColor: 'var(--md-sys-color-surface-container-lowest, #fff)' }}>
                        <span className="material-symbols-outlined text-secondary">lock</span>
                        <p className="text-[10px] text-secondary uppercase tracking-widest leading-relaxed">Mã hóa đầu cuối an toàn. Thông tin của bạn được bảo vệ.</p>
                    </div>
                </div>
            </aside>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;

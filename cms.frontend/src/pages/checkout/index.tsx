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

const getVietnamTodayString = () => {
  const options = { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric' as const, month: '2-digit' as const, day: '2-digit' as const };
  const formatter = new Intl.DateTimeFormat('en-CA', options);
  return formatter.format(new Date());
};

const DEFAULT_SLOTS = [
  { value: '08:00-10:00', label: '08:00 - 10:00 (Sáng)', startHour: 8 },
  { value: '10:00-12:00', label: '10:00 - 12:00 (Sáng)', startHour: 10 },
  { value: '13:00-15:00', label: '13:00 - 15:00 (Chiều)', startHour: 13 },
  { value: '15:00-17:00', label: '15:00 - 17:00 (Chiều)', startHour: 15 },
  { value: '17:00-19:00', label: '17:00 - 19:00 (Tối)', startHour: 17 },
  { value: '19:00-21:00', label: '19:00 - 21:00 (Tối)', startHour: 19 },
];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, refreshProfile } = useAuth();
  const createOrder = useCreateOrder();

  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [checkingBlacklist, setCheckingBlacklist] = useState(false);
  const [recipientIsBuyer, setRecipientIsBuyer] = useState(false);

  const deliveryDistrict = localStorage.getItem('delivery_district') || '';

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'COD',
    }
  });

  const watchPaymentMethod = watch('paymentMethod');
  const selectedDate = watch('deliveryDate');
  const watchFullname = watch('fullname');
  const watchPhone = watch('phone');

  // Auto-sync recipient if "recipientIsBuyer" is checked
  useEffect(() => {
    if (recipientIsBuyer) {
      setValue('recipientName', watchFullname || '', { shouldValidate: true });
      setValue('recipientPhone', watchPhone || '', { shouldValidate: true });
    }
  }, [recipientIsBuyer, watchFullname, watchPhone, setValue]);

  const getFilteredSlots = () => {
    const todayStr = getVietnamTodayString();
    if (selectedDate === todayStr) {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      const parts = formatter.formatToParts(now);
      const hourPart = parts.find(p => p.type === 'hour')?.value;
      const minutePart = parts.find(p => p.type === 'minute')?.value;
      
      const currentVnHour = hourPart ? parseInt(hourPart, 10) : now.getHours();
      const currentVnMinute = minutePart ? parseInt(minutePart, 10) : now.getMinutes();
      
      const currentVnTime = currentVnHour + (currentVnMinute / 60.0);
      const limitTime = currentVnTime + 2.0; // Lead-Time Rule = 2 hours

      return DEFAULT_SLOTS.filter(slot => slot.startHour >= limitTime);
    }
    return DEFAULT_SLOTS;
  };

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

  const premiumInputClass = "w-full border border-[#FCE4EC] bg-[#FCE4EC] rounded-lg px-4 py-3 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-body-md text-body-md placeholder-secondary-fixed-dim/60";

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
                    className={premiumInputClass}
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
                    className={premiumInputClass}
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
                  className={premiumInputClass}
                  placeholder="Địa chỉ Email"
                />
                {errors.email && <p className="text-error text-[10px] mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* PHẦN 2: NGƯỜI NHẬN */}
            <div className="bg-surface-container-lowest border border-outline-variant p-xl space-y-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant pb-md">
                <h5 className="font-display-xl text-headline-sm uppercase tracking-widest text-on-surface">2. Thông tin người nhận</h5>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={recipientIsBuyer}
                    onChange={(e) => setRecipientIsBuyer(e.target.checked)}
                    className="rounded text-primary focus:ring-primary size-4 border-outline-variant bg-transparent"
                  />
                  <span className="text-[12px] uppercase tracking-widest text-secondary font-bold">Người nhận là người mua</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-sm">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Họ và tên người nhận</label>
                  <input
                    type="text"
                    readOnly={recipientIsBuyer}
                    {...register('recipientName')}
                    className={`${premiumInputClass} ${recipientIsBuyer ? 'opacity-60 cursor-not-allowed bg-opacity-70' : ''}`}
                    placeholder="Tên người nhận hoa"
                  />
                  {errors.recipientName && <p className="text-error text-[10px] mt-1">{errors.recipientName.message}</p>}
                </div>
                <div className="space-y-sm">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Số điện thoại người nhận</label>
                  <input
                    type="text"
                    readOnly={recipientIsBuyer}
                    {...register('recipientPhone')}
                    className={`${premiumInputClass} ${recipientIsBuyer ? 'opacity-60 cursor-not-allowed bg-opacity-70' : ''}`}
                    placeholder="SĐT người nhận hoa"
                  />
                  {errors.recipientPhone && <p className="text-error text-[10px] mt-1">{errors.recipientPhone.message}</p>}
                </div>
              </div>

              <div className="space-y-sm">
                <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Lời chúc trên thiệp</label>
                <textarea
                  {...register('greetingCard')}
                  className={premiumInputClass}
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
                    className={`${premiumInputClass} opacity-60 cursor-not-allowed`}
                  />
                </div>
                <div className="space-y-sm">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    {...register('deliveryAddress')}
                    className={premiumInputClass}
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
                    min={getVietnamTodayString()}
                    className={premiumInputClass}
                  />
                  {errors.deliveryDate && <p className="text-error text-[10px] mt-1">{errors.deliveryDate.message}</p>}
                </div>
                <div className="space-y-sm">
                  <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Khung giờ giao hoa</label>
                  <select
                    {...register('deliveryTimeSlot')}
                    className={premiumInputClass}
                  >
                    <option value="">-- CHỌN KHUNG GIỜ --</option>
                    {getFilteredSlots().map(slot => (
                      <option key={slot.value} value={slot.value}>{slot.label}</option>
                    ))}
                  </select>
                  {errors.deliveryTimeSlot && <p className="text-error text-[10px] mt-1">{errors.deliveryTimeSlot.message}</p>}
                </div>
              </div>

              <div className="space-y-sm">
                <label className="text-[10px] uppercase tracking-widest text-secondary font-bold">Ghi chú thêm</label>
                <textarea
                  {...register('notes')}
                  className={premiumInputClass}
                  rows={3}
                  placeholder="Yêu cầu riêng về đơn hàng..."
                ></textarea>
              </div>
            </div>

            {/* PHƯƠNG THỨC THANH TOÁN */}
            <div className="bg-surface-container-lowest border border-outline-variant p-xl space-y-lg">
              <h5 className="font-display-xl text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md text-on-surface">4. Phương thức thanh toán</h5>
              
              <div className="space-y-md">
                {/* COD option */}
                <label className={`flex items-start gap-md p-md border rounded-lg transition-all ${watchPaymentMethod === 'COD' ? 'border-primary bg-[#FCE4EC]/20' : 'border-outline-variant hover:border-primary/50'} cursor-pointer ${isBlacklisted ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                <label className={`flex items-start gap-md p-md border rounded-lg transition-all ${watchPaymentMethod === 'OnlinePayment' ? 'border-primary bg-[#FCE4EC]/20' : 'border-outline-variant hover:border-primary/50'} cursor-pointer`}>
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
            <div className="bg-surface-container-low border border-outline-variant p-lg space-y-xl sticky top-32 rounded-lg">
              <h5 className="text-headline-sm uppercase tracking-widest border-b border-outline-variant pb-md text-on-surface">Chi tiết đơn hàng</h5>

              <div className="space-y-md border-b border-outline-variant pb-md max-h-80 overflow-y-auto no-scrollbar">
                {cartItems.map(item => (
                  <div className="flex items-center gap-md" key={item.id}>
                    <div className="relative w-20 aspect-[20/24] overflow-hidden rounded-lg bg-surface-container-low flex-shrink-0 border border-outline-variant/30">
                      <img
                        src={item.imageUrl || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-label-sm uppercase tracking-widest font-bold block text-on-surface line-clamp-1">{item.name}</span>
                      <span className="text-[10px] text-secondary uppercase tracking-widest block">SL: {item.quantity}</span>
                      <span className="font-bold text-xs text-secondary-fixed block">{formatCurrency(item.discountPrice || item.price)}</span>
                    </div>
                    <span className="font-bold text-sm text-on-surface self-center">{formatCurrency((item.discountPrice || item.price) * item.quantity)}</span>
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
                className="w-full bg-primary text-on-primary py-5 text-label-sm uppercase tracking-[0.3em] font-bold border border-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed btn-luxury btn-primary-luxury rounded-lg hover:bg-primary-hover transition-colors"
              >
                {createOrder.isPending ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>

              <div className="bg-white border border-outline-variant p-md flex items-start gap-md rounded-lg" style={{ backgroundColor: 'var(--md-sys-color-surface-container-lowest, #fff)' }}>
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

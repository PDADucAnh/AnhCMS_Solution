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
            <h3 className="text-label-sm uppercase tracking-[0.3em] text-secondary">Giao dịch hoàn tất</h3>
            <h2 className="font-display-xl text-display-xl uppercase tracking-tighter">
              Xác nhận đơn hàng
            </h2>
            <div className="w-12 h-0.5 bg-primary mx-auto"></div>
          </div>

          {orderId && (
            <div className="bg-surface-container-low border border-outline-variant p-lg">
              <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Mã đơn hàng</p>
              <p className="font-bold text-3xl serif text-primary">#{orderId}</p>
            </div>
          )}

          <div className="space-y-md text-secondary max-w-md mx-auto">
            <p className="text-body-md">
              Đơn hàng của bạn đã được ghi nhận và đang được chuẩn bị giao.
              Email xác nhận sẽ được gửi đến địa chỉ của bạn.
            </p>
            <p className="text-[10px] uppercase tracking-widest">
              Thời gian giao dự kiến: 5–7 Ngày làm việc
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-md justify-center pt-md">
            <Link
              to="/shop"
              className="bg-primary text-on-primary px-xl py-4 text-label-sm uppercase tracking-[0.3em] font-bold text-decoration-none btn-luxury btn-primary-luxury"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              to="/my-orders"
              className="border border-outline-variant px-xl py-4 text-label-sm uppercase tracking-[0.3em] font-bold text-decoration-none text-on-background btn-luxury"
            >
              Xem đơn hàng
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmationPage;

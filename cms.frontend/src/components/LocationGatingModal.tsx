import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

interface LocationGatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (district: string) => void;
  items: { productId: number; quantity: number }[];
}

const HCM_DISTRICTS = [
  "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12",
  "Quận Bình Thạnh", "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú", "Quận Bình Tân",
  "Thành phố Thủ Đức"
];

export const LocationGatingModal: React.FC<LocationGatingModalProps> = ({ isOpen, onClose, onSuccess, items }) => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCheck = async () => {
    if (!selectedDistrict) {
      setError('Vui lòng chọn Quận/Huyện');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response: any = await axiosClient.post('/LocationGating/check-availability', {
        district: selectedDistrict,
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
      });

      if (response.available) {
        localStorage.setItem('delivery_district', selectedDistrict);
        onSuccess(selectedDistrict);
      } else {
        setError(response.message || 'Khu vực này hiện đang hết hàng.');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-outline-variant p-xl max-w-md w-full shadow-2xl rounded-xl" style={{ backgroundColor: 'var(--md-sys-color-surface, #fff)' }}>
        <div className="text-center space-y-sm">
          <span className="material-symbols-outlined text-4xl text-primary">local_shipping</span>
          <h3 className="font-headline-sm text-headline-sm uppercase tracking-widest text-on-surface">Địa chỉ giao hàng</h3>
          <p className="text-secondary text-sm">Vui lòng chọn Quận/Huyện giao hàng tại TP.HCM để xác minh hỗ trợ vận chuyển.</p>
        </div>

        <div className="space-y-md mt-md">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant px-md py-4 text-sm font-semibold tracking-widest outline-none rounded-lg text-on-surface"
            style={{ backgroundColor: 'var(--md-sys-color-surface-container-low, #f5f5f5)', color: 'var(--md-sys-color-on-surface, #000)' }}
          >
            <option value="">-- CHỌN QUẬN/HUYỆN --</option>
            {HCM_DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {error && <p className="text-error text-[11px] font-bold text-center uppercase tracking-wider mt-2">{error}</p>}
        </div>

        <div className="flex gap-md mt-lg">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-outline-variant py-3 text-label-sm uppercase tracking-widest font-bold bg-transparent hover:bg-surface-container cursor-pointer text-on-surface"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleCheck}
            disabled={loading}
            className="flex-1 bg-primary text-on-primary py-3 text-label-sm uppercase tracking-widest font-bold border border-primary hover:opacity-90 cursor-pointer"
          >
            {loading ? 'Đang kiểm tra...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};

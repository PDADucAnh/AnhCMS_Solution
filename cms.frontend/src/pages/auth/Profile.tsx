import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AccountSidebar } from '../../components/OrderComponents';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, logout, refreshProfile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal({ threshold: 0 });

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancel = () => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Họ và tên không được để trống.');
      return;
    }
    if (fullName.length > 100) {
      toast.error('Họ và tên tối đa 100 ký tự.');
      return;
    }
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      toast.error('Số điện thoại không được để trống.');
      return;
    }
    if (cleanPhone.length < 10 || cleanPhone.length > 15 || !/^\d+$/.test(cleanPhone)) {
      toast.error('Số điện thoại phải chứa từ 10 đến 15 chữ số.');
      return;
    }
    if (!address.trim()) {
      toast.error('Địa chỉ không được để trống.');
      return;
    }
    if (address.length > 500) {
      toast.error('Địa chỉ tối đa 500 ký tự.');
      return;
    }

    setLoadingUpdate(true);
    try {
      await updateProfile(fullName.trim(), cleanPhone, address.trim());
      toast.success('Cập nhật thông tin cá nhân thành công!');
      setIsEditing(false);
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.';
      toast.error(errorMsg);
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20 min-h-screen">
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg min-h-[calc(100vh-200px)]">
        <div className="flex flex-col md:flex-row gap-stack-lg">
          <AccountSidebar />

          <section
            ref={ref}
            className="flex-grow transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="bg-surface-container-lowest p-stack-lg rounded-xl petal-shadow">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-lg">Thông tin cá nhân</h2>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-stack-lg mb-stack-lg">
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{user?.fullName || '—'}</h3>
                  <p className="text-on-surface-variant font-body-md italic">Thành viên</p>
                </div>
              </div>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  <div className="space-y-base">
                    <label className="font-label-md text-on-surface-variant">Họ và tên</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    ) : (
                      <div className="p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface">{user?.fullName || '—'}</div>
                    )}
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-on-surface-variant">Tên đăng nhập</label>
                    <div className="p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant/70">{user?.username || '—'}</div>
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-on-surface-variant">Email</label>
                    <div className="p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant/70">{user?.email || '—'}</div>
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-on-surface-variant">Số điện thoại</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    ) : (
                      <div className="p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface">{user?.phone || '—'}</div>
                    )}
                  </div>
                  <div className="space-y-base md:col-span-2">
                    <label className="font-label-md text-on-surface-variant">Địa chỉ</label>
                    {isEditing ? (
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className="w-full p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                      />
                    ) : (
                      <div className="p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface whitespace-pre-line">{user?.address || '—'}</div>
                    )}
                  </div>
                </div>
                <div className="mt-stack-lg flex gap-stack-md">
                  {isEditing ? (
                    <>
                      <button
                        type="submit"
                        disabled={loadingUpdate}
                        className="px-stack-md py-stack-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-surface-tint transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingUpdate ? 'Đang lưu...' : 'Lưu'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loadingUpdate}
                        className="px-stack-md py-stack-sm border border-outline text-on-surface-variant rounded-lg font-label-md hover:bg-surface-container-low transition-colors bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-stack-md py-stack-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-surface-tint transition-colors shadow-md cursor-pointer"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="px-stack-md py-stack-sm border border-error/30 text-error rounded-lg font-label-md hover:bg-error-container/20 transition-colors bg-transparent cursor-pointer"
                      >
                        Đăng xuất
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;

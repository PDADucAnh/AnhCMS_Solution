import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AccountSidebar } from '../../components/OrderComponents';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const Profile: React.FC = () => {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal({ threshold: 0 });

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                <div className="space-y-base">
                  <label className="font-label-md text-on-surface-variant">Họ và tên</label>
                  <div className="p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface">{user?.fullName || '—'}</div>
                </div>
                <div className="space-y-base">
                  <label className="font-label-md text-on-surface-variant">Tên đăng nhập</label>
                  <div className="p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface">{user?.username || '—'}</div>
                </div>
                <div className="space-y-base">
                  <label className="font-label-md text-on-surface-variant">Email</label>
                  <div className="p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface">{user?.email || '—'}</div>
                </div>
                <div className="space-y-base">
                  <label className="font-label-md text-on-surface-variant">Số điện thoại</label>
                  <div className="p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface">{user?.phone || '—'}</div>
                </div>
                <div className="space-y-base md:col-span-2">
                  <label className="font-label-md text-on-surface-variant">Địa chỉ</label>
                  <div className="p-stack-sm rounded-lg border border-outline-variant bg-surface-container-low text-on-surface whitespace-pre-line">{user?.address || '—'}</div>
                </div>
              </div>
              <div className="mt-stack-lg flex gap-stack-md">
                <button className="px-stack-md py-stack-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-surface-tint transition-colors shadow-md">Chỉnh sửa</button>
                <button onClick={handleLogout} className="px-stack-md py-stack-sm border border-error/30 text-error rounded-lg font-label-md hover:bg-error-container/20 transition-colors bg-transparent cursor-pointer">Đăng xuất</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;

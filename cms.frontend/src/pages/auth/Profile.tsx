import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Profile: React.FC = () => {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20 min-h-screen">
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="mb-xl pb-8 border-b border-primary">
          <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl text-primary uppercase text-center md:text-left">
            MEMBER PROFILE
          </h1>
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] text-center md:text-left mt-4">
            Personal Account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <aside className="md:col-span-3 border-r border-primary pr-8 hidden md:block">
            <ul className="space-y-6">
              <li>
                <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary font-bold border-l-2 border-primary pl-4 block cursor-default">
                  General Info
                </span>
              </li>
              <li>
                <Link to="/my-orders" className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors duration-150 pl-4 block text-decoration-none">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors duration-150 pl-4 block text-decoration-none">
                  Wishlist
                </Link>
              </li>
              <li className="mt-12 pt-12 border-t border-outline-variant">
                <button
                  onClick={handleLogout}
                  className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary hover:text-error transition-colors duration-150 pl-4 block w-full text-left"
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </aside>

          <div className="md:col-span-9 md:pl-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
              <div className="space-y-12">
                <div className="border-b border-outline-variant pb-4 group hover:border-primary transition-colors duration-300">
                  <label className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] block mb-2">Full Name</label>
                  <p className="font-body-lg text-lg text-primary">{user?.fullName || '—'}</p>
                </div>

                <div className="border-b border-outline-variant pb-4 group hover:border-primary transition-colors duration-300">
                  <label className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] block mb-2">Username</label>
                  <p className="font-body-lg text-lg text-primary">{user?.username || '—'}</p>
                </div>

                <div className="border-b border-outline-variant pb-4 group hover:border-primary transition-colors duration-300">
                  <label className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] block mb-2">Email Address</label>
                  <p className="font-body-lg text-lg text-primary">{user?.email || '—'}</p>
                </div>

                <div className="border-b border-outline-variant pb-4 group hover:border-primary transition-colors duration-300">
                  <label className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] block mb-2">Phone Number</label>
                  <p className="font-body-lg text-lg text-primary">{user?.phone || '—'}</p>
                </div>

                <div className="border-b border-outline-variant pb-4 group hover:border-primary transition-colors duration-300">
                  <label className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em] block mb-2">Default Shipping Address</label>
                  <p className="font-body-lg text-lg text-primary whitespace-pre-line">{user?.address || '—'}</p>
                </div>

                <div className="pt-8 flex gap-4">
                  <button className="bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-[0.2em] px-8 py-4 hover:bg-surface hover:text-primary hover:border-primary border border-transparent transition-all duration-150">
                    Edit Profile
                  </button>
                  <button className="bg-transparent text-primary border border-primary font-label-sm text-label-sm uppercase tracking-[0.2em] px-8 py-4 hover:bg-primary hover:text-on-primary transition-all duration-150">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="hidden lg:block" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
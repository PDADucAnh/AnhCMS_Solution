import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-surface dark:bg-inverse-surface border-t border-outline-variant/50 mt-xl">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">

          <div className="space-y-6">
            <h2 className="font-display-xl text-headline-lg uppercase tracking-[0.15em] text-primary dark:text-inverse-primary leading-none">
              AnhCMS<span className="text-outline font-body-md text-body-md tracking-[0.05em] font-normal">.Fashion</span>
            </h2>
            <p className="text-secondary dark:text-secondary-fixed-dim text-sm leading-relaxed max-w-xs tracking-wide">
              Curated collections for the discerning individual.
            </p>
          </div>

          <div className="space-y-6">
            <h5 className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-secondary dark:text-secondary-fixed-dim font-medium">
              Customer Service
            </h5>
            <ul className="space-y-3 list-none">
              {['Shipping & Delivery', 'Returns & Exchanges', 'Privacy Policy', 'FAQ'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary text-sm transition-colors duration-300 text-decoration-none tracking-wide"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-label-sm text-label-sm uppercase tracking-[0.25em] text-secondary dark:text-secondary-fixed-dim font-medium">
              Contact
            </h5>
            <ul className="space-y-3 list-none text-sm text-secondary dark:text-secondary-fixed-dim tracking-wide">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[15px] mt-0.5 text-outline">location_on</span>
                <span>123 Fashion District, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[15px] text-outline">phone</span>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[15px] text-outline">mail</span>
                <span>concierge@anhcms.fashion</span>
              </li>
            </ul>

            <div className="pt-6">
              <p className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary dark:text-secondary-fixed-dim mb-4">
                Newsletter
              </p>
              <form
                className="flex border-b border-outline pb-2 group focus-within:border-primary transition-colors duration-300"
                onSubmit={(e) => { e.preventDefault(); console.log('Newsletter:', email); setEmail(''); }}
              >
                <input
                  className="bg-transparent border-none w-full text-sm text-primary placeholder:text-secondary focus:ring-0 p-0 font-body-md outline-none"
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="font-label-sm text-label-sm uppercase tracking-[0.2em] pl-4 bg-transparent border-0 text-primary hover:text-secondary transition-colors duration-300"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-outline-variant/30">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-outline text-[11px] uppercase tracking-[0.2em] font-label-sm m-0">
            &copy; {new Date().getFullYear()} AnhCMS.Fashion. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-outline hover:text-primary transition-colors duration-300 text-decoration-none">
              <span className="material-symbols-outlined text-lg">instagram</span>
            </a>
            <a href="#" className="text-outline hover:text-primary transition-colors duration-300 text-decoration-none">
              <span className="material-symbols-outlined text-lg">pinterest</span>
            </a>
            <a href="#" className="text-outline hover:text-primary transition-colors duration-300 text-decoration-none">
              <span className="material-symbols-outlined text-lg">facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

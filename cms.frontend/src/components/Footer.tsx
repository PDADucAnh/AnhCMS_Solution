import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto w-full">
      <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="font-headline-sm text-headline-sm text-primary block">PDA FLOWER</span>
            <div>
              <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-3">Newsletter</h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                Subscribe For 20% Off, Early Access To Limited Edition Stems, &amp; Useful Care Tips
              </p>
              <div className="flex border-b border-outline-variant pb-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 bg-transparent border-0 outline-none text-on-surface font-body-md text-body-md placeholder:text-outline"
                />
                <button className="bg-transparent border-0 cursor-pointer text-primary hover:opacity-80 transition-opacity p-1">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-4">Shop</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {['Flowers', 'Peony Flowers', 'Plants', 'Gifts', 'Subscriptions', 'Same Day Delivery', 'All Products'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline">{item}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h5 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-2 text-[11px]">Top Picks</h5>
              <ul className="space-y-2 list-none p-0 m-0">
                {['The Margot', 'The Firecracker', 'The Peace', 'The Unicorn'].map((item) => (
                  <li key={item}>
                    <Link to="/shop" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-4">Help</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {['Contact', 'Care Instructions', 'Customer Service', 'Careers'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Contact' ? '/contact' : '/'} className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-4">Company</h4>
            <ul className="space-y-2.5 list-none p-0 m-0">
              {['Blog', 'Our Story', 'Press', 'Brands We Love', 'Privacy Policy', 'Terms &amp; Conditions', 'Accessibility', 'Sitemap'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Blog' ? '/blog' : '/'} className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors no-underline">
                    {item.replace('&amp;', '&')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-body-md text-body-md text-on-surface-variant">
            &copy; {new Date().getFullYear()} PDA FLOWER. Crafted for Contemporary Romance.
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant">
            Email: <a href="mailto:anh22032005@gmail.com" className="text-primary hover:opacity-80 transition-opacity no-underline">anh22032005@gmail.com</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
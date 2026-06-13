import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-xl px-margin grid grid-cols-1 md:grid-cols-4 gap-gutter bg-surface-container dark:bg-tertiary-container text-primary dark:text-inverse-primary font-body-md text-body-md border-t border-secondary-container dark:border-outline-variant flat no shadows mt-xl">
      <div className="col-span-1 md:col-span-1 flex flex-col items-start opacity-80 hover:opacity-100 transition-opacity">
        <h2 className="font-display-xl text-headline-sm uppercase tracking-widest text-primary dark:text-inverse-primary mb-md">AnhCMS.Fashion</h2>
        <p className="text-secondary dark:text-secondary-fixed-dim text-sm mb-lg max-w-xs text-justify">Elevating the everyday through minimalist design and uncompromising quality.</p>
        <p className="text-xs text-secondary dark:text-secondary-fixed-dim mt-auto">© 2026 AnhCMS Editorial. All rights reserved.</p>
      </div>
      <div className="col-span-1 flex flex-col gap-sm opacity-80 hover:opacity-100 transition-opacity">
        <h4 className="font-headline-sm text-sm uppercase tracking-widest mb-xs">Explore</h4>
        <a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors duration-300 w-fit text-decoration-none" href="#">About</a>
        <a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors duration-300 w-fit text-decoration-none" href="#">Customer Service</a>
        <a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors duration-300 w-fit text-decoration-none" href="#">Privacy</a>
        <a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors duration-300 w-fit text-decoration-none" href="#">Shipping</a>
      </div>
      <div className="col-span-1 md:col-span-2 flex flex-col gap-sm opacity-80 hover:opacity-100 transition-opacity">
        <h4 className="font-headline-sm text-sm uppercase tracking-widest mb-xs">Newsletter</h4>
        <p className="text-secondary dark:text-secondary-fixed-dim text-sm mb-xs">Subscribe to receive updates, access to exclusive deals, and more.</p>
        <form className="flex w-full max-w-md border-b border-outline pb-2 mt-2 group focus-within:border-primary transition-colors">
          <input className="bg-transparent border-none w-full text-body-md text-primary placeholder:text-secondary focus:ring-0 p-0 font-body-md outline-none" placeholder="Enter your email address" type="email" />
          <button className="font-label-sm text-label-sm uppercase tracking-widest text-primary hover:text-secondary transition-colors pl-4 bg-transparent border-0" type="submit">Subscribe</button>
        </form>
      </div>
    </footer>
  );
};

export default Footer;

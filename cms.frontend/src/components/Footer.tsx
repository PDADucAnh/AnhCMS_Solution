import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant mt-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-stack-lg max-w-container-max mx-auto w-full gap-stack-md">
        <div className="text-center md:text-left">
          <span className="font-headline-sm text-headline-sm text-primary block mb-2">PDA FLOWER</span>
          <span className="font-body-md text-body-md text-on-surface-variant">&copy; {new Date().getFullYear()} PDA FLOWER. Crafted for Contemporary Romance.</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-gutter gap-y-2">
          <a className="text-on-surface-variant font-label-sm text-label-sm hover:underline decoration-primary/30 transition-all focus:ring-2 focus:ring-primary/20 outline-none rounded" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant font-label-sm text-label-sm hover:underline decoration-primary/30 transition-all focus:ring-2 focus:ring-primary/20 outline-none rounded" href="#">Shipping Info</a>
          <a className="text-on-surface-variant font-label-sm text-label-sm hover:underline decoration-primary/30 transition-all focus:ring-2 focus:ring-primary/20 outline-none rounded" href="#">Terms of Service</a>
          <a className="text-on-surface-variant font-label-sm text-label-sm hover:underline decoration-primary/30 transition-all focus:ring-2 focus:ring-primary/20 outline-none rounded" href="#">Floral Care Guide</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

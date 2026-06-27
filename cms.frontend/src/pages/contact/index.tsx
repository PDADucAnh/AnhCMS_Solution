import React from 'react';
import { Link } from 'react-router-dom';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20 min-h-screen">
      <main className="max-w-[1440px] mx-auto px-margin py-xl">
        <header className="mb-xl text-center space-y-md">
          <h3 className="text-label-sm uppercase tracking-[0.3em] text-secondary">Get In Touch</h3>
          <h2 className="font-display-xl text-display-xl uppercase tracking-tighter text-primary">Contact Us</h2>
          <div className="w-12 h-0.5 bg-primary mx-auto"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl max-w-5xl mx-auto">
          <div className="space-y-lg">
            <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/50">
              <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
              <div>
                <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-1">Address</h3>
                <p className="text-secondary font-body-md">123 Fashion Street, District 1, Ho Chi Minh City</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/50">
              <span className="material-symbols-outlined text-primary text-2xl">phone</span>
              <div>
                <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-1">Phone</h3>
                <p className="text-secondary font-body-md">+84 123 456 789</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/50">
              <span className="material-symbols-outlined text-primary text-2xl">mail</span>
              <div>
                <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-1">Email</h3>
                <p className="text-secondary font-body-md">hello@pdaflower.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/50">
              <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
              <div>
                <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-1">Business Hours</h3>
                <p className="text-secondary font-body-md">Mon - Sat: 8:00 AM - 9:00 PM</p>
                <p className="text-secondary font-body-md">Sunday: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
            <div className="pt-4">
              <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary mb-3">Follow Us</h3>
              <div className="flex gap-3">
                <a href="#" className="size-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all" aria-label="Facebook">
                  <span className="material-symbols-outlined text-[20px]">facebook</span>
                </a>
                <a href="#" className="size-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all" aria-label="Instagram">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                </a>
                <a href="#" className="size-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all" aria-label="TikTok">
                  <span className="material-symbols-outlined text-[20px]">music_note</span>
                </a>
                <a href="#" className="size-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all" aria-label="Zalo">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-md">
            <div className="text-center mb-md">
              <h3 className="font-label-md text-label-md uppercase tracking-widest text-primary">Send Us a Message</h3>
            </div>
            <form className="space-y-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <input
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md rounded px-4 py-3 outline-none focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline"
                  placeholder="Your Name"
                  type="text"
                />
                <input
                  className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md rounded px-4 py-3 outline-none focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline"
                  placeholder="Your Email"
                  type="email"
                />
              </div>
              <input
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md rounded px-4 py-3 outline-none focus:ring-1 focus:ring-primary transition-colors placeholder:text-outline"
                placeholder="Subject"
                type="text"
              />
              <textarea
                className="w-full bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md rounded px-4 py-3 outline-none focus:ring-1 focus:ring-primary transition-colors resize-none placeholder:text-outline"
                placeholder="Your Message"
                rows={5}
              ></textarea>
              <button
                type="button"
                className="w-full bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest py-4 border border-primary btn-luxury btn-primary-luxury"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-xl">
          <Link to="/" className="text-primary font-label-sm uppercase tracking-widest text-decoration-none btn-link-luxury">Back to Home</Link>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;

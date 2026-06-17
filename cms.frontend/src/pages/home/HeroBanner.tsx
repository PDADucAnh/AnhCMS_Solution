import React from 'react';
import { Link } from 'react-router-dom';

function HeroBanner() {
    return (
        <section className="relative h-[819px] min-h-[600px] w-full overflow-hidden flex items-center justify-center mb-xl">
            <div className="absolute inset-0 w-full h-full">
                <img 
                    alt="Hero Background" 
                    className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-105" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqDI7Mz7K5BTIU02aNjpBEWhHAMWivU705BjuekjOzaWv5Ncq4RVM6FLqCQVDkxlst2xznDkIgv_u3I5fCM_COlDOuu5MLopgMKY7TLultFzoPfCdPyoPYgr1Xh6S2cppro04Fx_Bgmph_P3RLcr61NOUPmk3vn7Agh9O-c6znHdPWdT12btWMVa5SQz4029qFLcomV-MB3IUWQINEZLRJUkU2Vo5Q4dEjSJxTNR04fNUX5G4p8twxUkYYOpTk9KvSPxL0JIJVF3o" 
                />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div className="relative z-10 text-center px-margin max-w-3xl">
                <h1 className="font-display-xl text-display-xl md:text-display-xl text-white mb-md tracking-tighter uppercase drop-shadow-md">THE NEW ELEGANCE</h1>
                <p className="font-body-lg text-body-lg text-white mb-lg drop-shadow-md max-w-xl mx-auto italic serif">Discover the latest collection of meticulously crafted garments designed for the modern minimalist.</p>
                <div className="flex flex-col sm:flex-row gap-md justify-center">
                    <Link to="/shop" className="bg-primary text-on-primary px-8 py-4 font-label-sm text-label-sm uppercase tracking-widest hover:bg-surface hover:text-primary transition-colors border border-primary text-decoration-none">Shop Now</Link>
                    <Link to="/shop" className="bg-transparent text-white px-8 py-4 font-label-sm text-label-sm uppercase tracking-widest border border-white hover:bg-white hover:text-primary transition-colors text-decoration-none">New Collection</Link>
                </div>
            </div>
        </section>
    );
}

export default HeroBanner;

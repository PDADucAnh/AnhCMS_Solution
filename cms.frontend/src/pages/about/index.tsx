import React, { useEffect } from 'react';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md antialiased pt-20 min-h-screen">
      <main className="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
          <span className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-secondary block mb-6">House of Fashion</span>
          <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl text-primary uppercase tracking-tight leading-none mb-8">
            AnhCMS<span className="text-outline font-body-md text-body-md tracking-[0.05em] font-normal lowercase">.Fashion</span>
          </h1>
          <div className="w-8 h-0.5 bg-primary mx-auto mb-8"></div>
          <p className="font-body-lg text-body-lg text-secondary leading-relaxed max-w-2xl mx-auto">
            Crafting a new standard in contemporary fashion through meticulous attention to detail, 
            uncompromising quality, and a deep reverence for the art of dressing.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-20 md:space-y-28">
          <section className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-outline">Our Story</span>
            </div>
            <div className="md:col-span-3 space-y-6">
              <p className="serif text-2xl md:text-3xl italic leading-relaxed text-primary font-display-xl">
                Fashion is not merely adornment. It is a language, a statement of intent, 
                a quiet confidence that precedes the wearer into every room.
              </p>
              <div className="space-y-4 text-secondary leading-relaxed">
                <p>
                  Founded with a singular vision — to create pieces that transcend seasons and trends — 
                  AnhCMS.Fashion represents a return to the essential. Every collection is born from 
                  a dialogue between heritage craftsmanship and contemporary sensibility.
                </p>
                <p>
                  We believe in the power of reduction: stripping away the superfluous until only 
                  the purest expression of design remains. Our atelier operates at the intersection 
                  of precision tailoring and artistic freedom, where every seam tells a story.
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-outline">Our Values</span>
            </div>
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
              {[
                { title: 'Craftsmanship', desc: 'Each piece is a testament to the hands that made it. We honor the art of slow fashion through meticulous construction and premium material selection.' },
                { title: 'Curation', desc: 'Every collection is thoughtfully edited. We believe in fewer, better things — pieces that earn their place in your wardrobe through enduring relevance.' },
                { title: 'Authenticity', desc: 'We remain true to our vision. No fleeting trends, no compromise on quality. Our identity is defined by what we choose not to do as much as what we create.' },
              ].map((v) => (
                <div key={v.title} className="space-y-4">
                  <div className="w-8 h-px bg-primary"></div>
                  <h3 className="font-headline-sm text-headline-sm uppercase tracking-widest text-primary">{v.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            <div className="md:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-outline">The Atelier</span>
            </div>
            <div className="md:col-span-3 border-t border-primary pt-8">
              <p className="text-secondary leading-relaxed">
                Based in the creative heart of the city, our atelier is both workshop and sanctuary — 
                a space where ideas are sketched, fabrics are studied, and garments take form through 
                patient collaboration between designer and artisan. Every piece that bears the AnhCMS 
                label passes through our studio, ensuring that what reaches you carries the integrity 
                of its origin.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default About;

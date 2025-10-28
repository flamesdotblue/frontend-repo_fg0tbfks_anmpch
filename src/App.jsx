import React, { useEffect } from 'react';
import Hero3D from './components/Hero3D';
import ProductShowcase from './components/ProductShowcase';
import PreorderWaitlist from './components/PreorderWaitlist';
import InfoSections from './components/InfoSections';

export default function App() {
  // Basic SEO metadata injection without extra deps
  useEffect(() => {
    const title = 'Maison Vera — Luxury Mechanical Watches';
    const desc = 'Premium timepieces that unite precision engineering with understated elegance. Explore Vera One, Vera Eclipse, and Vera Expedition.';
    const url = window.location.origin;
    document.title = title;

    const ensure = (name, attrs) => {
      let el = document.querySelector(`${name}[name="${attrs.name}"]`) || document.createElement(name);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      return el;
    };

    ensure('meta', { name: 'description', content: desc });
    ensure('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' });
    ensure('meta', { name: 'theme-color', content: '#0b0b0f' });

    // Open Graph
    const og = (p, v) => { let m = document.querySelector(`meta[property="${p}"]`) || document.createElement('meta'); m.setAttribute('property', p); m.setAttribute('content', v); document.head.appendChild(m); };
    og('og:title', title);
    og('og:description', desc);
    og('og:type', 'website');
    og('og:url', url);

    // Twitter
    ensure('meta', { name: 'twitter:card', content: 'summary_large_image' });
    ensure('meta', { name: 'twitter:title', content: title });
    ensure('meta', { name: 'twitter:description', content: desc });

    // GA4 lightweight injection
    const gaId = import.meta.env.VITE_GA_ID || '';
    if (gaId) {
      const s1 = document.createElement('script');
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s1);

      const s2 = document.createElement('script');
      s2.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`;
      document.head.appendChild(s2);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/30">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <a href="#" className="text-zinc-100 font-semibold tracking-wide">Maison Vera</a>
          <nav className="hidden md:flex items-center gap-6 text-zinc-300">
            <a href="#models" className="hover:text-white">Models</a>
            <a href="#shop" className="hover:text-white">Shop</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#warranty" className="hover:text-white">Warranty</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
          <a href="#shop" className="inline-flex rounded-full bg-zinc-100 text-black px-4 py-1.5 text-sm font-medium hover:bg-white">Pre‑Order</a>
        </div>
      </header>

      <main>
        <Hero3D />
        <ProductShowcase />
        <PreorderWaitlist />
        <InfoSections />
      </main>
    </div>
  );
}

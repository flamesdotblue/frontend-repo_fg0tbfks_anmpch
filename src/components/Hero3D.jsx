import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero3D() {
  return (
    <section className="relative min-h-[85vh] w-full overflow-hidden bg-gradient-to-b from-[#0b0a10] via-[#0a0712] to-black flex items-stretch">
      {/* 3D Scene */}
      <div className="relative flex-1">
        <Spline scene="https://prod.spline.design/myxXfbNiwnbTpGFp/scene.splinecode" style={{ width: '100%', height: '100%' }} />

        {/* Soft gradients for mood (non-blocking) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[70rem] w-[70rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(176,144,255,0.18),transparent_60%)] blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      </div>

      {/* Copy block overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center">
        <div className="mx-auto max-w-6xl px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="pointer-events-auto">
            <p className="uppercase tracking-[0.3em] text-[11px] text-zinc-300/80">Maison Vera Parfums</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-semibold text-zinc-100 leading-tight">
              The Fragrance of Creativity
            </h1>
            <p className="mt-4 text-zinc-300/90 max-w-xl">
              A quiet aura of glass and light. Minimal, iridescent, and endlessly modern — bottles that float, formulas that linger.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#models" className="inline-flex items-center rounded-full bg-white/95 text-black px-5 py-2.5 font-medium hover:bg-white transition">Discover the Collection</a>
              <a href="#shop" className="inline-flex items-center rounded-full border border-white/30 text-zinc-100 px-5 py-2.5 font-medium hover:border-white/60 transition">Join the Waitlist</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';

export default function InfoSections() {
  return (
    <>
      <section id="about" className="bg-black py-20">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="tracking-widest uppercase text-xs text-zinc-400">About</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-zinc-100">Maison Vera Parfums</h2>
            <p className="mt-3 text-zinc-400">A studio devoted to quiet luxury. We compose modern, minimalist fragrances with rare naturals and featherlight synthetics—balanced for intimacy and presence, never noise.</p>
            <p className="mt-3 text-zinc-400">Each formula is macerated for up to eight weeks and cold‑filtered for clarity, then hand‑bottled in refillable glass built to be kept, not discarded.</p>
          </div>
          <div className="rounded-2xl h-72 md:h-80 bg-[radial-gradient(80%_80%_at_50%_30%,rgba(200,160,255,0.18),rgba(0,0,0,0)_60%)] ring-1 ring-white/10" />
        </div>
      </section>

      <section id="warranty" className="bg-zinc-950 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="tracking-widest uppercase text-xs text-zinc-400">Craft, Shipping & Returns</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-zinc-100">Assurance, Worldwide</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Considered Ingredients',
                text: 'We source responsibly—from iris butter to sandalwood—and adhere to IFRA standards. Vegan, no artificial colors.'
              },
              {
                title: 'Global Delivery',
                text: 'Insured, trackable shipping worldwide. Dispatch windows are shared on joining the waitlist and confirmed before checkout.'
              },
              {
                title: 'Simple Returns',
                text: 'Unopened bottles may be returned within 14 days for a refund. Sample sets are available to help you choose.'
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl bg-zinc-900/40 ring-1 ring-white/10 p-6">
                <h3 className="text-zinc-100 text-lg font-medium">{card.title}</h3>
                <p className="text-zinc-400 mt-2 text-sm">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-black py-20">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-10 items-start">
          <div>
            <p className="tracking-widest uppercase text-xs text-zinc-400">Contact</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-zinc-100">We’re here to help</h2>
            <p className="mt-3 text-zinc-400">Curious about notes, longevity, or shipping? Send us a note and we’ll respond within 24 hours.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert('Thanks for reaching out — we will reply to your email shortly.'); }} className="rounded-2xl bg-zinc-900/40 ring-1 ring-white/10 p-6 w-full">
            <div className="grid grid-cols-1 gap-4">
              <input required placeholder="Your name" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100" />
              <input required type="email" placeholder="you@example.com" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100" />
              <textarea required placeholder="How can we help?" rows={5} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100" />
            </div>
            <button className="mt-4 px-4 py-2 rounded-lg bg-zinc-100 text-black hover:bg-white transition" type="submit">Send message</button>
          </form>
        </div>
      </section>

      <footer className="bg-zinc-950 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} Maison Vera. All rights reserved.</p>
          <div className="flex items-center gap-5 text-zinc-400 text-sm">
            <a href="#about" className="hover:text-zinc-200">About</a>
            <a href="#warranty" className="hover:text-zinc-200">Craft & Shipping</a>
            <a href="#contact" className="hover:text-zinc-200">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}

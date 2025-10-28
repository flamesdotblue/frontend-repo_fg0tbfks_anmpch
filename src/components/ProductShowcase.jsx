import React, { useMemo, useState } from 'react';

const MODELS = [
  {
    id: 'mv01',
    name: 'Vera One',
    subtitle: '40mm • Automatic • 200m',
    price: 1290,
    finish: 'Brushed Steel / Obsidian Black',
    description:
      'Our signature daily timepiece. A balanced 40mm case, Swiss‑inspired automatic movement, and a deep sunburst dial under sapphire crystal.',
    specs: ['40mm case', 'Sapphire crystal', '200m water resistance', 'Automatic movement', 'Stainless bracelet'],
  },
  {
    id: 'mv02',
    name: 'Vera Eclipse',
    subtitle: '38mm • Hand‑Wound • 50m',
    price: 1490,
    finish: 'Polished Steel / Midnight Blue',
    description:
      'For purists who savor the ritual. A slim hand‑wound caliber in a refined 38mm case, complemented by a deep midnight dial.',
    specs: ['38mm case', 'Box sapphire', '50m water resistance', 'Hand‑wound movement', 'Leather strap'],
  },
  {
    id: 'mv03',
    name: 'Vera Expedition',
    subtitle: '41mm • Automatic GMT • 100m',
    price: 1790,
    finish: 'Bead‑Blasted / Charcoal',
    description:
      'Engineered for journeys. A true traveler’s GMT with independent hour hand, legible indices, and toolish bead‑blasted case.',
    specs: ['41mm case', 'AR sapphire', '100m water resistance', 'Automatic GMT', 'Hybrid rubber strap'],
  },
];

function Currency({ amount }) {
  return <span>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)}</span>;
}

function ModelCard({ model, onPreorder }) {
  return (
    <div className="group rounded-2xl bg-zinc-900/40 ring-1 ring-white/10 p-6 hover:ring-white/20 transition">
      <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-zinc-800 to-black overflow-hidden relative">
        {/* Procedural dial preview */}
        <div className="absolute inset-0" aria-hidden>
          <div className="absolute inset-0 opacity-60" style={{
            background: 'radial-gradient(120% 120% at 50% 10%, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 40%), radial-gradient(90% 90% at 50% 60%, rgba(120,120,140,0.25) 0%, rgba(0,0,0,0) 60%)'
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-40 w-40 md:h-48 md:w-48 rounded-full" style={{
              background: 'radial-gradient(circle at 40% 40%, #2a2d34 0%, #0f1116 60%, #07080b 100%)',
              boxShadow: 'inset 0 0 20px rgba(255,255,255,0.08), 0 30px 60px rgba(0,0,0,0.5)'
            }} />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <h3 className="text-zinc-100 text-xl font-medium">{model.name}</h3>
          <div className="text-zinc-300"><Currency amount={model.price} /></div>
        </div>
        <p className="text-zinc-400 text-sm mt-1">{model.subtitle}</p>
        <p className="text-zinc-400 text-sm mt-2">{model.finish}</p>
        <p className="text-zinc-300 text-sm mt-3">{model.description}</p>
        <ul className="mt-3 text-zinc-400 text-sm list-disc pl-5 space-y-1">
          {model.specs.map((s) => (<li key={s}>{s}</li>))}
        </ul>
        <div className="mt-4 flex gap-2">
          <a href={`#product-${model.id}`} className="px-4 py-2 rounded-full border border-zinc-600 text-zinc-100 hover:border-zinc-400 transition">View details</a>
          <button onClick={() => onPreorder(model)} className="px-4 py-2 rounded-full bg-zinc-100 text-black hover:bg-white transition">Pre‑order</button>
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ model, onClose }) {
  const specPairs = useMemo(() => model.specs.map((s, i) => ({ k: s.split(' ')[0], v: s })), [model]);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-3xl w-full rounded-2xl bg-zinc-900 ring-1 ring-white/10 overflow-hidden" onClick={(e) => e.stopPropagation()} id={`product-${model.id}`}>
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-zinc-800 to-black p-6">
            <div className="aspect-square rounded-xl bg-black/30 ring-1 ring-white/10" />
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl text-zinc-100 font-medium">{model.name}</h3>
                <p className="text-zinc-400 mt-1">{model.subtitle}</p>
              </div>
              <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">Close</button>
            </div>
            <p className="text-zinc-300 mt-4">{model.description}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specPairs.map((p) => (
                <div key={p.v} className="rounded-lg bg-zinc-800/60 ring-1 ring-white/10 p-3">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">Spec</p>
                  <p className="text-zinc-200">{p.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <a href="#shop" className="px-4 py-2 rounded-full bg-zinc-100 text-black hover:bg-white transition">Pre‑order</a>
              <a href="#contact" className="px-4 py-2 rounded-full border border-zinc-600 text-zinc-100 hover:border-zinc-400 transition">Ask a question</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductShowcase() {
  const [selected, setSelected] = useState(null);
  const [preorder, setPreorder] = useState(null);

  const handlePreorder = (m) => {
    setPreorder(m);
    const el = document.getElementById('preorder');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="models" className="bg-black py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="tracking-widest uppercase text-xs text-zinc-400">Collection</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-zinc-100">The Maison Vera Lineup</h2>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODELS.map((m) => (
            <ModelCard key={m.id} model={m} onPreorder={(mm) => handlePreorder(mm)} />
          ))}
        </div>
        {selected && (
          <ProductDetail model={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </section>
  );
}

export { MODELS };

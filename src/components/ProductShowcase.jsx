import React, { useMemo, useState } from 'react';

const MODELS = [
  {
    id: 'mv01',
    name: 'Édition Noire',
    subtitle: 'Extrait de Parfum • 50ml',
    price: 240,
    finish: 'Black currant, smoked cedar, ambrette',
    description:
      'Shadowy and restrained. A velvet opening of black currant moves into cool florals and a hush of smoked cedar. Intimate sillage, lingering depth.',
    specs: ['Extrait concentration', '50ml refillable flacon', 'Cold-filtered, 8-week maceration', 'Vegan, IFRA compliant'],
  },
  {
    id: 'mv02',
    name: 'Lumière Irisée',
    subtitle: 'Eau de Parfum • 50ml',
    price: 220,
    finish: 'Iris pallida, pear skin, cashmere musk',
    description:
      'A soft prism of light. The powdery elegance of iris meets dewy pear and a tender cashmere trail. Clean, luminous, undeniably modern.',
    specs: ['Eau de Parfum', '50ml refillable flacon', 'Iris butter from Tuscany', 'No artificial colors'],
  },
  {
    id: 'mv03',
    name: 'Cuir Serein',
    subtitle: 'Parfum • 50ml',
    price: 260,
    finish: 'Suede leather, tea, palo santo',
    description:
      'Weightless leather. A calm blend of suede and pale woods, lifted by tea leaves and palo santo smoke. Serene, enveloping, genderless.',
    specs: ['Parfum strength', '50ml refillable flacon', 'Responsible sandalwood', 'Hand-bottled in small batches'],
  },
];

function Currency({ amount }) {
  return <span>{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)}</span>;
}

function ModelCard({ model, onSelect, onPreorder }) {
  return (
    <div className="group rounded-2xl bg-zinc-900/40 ring-1 ring-white/10 p-6 hover:ring-white/20 transition">
      <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-gradient-to-br from-[#1a151f] to-black">
        {/* Minimal bottle silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-90" aria-hidden>
          <div className="h-44 w-32 md:h-56 md:w-40 rounded-xl" style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
            boxShadow: 'inset 0 0 30px rgba(255,255,255,0.08), 0 30px 60px rgba(0,0,0,0.45)'
          }} />
          <div className="absolute -inset-10 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(200,160,255,0.18),rgba(0,0,0,0)_50%)]" />
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
          <button onClick={() => onSelect(model)} className="px-4 py-2 rounded-full border border-zinc-600 text-zinc-100 hover:border-zinc-400 transition">Notes & details</button>
          <button onClick={() => onPreorder(model)} className="px-4 py-2 rounded-full bg-zinc-100 text-black hover:bg-white transition">Join waitlist</button>
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ model, onClose }) {
  const specPairs = useMemo(() => model.specs.map((s) => ({ k: s.split(' ')[0], v: s })), [model]);
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-3xl w-full rounded-2xl bg-zinc-900 ring-1 ring-white/10 overflow-hidden" onClick={(e) => e.stopPropagation()} id={`product-${model.id}`}>
        <div className="grid md:grid-cols-2">
          <div className="bg-gradient-to-br from-zinc-800 to-black p-6">
            <div className="aspect-square rounded-xl bg-[radial-gradient(90%_90%_at_50%_30%,rgba(200,160,255,0.18),rgba(0,0,0,0)_60%)] ring-1 ring-white/10 flex items-center justify-center">
              <div className="h-48 w-36 rounded-xl" style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))',
                boxShadow: 'inset 0 0 30px rgba(255,255,255,0.08), 0 30px 60px rgba(0,0,0,0.45)'
              }} />
            </div>
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
              <a href="#shop" className="px-4 py-2 rounded-full bg-zinc-100 text-black hover:bg-white transition">Join waitlist</a>
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

  const handlePreorder = (m) => {
    const el = document.getElementById('preorder');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="models" className="bg-black py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="tracking-widest uppercase text-xs text-zinc-400">Collection</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-zinc-100">Eaux that whisper</h2>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODELS.map((m) => (
            <ModelCard key={m.id} model={m} onSelect={(mm) => setSelected(mm)} onPreorder={(mm) => handlePreorder(mm)} />
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

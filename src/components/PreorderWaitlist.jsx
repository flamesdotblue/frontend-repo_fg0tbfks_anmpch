import React, { useEffect, useMemo, useState } from 'react';
import { MODELS } from './ProductShowcase';

export default function PreorderWaitlist() {
  const [modelId, setModelId] = useState(MODELS[0]?.id ?? 'mv01');
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(null);
  const [address, setAddress] = useState('');

  const model = useMemo(() => MODELS.find((m) => m.id === modelId) ?? MODELS[0], [modelId]);
  const total = useMemo(() => (model?.price ?? 0) * qty, [model, qty]);

  useEffect(() => {
    // Preselect from anchor deep link like #preorder?model=mv02
    try {
      const url = new URL(window.location.href);
      const m = url.hash.split('?')[1];
      if (m) {
        const params = new URLSearchParams(m);
        const mid = params.get('model');
        if (mid && MODELS.some((x) => x.id === mid)) setModelId(mid);
      }
    } catch {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Google Analytics event if available
    try {
      window.gtag && window.gtag('event', 'preorder_submit', { model: modelId, qty });
    } catch {}

    const mailchimpURL = import.meta.env.VITE_MAILCHIMP_URL; // Expect full form POST URL

    if (mailchimpURL) {
      // Create a hidden form submission (Mailchimp embedded form style) using a temporary form
      const form = document.createElement('form');
      form.action = mailchimpURL;
      form.method = 'POST';
      form.target = 'hidden_iframe_mc';

      const fields = {
        EMAIL: email,
        FNAME: name,
        MMERGE6: model?.name ?? '', // Custom field example for model
        MMERGE7: String(qty),
        MMERGE8: address,
      };
      Object.entries(fields).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = v;
        form.appendChild(input);
      });
      const iframe = document.createElement('iframe');
      iframe.name = 'hidden_iframe_mc';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      form.submit();
      setStatus('success');
      setEmail('');
      setName('');
      setAddress('');
      setQty(1);
      setTimeout(() => {
        document.body.removeChild(form);
        document.body.removeChild(iframe);
      }, 1000);
      return;
    }

    // Fallback: store locally to export
    const entry = {
      id: crypto.randomUUID(),
      modelId,
      qty,
      email,
      name,
      address,
      createdAt: new Date().toISOString(),
    };
    const prev = JSON.parse(localStorage.getItem('mv_preorders') || '[]');
    prev.push(entry);
    localStorage.setItem('mv_preorders', JSON.stringify(prev));
    setStatus('success-local');
    setEmail('');
    setName('');
    setAddress('');
    setQty(1);
  };

  const exportLocal = () => {
    const data = localStorage.getItem('mv_preorders') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MaisonVera_Preorders.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="shop" className="bg-zinc-950 py-20">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <p className="tracking-widest uppercase text-xs text-zinc-400">Shop / Pre‑Order</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-zinc-100">Reserve your Maison Vera</h2>
          <p className="mt-3 text-zinc-400">A small refundable deposit secures your build slot. You will be notified via email with your delivery window and checkout invitation when your watch is ready.</p>

          <div className="mt-6 rounded-2xl bg-zinc-900/40 ring-1 ring-white/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-300 font-medium">{model?.name}</p>
                <p className="text-zinc-400 text-sm">{model?.subtitle}</p>
              </div>
              <p className="text-zinc-200">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(model?.price ?? 0)}</p>
            </div>
            <div className="mt-4 flex gap-3">
              <select value={modelId} onChange={(e) => setModelId(e.target.value)} className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100">
                {MODELS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <input type="number" min={1} max={5} value={qty} onChange={(e) => setQty(clamp(Number(e.target.value), 1, 5))} className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 w-24" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-zinc-400 text-sm">Estimated total</p>
              <p className="text-zinc-100 text-lg">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(total)}</p>
            </div>
          </div>
        </div>
        <form id="preorder" onSubmit={handleSubmit} className="rounded-2xl bg-zinc-900/40 ring-1 ring-white/10 p-6">
          <h3 className="text-zinc-100 text-xl font-medium">Checkout Details</h3>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Doe" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Shipping address (city, country)</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, Country" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100" />
            </div>
          </div>
          <button type="submit" className="mt-4 w-full px-4 py-2 rounded-lg bg-zinc-100 text-black hover:bg-white transition">Place pre‑order</button>
          {status === 'success' && (
            <p className="mt-3 text-emerald-400 text-sm">Pre‑order received. Check your inbox for a confirmation email.</p>
          )}
          {status === 'success-local' && (
            <div className="mt-3 text-zinc-300 text-sm">
              <p>Pre‑order captured locally. Set VITE_MAILCHIMP_URL to send submissions to your Mailchimp audience.</p>
              <button type="button" onClick={exportLocal} className="mt-2 px-3 py-1.5 rounded-md border border-zinc-600 text-zinc-100 hover:border-zinc-400">Export JSON</button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

import React, { useEffect, useRef, useState } from 'react';

// Procedural "realistic" watch rendered on canvas with interactive tilt
// - Radial brushed dial, metallic bezel, markers, date window
// - Smooth second hand sweep, hour/minute hands, glass specular highlights
// - Mouse/touch tilt parallax and light movement
// - Export PNG button for asset download

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function drawDial(ctx, w, h, tiltX, tiltY, time) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.42;

  ctx.clearRect(0, 0, w, h);
  ctx.save();

  // Background - soft velvet gradient
  const bgGrad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 2);
  bgGrad.addColorStop(0, '#0b0b0f');
  bgGrad.addColorStop(1, '#000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Watch shadow ellipse
  ctx.save();
  ctx.translate(0, radius * 0.35);
  const shadowGrad = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius * 1.2);
  shadowGrad.addColorStop(0, 'rgba(0,0,0,0.55)');
  shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = shadowGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy + radius * 0.85, radius * 1.1, radius * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tilt group
  ctx.translate(cx, cy);
  ctx.rotate((tiltX * -1 + tiltY) * 0.02);

  // Case outer ring (brushed steel)
  const caseGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
  caseGrad.addColorStop(0, '#c9cbd1');
  caseGrad.addColorStop(0.5, '#9ea3ad');
  caseGrad.addColorStop(1, '#e3e5ea');
  ctx.fillStyle = caseGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.08, 0, Math.PI * 2);
  ctx.fill();

  // Bezel rim
  const bezelGrad = ctx.createRadialGradient(0, 0, radius * 0.9, 0, 0, radius * 1.06);
  bezelGrad.addColorStop(0, '#777b86');
  bezelGrad.addColorStop(1, '#2b2e36');
  ctx.fillStyle = bezelGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.02, 0, Math.PI * 2);
  ctx.fill();

  // Dial base (brushed sunburst)
  const dialGrad = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, radius * 0.1, 0, 0, radius);
  dialGrad.addColorStop(0, '#1a1d22');
  dialGrad.addColorStop(1, '#0f1116');
  ctx.fillStyle = dialGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.95, 0, Math.PI * 2);
  ctx.fill();

  // Minute track
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = radius * 0.008;
  for (let i = 0; i < 60; i++) {
    const ang = (i / 60) * Math.PI * 2;
    const inner = i % 5 === 0 ? radius * 0.82 : radius * 0.88;
    const outer = radius * 0.92;
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang) * inner, Math.sin(ang) * inner);
    ctx.lineTo(Math.cos(ang) * outer, Math.sin(ang) * outer);
    ctx.stroke();
  }

  // Hour markers (applied indices)
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const r1 = radius * 0.70;
    const r2 = radius * 0.80;
    ctx.save();
    ctx.rotate(ang);
    const markerGrad = ctx.createLinearGradient(r1, 0, r2, 0);
    markerGrad.addColorStop(0, '#e7e9ee');
    markerGrad.addColorStop(1, '#8f95a1');
    ctx.strokeStyle = markerGrad;
    ctx.lineCap = 'round';
    ctx.lineWidth = radius * 0.04;
    ctx.beginPath();
    ctx.moveTo(r1, 0);
    ctx.lineTo(r2, 0);
    ctx.stroke();
    ctx.restore();
  }

  // Date window at 3 o'clock
  ctx.save();
  ctx.rotate(Math.PI / 2);
  const dateW = radius * 0.22;
  const dateH = radius * 0.14;
  ctx.fillStyle = '#e9ebf2';
  ctx.strokeStyle = '#b8bcc7';
  ctx.lineWidth = radius * 0.01;
  ctx.beginPath();
  ctx.roundRect(radius * 0.42 - dateW / 2, -dateH / 2, dateW, dateH, radius * 0.03);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#1a1d22';
  ctx.font = `${radius * 0.12}px "Inter", system-ui, -apple-system`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const date = new Date(time).getDate().toString().padStart(2, '0');
  ctx.fillText(date, radius * 0.42, 0);
  ctx.restore();

  // Brand text
  ctx.fillStyle = '#e7e9ee';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${radius * 0.14}px "Mona Sans", "Inter", system-ui`;
  ctx.fillText('Maison Vera', 0, -radius * 0.35);
  ctx.font = `${radius * 0.07}px "Inter", system-ui`;
  ctx.fillStyle = 'rgba(231,233,238,0.85)';
  ctx.fillText('Automatic • 200m', 0, -radius * 0.22);

  // Hands
  const now = new Date(time);
  const sec = now.getSeconds() + now.getMilliseconds() / 1000;
  const min = now.getMinutes() + sec / 60;
  const hr = (now.getHours() % 12) + min / 60;

  // Hour hand
  ctx.save();
  ctx.rotate((hr / 12) * Math.PI * 2);
  ctx.strokeStyle = '#e7e9ee';
  ctx.lineWidth = radius * 0.04;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-radius * 0.08, 0);
  ctx.lineTo(radius * 0.45, 0);
  ctx.stroke();
  ctx.restore();

  // Minute hand
  ctx.save();
  ctx.rotate((min / 60) * Math.PI * 2);
  ctx.strokeStyle = '#e7e9ee';
  ctx.lineWidth = radius * 0.03;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-radius * 0.1, 0);
  ctx.lineTo(radius * 0.65, 0);
  ctx.stroke();
  ctx.restore();

  // Second hand (sweep)
  ctx.save();
  ctx.rotate((sec / 60) * Math.PI * 2);
  ctx.strokeStyle = '#c22b2b';
  ctx.lineWidth = radius * 0.01;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.2, 0);
  ctx.lineTo(radius * 0.8, 0);
  ctx.stroke();
  ctx.fillStyle = '#c22b2b';
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Crystal specular highlight
  const lx = clamp(tiltX, -1, 1) * radius * 0.3;
  const ly = clamp(tiltY, -1, 1) * radius * 0.3;
  const glassGrad = ctx.createRadialGradient(lx, ly, radius * 0.05, lx, ly, radius * 0.9);
  glassGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
  glassGrad.addColorStop(0.5, 'rgba(255,255,255,0.06)');
  glassGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.98, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export default function Hero3D() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let raf;
    let tiltX = 0;
    let tiltY = 0;

    const resize = () => {
      const rect = containerRef.current.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height) * 0.9;
      canvas.width = Math.max(600, Math.floor(size));
      canvas.height = Math.max(600, Math.floor(size));
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      tiltX = (x - 0.5) * 2; // -1..1
      tiltY = (y - 0.5) * 2;
    };

    const onLeave = () => { tiltX = 0; tiltY = 0; };

    const loop = () => {
      drawDial(ctx, canvas.width, canvas.height, tiltX, tiltY, Date.now());
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onLeave);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const handleExport = () => {
    const canvas = canvasRef.current;
    setExporting(true);
    // Small delay to ensure latest frame
    requestAnimationFrame(() => {
      const link = document.createElement('a');
      link.download = `MaisonVera_Watch_${new Date().toISOString().slice(0,10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setTimeout(() => setExporting(false), 600);
    });
  };

  return (
    <section ref={containerRef} className="relative min-h-[80vh] w-full overflow-hidden bg-gradient-to-b from-[#0b0b0f] via-[#0a0a0c] to-black flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-[60rem] w-[60rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,134,255,0.12),transparent_60%)] blur-3xl" />
      </div>
      <div className="z-10 mx-auto max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="text-left">
          <p className="tracking-widest uppercase text-xs text-zinc-400">Maison Vera</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-semibold text-zinc-100 leading-tight">Time, Crafted to Perfection.</h1>
          <p className="mt-4 text-zinc-400 max-w-xl">A celebration of precision and poise. Experience Swiss-inspired engineering, minimalist aesthetics, and materials that endure a lifetime.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#shop" className="inline-flex items-center rounded-full bg-zinc-100 text-black px-5 py-2.5 font-medium hover:bg-white transition">Shop / Pre‑Order</a>
            <a href="#about" className="inline-flex items-center rounded-full border border-zinc-600 text-zinc-100 px-5 py-2.5 font-medium hover:border-zinc-400 transition">About Maison Vera</a>
            <button onClick={handleExport} className="inline-flex items-center rounded-full border border-zinc-600 text-zinc-100 px-5 py-2.5 font-medium hover:border-zinc-400 transition disabled:opacity-60" disabled={exporting}>{exporting ? 'Exporting…' : 'Export Hero PNG'}</button>
          </div>
        </div>
        <div className="relative aspect-square">
          <canvas ref={canvasRef} className="w-full h-full rounded-[2rem] shadow-2xl ring-1 ring-white/10 bg-black/40" />
        </div>
      </div>
    </section>
  );
}

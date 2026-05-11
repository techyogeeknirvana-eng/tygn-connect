'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

type Node = { id: string; x: number; y: number; label: string; size: number };

const nodes: Node[] = [
  { id: 'blr', x: 0.32, y: 0.72, label: 'Bangalore',  size: 14 },
  { id: 'hyd', x: 0.36, y: 0.62, label: 'Hyderabad',  size: 11 },
  { id: 'mum', x: 0.22, y: 0.55, label: 'Mumbai',     size: 12 },
  { id: 'pun', x: 0.26, y: 0.58, label: 'Pune',       size: 10 },
  { id: 'del', x: 0.38, y: 0.28, label: 'Delhi NCR',  size: 13 },
  { id: 'kol', x: 0.62, y: 0.40, label: 'Kolkata',    size: 9  },
  { id: 'che', x: 0.42, y: 0.80, label: 'Chennai',    size: 10 },
  { id: 'jpr', x: 0.30, y: 0.36, label: 'Jaipur',     size: 7  },
  { id: 'ahm', x: 0.20, y: 0.45, label: 'Ahmedabad',  size: 8  },
  { id: 'koc', x: 0.34, y: 0.88, label: 'Kochi',      size: 7  },
  { id: 'gwh', x: 0.74, y: 0.32, label: 'Guwahati',   size: 6  },
  { id: 'cdg', x: 0.34, y: 0.20, label: 'Chandigarh', size: 7  },
];

const links: [string, string][] = [
  ['blr', 'hyd'], ['blr', 'che'], ['blr', 'mum'], ['hyd', 'pun'],
  ['mum', 'pun'], ['mum', 'ahm'], ['del', 'jpr'], ['del', 'cdg'],
  ['del', 'kol'], ['kol', 'gwh'], ['blr', 'koc'], ['hyd', 'del'],
];

export default function InnovationMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Pulse animations along edges
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * devicePixelRatio;
      canvas.height = r.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
    let t = 0;
    const draw = () => {
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, w, h);
      t += 0.008;
      links.forEach(([a, b], i) => {
        const A = nodeMap[a]; const B = nodeMap[b];
        const ax = A.x * w, ay = A.y * h, bx = B.x * w, by = B.y * h;
        ctx.strokeStyle = 'hsla(187,92%,53%,0.18)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
        const p = (t + i * 0.13) % 1;
        const px = ax + (bx - ax) * p;
        const py = ay + (by - ay) * p;
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grd.addColorStop(0, 'hsla(50,98%,54%,0.9)');
        grd.addColorStop(1, 'hsla(50,98%,54%,0)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="relative z-10 px-6 py-28 cyber-noise">
      <div className="absolute inset-0 cyber-grid-bg opacity-25 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-3.5 h-3.5 text-cyan-300" />
            <span className="term-text text-[11px] tracking-[0.3em] text-cyan-300/90">// INNOVATION_MESH.IND</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            <span className="holo-text">The Network is alive.</span>
          </h2>
          <p className="mt-3 text-white/55 max-w-2xl">
            Real-time map of TYGN nodes across India. Every dot is a college, every pulse is a builder shipping.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="holo-card relative overflow-hidden h-[520px]"
        >
          <span className="cyber-corner tl" /><span className="cyber-corner tr" />
          <span className="cyber-corner bl" /><span className="cyber-corner br" />
          <div className="absolute inset-0 cyber-grid-bg-strong opacity-30" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {nodes.map((n) => (
            <div
              key={n.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x * 100}%`, top: `${n.y * 100}%` }}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="absolute rounded-full bg-cyan-400/20 animate-ping"
                  style={{ width: n.size * 2, height: n.size * 2 }}
                />
                <span
                  className="rounded-full bg-cyan-300 shadow-[0_0_18px_hsl(187_92%_53%/0.9)]"
                  style={{ width: n.size, height: n.size }}
                />
                <span className="absolute top-full mt-1.5 term-text text-[10px] tracking-widest text-cyan-100/80 whitespace-nowrap">
                  {n.label}
                </span>
              </div>
            </div>
          ))}

          {/* Stats overlay */}
          <div className="absolute top-6 right-6 holo-card p-4 w-56 z-10">
            <div className="term-text text-[10px] tracking-[0.25em] text-white/40 mb-2">// MESH STATUS</div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-white/60">Nodes online</span>
              <span className="term-text text-cyan-300">{nodes.length} / 12</span>
            </div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-white/60">Active links</span>
              <span className="term-text text-yellow-300">{links.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Latency</span>
              <span className="term-text text-emerald-400">12ms</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

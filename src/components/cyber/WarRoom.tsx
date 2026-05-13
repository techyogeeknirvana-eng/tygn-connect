'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, GitCommit, Zap, TrendingUp, Wifi } from 'lucide-react';

function useTicker(initial: number, min: number, max: number) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setV(p => {
        const n = p + (Math.random() - 0.5) * (max - min) * 0.08;
        return Math.max(min, Math.min(max, n));
      });
    }, 900);
    return () => clearInterval(id);
  }, [min, max]);
  return v;
}

function Sparkline({ color = '#22D3EE' }: { color?: string }) {
  const [points, setPoints] = useState<number[]>(() =>
    Array.from({ length: 24 }, () => 20 + Math.random() * 60),
  );
  useEffect(() => {
    const id = setInterval(() => {
      setPoints(p => [...p.slice(1), 20 + Math.random() * 60]);
    }, 700);
    return () => clearInterval(id);
  }, []);
  const w = 200, h = 50;
  const step = w / (points.length - 1);
  const d = points.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * step},${h - y * (h / 100)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#g-${color})`} />
      <path d={d} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export default function WarRoom() {
  const cpu = useTicker(62, 30, 95);
  const net = useTicker(74, 40, 99);
  const ops = useTicker(48, 20, 80);

  const alerts = [
    { t: '02:14', sev: 'INFO',  msg: 'New operator onboarded · @kavya.dev', color: 'text-cyan-300' },
    { t: '02:11', sev: 'OPS',   msg: 'Mission AEGIS deployed to staging',   color: 'text-yellow-300' },
    { t: '02:07', sev: 'WARN',  msg: 'Rate-limit spike on /api/match',      color: 'text-orange-300' },
    { t: '02:03', sev: 'INTEL', msg: 'New hackathon signal · ETHGlobal',    color: 'text-fuchsia-300' },
    { t: '01:58', sev: 'INFO',  msg: 'AI Core v2.4.1 hot-reloaded',         color: 'text-cyan-300' },
  ];

  const commits = [
    { who: 'aarav',  msg: 'feat: realtime presence channel', branch: 'main' },
    { who: 'diya',   msg: 'fix: embedding cache invalidation', branch: 'ml/cache' },
    { who: 'rohan',  msg: 'chore: rotate JWT signing key',   branch: 'sec/keys' },
    { who: 'isha',   msg: 'ui: holo card corner brackets',   branch: 'design' },
  ];

  return (
    <section className="relative z-10 px-6 py-24 cyber-noise">
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="term-text text-[11px] tracking-[0.3em] text-yellow-300/80 mb-3">// SECTION 09 · DIGITAL WAR ROOM</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            <span className="holo-text">All systems. One pane.</span>
          </h2>
          <p className="mt-3 text-white/55 max-w-xl mx-auto">
            Network telemetry, mission alerts, commit stream and threat signals — streaming in real time.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-5">
          {/* TELEMETRY */}
          {[
            { label: 'CPU LOAD',     value: cpu, Icon: Activity,   color: '#22D3EE', unit: '%' },
            { label: 'NETWORK I/O',  value: net, Icon: Wifi,       color: '#FACC15', unit: '%' },
            { label: 'OPS / SEC',    value: ops, Icon: TrendingUp, color: '#E879F9', unit: '' },
          ].map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className="holo-card p-5 col-span-12 sm:col-span-6 lg:col-span-4 relative"
            >
              <div className="flex items-center justify-between">
                <div className="term-text text-[10px] tracking-[0.25em] text-white/50">{m.label}</div>
                <m.Icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
              <div className="font-display text-3xl font-bold mt-1" style={{ color: m.color }}>
                {m.value.toFixed(0)}{m.unit}
              </div>
              <Sparkline color={m.color} />
            </motion.div>
          ))}

          {/* ALERTS */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="holo-card p-5 col-span-12 lg:col-span-7 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-300" />
                <div className="term-text text-[11px] tracking-[0.25em] text-white/70">EVENT STREAM</div>
              </div>
              <span className="term-text text-[10px] text-emerald-400/80">● LIVE</span>
            </div>
            <ul className="space-y-2">
              {alerts.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-sm border-b border-white/5 pb-2 last:border-0">
                  <span className="term-text text-[10px] text-white/40 w-12 mt-0.5">{a.t}</span>
                  <span className={`term-text text-[10px] tracking-[0.2em] ${a.color} w-14`}>{a.sev}</span>
                  <span className="text-white/75 flex-1">{a.msg}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* COMMITS */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="holo-card p-5 col-span-12 lg:col-span-5 relative"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-cyan-300" />
                <div className="term-text text-[11px] tracking-[0.25em] text-white/70">COMMIT FEED</div>
              </div>
              <Zap className="w-4 h-4 text-yellow-300" />
            </div>
            <ul className="space-y-3">
              {commits.map((c, i) => (
                <li key={i} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    <span className="term-text text-[11px] text-cyan-300">{c.who}</span>
                    <span className="text-white/40 text-xs">→ {c.branch}</span>
                  </div>
                  <div className="text-white/70 text-xs ml-4 mt-0.5">{c.msg}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

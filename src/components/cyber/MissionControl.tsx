'use client';

import { motion } from 'framer-motion';
import {
  Activity, Cpu, Radar, Network, Database, ShieldAlert,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const modules = [
  { Icon: Activity,    label: 'NEURAL UPLINK',   metric: '98.4%',  sub: 'sync stable',     color: 'cyan',    pulse: 92 },
  { Icon: Cpu,         label: 'AI CORE',         metric: 'GPT-5',  sub: '12 agents online', color: 'magenta', pulse: 78 },
  { Icon: Radar,       label: 'OPP RADAR',       metric: '47',     sub: 'signals tracked',  color: 'yellow',  pulse: 64 },
  { Icon: Network,     label: 'MESH NETWORK',    metric: '1.2K',   sub: 'operators live',   color: 'cyan',    pulse: 86 },
  { Icon: Database,    label: 'KNOWLEDGE VAULT', metric: '8.4TB',  sub: 'indexed',          color: 'magenta', pulse: 71 },
  { Icon: ShieldAlert, label: 'THREAT GRID',     metric: 'GREEN',  sub: 'no anomalies',     color: 'yellow',  pulse: 55 },
];

const colorMap: Record<string, { text: string; bar: string; glow: string; ring: string }> = {
  cyan:    { text: 'text-cyan-300',    bar: 'bg-cyan-400',    glow: 'shadow-[0_0_20px_hsl(187_92%_53%/0.5)]', ring: 'border-cyan-400/40' },
  magenta: { text: 'text-fuchsia-300', bar: 'bg-fuchsia-400', glow: 'shadow-[0_0_20px_hsl(292_84%_61%/0.5)]', ring: 'border-fuchsia-400/40' },
  yellow:  { text: 'text-yellow-300',  bar: 'bg-yellow-400',  glow: 'shadow-[0_0_20px_hsl(50_98%_54%/0.5)]',  ring: 'border-yellow-400/40' },
};

function LiveBar({ value, color }: { value: number; color: string }) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setInterval(() => setV((p) => Math.max(20, Math.min(99, p + (Math.random() * 12 - 6)))), 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div
        animate={{ width: `${v}%` }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        className={`h-full ${colorMap[color].bar} ${colorMap[color].glow}`}
      />
    </div>
  );
}

export default function MissionControl() {
  return (
    <section className="relative z-10 px-6 py-28 cyber-noise">
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="term-text text-[11px] tracking-[0.3em] text-emerald-300/90">// MISSION_CONTROL.SYS</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            <span className="holo-text">AI Mission Control.</span>
          </h2>
          <p className="mt-3 text-white/55 max-w-2xl">
            Six holographic modules. Live telemetry from the TYGN ecosystem — streaming directly from the mesh.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m, i) => {
            const c = colorMap[m.color];
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="holo-card p-6 relative overflow-hidden"
              >
                <span className="cyber-corner tl" /><span className="cyber-corner tr" />
                <span className="cyber-corner bl" /><span className="cyber-corner br" />

                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center border ${c.ring} bg-white/[0.02]`}>
                    <m.Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <span className={`term-text text-[10px] tracking-[0.2em] ${c.text}`}>● LIVE</span>
                </div>

                <div className="term-text text-[10px] tracking-[0.25em] text-white/40 mb-1">{m.label}</div>
                <div className={`font-display text-3xl font-bold ${c.text} mb-1`}>{m.metric}</div>
                <div className="text-xs text-white/50 mb-4">{m.sub}</div>

                <LiveBar value={m.pulse} color={m.color} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

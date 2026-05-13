'use client';

import { motion } from 'framer-motion';
import { Radar, Briefcase, Trophy, GraduationCap, Rocket } from 'lucide-react';

const signals = [
  { icon: Briefcase,    label: 'SDE Intern',       org: 'Razorpay',     type: 'JOB',       dist: '0.8 km', color: 'cyan' },
  { icon: Trophy,       label: 'Smart India Hack', org: 'MoE',          type: 'HACK',      dist: '1.4 km', color: 'yellow' },
  { icon: GraduationCap,label: 'GSoC 2026',        org: 'Google',       type: 'PROGRAM',   dist: '2.1 km', color: 'magenta' },
  { icon: Rocket,       label: 'Y Combinator W26', org: 'YC',           type: 'STARTUP',   dist: '3.6 km', color: 'cyan' },
  { icon: Briefcase,    label: 'AI Research',      org: 'Sarvam AI',    type: 'JOB',       dist: '4.2 km', color: 'yellow' },
  { icon: Trophy,       label: 'ETH Global India', org: 'ETHGlobal',    type: 'HACK',      dist: '5.0 km', color: 'magenta' },
];

const colorMap: Record<string, string> = {
  cyan:    'text-cyan-300 border-cyan-300/40 bg-cyan-300/5',
  yellow:  'text-yellow-300 border-yellow-300/40 bg-yellow-300/5',
  magenta: 'text-fuchsia-300 border-fuchsia-300/40 bg-fuchsia-300/5',
};

export default function OpportunityRadar() {
  return (
    <section className="relative z-10 px-6 py-24 cyber-noise">
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="term-text text-[11px] tracking-[0.3em] text-cyan-300/80 mb-3">// SECTION 07 · OPPORTUNITY RADAR</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            <span className="holo-text">Signals incoming.</span>
          </h2>
          <p className="mt-3 text-white/55 max-w-xl mx-auto">
            A live sweep of jobs, hackathons, programs and startup launches across the network.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* RADAR */}
          <div className="lg:col-span-2">
            <div className="holo-card p-6 relative aspect-square flex items-center justify-center overflow-hidden">
              <span className="cyber-corner tl" /><span className="cyber-corner tr" />
              <span className="cyber-corner bl" /><span className="cyber-corner br" />

              {/* rings */}
              {[0.35, 0.6, 0.85].map((s, i) => (
                <div key={i}
                  className="absolute rounded-full border border-cyan-300/20"
                  style={{ width: `${s * 100}%`, height: `${s * 100}%` }} />
              ))}
              {/* crosshair */}
              <div className="absolute inset-x-6 top-1/2 h-px bg-cyan-300/15" />
              <div className="absolute inset-y-6 left-1/2 w-px bg-cyan-300/15" />

              {/* sweep */}
              <div className="absolute inset-6 rounded-full overflow-hidden">
                <div
                  className="absolute inset-0 origin-center animate-radar-sweep"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(34,211,238,0.0) 0deg, rgba(34,211,238,0.45) 60deg, rgba(34,211,238,0) 90deg)',
                  }}
                />
              </div>

              {/* center dot */}
              <div className="absolute w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />

              {/* blips */}
              {[
                { t: '20%', l: '70%', c: 'bg-yellow-300' },
                { t: '60%', l: '78%', c: 'bg-fuchsia-300' },
                { t: '72%', l: '32%', c: 'bg-cyan-300' },
                { t: '34%', l: '28%', c: 'bg-yellow-300' },
                { t: '50%', l: '60%', c: 'bg-cyan-300' },
              ].map((b, i) => (
                <span key={i}
                  className={`absolute w-2 h-2 rounded-full ${b.c} animate-pulse`}
                  style={{ top: b.t, left: b.l, boxShadow: '0 0 10px currentColor' }} />
              ))}

              <div className="absolute top-3 left-3 term-text text-[10px] tracking-[0.25em] text-cyan-300/70 flex items-center gap-2">
                <Radar className="w-3 h-3" /> SCANNING · 360°
              </div>
              <div className="absolute bottom-3 right-3 term-text text-[10px] tracking-[0.25em] text-emerald-400/80">
                ● LIVE
              </div>
            </div>
          </div>

          {/* SIGNALS */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {signals.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="holo-card p-4 relative"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-md border flex items-center justify-center ${colorMap[s.color]}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-display font-semibold text-white truncate">{s.label}</h4>
                      <span className={`term-text text-[9px] tracking-[0.2em] px-1.5 py-0.5 rounded border ${colorMap[s.color]}`}>{s.type}</span>
                    </div>
                    <div className="text-xs text-white/55">{s.org}</div>
                    <div className="mt-2 flex items-center justify-between term-text text-[10px] tracking-widest text-white/40">
                      <span>DIST {s.dist}</span>
                      <span className="text-cyan-300/80">LOCK ▸</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { Rocket, GitBranch, Star, Users, ChevronRight } from 'lucide-react';

const projects = [
  {
    codename: 'PROJECT_NEXUS',
    title: 'Decentralized Study Mesh',
    desc: 'P2P knowledge sharing with on-chain attribution for contributors.',
    stack: ['Solidity', 'IPFS', 'Next.js'],
    status: 'DEPLOYING',
    statusColor: 'text-yellow-300 border-yellow-300/40',
    crew: 4, stars: 287, branches: 12,
  },
  {
    codename: 'PROJECT_AEGIS',
    title: 'AI Threat Sentinel',
    desc: 'Real-time anomaly detection for college network infra.',
    stack: ['PyTorch', 'FastAPI', 'Kafka'],
    status: 'LIVE',
    statusColor: 'text-emerald-400 border-emerald-400/40',
    crew: 6, stars: 512, branches: 23,
  },
  {
    codename: 'PROJECT_VOID',
    title: 'Quantum-Safe Vault',
    desc: 'Post-quantum encrypted note storage for the federation.',
    stack: ['Rust', 'Tauri', 'Kyber'],
    status: 'RECRUITING',
    statusColor: 'text-fuchsia-400 border-fuchsia-400/40',
    crew: 2, stars: 94, branches: 5,
  },
  {
    codename: 'PROJECT_PULSE',
    title: 'Realtime Hackathon Ops',
    desc: 'Live judging dashboard with sub-second sync across teams.',
    stack: ['Elixir', 'Phoenix', 'React'],
    status: 'LIVE',
    statusColor: 'text-emerald-400 border-emerald-400/40',
    crew: 5, stars: 341, branches: 18,
  },
];

export default function ProjectBattlefield() {
  return (
    <section className="relative z-10 px-6 py-28">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, hsl(187 92% 53% / 0.10), transparent 60%)' }} />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <Rocket className="w-3.5 h-3.5 text-yellow-300" />
            <span className="term-text text-[11px] tracking-[0.3em] text-yellow-300/90">// PROJECT_BATTLEFIELD.OPS</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            <span className="holo-text">Live missions in flight.</span>
          </h2>
          <p className="mt-3 text-white/55 max-w-2xl">
            Real projects. Real crews. Real shipping. Pick a mission, join a squad, push to main.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.codename}
              initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="holo-card p-6 relative group cursor-pointer"
            >
              <span className="cyber-corner tl" /><span className="cyber-corner tr" />
              <span className="cyber-corner bl" /><span className="cyber-corner br" />

              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="term-text text-[10px] tracking-[0.3em] text-cyan-300/70 mb-1">{p.codename}</div>
                  <h3 className="font-display text-xl font-bold text-white">{p.title}</h3>
                </div>
                <span className={`term-text text-[9px] tracking-widest px-2 py-1 border rounded ${p.statusColor}`}>
                  ● {p.status}
                </span>
              </div>

              <p className="text-sm text-white/55 mb-5">{p.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {p.stack.map((s) => (
                  <span key={s} className="term-text text-[10px] tracking-wider px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-white/70">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4 text-xs text-white/50 term-text">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{p.crew}</span>
                  <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" />{p.stars}</span>
                  <span className="flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5" />{p.branches}</span>
                </div>
                <span className="term-text text-[10px] tracking-widest text-cyan-300 flex items-center gap-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  JOIN <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

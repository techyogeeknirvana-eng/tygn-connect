'use client';

import { motion } from 'framer-motion';
import { Sparkles, Cpu, Code2, Palette, Shield, Database } from 'lucide-react';

const operators = [
  { name: 'Aarav M.',  role: 'Full-Stack',     match: 96, skills: ['React', 'Node', 'tRPC'],     Icon: Code2,    color: 'cyan' },
  { name: 'Diya K.',   role: 'AI/ML Engineer', match: 92, skills: ['PyTorch', 'LLMs', 'CUDA'],   Icon: Cpu,      color: 'magenta' },
  { name: 'Rohan S.',  role: 'Security',       match: 89, skills: ['Pentest', 'Crypto', 'CTF'],  Icon: Shield,   color: 'yellow' },
  { name: 'Isha P.',   role: 'Product Design', match: 87, skills: ['Figma', 'Motion', 'UX'],     Icon: Palette,  color: 'cyan' },
  { name: 'Karan V.',  role: 'Data Engineer',  match: 84, skills: ['Spark', 'Kafka', 'dbt'],     Icon: Database, color: 'magenta' },
  { name: 'Meera R.',  role: 'Frontend',       match: 81, skills: ['Next', 'GSAP', 'WebGL'],     Icon: Code2,    color: 'yellow' },
];

const ringColor: Record<string, string> = {
  cyan:    'from-cyan-400 to-cyan-600',
  yellow:  'from-yellow-300 to-yellow-500',
  magenta: 'from-fuchsia-400 to-fuchsia-600',
};

export default function AINetworking() {
  return (
    <section className="relative z-10 px-6 py-24">
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="term-text text-[11px] tracking-[0.3em] text-fuchsia-300/80 mb-3">// SECTION 08 · AI NETWORKING ENGINE</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            <span className="holo-text">Find your co-founder.</span>
          </h2>
          <p className="mt-3 text-white/55 max-w-xl mx-auto">
            Our embeddings engine matches you with operators by skill, vibe, timezone and ambition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {operators.map((op, i) => (
            <motion.div
              key={op.name}
              initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="holo-card p-5 relative group"
            >
              <span className="cyber-corner tl" /><span className="cyber-corner tr" />
              <span className="cyber-corner bl" /><span className="cyber-corner br" />

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${ringColor[op.color]} p-[2px]`}>
                    <div className="w-full h-full rounded-full bg-[#0B0F1A] flex items-center justify-center">
                      <op.Icon className="w-6 h-6 text-white/85" />
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0B0F1A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-semibold text-white">{op.name}</h4>
                  <div className="text-xs text-white/55">{op.role}</div>
                </div>
                <div className="text-right">
                  <div className="term-text text-[10px] tracking-[0.2em] text-white/40">MATCH</div>
                  <div className="font-display text-2xl font-bold holo-text">{op.match}%</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {op.skills.map(s => (
                  <span key={s} className="term-text text-[10px] tracking-widest text-white/70 px-2 py-0.5 rounded border border-white/10 bg-white/5">
                    {s}
                  </span>
                ))}
              </div>

              <button className="mt-4 w-full term-text text-[11px] tracking-[0.25em] py-2 rounded border border-cyan-300/30 text-cyan-300 hover:bg-cyan-300/10 transition flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> CONNECT
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

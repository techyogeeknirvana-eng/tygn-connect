'use client';

import { motion } from 'framer-motion';
import { Code2, Database, Brain, Shield, Cloud, Sparkles } from 'lucide-react';

const skills = [
  { Icon: Code2,    name: 'Frontend',     level: 7, max: 10, xp: 7420,  color: 'cyan' },
  { Icon: Database, name: 'Backend',      level: 6, max: 10, xp: 5810,  color: 'magenta' },
  { Icon: Brain,    name: 'AI / ML',      level: 5, max: 10, xp: 4220,  color: 'yellow' },
  { Icon: Shield,   name: 'Security',     level: 4, max: 10, xp: 3104,  color: 'cyan' },
  { Icon: Cloud,    name: 'DevOps',       level: 6, max: 10, xp: 5560,  color: 'magenta' },
  { Icon: Sparkles, name: 'Design',       level: 3, max: 10, xp: 2180,  color: 'yellow' },
];

const cMap: Record<string, { text: string; bar: string; ring: string; glow: string }> = {
  cyan:    { text: 'text-cyan-300',    bar: 'from-cyan-400 to-cyan-300',       ring: 'border-cyan-400/40',    glow: 'shadow-[0_0_18px_hsl(187_92%_53%/0.5)]' },
  magenta: { text: 'text-fuchsia-300', bar: 'from-fuchsia-500 to-fuchsia-300', ring: 'border-fuchsia-400/40', glow: 'shadow-[0_0_18px_hsl(292_84%_61%/0.5)]' },
  yellow:  { text: 'text-yellow-300',  bar: 'from-yellow-400 to-yellow-300',   ring: 'border-yellow-400/40',  glow: 'shadow-[0_0_18px_hsl(50_98%_54%/0.5)]' },
};

export default function SkillEvolution() {
  const totalXP = skills.reduce((a, s) => a + s.xp, 0);
  const overall = Math.round(skills.reduce((a, s) => a + s.level, 0) / skills.length * 10) / 10;

  return (
    <section className="relative z-10 px-6 py-28 cyber-noise">
      <div className="absolute inset-0 cyber-grid-bg opacity-25 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
              <span className="term-text text-[11px] tracking-[0.3em] text-fuchsia-300/90">// SKILL_EVOLUTION.SYS</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
              <span className="holo-text">Level up. Visibly.</span>
            </h2>
            <p className="mt-3 text-white/55 max-w-2xl">
              Your skill tree. Earn XP from missions, quizzes, contributions. Unlock ranks. Get scouted.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="holo-card p-4 px-5 relative">
              <div className="term-text text-[10px] tracking-[0.25em] text-white/40">TOTAL XP</div>
              <div className="font-display text-2xl font-bold text-yellow-300">{totalXP.toLocaleString()}</div>
            </div>
            <div className="holo-card p-4 px-5 relative">
              <div className="term-text text-[10px] tracking-[0.25em] text-white/40">RANK AVG</div>
              <div className="font-display text-2xl font-bold text-cyan-300">{overall} / 10</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skills.map((s, i) => {
            const c = cMap[s.color];
            const pct = (s.level / s.max) * 100;
            return (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="holo-card p-6 relative"
              >
                <span className="cyber-corner tl" /><span className="cyber-corner tr" />
                <span className="cyber-corner bl" /><span className="cyber-corner br" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${c.ring} bg-white/[0.02]`}>
                      <s.Icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <div>
                      <div className="font-display font-bold text-white">{s.name}</div>
                      <div className="term-text text-[10px] tracking-widest text-white/40">{s.xp.toLocaleString()} XP</div>
                    </div>
                  </div>
                  <div className={`term-text text-2xl font-bold ${c.text}`}>
                    {s.level}<span className="text-sm text-white/30">/{s.max}</span>
                  </div>
                </div>

                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${c.bar} ${c.glow}`}
                  />
                </div>

                <div className="mt-3 flex justify-between term-text text-[10px] tracking-widest text-white/40">
                  <span>NOVICE</span><span>OPERATOR</span><span>ARCHITECT</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

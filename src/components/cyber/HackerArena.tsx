'use client';

import { motion } from 'framer-motion';
import { Trophy, Terminal, Zap, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

const operators = [
  { rank: 1, handle: 'n3on_phantom',   xp: 24890, rankName: 'ARCHITECT',  flags: 142, color: 'text-yellow-300' },
  { rank: 2, handle: 'vx.shadow',      xp: 22104, rankName: 'OPERATOR',   flags: 128, color: 'text-cyan-300' },
  { rank: 3, handle: '0xCipher',       xp: 19876, rankName: 'OPERATOR',   flags: 119, color: 'text-fuchsia-300' },
  { rank: 4, handle: 'ghost_proto',    xp: 18420, rankName: 'AGENT',      flags: 104, color: 'text-cyan-300' },
  { rank: 5, handle: 'binary_monk',    xp: 16332, rankName: 'AGENT',      flags:  97, color: 'text-cyan-300' },
  { rank: 6, handle: 'null_router',    xp: 14201, rankName: 'INITIATE',   flags:  82, color: 'text-white/70' },
];

const challenges = [
  { name: 'SQL_INJECT_v2',    diff: 'EASY',   pts: 100, solved: true },
  { name: 'JWT_FORGERY',      diff: 'MED',    pts: 250, solved: true },
  { name: 'BUFFER_OVERFLOW',  diff: 'HARD',   pts: 500, solved: false },
  { name: 'CRYPTO_HEIST',     diff: 'INSANE', pts: 1000, solved: false },
];

const diffColor: Record<string, string> = {
  EASY: 'text-emerald-400 border-emerald-400/40',
  MED: 'text-yellow-300 border-yellow-300/40',
  HARD: 'text-orange-400 border-orange-400/40',
  INSANE: 'text-fuchsia-400 border-fuchsia-400/40',
};

function TerminalDemo() {
  const lines = [
    '$ ssh operator@tygn.range',
    '> auth: KEY_VERIFIED',
    '> loading challenge: BUFFER_OVERFLOW',
    '> spawning sandbox... [OK]',
    '> exploit ready. good hunting.',
    '$ _',
  ];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= lines.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), 600);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div className="holo-card p-5 font-mono text-[12px] leading-relaxed h-full relative overflow-hidden">
      <span className="cyber-corner tl" /><span className="cyber-corner tr" />
      <span className="cyber-corner bl" /><span className="cyber-corner br" />
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-2 term-text text-[10px] tracking-widest text-white/40">cyber-range — zsh</span>
      </div>
      {lines.slice(0, shown).map((l, i) => (
        <div key={i} className={l.startsWith('$') ? 'text-cyan-300' : 'text-emerald-300/90'}>
          {l}
        </div>
      ))}
      {shown < lines.length && <span className="inline-block w-2 h-3.5 bg-cyan-300 animate-pulse" />}
    </div>
  );
}

export default function HackerArena() {
  return (
    <section className="relative z-10 px-6 py-28">
      <div className="absolute inset-0 cyber-grid-bg-strong opacity-20 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 80% 50%, hsl(292 84% 61% / 0.12), transparent 60%)' }} />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="term-text text-[11px] tracking-[0.3em] text-fuchsia-300/90">// CYBER_RANGE.ARENA</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
            <span className="holo-text">Hacker Arena.</span>
          </h2>
          <p className="mt-3 text-white/55 max-w-2xl">
            Capture flags. Exploit sandboxes. Climb the ranks. The leaderboard never sleeps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="lg:col-span-3 holo-card p-6 relative"
          >
            <span className="cyber-corner tl" /><span className="cyber-corner tr" />
            <span className="cyber-corner bl" /><span className="cyber-corner br" />

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span className="term-text text-[11px] tracking-[0.25em] text-white/70">LEADERBOARD // SEASON 04</span>
              </div>
              <span className="term-text text-[10px] text-emerald-400">● LIVE</span>
            </div>

            <div className="space-y-2">
              {operators.map((op, i) => (
                <motion.div
                  key={op.handle}
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-12 items-center gap-3 px-3 py-3 rounded-md border border-white/5 bg-white/[0.02] hover:border-cyan-400/30 hover:bg-cyan-400/[0.03] transition-colors"
                >
                  <span className={`col-span-1 term-text text-sm font-bold ${op.color}`}>#{op.rank}</span>
                  <span className="col-span-4 font-mono text-sm text-white">{op.handle}</span>
                  <span className="col-span-3 term-text text-[10px] tracking-widest text-white/50">{op.rankName}</span>
                  <span className="col-span-2 term-text text-xs text-cyan-300">{op.flags} flags</span>
                  <span className="col-span-2 term-text text-xs text-yellow-300 text-right">{op.xp.toLocaleString()} XP</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column: Terminal + Challenges */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <TerminalDemo />

            <div className="holo-card p-5 relative">
              <span className="cyber-corner tl" /><span className="cyber-corner tr" />
              <span className="cyber-corner bl" /><span className="cyber-corner br" />
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-cyan-300" />
                <span className="term-text text-[11px] tracking-[0.25em] text-white/70">ACTIVE CHALLENGES</span>
              </div>
              <div className="space-y-2">
                {challenges.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className={`w-3.5 h-3.5 ${c.solved ? 'text-emerald-400' : 'text-white/30'}`} />
                      <span className={`font-mono ${c.solved ? 'text-white/50 line-through' : 'text-white'}`}>{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`term-text text-[9px] tracking-widest px-1.5 py-0.5 border rounded ${diffColor[c.diff]}`}>
                        {c.diff}
                      </span>
                      <span className="term-text text-xs text-yellow-300 w-12 text-right">+{c.pts}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

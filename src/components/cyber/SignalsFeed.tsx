'use client';

import { motion } from 'framer-motion';
import { Radio, Inbox } from 'lucide-react';

export default function SignalsFeed() {
  // Real feed not yet wired. Show empty terminal-style state instead of fake data.
  return (
    <section className="relative z-10 px-6 py-24 cyber-noise">
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="term-text text-[11px] tracking-[0.3em] text-fuchsia-300/80 mb-3">// SECTION 11 · AI NEWS & SIGNALS</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            <span className="holo-text">Wire feed.</span>
          </h2>
          <p className="mt-3 text-white/55 max-w-xl mx-auto">
            Curated drops from the frontier of AI, security, web and open source — coming online soon.
          </p>
        </motion.div>

        <div className="holo-card p-6 relative font-mono text-sm">
          <span className="cyber-corner tl" /><span className="cyber-corner tr" />
          <span className="cyber-corner bl" /><span className="cyber-corner br" />

          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-fuchsia-300" />
              <span className="term-text text-[11px] tracking-[0.25em] text-white/70">SIGNAL.STREAM</span>
            </div>
            <span className="term-text text-[10px] tracking-[0.25em] text-amber-300/80">● STANDBY</span>
          </div>

          <div className="space-y-1.5 text-white/60">
            <div><span className="text-cyan-300">$</span> tygn signals --tail</div>
            <div className="text-white/40">[ok] connecting to upstream...</div>
            <div className="text-white/40">[ok] handshake complete</div>
            <div className="text-amber-300/80">[wait] no curated drops in queue</div>
            <div className="text-white/40">[info] feed activates once curators ship the first signal</div>
            <div className="flex items-center gap-2 pt-2">
              <Inbox className="w-4 h-4 text-fuchsia-300/70" />
              <span className="text-white/70">Empty inbox. The wire is quiet — for now.</span>
              <span className="w-2 h-4 bg-cyan-300 animate-terminal-blink" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

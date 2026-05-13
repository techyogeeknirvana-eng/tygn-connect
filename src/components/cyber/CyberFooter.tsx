'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function CyberFooter() {
  const [cmd, setCmd] = useState('');
  const [out, setOut] = useState<string[]>(['type `help` and hit enter']);

  const run = (raw: string) => {
    const c = raw.trim().toLowerCase();
    if (!c) return;
    let res = '';
    if (c === 'help') res = 'commands: help · about · join · contact · clear';
    else if (c === 'about') res = 'TYGN — a cyber-innovation OS for India\'s next wave of builders.';
    else if (c === 'join') res = 'navigate to /auth to initialize your operator profile.';
    else if (c === 'contact') res = 'techyogeeknirvana@gmail.com';
    else if (c === 'clear') { setOut([]); setCmd(''); return; }
    else res = `command not found: ${c}`;
    setOut(p => [...p, `$ ${raw}`, res]);
    setCmd('');
  };

  return (
    <footer className="relative z-10 px-6 pt-20 pb-10 border-t border-white/10 cyber-noise">
      <div className="absolute inset-0 cyber-grid-bg opacity-25 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-fuchsia-400 flex items-center justify-center font-display font-bold text-[#05060A]">T</div>
              <span className="font-display text-lg font-bold holo-text">TYGN</span>
            </div>
            <p className="text-sm text-white/55 max-w-xs">
              Cyber-innovation OS for B.Tech operators. Build. Ship. Level up.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Github, Twitter, Linkedin, Mail].map((I, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded border border-white/10 flex items-center justify-center text-white/60 hover:text-cyan-300 hover:border-cyan-300/40 transition">
                  <I className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="term-text text-[10px] tracking-[0.25em] text-cyan-300/70 mb-3">// MODULES</div>
              <ul className="space-y-2 text-sm">
                {[['Notes','/notes'],['Events','/events'],['Jobs','/jobs'],['Community','/community']].map(([n,h])=>(
                  <li key={n}><Link to={h} className="text-white/65 hover:text-white transition">{n}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="term-text text-[10px] tracking-[0.25em] text-fuchsia-300/70 mb-3">// LABS</div>
              <ul className="space-y-2 text-sm">
                {[['Resume Lab','/resume-checker'],['Skill Trials','/quizzes'],['Sign In','/auth']].map(([n,h])=>(
                  <li key={n}><Link to={h} className="text-white/65 hover:text-white transition">{n}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Terminal */}
          <div className="holo-card p-4 relative font-mono text-xs">
            <span className="cyber-corner tl" /><span className="cyber-corner tr" />
            <span className="cyber-corner bl" /><span className="cyber-corner br" />
            <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-300" />
              <span className="term-text text-[10px] tracking-[0.25em] text-white/60">tygn://shell</span>
            </div>
            <div className="h-28 overflow-y-auto space-y-1 text-white/65">
              {out.map((l, i) => (
                <div key={i} className={l.startsWith('$') ? 'text-cyan-300' : ''}>{l}</div>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); run(cmd); }}
              className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2"
            >
              <span className="text-cyan-300">$</span>
              <input
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                placeholder="help"
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30"
              />
              <span className="w-1.5 h-3.5 bg-cyan-300 animate-terminal-blink" />
            </form>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-6 border-t border-white/10 term-text text-[10px] tracking-[0.25em] text-white/40">
          <span>© {new Date().getFullYear()} TECHYOGEEK NIRVANA · ALL SYSTEMS NOMINAL</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            UPLINK STABLE
          </span>
        </div>
      </div>
    </footer>
  );
}

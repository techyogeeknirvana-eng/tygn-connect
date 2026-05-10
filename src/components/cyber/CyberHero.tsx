'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Terminal, Rocket, FlaskConical, ChevronRight, Activity, Wifi, Cpu, Shield } from 'lucide-react';

/* ---------- Particle / node canvas ---------- */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const N = 70;

    const resize = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const init = () => {
      nodes.length = 0;
      for (let i = 0; i < N; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // connections
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const o = 1 - Math.sqrt(d2) / 140;
            ctx.strokeStyle = `rgba(34,211,238,${o * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        ctx.fillStyle = 'rgba(250,204,21,0.85)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(34,211,238,0.4)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize(); init(); draw();
    const ro = new ResizeObserver(() => { resize(); init(); });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ---------- Live terminal ---------- */
const LOG_POOL = [
  { tag: 'AUTH', txt: 'new operator joined → @neoCoder', tone: 'cyan' },
  { tag: 'AI/GEN', txt: 'roadmap synthesized · vector=ml-engineer', tone: 'yellow' },
  { tag: 'MISSION', txt: 'CTF #042 deployed · diff=hard', tone: 'magenta' },
  { tag: 'BUILD', txt: 'project_aurora.deploy → status=200 OK', tone: 'emerald' },
  { tag: 'SIGNAL', txt: 'hackathon window opens in 03:21:47', tone: 'cyan' },
  { tag: 'ALERT', txt: 'phishing sim · 12 ops compromised', tone: 'magenta' },
  { tag: 'AI/GEN', txt: 'resume scored · ATS=92 · gaps=2', tone: 'yellow' },
  { tag: 'NETWORK', txt: 'cofounder match · @rishi ⇄ @ananya', tone: 'emerald' },
  { tag: 'XP', txt: '+240 XP → rank up · ARCHITECT-II', tone: 'yellow' },
  { tag: 'BOUNTY', txt: 'open-source mission · ₹15,000 reward', tone: 'cyan' },
  { tag: 'INTEL', txt: 'GPT-6 leak rumor · trust=0.42', tone: 'magenta' },
  { tag: 'EVENT', txt: 'workshop · prompt-engineering · LIVE', tone: 'emerald' },
];

const toneClass: Record<string, string> = {
  cyan: 'text-cyan-300',
  yellow: 'text-yellow-300',
  magenta: 'text-fuchsia-300',
  emerald: 'text-emerald-300',
};

function LiveTerminal() {
  const [lines, setLines] = useState<{ id: number; tag: string; txt: string; tone: string; time: string }[]>([]);
  useEffect(() => {
    let id = 0;
    const tick = () => {
      const pick = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setLines((prev) => [...prev.slice(-9), { id: id++, ...pick, time }]);
    };
    tick(); tick(); tick();
    const t = setInterval(tick, 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative neon-border rounded-xl overflow-hidden term-text">
      <span className="cyber-corner tl" /><span className="cyber-corner tr" />
      <span className="cyber-corner bl" /><span className="cyber-corner br" />
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-cyan-400/20 bg-black/40">
        <div className="flex items-center gap-2 text-[11px] tracking-widest text-cyan-300/80">
          <Terminal className="w-3.5 h-3.5" />
          TYGN://live-feed
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-fuchsia-400/70 animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-yellow-300/70" />
          <span className="w-2 h-2 rounded-full bg-cyan-300/70" />
        </div>
      </div>
      {/* status bar */}
      <div className="grid grid-cols-3 gap-px bg-cyan-400/10 text-[10px] tracking-wider">
        {[
          { Icon: Wifi, label: 'UPLINK', val: 'STABLE' },
          { Icon: Cpu, label: 'NODES', val: '1.2K' },
          { Icon: Shield, label: 'THREAT', val: 'LOW' },
        ].map(({ Icon, label, val }) => (
          <div key={label} className="px-3 py-2 bg-black/60 flex items-center gap-2">
            <Icon className="w-3 h-3 text-cyan-300" />
            <span className="text-white/40">{label}</span>
            <span className="ml-auto text-emerald-300">{val}</span>
          </div>
        ))}
      </div>
      {/* logs */}
      <div className="relative h-[340px] overflow-hidden bg-black/60 px-4 py-3 text-[12px]">
        <div className="absolute inset-0 cyber-scanlines" />
        <div className="relative space-y-1.5">
          {lines.map((l) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-2"
            >
              <span className="text-white/30 shrink-0">{l.time}</span>
              <span className={`shrink-0 ${toneClass[l.tone]} font-semibold`}>[{l.tag}]</span>
              <span className="text-white/75">{l.txt}</span>
            </motion.div>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-cyan-400">tygn@os:~$</span>
            <span className="w-1.5 h-3.5 bg-cyan-300 animate-terminal-blink" />
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="px-4 py-2 bg-black/70 border-t border-cyan-400/20 text-[10px] tracking-widest text-white/40 flex items-center justify-between">
        <span className="flex items-center gap-1.5"><Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> STREAMING · REALTIME</span>
        <span>v2.0.42</span>
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */
export default function CyberHero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen w-full overflow-hidden cyber-noise cyber-scanlines">
      {/* Layer 1: void */}
      <div className="absolute inset-0 bg-[#05060A]" />

      {/* Layer 2: perspective grid floor */}
      <div className="absolute inset-x-0 bottom-0 h-[55vh] [perspective:900px]">
        <div
          className="absolute inset-0 cyber-grid-bg-strong animate-grid-drift origin-bottom"
          style={{
            transform: 'rotateX(62deg) translateY(10%)',
            maskImage: 'linear-gradient(to top, black 30%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 95%)',
          }}
        />
      </div>

      {/* Layer 3: top grid + radial glows */}
      <div className="absolute inset-0 cyber-grid-bg opacity-60" />
      <div className="absolute -top-32 -left-32 w-[640px] h-[640px] rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)' }} />
      <div className="absolute top-40 -right-40 w-[700px] h-[700px] rounded-full"
           style={{ background: 'radial-gradient(circle, rgba(232,121,249,0.18), transparent 70%)' }} />

      {/* Layer 4: particles */}
      <div className="absolute inset-0">
        <ParticleField />
      </div>

      {/* scan line sweeping */}
      <div className="scan-line" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 md:pt-28 pb-16 grid lg:grid-cols-12 gap-10 items-center min-h-screen">
        {/* LEFT */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 backdrop-blur-sm term-text text-[11px] tracking-widest"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-pulse-ring" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-cyan-200">SYSTEM ONLINE · v2.0 · BETA</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold tracking-tight mt-6 text-[clamp(2.4rem,5.4vw,5.4rem)] leading-[1.02]"
          >
            <span className="block text-white/95">Welcome to the</span>
            <span className="block holo-text">Future of Student</span>
            <span className="block">
              <span className="glitch-layer text-white" data-text="Innovation.">Innovation.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-white/65 max-w-xl term-text"
          >
            <span className="text-cyan-300">&gt;</span> Build. Hack. Learn. Collaborate. Compete.
            <br />
            <span className="text-white/40">An operating system for India's next generation of builders.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <button onClick={() => navigate(user ? '/notes' : '/auth')} className="btn-cyber">
              <Rocket className="w-4 h-4" /> Enter TYGN <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/community')} className="btn-ghost-neon">
              <Terminal className="w-4 h-4" /> Launch Mission
            </button>
            <button onClick={() => navigate('/resume-checker')} className="btn-ghost-neon"
                    style={{ color: 'hsl(var(--neon-yellow))', borderColor: 'hsl(var(--neon-yellow) / 0.4)', background: 'hsl(var(--neon-yellow) / 0.06)' }}>
              <FlaskConical className="w-4 h-4" /> Explore Labs
            </button>
          </motion.div>

          {/* mini stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-14 grid grid-cols-4 gap-4 max-w-xl term-text"
          >
            {[
              { v: '1,247', l: 'OPERATORS' },
              { v: '042', l: 'MISSIONS' },
              { v: '93%', l: 'UPTIME' },
              { v: '∞', l: 'POTENTIAL' },
            ].map((s) => (
              <div key={s.l} className="relative p-3 rounded-md border border-cyan-400/15 bg-black/40">
                <div className="text-xl font-bold text-white">{s.v}</div>
                <div className="text-[9px] tracking-[0.2em] text-cyan-300/70 mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT - Terminal */}
        <motion.div
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-5 animate-float-slow"
        >
          <LiveTerminal />
        </motion.div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#05060A] z-[5]" />
    </section>
  );
}

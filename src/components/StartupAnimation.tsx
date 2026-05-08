import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "[ OK ] init.kernel  ............... TYGN.OS v4.2.0",
  "[ OK ] handshake    ............... auth.gateway → SECURE",
  "[ .. ] neural_net   ............... booting transformer cores",
  "[ OK ] neural_net   ............... 12 layers online",
  "[ .. ] datastream   ............... syncing community.shards",
  "[ OK ] datastream   ............... 0xA9F3 nodes verified",
  "[ .. ] cipher       ............... rotating quantum keys",
  "[ OK ] cipher       ............... AES-512 / RSA-4096",
  "[ OK ] resume.ai    ............... ATS engine warm",
  "[ OK ] mainframe    ............... welcome, operator",
];

const StartupAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [lineIdx, setLineIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Boot lines stream
  useEffect(() => {
    if (lineIdx < BOOT_LINES.length) {
      const t = setTimeout(() => setLineIdx((i) => i + 1), 220);
      return () => clearTimeout(t);
    }
    const finish = setTimeout(() => {
      setDone(true);
      setTimeout(onComplete, 700);
    }, 600);
    return () => clearTimeout(finish);
  }, [lineIdx, onComplete]);

  // Smooth progress
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        const target = (lineIdx / BOOT_LINES.length) * 100;
        return p + (target - p) * 0.18;
      });
    }, 40);
    return () => clearInterval(id);
  }, [lineIdx]);

  // Matrix rain background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "ァアイウエオカキクケコサシスセソタチツテトナニヌネノ01アイウエオ#$%&*+-=<>".split("");
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(5, 7, 18, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // head bright, tail cyan
        ctx.fillStyle = Math.random() > 0.975 ? "#FACC15" : "rgba(34, 211, 238, 0.85)";
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, x, y);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[60] overflow-hidden bg-[#05070f] text-cyan-200 font-mono"
        >
          {/* Matrix rain */}
          <canvas ref={canvasRef} className="absolute inset-0 opacity-50" />

          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)",
            }}
          />

          {/* Vignette + grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(5,7,18,0.95) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.18) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse at center, black 50%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 80%)",
            }}
          />

          {/* Center stack */}
          <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6">
            {/* Logo orb */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 rounded-full blur-3xl bg-cyan-400/40 animate-pulse" />
              <div className="absolute inset-0 rounded-full blur-2xl bg-yellow-300/30" />
              <div className="relative w-28 h-28 rounded-full border border-cyan-400/60 bg-gradient-to-br from-cyan-500/20 via-transparent to-yellow-400/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-1 rounded-full border border-dashed border-cyan-300/50"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-3 rounded-full border border-yellow-300/40"
                />
                <span className="text-3xl font-bold tracking-widest bg-gradient-to-br from-cyan-200 to-yellow-200 bg-clip-text text-transparent">
                  T<span className="text-yellow-300">Y</span>GN
                </span>
              </div>
            </motion.div>

            {/* Glitch title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative text-3xl md:text-5xl font-bold tracking-[0.25em] text-cyan-100"
            >
              <span className="absolute -left-[2px] top-0 text-pink-500/70 mix-blend-screen animate-pulse">
                TECHYOGEEK · NIRVANA
              </span>
              <span className="absolute left-[2px] top-0 text-cyan-400/70 mix-blend-screen animate-pulse">
                TECHYOGEEK · NIRVANA
              </span>
              <span className="relative">TECHYOGEEK · NIRVANA</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-3 text-xs md:text-sm uppercase tracking-[0.45em] text-cyan-400/80"
            >
              // initializing neural mainframe
            </motion.p>

            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 w-full max-w-2xl rounded-lg border border-cyan-500/30 bg-black/60 backdrop-blur-sm shadow-[0_0_60px_-10px_rgba(34,211,238,0.5)]"
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan-500/20">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-3 text-[10px] tracking-widest text-cyan-300/70">
                  tygn@mainframe ~ /boot
                </span>
              </div>
              <div className="p-4 h-56 overflow-hidden text-[12px] md:text-sm leading-relaxed">
                {BOOT_LINES.slice(0, lineIdx).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={
                      line.includes("[ OK ]")
                        ? "text-emerald-300"
                        : "text-cyan-200/90"
                    }
                  >
                    <span className="text-cyan-500/60 mr-2">›</span>
                    {line}
                  </motion.div>
                ))}
                {lineIdx < BOOT_LINES.length && (
                  <span className="inline-block w-2 h-4 bg-cyan-300 align-middle animate-pulse" />
                )}
              </div>
            </motion.div>

            {/* Progress */}
            <div className="mt-6 w-full max-w-2xl">
              <div className="flex justify-between text-[10px] tracking-[0.3em] text-cyan-400/70 mb-2">
                <span>SYS.LOAD</span>
                <span>{Math.min(100, Math.round(progress))}%</span>
              </div>
              <div className="relative h-1.5 w-full bg-cyan-500/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 via-cyan-300 to-yellow-300 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Corner brackets */}
          {[
            "top-6 left-6 border-l border-t",
            "top-6 right-6 border-r border-t",
            "bottom-6 left-6 border-l border-b",
            "bottom-6 right-6 border-r border-b",
          ].map((c, i) => (
            <div
              key={i}
              className={`absolute w-10 h-10 border-cyan-400/60 ${c}`}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartupAnimation;

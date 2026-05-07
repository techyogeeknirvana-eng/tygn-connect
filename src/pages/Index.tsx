'use client';

import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  BookOpen, Calendar, Briefcase, Users, Brain, FileCheck,
  Sparkles, Zap, Shield, ArrowRight, MessageCircle,
} from 'lucide-react';

const ADMIN_EMAIL = 'techyogeeknirvana@gmail.com';

export default function Index() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const features = [
    { name: 'Notes', href: '/notes', Icon: BookOpen, desc: 'Branch & semester-wise study material', color: 'from-violet-500 to-fuchsia-500' },
    { name: 'Events', href: '/events', Icon: Calendar, desc: 'Hackathons, workshops, meetups', color: 'from-cyan-400 to-blue-500' },
    { name: 'Jobs', href: '/jobs', Icon: Briefcase, desc: 'Curated jobs & internships', color: 'from-emerald-400 to-teal-500' },
    { name: 'Community', href: '/community', Icon: Users, desc: 'Realtime Q&A and discussions', color: 'from-pink-500 to-rose-500' },
    { name: 'Quizzes', href: '/quizzes', Icon: Brain, desc: 'Sharpen your fundamentals', color: 'from-amber-400 to-orange-500' },
    { name: 'AI Resume Checker', href: '/resume-checker', Icon: FileCheck, desc: 'ATS scoring with AI feedback', color: 'from-indigo-400 to-purple-500' },
  ];

  // Mouse-reactive gradient
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05060f] text-white">
      {/* Background grid + glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.6) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          }}
        />
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background:
              'radial-gradient(600px circle at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.15), transparent 40%)',
          }}
        />
      </div>

      {/* HERO */}
      <section ref={heroRef} className="relative z-10 min-h-[92vh] flex items-center px-6">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            <span className="text-xs uppercase tracking-[0.25em] text-violet-200">Cyber × AI Community</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight"
          >
            <span className="bg-gradient-to-br from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
              TechYOGeek
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Nirvana
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed"
          >
            A futuristic hub for Indian coders — notes, jobs, hackathons, AI tools and a live community.
            Build, learn, ship, and level up together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            {user ? (
              <>
                {isAdmin ? (
                  <NeonCTA onClick={() => navigate('/admin')}>
                    <Shield className="w-4 h-4 mr-2" /> Admin Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </NeonCTA>
                ) : (
                  <NeonCTA onClick={() => navigate('/notes')}>
                    Enter Platform <ArrowRight className="w-4 h-4 ml-2" />
                  </NeonCTA>
                )}
                <Button variant="outline" onClick={signOut}
                  className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                  Sign Out
                </Button>
              </>
            ) : (
              <NeonCTA onClick={() => navigate('/auth')}>
                <Zap className="w-4 h-4 mr-2" /> Sign In / Sign Up
              </NeonCTA>
            )}
            <a
              href="https://chat.whatsapp.com/KFUYpSAMVOr0TtuUWqSBpZ"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20 transition-all hover:scale-[1.03]"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> Join WhatsApp Community
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl"
          >
            {[
              { v: '1K+', l: 'Coders' },
              { v: '500+', l: 'Notes' },
              { v: '50+', l: 'Events' },
              { v: '100+', l: 'Jobs' },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">{s.v}</div>
                <div className="text-xs uppercase tracking-widest text-white/50 mt-1">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Everything you need</span>
            </h2>
            <p className="mt-3 text-white/60 max-w-xl mx-auto">A complete toolkit for student developers — built for speed and depth.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link to={f.href} className="block group relative">
                  <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-60 blur transition-opacity`} />
                  <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 group-hover:bg-white/[0.06] transition-all">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <f.Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{f.name}</h3>
                    <p className="text-sm text-white/60 mt-1">{f.desc}</p>
                    <div className="mt-4 flex items-center text-sm text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden border border-white/10 p-10 md:p-16 text-center"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.25), transparent 60%), radial-gradient(circle at 70% 70%, rgba(56,189,248,0.20), transparent 60%), rgba(255,255,255,0.02)' }}
        >
          <h3 className="text-3xl md:text-5xl font-bold mb-4">Ready to plug in?</h3>
          <p className="text-white/70 max-w-xl mx-auto mb-8">Join hundreds of B.Tech coders building, learning and shipping with TYGN.</p>
          {!user && (
            <NeonCTA onClick={() => navigate('/auth')}>
              Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
            </NeonCTA>
          )}
        </motion.div>
      </section>
    </div>
  );
}

const NeonCTA = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button onClick={onClick} className="relative inline-flex items-center px-7 py-3 rounded-full font-semibold text-white overflow-hidden group">
    <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500" />
    <span className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-400 blur-xl opacity-50 group-hover:opacity-90 transition-opacity" />
    <span className="relative flex items-center">{children}</span>
  </button>
);

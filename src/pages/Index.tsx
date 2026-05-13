'use client';

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import CyberHero from '@/components/cyber/CyberHero';
import MissionControl from '@/components/cyber/MissionControl';
import HackerArena from '@/components/cyber/HackerArena';
import InnovationMap from '@/components/cyber/InnovationMap';
import ProjectBattlefield from '@/components/cyber/ProjectBattlefield';
import SkillEvolution from '@/components/cyber/SkillEvolution';
import OpportunityRadar from '@/components/cyber/OpportunityRadar';
import AINetworking from '@/components/cyber/AINetworking';
import WarRoom from '@/components/cyber/WarRoom';
import {
  BookOpen, Calendar, Briefcase, Users, Brain, FileCheck,
  ArrowRight, Shield,
} from 'lucide-react';

const ADMIN_EMAIL = 'techyogeeknirvana@gmail.com';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.email === ADMIN_EMAIL;

  const features = [
    { name: 'Notes Vault',     href: '/notes',          Icon: BookOpen,  desc: 'Branch & semester study material', tag: 'ARCHIVE' },
    { name: 'Mission Events',  href: '/events',         Icon: Calendar,  desc: 'Hackathons, workshops, meetups',   tag: 'OPS' },
    { name: 'Job Signals',     href: '/jobs',           Icon: Briefcase, desc: 'Curated roles & internships',      tag: 'INTEL' },
    { name: 'War Room',        href: '/community',      Icon: Users,     desc: 'Realtime Q&A and discussions',     tag: 'COMMS' },
    { name: 'Skill Trials',    href: '/quizzes',        Icon: Brain,     desc: 'Sharpen your fundamentals',        tag: 'TRAINING' },
    { name: 'AI Resume Lab',   href: '/resume-checker', Icon: FileCheck, desc: 'ATS scoring with AI feedback',     tag: 'LAB' },
  ];

  return (
    <div className="cyber-root relative min-h-screen overflow-hidden">
      <CyberHero />

      <MissionControl />

      <HackerArena />

      <InnovationMap />

      <ProjectBattlefield />

      <SkillEvolution />

      <OpportunityRadar />

      <AINetworking />

      <WarRoom />

      {/* MODULES GRID */}
      <section className="relative z-10 px-6 py-24 cyber-noise">
        <div className="absolute inset-0 cyber-grid-bg opacity-40 pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="term-text text-[11px] tracking-[0.3em] text-cyan-300/80 mb-3">// SYSTEM MODULES</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              <span className="holo-text">Choose your interface.</span>
            </h2>
            <p className="mt-3 text-white/55 max-w-xl mx-auto">
              Six core modules. One ecosystem. Built to make every B.Tech mind ship faster.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link to={f.href} className="block group">
                  <div className="holo-card p-6 h-full">
                    <span className="cyber-corner tl" /><span className="cyber-corner tr" />
                    <span className="cyber-corner bl" /><span className="cyber-corner br" />

                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center relative"
                           style={{ background: 'linear-gradient(135deg, hsl(187 92% 53% / 0.18), hsl(292 84% 61% / 0.18))', border: '1px solid hsl(187 92% 53% / 0.4)' }}>
                        <f.Icon className="w-6 h-6 text-cyan-300" />
                      </div>
                      <span className="term-text text-[10px] tracking-[0.2em] text-yellow-300/80 px-2 py-1 rounded border border-yellow-300/30 bg-yellow-300/5">
                        {f.tag}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white">{f.name}</h3>
                    <p className="text-sm text-white/55 mt-1">{f.desc}</p>

                    <div className="mt-5 flex items-center justify-between term-text text-[11px] tracking-widest">
                      <span className="text-emerald-400/80">● ONLINE</span>
                      <span className="flex items-center gap-1 text-cyan-300 opacity-70 group-hover:opacity-100 transition-opacity">
                        ENGAGE <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative neon-border rounded-2xl overflow-hidden p-10 md:p-16 text-center"
        >
          <span className="cyber-corner tl" /><span className="cyber-corner tr" />
          <span className="cyber-corner bl" /><span className="cyber-corner br" />
          <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)' }} />

          <div className="relative">
            <div className="term-text text-[11px] tracking-[0.3em] text-yellow-300/80 mb-3">// READY TO DEPLOY?</div>
            <h3 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              Plug in. <span className="holo-text">Level up.</span>
            </h3>
            <p className="text-white/60 max-w-xl mx-auto mb-8">
              Hundreds of B.Tech operators are already shipping. The terminal is open.
            </p>
            {!user ? (
              <button onClick={() => navigate('/auth')} className="btn-cyber">
                Initialize Operator <ArrowRight className="w-4 h-4" />
              </button>
            ) : isAdmin ? (
              <button onClick={() => navigate('/admin')} className="btn-cyber">
                <Shield className="w-4 h-4" /> Open Command Center
              </button>
            ) : (
              <button onClick={() => navigate('/notes')} className="btn-cyber">
                Continue Mission <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}

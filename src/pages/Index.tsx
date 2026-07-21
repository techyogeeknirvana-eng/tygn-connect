import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  BookOpen, Calendar, Briefcase, Users, Brain, FileCheck, Mic,
  ArrowRight, Shield, GraduationCap, Sparkles, Trophy, Heart,
} from 'lucide-react';

const ADMIN_EMAIL = 'techyogeeknirvana@gmail.com';

const features = [
  { name: 'AI Interview',    href: '/interview',      Icon: Mic,       desc: 'Live voice mock interviews with a real scorecard. NEW.', highlight: true },
  { name: 'Notes',           href: '/notes',          Icon: BookOpen,  desc: 'Branch & semester study material, curated by seniors.' },
  { name: 'Community',       href: '/community',      Icon: Users,     desc: 'Ask, answer, and chat with fellow B.Tech students.' },
  { name: 'Quizzes',         href: '/quizzes',        Icon: Brain,     desc: 'Practice core CS, DSA and aptitude in short bursts.' },
  { name: 'Resume Builder',  href: '/resume-checker', Icon: FileCheck, desc: 'AI-powered ATS scoring with actionable feedback.' },
  { name: 'Events',          href: '/events',         Icon: Calendar,  desc: 'Hackathons, workshops and meetups in one feed.' },
  { name: 'Opportunities',   href: '/jobs',           Icon: Briefcase, desc: 'Internships and entry-level roles, hand-picked.' },
];

// Placeholders — swap with real numbers when available
const stats = [
  { label: 'Active students', value: '500+' },
  { label: 'Notes shared',    value: '120+' },
  { label: 'Events listed',   value: '40+' },
  { label: 'Colleges',        value: '15+' },
];

const testimonials = [
  {
    name: 'Aarav S.',
    role: 'CSE, 3rd year',
    quote: 'TYGN saved me hours of hunting for notes. Got a clean PDF for every subject in one click.',
  },
  {
    name: 'Priya K.',
    role: 'ECE, 2nd year',
    quote: 'The resume checker actually told me what was wrong. Cleared an internship screen the week after.',
  },
  {
    name: 'Rohan M.',
    role: 'IT, final year',
    quote: 'Community answers come back fast, and the hackathon listings are genuinely useful.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <div className="bg-[#05060f] text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Soft ambient glow — no particles, no grid */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[820px] rounded-full opacity-50"
             style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[420px] w-[520px] rounded-full opacity-40"
             style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.18), transparent 70%)' }} />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <motion.div {...fadeUp} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-cyan-200">
              <GraduationCap className="h-3.5 w-3.5" />
              For B.Tech students, by B.Tech students
            </span>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">
              The student ecosystem for{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-yellow-300 bg-clip-text text-transparent">
                notes, community & careers.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/65 md:text-lg">
              TYGN Connect brings together study material, peer Q&amp;A, quizzes, resume tools,
              events and opportunities — one calm home instead of ten scattered tabs.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {!user ? (
                <Button size="lg" onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-[#05060f] hover:opacity-90">
                  Get started <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              ) : isAdmin ? (
                <Button size="lg" onClick={() => navigate('/admin')}
                  className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-[#05060f] hover:opacity-90">
                  <Shield className="mr-1 h-4 w-4" /> Open Admin
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate('/notes')}
                  className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-[#05060f] hover:opacity-90">
                  Continue <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              )}
              <Button size="lg" variant="outline" asChild
                className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
                <Link to="/community">Explore community</Link>
              </Button>
            </div>

            {/* Tiny stat bar */}
            <div className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-heading text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES — above the fold context */}
      <section id="features" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-12 max-w-2xl">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">Everything you need, in one place.</h2>
            <p className="mt-3 text-white/60">
              Six focused modules. No fluff, no dead clicks — each card opens a real, working part of the platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Link
                  to={f.href}
                  className={`group relative block h-full rounded-2xl border p-6 transition hover:-translate-y-0.5 ${
                    f.highlight
                      ? 'border-fuchsia-300/40 bg-gradient-to-br from-fuchsia-500/10 via-cyan-500/10 to-yellow-300/5 hover:border-fuchsia-300/70'
                      : 'border-white/10 bg-white/[0.03] hover:border-cyan-300/30 hover:bg-white/[0.05]'
                  }`}
                >
                  {f.highlight && (
                    <span className="absolute right-4 top-4 rounded-full bg-fuchsia-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#05060f]">New</span>
                  )}
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl border ${f.highlight ? 'border-fuchsia-300/40 bg-fuchsia-300/10' : 'border-cyan-300/30 bg-cyan-300/10'}`}>
                    <f.Icon className={`h-5 w-5 ${f.highlight ? 'text-fuchsia-300' : 'text-cyan-300'}`} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-white">{f.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/60">{f.desc}</p>
                  <div className={`mt-5 inline-flex items-center gap-1 text-xs font-medium opacity-80 transition group-hover:opacity-100 ${f.highlight ? 'text-fuchsia-300' : 'text-cyan-300'}`}>
                    Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT / TESTIMONIALS */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="mb-12 flex items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-fuchsia-200">
                <Heart className="h-3 w-3" /> Community impact
              </span>
              <h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl">Built with students. Trusted by students.</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <Trophy className="h-5 w-5 text-yellow-300" />
                <blockquote className="mt-4 text-sm leading-relaxed text-white/75">"{t.quote}"</blockquote>
                <figcaption className="mt-5 text-xs text-white/50">
                  <span className="font-semibold text-white/80">{t.name}</span> · {t.role}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/10 to-yellow-300/10 p-10 text-center md:p-14"
        >
          <Sparkles className="mx-auto h-6 w-6 text-cyan-300" />
          <h3 className="mt-4 font-heading text-3xl font-bold md:text-4xl">Ready to join TYGN Connect?</h3>
          <p className="mx-auto mt-3 max-w-xl text-white/65">
            Free for every B.Tech student. Sign in with Google and you're in.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {!user ? (
              <Button size="lg" onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-[#05060f] hover:opacity-90">
                Sign in with Google
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate('/notes')}
                className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-[#05060f] hover:opacity-90">
                Go to Notes
              </Button>
            )}
            <Button size="lg" variant="outline" asChild
              className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
              <Link to="/about">About TYGN</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

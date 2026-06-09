import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, Heart, Target, Sparkles, Mail } from 'lucide-react';

const values = [
  { Icon: Users, title: 'Student-first', desc: 'Every feature is shaped by what B.Tech students actually need day-to-day.' },
  { Icon: Target, title: 'Useful, not noisy', desc: 'No spammy notifications. No fake gamification. Just tools that work.' },
  { Icon: Heart, title: 'Free & open', desc: 'Core features stay free for students. Built and maintained by the community.' },
];

export default function About() {
  return (
    <div className="bg-[#05060f] text-white">
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full opacity-40"
             style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)' }} />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-cyan-200">
            <GraduationCap className="h-3.5 w-3.5" /> About TYGN Connect
          </span>
          <h1 className="mt-5 font-heading text-4xl font-bold md:text-5xl">
            One home for every B.Tech student.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/65 md:text-lg">
            TYGN Connect (TechYOGeek Nirvana) is a student-built platform that puts your study material,
            community, quizzes, resume tools, events and opportunities in one calm, focused space.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10">
                <v.Icon className="h-5 w-5 text-cyan-300" />
              </div>
              <h3 className="font-heading text-lg font-semibold">{v.title}</h3>
              <p className="mt-1.5 text-sm text-white/60">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12">
          <Sparkles className="h-6 w-6 text-cyan-300" />
          <h2 className="mt-4 font-heading text-2xl font-bold md:text-3xl">Our story, in one paragraph.</h2>
          <p className="mt-4 text-white/70">
            We started TYGN Connect because finding decent notes, knowing what hackathons are happening,
            and getting honest feedback on a resume should not take ten WhatsApp groups and a Telegram channel.
            We're a small group of students building the platform we wished existed when we started college.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-[#05060f] hover:opacity-90">
            <Link to="/">Explore the platform</Link>
          </Button>
          <Button asChild size="lg" variant="outline"
            className="border-white/15 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:text-white">
            <Link to="/contact"><Mail className="mr-1 h-4 w-4" /> Contact us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

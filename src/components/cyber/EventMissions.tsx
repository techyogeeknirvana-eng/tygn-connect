'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  type: string | null;
};

export default function EventMissions() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('events' as any)
          .select('*')
          .eq('approved', true)
          .order('event_date', { ascending: true })
          .limit(6);
        if (data) setEvents(data as any);
      } catch {/* table may not exist yet */}
      setLoading(false);
    })();
  }, []);

  return (
    <section className="relative z-10 px-6 py-24">
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10 flex-wrap gap-4"
        >
          <div>
            <div className="term-text text-[11px] tracking-[0.3em] text-cyan-300/80 mb-3">// SECTION 10 · EVENT MISSIONS</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              <span className="holo-text">Live mission board.</span>
            </h2>
          </div>
          <Link to="/events" className="term-text text-[11px] tracking-[0.25em] text-cyan-300 border border-cyan-300/30 px-4 py-2 rounded hover:bg-cyan-300/10 transition">
            VIEW ALL ▸
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0,1,2].map(i => (
              <div key={i} className="holo-card p-6 h-44 animate-pulse opacity-50" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="holo-card p-12 text-center relative">
            <span className="cyber-corner tl" /><span className="cyber-corner tr" />
            <span className="cyber-corner bl" /><span className="cyber-corner br" />
            <Inbox className="w-10 h-10 text-cyan-300/60 mx-auto mb-3" />
            <div className="term-text text-[11px] tracking-[0.25em] text-white/50 mb-1">// AWAITING SIGNALS</div>
            <p className="text-white/70">No approved missions yet. Submit one to launch the board.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="holo-card p-6 relative"
              >
                <span className="cyber-corner tl" /><span className="cyber-corner tr" />
                <span className="cyber-corner bl" /><span className="cyber-corner br" />
                <div className="flex items-center gap-2 term-text text-[10px] tracking-[0.25em] text-yellow-300/80 mb-3">
                  <Calendar className="w-3 h-3" />
                  {e.event_date ? new Date(e.event_date).toLocaleDateString() : 'TBA'}
                  {e.type && <span className="text-cyan-300/70">· {e.type.toUpperCase()}</span>}
                </div>
                <h3 className="font-display text-lg font-bold text-white">{e.title}</h3>
                {e.description && <p className="text-sm text-white/60 mt-2 line-clamp-3">{e.description}</p>}
                {e.location && <div className="mt-3 term-text text-[10px] tracking-widest text-white/40">@ {e.location}</div>}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

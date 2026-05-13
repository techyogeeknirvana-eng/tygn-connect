'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Inbox } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  branch?: string | null;
};

export default function MemberWall() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, count: c } = await supabase
          .from('profiles' as any)
          .select('id, full_name, avatar_url, branch', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(12);
        if (data) setMembers(data as any);
        if (typeof c === 'number') setCount(c);
      } catch {/* schema may differ */}
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
          className="text-center mb-12"
        >
          <div className="term-text text-[11px] tracking-[0.3em] text-yellow-300/80 mb-3">// SECTION 12 · ELITE MEMBER WALL</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold">
            <span className="holo-text">The operators.</span>
          </h2>
          <p className="mt-3 text-white/55 max-w-xl mx-auto">
            Real people building real things. {count !== null ? `${count} registered so far.` : 'Network expanding.'}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="holo-card aspect-square animate-pulse opacity-50" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="holo-card p-12 text-center relative">
            <span className="cyber-corner tl" /><span className="cyber-corner tr" />
            <span className="cyber-corner bl" /><span className="cyber-corner br" />
            <Users className="w-10 h-10 text-yellow-300/60 mx-auto mb-3" />
            <div className="term-text text-[11px] tracking-[0.25em] text-white/50 mb-1">// NETWORK INITIALIZING</div>
            <p className="text-white/70">Be the first operator on the wall.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {members.map((m, i) => {
              const initials = (m.full_name || '?')
                .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                  className="holo-card p-4 relative aspect-square flex flex-col items-center justify-center text-center"
                >
                  <span className="cyber-corner tl" /><span className="cyber-corner tr" />
                  <span className="cyber-corner bl" /><span className="cyber-corner br" />

                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt={m.full_name || 'operator'} className="w-12 h-12 rounded-full object-cover border border-cyan-300/30" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400/30 to-fuchsia-400/30 border border-cyan-300/30 flex items-center justify-center font-display text-sm font-bold text-white">
                      {initials}
                    </div>
                  )}
                  <div className="mt-2 text-xs font-medium text-white truncate w-full">{m.full_name || 'Operator'}</div>
                  {m.branch && <div className="term-text text-[9px] tracking-[0.2em] text-cyan-300/70 mt-0.5 truncate w-full">{m.branch}</div>}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

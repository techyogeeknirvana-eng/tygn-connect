import { useEffect, useState } from "react";
import { Bell, AlertTriangle, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  body: string;
  important: boolean;
  created_at: string;
  target_user_id: string | null;
}

export const NotificationBell = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const load = async () => {
    if (!user) return;
    const [{ data: notifs }, { data: reads }] = await Promise.all([
      supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(30),
      supabase.from("notification_reads").select("notification_id").eq("user_id", user.id),
    ]);
    setItems((notifs as Notification[]) || []);
    setReadIds(new Set((reads || []).map((r: any) => r.notification_id)));
  };

  useEffect(() => {
    load();
    if (!user) return;
    const channel = supabase
      .channel("notifications-stream")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const markRead = async (id: string) => {
    if (!user || readIds.has(id)) return;
    setReadIds((s) => new Set(s).add(id));
    await supabase.from("notification_reads").insert({ notification_id: id, user_id: user.id });
  };

  const markAllRead = async () => {
    if (!user) return;
    const unread = items.filter((i) => !readIds.has(i.id));
    if (!unread.length) return;
    const rows = unread.map((u) => ({ notification_id: u.id, user_id: user.id }));
    setReadIds(new Set([...readIds, ...unread.map((u) => u.id)]));
    await supabase.from("notification_reads").insert(rows);
  };

  if (!user) return null;
  const unreadCount = items.filter((i) => !readIds.has(i.id)).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:text-white"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-cyan-300 px-1 text-[10px] font-bold text-[#05060d] shadow-[0_0_10px_rgba(250,204,21,0.6)]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-[340px] max-h-[480px] overflow-hidden rounded-xl border border-cyan-300/20 bg-[#05060d]/95 backdrop-blur-xl shadow-2xl z-50"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300/80">Transmissions</span>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 text-[10px] text-white/60 hover:text-white">
                    <Check className="h-3 w-3 mr-1" /> Mark all
                  </Button>
                )}
                <button onClick={() => setOpen(false)} className="rounded p-1 text-white/60 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[420px]">
              {items.length === 0 ? (
                <div className="p-6 text-center text-xs text-white/50">No transmissions yet.</div>
              ) : items.map((n) => {
                const unread = !readIds.has(n.id);
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`cursor-pointer border-b border-white/5 p-3 transition hover:bg-white/[0.04] ${unread ? "bg-white/[0.02]" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      {n.important && (
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-300" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${n.important ? "text-yellow-200" : "text-white"}`}>{n.title}</span>
                          {unread && <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />}
                        </div>
                        <p className="mt-1 text-xs text-white/70 whitespace-pre-wrap">{n.body}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                          {new Date(n.created_at).toLocaleString()}
                          {n.target_user_id ? " · personal" : " · broadcast"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

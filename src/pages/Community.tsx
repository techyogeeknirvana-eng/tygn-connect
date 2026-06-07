import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash, Lock, Crown, Shield, Zap, Send, Smile, X, Pin, Reply, Trash2,
  MoreHorizontal, Users, AlertTriangle, Sparkles, Plus, Search
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import tygn_logo from "@/assets/tygn-logo.png";

type Tier = "supreme" | "co_admin" | "elite" | "operator";
const TIER_RANK: Record<Tier, number> = { supreme: 4, co_admin: 3, elite: 2, operator: 1 };

const TIER_STYLE: Record<Tier, { label: string; icon: any; color: string; ring: string }> = {
  supreme: { label: "Supreme",  icon: Crown,  color: "text-yellow-300", ring: "ring-yellow-300/50" },
  co_admin:{ label: "Co-Admin", icon: Shield, color: "text-fuchsia-300", ring: "ring-fuchsia-300/50" },
  elite:   { label: "Elite",    icon: Zap,    color: "text-cyan-300",    ring: "ring-cyan-300/50" },
  operator:{ label: "Operator", icon: Sparkles, color: "text-white/70", ring: "ring-white/20" },
};

interface Channel { id: string; slug: string; name: string; description: string | null; category: "public"|"elite"|"admin"; position: number; }
interface ChatMsg { id: string; channel_id: string; user_id: string; content: string; reply_to_id: string | null; is_pinned: boolean; sticker: string | null; created_at: string; edited_at: string | null; }
interface Reaction { id: string; message_id: string; user_id: string; emoji: string; }

const STICKERS = ["⚡","🔥","💀","👁️","🤖","🛸","💎","🧬","🌐","🕶️","🪩","🟣","🟡","🔵","✅","❌"];
const QUICK_REACTIONS = ["⚡","🔥","💀","👁️","🤖","💎","✅","❌"];

const Community = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [tier, setTier] = useState<Tier>("operator");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [profiles, setProfiles] = useState<Record<string, { full_name: string | null; avatar_url: string | null }>>({});
  const [presence, setPresence] = useState<Record<string, { full_name: string }>>({});
  const [input, setInput] = useState("");
  const [reply, setReply] = useState<ChatMsg | null>(null);
  const [bandwidth, setBandwidth] = useState(false);
  const [members, setMembers] = useState(true);
  const [transmissions, setTransmissions] = useState<{ used: number; date: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isAdminTier = TIER_RANK[tier] >= 3;
  const active = channels.find((c) => c.id === activeId) || null;

  // Load tier + channels
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: t } = await (supabase.rpc as any)("get_user_tier", { _uid: user.id });
      if (t) setTier(t as Tier);
      const { data: ch } = await supabase.from("channels" as any).select("*").order("position");
      const list = (ch as any as Channel[]) || [];
      setChannels(list);
      if (list.length && !activeId) setActiveId(list[0].id);
      const { data: st } = await supabase.from("user_chat_state" as any).select("transmissions_used,transmissions_date").eq("user_id", user.id).maybeSingle();
      if (st) setTransmissions({ used: (st as any).transmissions_used, date: (st as any).transmissions_date });
    })();
  }, [user?.id]);

  // Load messages for active channel + realtime
  useEffect(() => {
    if (!activeId) return;
    let alive = true;
    (async () => {
      const { data } = await supabase.from("chat_messages" as any).select("*").eq("channel_id", activeId).order("created_at", { ascending: true }).limit(200);
      if (!alive) return;
      const msgs = (data as any as ChatMsg[]) || [];
      setMessages(msgs);
      await hydrateProfiles(msgs.map((m) => m.user_id));
      const { data: rx } = await supabase.from("message_reactions" as any).select("*").in("message_id", msgs.map((m) => m.id).length ? msgs.map((m) => m.id) : ["00000000-0000-0000-0000-000000000000"]);
      setReactions((rx as any as Reaction[]) || []);
    })();

    const ch = supabase
      .channel(`chat-${activeId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `channel_id=eq.${activeId}` }, (p) => {
        const m = p.new as ChatMsg;
        setMessages((prev) => [...prev, m]);
        hydrateProfiles([m.user_id]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "chat_messages", filter: `channel_id=eq.${activeId}` }, (p) => {
        const m = p.new as ChatMsg;
        setMessages((prev) => prev.map((x) => x.id === m.id ? m : x));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "chat_messages", filter: `channel_id=eq.${activeId}` }, (p) => {
        const m = p.old as ChatMsg;
        setMessages((prev) => prev.filter((x) => x.id !== m.id));
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "message_reactions" }, async () => {
        const ids = messages.map((m) => m.id);
        if (!ids.length) return;
        const { data: rx } = await supabase.from("message_reactions" as any).select("*").in("message_id", ids);
        setReactions((rx as any as Reaction[]) || []);
      })
      .subscribe();

    return () => { alive = false; supabase.removeChannel(ch); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Presence
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel("tygn-presence", { config: { presence: { key: user.id } } });
    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState() as Record<string, Array<{ full_name: string }>>;
      const flat: Record<string, { full_name: string }> = {};
      Object.entries(state).forEach(([k, v]) => { flat[k] = v[0] || { full_name: "Operator" }; });
      setPresence(flat);
    }).subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ full_name: userProfile?.full_name || user.email?.split("@")[0] || "Operator" });
      }
    });
    return () => { supabase.removeChannel(ch); };
  }, [user?.id, userProfile?.full_name]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length, activeId]);

  const hydrateProfiles = async (ids: string[]) => {
    const missing = Array.from(new Set(ids.filter((id) => id && !profiles[id])));
    if (!missing.length) return;
    const { data } = await supabase.from("profiles").select("id,full_name,avatar_url").in("id", missing);
    setProfiles((prev) => {
      const next = { ...prev };
      (data || []).forEach((p: any) => { next[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url }; });
      return next;
    });
  };

  const send = async (sticker?: string) => {
    if (!user || !active) return;
    const text = sticker ? sticker : input.trim();
    if (!text) return;
    if (tier === "operator" && transmissions?.date === new Date().toISOString().slice(0,10) && transmissions.used >= 10) {
      setBandwidth(true);
      return;
    }
    const { error } = await supabase.from("chat_messages" as any).insert({
      channel_id: active.id,
      user_id: user.id,
      content: text,
      reply_to_id: reply?.id ?? null,
      sticker: sticker ?? null,
    });
    if (error) {
      if (error.message?.includes("BANDWIDTH_EXHAUSTED")) {
        setBandwidth(true);
      } else if (error.message?.includes("BANNED")) {
        toast({ title: "You are banned from the network", variant: "destructive" });
      } else if (error.message?.includes("MUTED")) {
        toast({ title: "You are muted", description: "Wait until the mute expires.", variant: "destructive" });
      } else {
        toast({ title: "Transmission failed", description: error.message, variant: "destructive" });
      }
      return;
    }
    if (tier === "operator") {
      const today = new Date().toISOString().slice(0,10);
      setTransmissions((t) => ({ used: (t?.date === today ? (t?.used || 0) : 0) + 1, date: today }));
    }
    setInput("");
    setReply(null);
    inputRef.current?.focus();
  };

  const togglePin = async (m: ChatMsg) => {
    if (!isAdminTier) return;
    await supabase.from("chat_messages" as any).update({ is_pinned: !m.is_pinned }).eq("id", m.id);
  };
  const deleteMsg = async (m: ChatMsg) => {
    await supabase.from("chat_messages" as any).delete().eq("id", m.id);
  };
  const toggleReact = async (m: ChatMsg, emoji: string) => {
    if (!user) return;
    const existing = reactions.find((r) => r.message_id === m.id && r.user_id === user.id && r.emoji === emoji);
    if (existing) {
      await supabase.from("message_reactions" as any).delete().eq("id", existing.id);
      setReactions((p) => p.filter((r) => r.id !== existing.id));
    } else {
      const { data } = await supabase.from("message_reactions" as any).insert({ message_id: m.id, user_id: user.id, emoji }).select().single();
      if (data) setReactions((p) => [...p, data as Reaction]);
    }
  };

  const pinned = useMemo(() => messages.filter((m) => m.is_pinned), [messages]);
  const onlineCount = Object.keys(presence).length;
  const TierIcon = TIER_STYLE[tier].icon;

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-[#05060d] text-white overflow-hidden flex">
      {/* Particles bg */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        {[...Array(30)].map((_, i) => (
          <motion.div key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-cyan-300/60"
            style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 4 + Math.random()*4, repeat: Infinity, delay: Math.random()*4 }}
          />
        ))}
      </div>

      {/* Channels sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-white/5 bg-[#08081a]/80 backdrop-blur-xl relative z-10">
        <div className="h-14 flex items-center gap-3 px-4 border-b border-white/5">
          <div className="relative h-9 w-9">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-400/50 via-fuchsia-400/40 to-yellow-300/50 blur" />
            <div className="relative h-full w-full rounded-xl border border-cyan-300/40 bg-black p-0.5">
              <img src={tygn_logo} alt="TYGN" className="h-full w-full object-contain" />
            </div>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">TYGN.NET</p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">community grid</p>
          </div>
        </div>

        <div className="px-3 py-3">
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5">
            <Search className="h-3.5 w-3.5 text-white/40" />
            <input placeholder="Find channel" className="bg-transparent text-xs outline-none text-white/80 placeholder:text-white/30 w-full" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-4">
          {(["public","elite","admin"] as const).map((cat) => {
            const list = channels.filter((c) => c.category === cat);
            if (!list.length) return null;
            const tierGate = cat === "admin" ? "co_admin" : cat === "elite" ? "elite" : "operator";
            const gated = TIER_RANK[tier] < TIER_RANK[tierGate as Tier];
            return (
              <div key={cat}>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 flex items-center gap-1.5">
                    {cat === "admin" && <Crown className="h-3 w-3 text-yellow-300" />}
                    {cat === "elite" && <Zap className="h-3 w-3 text-cyan-300" />}
                    {cat === "public" && <Hash className="h-3 w-3 text-white/40" />}
                    {cat}
                  </span>
                </div>
                <div className="space-y-0.5">
                  {list.map((c) => {
                    const isActive = c.id === activeId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveId(c.id)}
                        disabled={gated}
                        className={`group w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm transition relative
                          ${isActive ? "bg-gradient-to-r from-cyan-300/15 to-fuchsia-300/10 text-white" : "text-white/55 hover:text-white hover:bg-white/[0.04]"}
                          ${gated ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        {gated ? <Lock className="h-3.5 w-3.5 text-yellow-300/70" /> : <Hash className="h-3.5 w-3.5" />}
                        <span className="truncate">{c.name}</span>
                        {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-gradient-to-b from-cyan-300 to-fuchsia-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* User card */}
        <div className="border-t border-white/5 p-3 bg-black/40">
          <div className="flex items-center gap-2">
            <div className={`relative h-9 w-9 rounded-full ring-2 ${TIER_STYLE[tier].ring} bg-gradient-to-br from-cyan-400 to-fuchsia-400 flex items-center justify-center text-xs font-bold text-[#05060d]`}>
              {(userProfile?.full_name || user.email || "U").charAt(0).toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#08081a]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold truncate text-white">{userProfile?.full_name || user.email?.split("@")[0]}</div>
              <div className={`text-[10px] uppercase tracking-wider flex items-center gap-1 ${TIER_STYLE[tier].color}`}>
                <TierIcon className="h-2.5 w-2.5" />
                {TIER_STYLE[tier].label}
              </div>
            </div>
          </div>
          {tier === "operator" && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-white/40 mb-1">
                <span>Bandwidth</span>
                <span>{Math.min(transmissions?.used || 0, 10)}/10</span>
              </div>
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-300 to-yellow-300" style={{ width: `${Math.min(((transmissions?.used || 0)/10)*100, 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main chat */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Channel header */}
        <div className="h-14 flex items-center justify-between border-b border-white/5 bg-[#06061a]/70 backdrop-blur px-4">
          <div className="flex items-center gap-3 min-w-0">
            {active ? (
              <>
                {active.category === "admin" ? <Crown className="h-4 w-4 text-yellow-300" /> :
                 active.category === "elite" ? <Zap className="h-4 w-4 text-cyan-300" /> :
                 <Hash className="h-4 w-4 text-white/50" />}
                <span className="font-semibold text-white truncate">{active.name}</span>
                {active.description && (
                  <span className="hidden lg:inline text-xs text-white/40 border-l border-white/10 pl-3 truncate">{active.description}</span>
                )}
              </>
            ) : <span className="text-white/40 text-sm">Select a channel</span>}
          </div>
          <div className="flex items-center gap-2">
            {pinned.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white rounded-md px-2 py-1 border border-white/10 bg-white/[0.03]">
                    <Pin className="h-3.5 w-3.5 text-yellow-300" /> {pinned.length}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-[#0a0a18] border-white/10 text-white">
                  <p className="text-[10px] uppercase tracking-wider text-yellow-300/80 mb-2">// pinned transmissions</p>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {pinned.map((m) => (
                      <div key={m.id} className="rounded border border-white/10 bg-white/[0.03] p-2 text-xs">
                        <div className="font-semibold text-white/80">{profiles[m.user_id]?.full_name || "Operator"}</div>
                        <div className="text-white/60 whitespace-pre-wrap">{m.content}</div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <button onClick={() => setMembers((m) => !m)} className="inline-flex items-center gap-1 text-xs text-white/60 hover:text-white rounded-md px-2 py-1 border border-white/10 bg-white/[0.03]">
              <Users className="h-3.5 w-3.5" /> {onlineCount}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-white/40">
              <div className="relative h-16 w-16">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-cyan-400/40 via-fuchsia-400/30 to-yellow-300/40 blur" />
                <div className="relative h-full w-full rounded-2xl border border-cyan-300/40 bg-black p-1">
                  <img src={tygn_logo} alt="" className="h-full w-full object-contain" />
                </div>
              </div>
              <p className="text-sm">No transmissions in this channel yet.</p>
              <p className="text-[10px] uppercase tracking-[0.25em]">// be the first signal</p>
            </div>
          ) : messages.map((m, idx) => {
            const prev = messages[idx-1];
            const grouped = prev && prev.user_id === m.user_id && (new Date(m.created_at).getTime() - new Date(prev.created_at).getTime() < 5*60*1000);
            const author = profiles[m.user_id];
            const myReactions = reactions.filter((r) => r.message_id === m.id);
            const grouped_rx = myReactions.reduce<Record<string, { count: number; mine: boolean }>>((acc, r) => {
              acc[r.emoji] ||= { count: 0, mine: false };
              acc[r.emoji].count++;
              if (r.user_id === user.id) acc[r.emoji].mine = true;
              return acc;
            }, {});
            const replyTarget = m.reply_to_id ? messages.find((x) => x.id === m.reply_to_id) : null;
            const canManage = isAdminTier || m.user_id === user.id;
            return (
              <div key={m.id} className={`group relative px-2 -mx-2 rounded-md hover:bg-white/[0.03] transition ${grouped ? "py-0.5" : "py-1.5 mt-2"}`}>
                {replyTarget && (
                  <div className="ml-12 mb-1 flex items-center gap-1.5 text-[11px] text-white/40">
                    <Reply className="h-3 w-3" />
                    <span className="text-cyan-300/70">@{profiles[replyTarget.user_id]?.full_name || "operator"}</span>
                    <span className="truncate max-w-xs">{replyTarget.content}</span>
                  </div>
                )}
                <div className="flex gap-3">
                  {grouped ? (
                    <div className="w-9 shrink-0 text-[10px] text-white/0 group-hover:text-white/30 self-start text-center pt-0.5">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  ) : (
                    <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 via-fuchsia-400 to-yellow-300 flex items-center justify-center text-xs font-bold text-[#05060d]">
                      {(author?.full_name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    {!grouped && (
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-sm bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
                          {author?.full_name || "Operator"}
                        </span>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider">
                          {new Date(m.created_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                        </span>
                        {m.is_pinned && <Pin className="h-3 w-3 text-yellow-300" />}
                      </div>
                    )}
                    {m.sticker ? (
                      <div className="text-4xl leading-tight">{m.sticker}</div>
                    ) : (
                      <p className="text-sm text-white/85 whitespace-pre-wrap break-words">{m.content}</p>
                    )}
                    {Object.keys(grouped_rx).length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {Object.entries(grouped_rx).map(([e, v]) => (
                          <button
                            key={e}
                            onClick={() => toggleReact(m, e)}
                            className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs transition
                              ${v.mine ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20"}`}
                          >
                            <span>{e}</span><span>{v.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover actions */}
                <div className="absolute right-2 -top-3 opacity-0 group-hover:opacity-100 transition flex items-center rounded-md border border-white/10 bg-[#0a0a18] shadow-lg">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-1.5 text-white/60 hover:text-white" title="React"><Smile className="h-3.5 w-3.5" /></button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2 bg-[#0a0a18] border-white/10">
                      <div className="flex gap-1">
                        {QUICK_REACTIONS.map((e) => (
                          <button key={e} onClick={() => toggleReact(m, e)} className="text-xl hover:scale-125 transition">{e}</button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <button onClick={() => { setReply(m); inputRef.current?.focus(); }} className="p-1.5 text-white/60 hover:text-white" title="Reply"><Reply className="h-3.5 w-3.5" /></button>
                  {isAdminTier && (
                    <button onClick={() => togglePin(m)} className="p-1.5 text-yellow-300/80 hover:text-yellow-300" title="Pin">
                      <Pin className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {canManage && (
                    <button onClick={() => deleteMsg(m)} className="p-1.5 text-red-400 hover:text-red-300" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Composer */}
        <div className="border-t border-white/5 bg-[#06061a]/70 backdrop-blur p-3">
          <AnimatePresence>
            {reply && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-2 flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-300/5 px-3 py-1.5 text-xs"
              >
                <Reply className="h-3 w-3 text-cyan-300" />
                <span className="text-white/60">Replying to</span>
                <span className="text-cyan-300 font-semibold">{profiles[reply.user_id]?.full_name || "operator"}</span>
                <span className="text-white/40 truncate flex-1">{reply.content}</span>
                <button onClick={() => setReply(null)} className="text-white/50 hover:text-white"><X className="h-3 w-3" /></button>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.03] focus-within:border-cyan-300/40 transition px-3 py-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-white/50 hover:text-cyan-300" title="Stickers">
                  <Smile className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 bg-[#0a0a18] border-white/10">
                <p className="text-[10px] uppercase tracking-wider text-fuchsia-300/80 mb-2">
                  // sticker pack {TIER_RANK[tier] >= 2 ? "· elite unlocked" : ""}
                </p>
                <div className="grid grid-cols-8 gap-1">
                  {STICKERS.slice(0, TIER_RANK[tier] >= 2 ? STICKERS.length : 8).map((s) => (
                    <button key={s} onClick={() => send(s)} className="text-2xl hover:scale-110 transition">{s}</button>
                  ))}
                </div>
                {TIER_RANK[tier] < 2 && (
                  <p className="mt-2 text-[10px] text-white/40">Reach Elite tier to unlock all stickers.</p>
                )}
              </PopoverContent>
            </Popover>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={active ? `Transmit to #${active.name}` : "Select a channel"}
              rows={1}
              disabled={!active}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none resize-none max-h-32"
            />
            <Button onClick={() => send()} disabled={!active || !input.trim()} size="sm" className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-[#05060d] hover:opacity-90">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {tier === "operator" && (
            <p className="mt-1.5 text-[10px] text-white/40 text-center uppercase tracking-wider">
              Operator bandwidth · 10 transmissions / day · {Math.max(0, 10 - (transmissions?.used || 0))} remaining
            </p>
          )}
        </div>
      </main>

      {/* Members panel */}
      {members && (
        <aside className="hidden xl:flex w-60 shrink-0 flex-col border-l border-white/5 bg-[#08081a]/80 backdrop-blur-xl relative z-10">
          <div className="h-14 flex items-center px-4 border-b border-white/5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">// online · {onlineCount}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {Object.entries(presence).map(([id, p]) => (
              <div key={id} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/[0.04]">
                <div className="relative h-7 w-7 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-400 flex items-center justify-center text-[10px] font-bold text-[#05060d]">
                  {(p.full_name || "?").charAt(0).toUpperCase()}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#08081a]" />
                </div>
                <span className="text-xs text-white/70 truncate">{p.full_name}</span>
              </div>
            ))}
            {onlineCount === 0 && <p className="text-xs text-white/30 text-center py-6">No operators online.</p>}
          </div>
        </aside>
      )}

      {/* Bandwidth dialog */}
      <Dialog open={bandwidth} onOpenChange={setBandwidth}>
        <DialogContent className="bg-[#05060d] border-yellow-300/40 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-300">
              <AlertTriangle className="h-5 w-5 animate-pulse" /> BANDWIDTH EXHAUSTED
            </DialogTitle>
            <DialogDescription className="text-white/60 pt-2">
              Operator tier is rate-limited to <span className="text-yellow-300 font-semibold">10 transmissions / day</span>.
              Your quota refreshes at <span className="text-cyan-300">00:00 UTC</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-yellow-300/20 bg-yellow-300/5 p-3 text-xs text-white/70">
            // Upgrade to <span className="text-cyan-300 font-semibold">ELITE</span> tier for unlimited transmissions, exclusive channels, and the full sticker pack.
          </div>
          <Button onClick={() => setBandwidth(false)} className="w-full bg-gradient-to-r from-cyan-300 to-yellow-300 text-[#05060d]">
            Acknowledge
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;

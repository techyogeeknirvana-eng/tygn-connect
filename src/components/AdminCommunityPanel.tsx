import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Shield, Zap, Sparkles, Ban, Mic, MicOff, RotateCcw, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsAdmin } from "@/hooks/useIsAdmin";

type Tier = "supreme" | "co_admin" | "elite" | "operator";
const TIER_ICONS: Record<Tier, any> = { supreme: Crown, co_admin: Shield, elite: Zap, operator: Sparkles };
const TIER_COLORS: Record<Tier, string> = {
  supreme: "text-yellow-300 border-yellow-300/40 bg-yellow-300/10",
  co_admin: "text-fuchsia-300 border-fuchsia-300/40 bg-fuchsia-300/10",
  elite: "text-cyan-300 border-cyan-300/40 bg-cyan-300/10",
  operator: "text-white/60 border-white/20 bg-white/5",
};

interface Row {
  id: string; full_name: string | null; branch: string | null;
  tier: Tier; banned: boolean; muted_until: string | null; transmissions_used: number;
}

export const AdminCommunityPanel = () => {
  const { toast } = useToast();
  const { isAdmin } = useIsAdmin();
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("id,full_name,branch").eq("approval_status", "approved").order("full_name");
    const ids = (profiles || []).map((p: any) => p.id);
    if (!ids.length) { setRows([]); setLoading(false); return; }
    const [{ data: roles }, { data: states }, tiers] = await Promise.all([
      supabase.from("user_roles").select("user_id,role").in("user_id", ids),
      supabase.from("user_chat_state" as any).select("user_id,banned,muted_until,transmissions_used,transmissions_date").in("user_id", ids),
      Promise.all(ids.map((id) => (supabase.rpc as any)("get_user_tier", { _uid: id }).then((r: any) => [id, (r.data as Tier) || "operator"] as const))),
    ]);
    const tierMap = Object.fromEntries(await tiers);
    const stateMap = Object.fromEntries(((states as any[]) || []).map((s: any) => [s.user_id, s]));
    setRows((profiles || []).map((p: any) => ({
      id: p.id,
      full_name: p.full_name,
      branch: p.branch,
      tier: tierMap[p.id] || "operator",
      banned: stateMap[p.id]?.banned || false,
      muted_until: stateMap[p.id]?.muted_until || null,
      transmissions_used: stateMap[p.id]?.transmissions_date === new Date().toISOString().slice(0,10) ? (stateMap[p.id]?.transmissions_used || 0) : 0,
    })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setTier = async (r: Row, newTier: Tier) => {
    // Remove existing co_admin/elite role rows for this user
    await supabase.from("user_roles").delete().eq("user_id", r.id).in("role", ["co_admin", "elite"] as any);
    if (newTier === "co_admin" || newTier === "elite") {
      const { error } = await supabase.from("user_roles").insert({ user_id: r.id, role: newTier as any });
      if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    }
    toast({ title: `Tier set to ${newTier}` });
    load();
  };

  const upsertState = async (id: string, patch: Record<string, any>) => {
    const { error } = await supabase.from("user_chat_state" as any).upsert({ user_id: id, ...patch }, { onConflict: "user_id" });
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else load();
  };

  const ban = (r: Row) => upsertState(r.id, { banned: !r.banned });
  const mute = (r: Row, minutes: number) => upsertState(r.id, { muted_until: minutes ? new Date(Date.now() + minutes*60000).toISOString() : null });
  const resetTx = (r: Row) => upsertState(r.id, { transmissions_used: 0, transmissions_date: new Date().toISOString().slice(0,10) });

  const filtered = rows.filter((r) => !q || (r.full_name || "").toLowerCase().includes(q.toLowerCase()) || (r.branch || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <Card className="bg-[#0a0f1f] border-cyan-300/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-200">
          <Crown className="w-5 h-5" /> Community Command
        </CardTitle>
        <p className="text-xs text-white/50">Assign tier roles, ban, mute, and reset operator bandwidth.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input placeholder="Search operators…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        {loading ? <p className="text-white/50 text-sm">Loading…</p> : (
          <div className="max-h-[600px] overflow-y-auto space-y-2">
            {filtered.map((r) => {
              const Icon = TIER_ICONS[r.tier];
              const muted = r.muted_until && new Date(r.muted_until) > new Date();
              return (
                <div key={r.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-3 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 min-w-[180px] flex-1">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-400 flex items-center justify-center text-xs font-bold text-[#05060d]">
                      {(r.full_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{r.full_name || "Operator"}</div>
                      <div className="text-[10px] text-white/40">{r.branch || "—"} · {r.transmissions_used}/10 today</div>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${TIER_COLORS[r.tier]} uppercase tracking-wider`}>
                    <Icon className="w-3 h-3 mr-1" /> {r.tier.replace("_", " ")}
                  </Badge>
                  {r.banned && <Badge variant="outline" className="border-red-400/40 text-red-300 bg-red-400/10">Banned</Badge>}
                  {muted && <Badge variant="outline" className="border-yellow-300/40 text-yellow-200 bg-yellow-300/10">Muted</Badge>}
                  {isAdmin ? (
                    <Select value={r.tier === "supreme" ? "supreme" : r.tier} onValueChange={(v) => setTier(r, v as Tier)} disabled={r.tier === "supreme"}>
                      <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="co_admin">Co-Admin</SelectItem>
                        <SelectItem value="elite">Elite</SelectItem>
                        <SelectItem value="operator">Operator</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-[10px] text-white/30 uppercase tracking-wider w-[140px] text-center">Admin sets tier</span>
                  )}
                  <Button size="sm" variant="outline" onClick={() => ban(r)} className={r.banned ? "border-red-400/60 text-red-300" : ""}>
                    <Ban className="w-3.5 h-3.5 mr-1" /> {r.banned ? "Unban" : "Ban"}
                  </Button>
                  {muted ? (
                    <Button size="sm" variant="outline" onClick={() => mute(r, 0)}>
                      <Mic className="w-3.5 h-3.5 mr-1" /> Unmute
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => mute(r, 60)}>
                      <MicOff className="w-3.5 h-3.5 mr-1" /> Mute 1h
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => resetTx(r)} title="Reset transmissions">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              );
            })}
            {filtered.length === 0 && <p className="text-white/40 text-sm text-center py-6">No operators found.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

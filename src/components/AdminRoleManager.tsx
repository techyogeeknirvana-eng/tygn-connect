import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldPlus, ShieldX, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  branch: string | null;
  is_moderator?: boolean;
}

export const AdminRoleManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: mods }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, avatar_url, branch").eq("approval_status", "approved").order("full_name"),
      supabase.from("user_roles").select("user_id").eq("role", "moderator"),
    ]);
    const modIds = new Set((mods || []).map((m: any) => m.user_id));
    setUsers((profiles || []).map((p: any) => ({ ...p, is_moderator: modIds.has(p.id) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const promote = async (u: ProfileRow) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: u.id, role: "moderator" });
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: `${u.full_name || "User"} is now a Mini Admin` });
    load();
  };

  const demote = async (u: ProfileRow) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", u.id).eq("role", "moderator");
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Role removed" });
    load();
  };

  const filtered = users.filter((u) =>
    !q || (u.full_name || "").toLowerCase().includes(q.toLowerCase()) || (u.branch || "").toLowerCase().includes(q.toLowerCase())
  );
  const mods = filtered.filter((u) => u.is_moderator);
  const rest = filtered.filter((u) => !u.is_moderator);

  return (
    <Card className="bg-[#0a0f1f] border-cyan-300/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-200">
          <Shield className="w-5 h-5" /> Mini Admin Roles
        </CardTitle>
        <p className="text-xs text-white/50">
          Mini admins can approve submissions, manage live posts, and edit content. Only the main admin can promote or demote.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input placeholder="Search by name or branch" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>

        <div>
          <div className="text-[10px] tracking-[0.25em] text-fuchsia-300/70 mb-2">// ACTIVE MINI ADMINS · {mods.length}</div>
          {mods.length === 0 ? (
            <p className="text-xs text-white/40 py-2">No mini admins yet. Promote a trusted user below.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {mods.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-2 rounded border border-fuchsia-300/20 bg-fuchsia-300/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-300 flex items-center justify-center text-xs font-bold text-[#05060d]">
                      {(u.full_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate text-white">{u.full_name || "Unnamed"}</div>
                      <div className="text-[10px] text-white/40 truncate">{u.branch || "—"}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => demote(u)}>
                    <ShieldX className="w-4 h-4 mr-1" /> Demote
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-[10px] tracking-[0.25em] text-cyan-300/70 mb-2">// APPROVED USERS · {rest.length}</div>
          {loading ? (
            <p className="text-xs text-white/40">Loading…</p>
          ) : (
            <div className="max-h-[420px] overflow-y-auto grid sm:grid-cols-2 gap-2">
              {rest.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-2 rounded border border-white/10 bg-white/[0.02]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-yellow-300 flex items-center justify-center text-xs font-bold text-[#05060d]">
                      {(u.full_name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate text-white">{u.full_name || "Unnamed"}</div>
                      <div className="text-[10px] text-white/40 truncate">{u.branch || "—"}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => promote(u)} className="border-cyan-300/40 text-cyan-200 hover:bg-cyan-300/10">
                    <ShieldPlus className="w-4 h-4 mr-1" /> Make Mini Admin
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

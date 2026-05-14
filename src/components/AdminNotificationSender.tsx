import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Send, Trash2, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const AdminNotificationSender = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [important, setImportant] = useState(false);
  const [target, setTarget] = useState<string>("__broadcast");
  const [users, setUsers] = useState<{ id: string; full_name: string | null }[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [{ data: u }, { data: n }] = await Promise.all([
      supabase.from("profiles").select("id, full_name").order("full_name"),
      supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    setUsers(u || []);
    setRecent(n || []);
  };

  useEffect(() => { load(); }, []);

  const send = async () => {
    if (!user) return;
    if (!title.trim() || !body.trim()) return toast({ title: "Title and message required", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("notifications").insert({
      title: title.trim(),
      body: body.trim(),
      important,
      target_user_id: target === "__broadcast" ? null : target,
      created_by: user.id,
    });
    setBusy(false);
    if (error) return toast({ title: "Send failed", description: error.message, variant: "destructive" });
    toast({ title: "Transmission sent" });
    setTitle(""); setBody(""); setImportant(false); setTarget("__broadcast");
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Megaphone className="w-5 h-5 text-accent" />Send Transmission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Recipient</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__broadcast">📡 Broadcast to everyone</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.full_name || u.id.slice(0, 8)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Important update…" maxLength={120} />
          </div>
          <div>
            <Label>Message *</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your instructions or announcement…" rows={5} maxLength={2000} />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <Label className="cursor-pointer">Mark as IMPORTANT</Label>
              <p className="text-xs text-muted-foreground">Shows a warning icon and highlight.</p>
            </div>
            <Switch checked={important} onCheckedChange={setImportant} />
          </div>
          <Button onClick={send} disabled={busy} className="w-full">
            <Send className="w-4 h-4 mr-2" />{busy ? "Sending…" : "Send Transmission"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transmissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[560px] overflow-y-auto">
          {recent.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground text-sm">No transmissions yet.</p>
          ) : recent.map((n) => (
            <div key={n.id} className="rounded-md border border-border p-3 bg-muted/30">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{n.title}</span>
                    {n.important && <Badge variant="outline" className="text-yellow-400 border-yellow-400/40">Important</Badge>}
                    <Badge variant="secondary">{n.target_user_id ? "Personal" : "Broadcast"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.body}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => remove(n.id)} className="text-destructive shrink-0">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

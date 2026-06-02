import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminEditDialog, EditTable } from "@/components/AdminEditDialog";

type T = "events" | "jobs" | "internships";
const labels: Record<T, string> = { events: "Events", jobs: "Jobs", internships: "Internships" };

export const AdminLiveManage = () => {
  const { toast } = useToast();
  const [data, setData] = useState<Record<T, any[]>>({ events: [], jobs: [], internships: [] });
  const [editing, setEditing] = useState<{ table: EditTable; row: any } | null>(null);

  const load = async () => {
    const [{ data: e }, { data: j }, { data: i }] = await Promise.all([
      supabase.from("events").select("*").eq("status", "approved").order("created_at", { ascending: false }),
      supabase.from("jobs").select("*").eq("status", "approved").order("created_at", { ascending: false }),
      supabase.from("internships").select("*").eq("status", "approved").order("created_at", { ascending: false }),
    ]);
    setData({ events: e || [], jobs: j || [], internships: i || [] });
  };

  useEffect(() => { load(); }, []);

  const remove = async (table: T, id: string) => {
    if (!confirm(`Delete this ${table.slice(0, -1)} permanently?`)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Deleted" });
    load();
  };

  const unpublish = async (table: T, id: string) => {
    const { error } = await supabase.from(table).update({ status: "rejected" }).eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  const renderRow = (table: T, r: any) => (
    <div key={r.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3 bg-muted/30">
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate">{r.title}</div>
        <div className="text-xs text-muted-foreground truncate">
          {table === "events" && `${r.event_date ? new Date(r.event_date).toLocaleDateString() : "No date"} · ${r.location || "—"}`}
          {table !== "events" && `${r.company} · ${r.location || "Remote"}`}
        </div>
      </div>
      <Badge variant="outline" className="text-secondary">Live</Badge>
      <Button size="sm" variant="outline" onClick={() => setEditing({ table, row: r })}>
        <Pencil className="w-3.5 h-3.5 mr-1" />Edit
      </Button>
      <Button size="sm" variant="outline" onClick={() => unpublish(table, r.id)}>Unpublish</Button>
      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(table, r.id)}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Content Management</span>
          <Button size="sm" variant="ghost" onClick={load}><RefreshCw className="w-4 h-4 mr-1" />Refresh</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="events">
          <TabsList className="grid grid-cols-3 mb-4">
            {(Object.keys(labels) as T[]).map((k) => (
              <TabsTrigger key={k} value={k}>{labels[k]} <Badge variant="secondary" className="ml-2">{data[k].length}</Badge></TabsTrigger>
            ))}
          </TabsList>
          {(Object.keys(labels) as T[]).map((k) => (
            <TabsContent key={k} value={k} className="space-y-2 max-h-[520px] overflow-y-auto">
              {data[k].length === 0
                ? <p className="text-muted-foreground text-center py-6 text-sm">Nothing live.</p>
                : data[k].map((r) => renderRow(k, r))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

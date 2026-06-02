import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle, XCircle, Calendar, Briefcase, GraduationCap, FileText, Megaphone, Settings, Pencil, ShieldCheck } from "lucide-react";
import { AdminUserManagement } from "@/components/AdminUserManagement";
import { AdminNotificationSender } from "@/components/AdminNotificationSender";
import { AdminLiveManage } from "@/components/AdminLiveManage";
import { AdminRoleManager } from "@/components/AdminRoleManager";
import { AdminEditDialog, EditTable } from "@/components/AdminEditDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsModerator } from "@/hooks/useIsModerator";

type TableName = "events" | "jobs" | "internships" | "notes_contributions";

const Admin = () => {
  const { toast } = useToast();
  const { isModerator, isAdmin, loading } = useIsModerator();

  const [events, setEvents] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [interns, setInterns] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [editing, setEditing] = useState<{ table: EditTable; row: any } | null>(null);

  const loadAll = async () => {
    const [{ data: e }, { data: j }, { data: i }, { data: n }] = await Promise.all([
      supabase.from("events").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("jobs").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("internships").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("notes_contributions").select("*").eq("status", "pending").order("created_at", { ascending: false }),
    ]);
    setEvents(e || []); setJobs(j || []); setInterns(i || []); setNotes(n || []);
  };

  useEffect(() => { if (isModerator) loadAll(); }, [isModerator]);

  const decide = async (table: TableName, id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    toast({ title: status === "approved" ? "Approved" : "Rejected" });
    loadAll();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#05060d] text-white"><div className="animate-pulse">Loading…</div></div>;

  if (!isModerator) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05060d]">
        <Card className="max-w-md bg-[#0a0f1f] border-cyan-300/20"><CardContent className="p-8 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-white">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
        </CardContent></Card>
      </div>
    );
  }

  const PendingList = ({
    rows, table, renderTitle, renderMeta, editable,
  }: {
    rows: any[]; table: TableName;
    renderTitle: (r: any) => string;
    renderMeta: (r: any) => string;
    editable?: boolean;
  }) => (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">No pending items</p>
      ) : rows.map((r) => (
        <Card key={r.id} className="bg-[#0a0f1f]/60 border-cyan-300/10 hover:border-cyan-300/30 transition">
          <CardContent className="p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {r.image_url && <img src={r.image_url} alt="" loading="lazy" className="h-20 rounded mb-2 border border-white/10" />}
              <h4 className="font-semibold text-white">{renderTitle(r)}</h4>
              <p className="text-sm text-muted-foreground mt-1">{renderMeta(r)}</p>
              {r.description && <p className="text-sm mt-2 line-clamp-3 text-white/70">{r.description}</p>}
              {r.content && <p className="text-sm mt-2 line-clamp-3 text-white/70">{r.content}</p>}
              {r.link && <a href={r.link} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 underline mt-1 inline-block">Open link</a>}
              {r.file_url && <a href={r.file_url} target="_blank" rel="noreferrer" className="text-xs text-cyan-300 underline mt-1 inline-block">Open file</a>}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button size="sm" variant="outline" className="text-emerald-300 border-emerald-400/40 hover:bg-emerald-400/10" onClick={() => decide(table, r.id, "approved")}>
                <CheckCircle className="w-4 h-4 mr-1" />Approve
              </Button>
              <Button size="sm" variant="outline" className="text-destructive border-destructive/40 hover:bg-destructive/10" onClick={() => decide(table, r.id, "rejected")}>
                <XCircle className="w-4 h-4 mr-1" />Reject
              </Button>
              {editable && (
                <Button size="sm" variant="outline" className="border-cyan-300/40 text-cyan-200 hover:bg-cyan-300/10"
                  onClick={() => setEditing({ table: table as EditTable, row: r })}>
                  <Pencil className="w-4 h-4 mr-1" />Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-[#05060d] via-[#070b1d] to-[#05060d] text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-cyan-400/30 blur-lg" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-400 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#05060d]" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                {isAdmin ? "Command Center" : "Mini Admin Console"}
              </h1>
              <p className="text-sm text-white/50">Approve users, moderate submissions, edit live posts.</p>
            </div>
          </div>
          <Badge className={isAdmin ? "bg-cyan-300/15 text-cyan-200 border-cyan-300/30" : "bg-fuchsia-300/15 text-fuchsia-200 border-fuchsia-300/30"}>
            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> {isAdmin ? "ADMIN" : "MINI ADMIN"}
          </Badge>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className={`grid w-full ${isAdmin ? "grid-cols-8" : "grid-cols-7"} bg-[#0a0f1f]/80 border border-cyan-300/15`}>
            <TabsTrigger value="users">Users</TabsTrigger>
            {isAdmin && <TabsTrigger value="roles"><Shield className="w-3.5 h-3.5 mr-1" />Roles</TabsTrigger>}
            <TabsTrigger value="notify"><Megaphone className="w-3.5 h-3.5 mr-1" />Notify</TabsTrigger>
            <TabsTrigger value="manage"><Settings className="w-3.5 h-3.5 mr-1" />Manage</TabsTrigger>
            <TabsTrigger value="events">Events <Badge variant="secondary" className="ml-2">{events.length}</Badge></TabsTrigger>
            <TabsTrigger value="jobs">Jobs <Badge variant="secondary" className="ml-2">{jobs.length}</Badge></TabsTrigger>
            <TabsTrigger value="internships">Interns <Badge variant="secondary" className="ml-2">{interns.length}</Badge></TabsTrigger>
            <TabsTrigger value="notes">Notes <Badge variant="secondary" className="ml-2">{notes.length}</Badge></TabsTrigger>
          </TabsList>

          <TabsContent value="users"><AdminUserManagement /></TabsContent>
          {isAdmin && <TabsContent value="roles"><AdminRoleManager /></TabsContent>}
          <TabsContent value="notify"><AdminNotificationSender /></TabsContent>
          <TabsContent value="manage"><AdminLiveManage /></TabsContent>

          <TabsContent value="events">
            <Card className="bg-[#0a0f1f] border-cyan-300/20">
              <CardHeader><CardTitle className="flex items-center gap-2 text-cyan-200"><Calendar className="w-5 h-5" />Pending Events</CardTitle></CardHeader>
              <CardContent>
                <PendingList rows={events} table="events" editable
                  renderTitle={(r) => r.title}
                  renderMeta={(r) => `${r.event_date ? new Date(r.event_date).toLocaleString() : "No date"} • ${r.location || "No location"}`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card className="bg-[#0a0f1f] border-cyan-300/20">
              <CardHeader><CardTitle className="flex items-center gap-2 text-yellow-300"><Briefcase className="w-5 h-5" />Pending Jobs</CardTitle></CardHeader>
              <CardContent>
                <PendingList rows={jobs} table="jobs" editable
                  renderTitle={(r) => r.title}
                  renderMeta={(r) => `${r.company} • ${r.location || "Remote"} • ${r.job_type || ""}`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internships">
            <Card className="bg-[#0a0f1f] border-cyan-300/20">
              <CardHeader><CardTitle className="flex items-center gap-2 text-fuchsia-300"><GraduationCap className="w-5 h-5" />Pending Internships</CardTitle></CardHeader>
              <CardContent>
                <PendingList rows={interns} table="internships" editable
                  renderTitle={(r) => r.title}
                  renderMeta={(r) => `${r.company} • ${r.location || "Remote"} • ${r.duration || ""}`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card className="bg-[#0a0f1f] border-cyan-300/20">
              <CardHeader><CardTitle className="flex items-center gap-2 text-cyan-200"><FileText className="w-5 h-5" />Pending Notes</CardTitle></CardHeader>
              <CardContent>
                <PendingList rows={notes} table="notes_contributions"
                  renderTitle={(r) => r.subject}
                  renderMeta={(r) => `By ${r.contributor_name}`}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AdminEditDialog
          open={!!editing}
          onOpenChange={(v) => !v && setEditing(null)}
          table={editing?.table || "events"}
          row={editing?.row}
          onSaved={loadAll}
        />
      </div>
    </div>
  );
};

export default Admin;

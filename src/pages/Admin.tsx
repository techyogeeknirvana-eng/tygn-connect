import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle, XCircle, Calendar, Briefcase, GraduationCap, FileText, Megaphone, Settings } from "lucide-react";
import { AdminUserManagement } from "@/components/AdminUserManagement";
import { AdminNotificationSender } from "@/components/AdminNotificationSender";
import { AdminLiveManage } from "@/components/AdminLiveManage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";

type TableName = "events" | "jobs" | "internships" | "notes_contributions";

const Admin = () => {
  const { toast } = useToast();
  const { isAdmin, loading } = useIsAdmin();

  const [events, setEvents] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [interns, setInterns] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  const loadAll = async () => {
    const [{ data: e }, { data: j }, { data: i }, { data: n }] = await Promise.all([
      supabase.from("events").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("jobs").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("internships").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("notes_contributions").select("*").eq("status", "pending").order("created_at", { ascending: false }),
    ]);
    setEvents(e || []); setJobs(j || []); setInterns(i || []); setNotes(n || []);
  };

  useEffect(() => { if (isAdmin) loadAll(); }, [isAdmin]);

  const decide = async (table: TableName, id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: status === "approved" ? "Approved" : "Rejected" });
    loadAll();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse">Loading…</div></div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md"><CardContent className="p-8 text-center">
          <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access the admin dashboard.</p>
        </CardContent></Card>
      </div>
    );
  }

  const PendingList = ({
    rows, table, renderTitle, renderMeta,
  }: {
    rows: any[]; table: TableName;
    renderTitle: (r: any) => string;
    renderMeta: (r: any) => string;
  }) => (
    <div className="space-y-3">
      {rows.length === 0 ? (
        <p className="text-muted-foreground text-center py-6">No pending items</p>
      ) : rows.map((r) => (
        <Card key={r.id} className="bg-muted/40">
          <CardContent className="p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold">{renderTitle(r)}</h4>
              <p className="text-sm text-muted-foreground mt-1">{renderMeta(r)}</p>
              {r.description && <p className="text-sm mt-2 line-clamp-3">{r.description}</p>}
              {r.content && <p className="text-sm mt-2 line-clamp-3">{r.content}</p>}
              {r.link && <a href={r.link} target="_blank" rel="noreferrer" className="text-xs text-primary underline mt-1 inline-block">Open link</a>}
              {r.file_url && <a href={r.file_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline mt-1 inline-block">Open file</a>}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button size="sm" variant="outline" className="text-secondary border-secondary" onClick={() => decide(table, r.id, "approved")}>
                <CheckCircle className="w-4 h-4 mr-1" />Approve
              </Button>
              <Button size="sm" variant="outline" className="text-destructive border-destructive" onClick={() => decide(table, r.id, "rejected")}>
                <XCircle className="w-4 h-4 mr-1" />Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Approve users and moderate community submissions.</p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="notify"><Megaphone className="w-3.5 h-3.5 mr-1" />Notify</TabsTrigger>
            <TabsTrigger value="manage"><Settings className="w-3.5 h-3.5 mr-1" />Manage</TabsTrigger>
            <TabsTrigger value="events">Events <Badge variant="secondary" className="ml-2">{events.length}</Badge></TabsTrigger>
            <TabsTrigger value="jobs">Jobs <Badge variant="secondary" className="ml-2">{jobs.length}</Badge></TabsTrigger>
            <TabsTrigger value="internships">Interns <Badge variant="secondary" className="ml-2">{interns.length}</Badge></TabsTrigger>
            <TabsTrigger value="notes">Notes <Badge variant="secondary" className="ml-2">{notes.length}</Badge></TabsTrigger>
          </TabsList>

          <TabsContent value="users"><AdminUserManagement /></TabsContent>
          <TabsContent value="notify"><AdminNotificationSender /></TabsContent>
          <TabsContent value="manage"><AdminLiveManage /></TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-secondary" />Pending Events</CardTitle></CardHeader>
              <CardContent>
                <PendingList rows={events} table="events"
                  renderTitle={(r) => r.title}
                  renderMeta={(r) => `${r.event_date ? new Date(r.event_date).toLocaleString() : "No date"} • ${r.location || "No location"}`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-accent" />Pending Jobs</CardTitle></CardHeader>
              <CardContent>
                <PendingList rows={jobs} table="jobs"
                  renderTitle={(r) => r.title}
                  renderMeta={(r) => `${r.company} • ${r.location || "Remote"} • ${r.job_type || ""}`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internships">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" />Pending Internships</CardTitle></CardHeader>
              <CardContent>
                <PendingList rows={interns} table="internships"
                  renderTitle={(r) => r.title}
                  renderMeta={(r) => `${r.company} • ${r.location || "Remote"} • ${r.duration || ""}`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" />Pending Notes</CardTitle></CardHeader>
              <CardContent>
                <PendingList rows={notes} table="notes_contributions"
                  renderTitle={(r) => r.subject}
                  renderMeta={(r) => `By ${r.contributor_name}`}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

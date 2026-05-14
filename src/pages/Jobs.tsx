import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, MapPin, Building, ExternalLink, Plus, AlertCircle, GraduationCap, Sparkles, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface JobRow {
  id: string; title: string; company: string; location: string | null;
  job_type: string | null; salary_range: string | null;
  description: string | null; link: string | null; image_url: string | null; status: string;
}
interface InternshipRow {
  id: string; title: string; company: string; location: string | null;
  duration: string | null; stipend: string | null;
  description: string | null; link: string | null; image_url: string | null; status: string;
}

const Jobs = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [interns, setInterns] = useState<InternshipRow[]>([]);
  const [myJobs, setMyJobs] = useState<JobRow[]>([]);
  const [myInts, setMyInts] = useState<InternshipRow[]>([]);
  const [tab, setTab] = useState("jobs");

  const emptyJob = { title: "", company: "", location: "", job_type: "Full-time", salary_range: "", description: "", link: "", image_url: "" };
  const emptyInt = { title: "", company: "", location: "", duration: "", stipend: "", description: "", link: "", image_url: "" };
  const [jobForm, setJobForm] = useState(emptyJob);
  const [intForm, setIntForm] = useState(emptyInt);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editingIntId, setEditingIntId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [autofilling, setAutofilling] = useState<"job" | "int" | null>(null);

  const autofill = async (kind: "job" | "int") => {
    const link = (kind === "job" ? jobForm.link : intForm.link).trim();
    if (!link) return toast({ title: "Paste a link first", variant: "destructive" });
    setAutofilling(kind);
    const { data, error } = await supabase.functions.invoke("fetch-link-metadata", { body: { url: link } });
    setAutofilling(null);
    if (error || !data || data.error) {
      return toast({ title: "Could not fetch link", description: error?.message || data?.error, variant: "destructive" });
    }
    if (kind === "job") {
      setJobForm((f) => ({
        ...f,
        title: f.title || data.title || "",
        company: f.company || data.siteName || "",
        description: f.description || data.description || "",
        image_url: f.image_url || data.image || "",
      }));
    } else {
      setIntForm((f) => ({
        ...f,
        title: f.title || data.title || "",
        company: f.company || data.siteName || "",
        description: f.description || data.description || "",
        image_url: f.image_url || data.image || "",
      }));
    }
    toast({ title: "Auto-filled from link" });
  };

  const load = async () => {
    const [{ data: j }, { data: i }] = await Promise.all([
      supabase.from("jobs").select("*").eq("status", "approved").order("created_at", { ascending: false }),
      supabase.from("internships").select("*").eq("status", "approved").order("created_at", { ascending: false }),
    ]);
    setJobs((j as JobRow[]) || []);
    setInterns((i as InternshipRow[]) || []);
  };

  useEffect(() => { load(); }, []);

  const submitJob = async () => {
    if (!user) return toast({ title: "Login required", variant: "destructive" });
    if (!jobForm.title || !jobForm.company) return toast({ title: "Title & company required", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("jobs").insert({ user_id: user.id, ...jobForm, location: jobForm.location || null, salary_range: jobForm.salary_range || null, description: jobForm.description || null, link: jobForm.link || null, image_url: jobForm.image_url || null });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Submitted!", description: "Your job posting awaits admin approval." });
    setJobForm({ title: "", company: "", location: "", job_type: "Full-time", salary_range: "", description: "", link: "", image_url: "" });
    setTab("jobs");
  };

  const submitInt = async () => {
    if (!user) return toast({ title: "Login required", variant: "destructive" });
    if (!intForm.title || !intForm.company) return toast({ title: "Title & company required", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("internships").insert({ user_id: user.id, ...intForm, location: intForm.location || null, duration: intForm.duration || null, stipend: intForm.stipend || null, description: intForm.description || null, link: intForm.link || null, image_url: intForm.image_url || null });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Submitted!", description: "Your internship awaits admin approval." });
    setIntForm({ title: "", company: "", location: "", duration: "", stipend: "", description: "", link: "", image_url: "" });
    setTab("internships");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-accent" />
            <h1 className="text-3xl font-bold">Jobs & Internships</h1>
          </div>
          <p className="text-muted-foreground">Browse approved opportunities and submit your own.</p>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="post-job">Post Job</TabsTrigger>
            <TabsTrigger value="post-int">Post Internship</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            {jobs.length === 0 ? (
              <Card className="text-center py-12"><CardContent><Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No approved jobs yet.</p></CardContent></Card>
            ) : jobs.map((j) => (
              <Card key={j.id} className="overflow-hidden">
                {j.image_url && <img src={j.image_url} alt={j.title} className="w-full h-48 object-cover" loading="lazy" />}
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{j.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Building className="w-4 h-4" />{j.company}</span>
                        {j.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{j.location}</span>}
                      </div>
                    </div>
                    <Badge variant="outline">{j.job_type || "Full-time"}</Badge>
                  </div>
                  {j.salary_range && <Badge variant="outline" className="text-secondary">{j.salary_range}</Badge>}
                  {j.description && <p className="text-sm text-muted-foreground">{j.description}</p>}
                  {j.link && <Button size="sm" onClick={() => window.open(j.link!, "_blank")}><ExternalLink className="w-4 h-4 mr-2" />Apply</Button>}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="internships" className="space-y-4">
            {interns.length === 0 ? (
              <Card className="text-center py-12"><CardContent><GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No approved internships yet.</p></CardContent></Card>
            ) : interns.map((i) => (
              <Card key={i.id} className="overflow-hidden">
                {i.image_url && <img src={i.image_url} alt={i.title} className="w-full h-48 object-cover" loading="lazy" />}
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{i.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Building className="w-4 h-4" />{i.company}</span>
                        {i.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{i.location}</span>}
                      </div>
                    </div>
                    {i.duration && <Badge variant="outline">{i.duration}</Badge>}
                  </div>
                  {i.stipend && <Badge variant="outline" className="text-secondary">Stipend: {i.stipend}</Badge>}
                  {i.description && <p className="text-sm text-muted-foreground">{i.description}</p>}
                  {i.link && <Button size="sm" onClick={() => window.open(i.link!, "_blank")}><ExternalLink className="w-4 h-4 mr-2" />Apply</Button>}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="post-job">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" />Post a Job</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/40 p-3 rounded-md text-sm flex gap-2 items-start"><AlertCircle className="w-4 h-4 mt-0.5 text-accent" /><span>All postings require admin approval.</span></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>Title *</Label><Input value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} /></div>
                  <div><Label>Company *</Label><Input value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} /></div>
                  <div><Label>Location</Label><Input value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} /></div>
                  <div><Label>Type</Label><Input value={jobForm.job_type} onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })} placeholder="Full-time / Part-time / Contract" /></div>
                  <div><Label>Salary range</Label><Input value={jobForm.salary_range} onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })} /></div>
                  <div className="md:col-span-2">
                    <Label>Apply link</Label>
                    <div className="flex gap-2">
                      <Input value={jobForm.link} onChange={(e) => setJobForm({ ...jobForm, link: e.target.value })} placeholder="https://…" />
                      <Button type="button" variant="outline" onClick={() => autofill("job")} disabled={autofilling === "job"}>
                        <Sparkles className="w-4 h-4 mr-2" />{autofilling === "job" ? "Fetching…" : "Auto-fill"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div><Label>Description</Label><Textarea value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} /></div>
                <div>
                  <Label>Poster / Image URL</Label>
                  <Input value={jobForm.image_url} onChange={(e) => setJobForm({ ...jobForm, image_url: e.target.value })} placeholder="https://…/banner.jpg" />
                  {jobForm.image_url && <img src={jobForm.image_url} alt="Preview" className="mt-2 w-full max-h-56 object-cover rounded-md border border-border" />}
                </div>
                <Button onClick={submitJob} disabled={busy}>{busy ? "Submitting…" : "Submit for Approval"}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="post-int">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" />Post an Internship</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/40 p-3 rounded-md text-sm flex gap-2 items-start"><AlertCircle className="w-4 h-4 mt-0.5 text-accent" /><span>All postings require admin approval.</span></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label>Title *</Label><Input value={intForm.title} onChange={(e) => setIntForm({ ...intForm, title: e.target.value })} /></div>
                  <div><Label>Company *</Label><Input value={intForm.company} onChange={(e) => setIntForm({ ...intForm, company: e.target.value })} /></div>
                  <div><Label>Location</Label><Input value={intForm.location} onChange={(e) => setIntForm({ ...intForm, location: e.target.value })} /></div>
                  <div><Label>Duration</Label><Input value={intForm.duration} onChange={(e) => setIntForm({ ...intForm, duration: e.target.value })} placeholder="e.g. 3 months" /></div>
                  <div><Label>Stipend</Label><Input value={intForm.stipend} onChange={(e) => setIntForm({ ...intForm, stipend: e.target.value })} /></div>
                  <div className="md:col-span-2">
                    <Label>Apply link</Label>
                    <div className="flex gap-2">
                      <Input value={intForm.link} onChange={(e) => setIntForm({ ...intForm, link: e.target.value })} placeholder="https://…" />
                      <Button type="button" variant="outline" onClick={() => autofill("int")} disabled={autofilling === "int"}>
                        <Sparkles className="w-4 h-4 mr-2" />{autofilling === "int" ? "Fetching…" : "Auto-fill"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div><Label>Description</Label><Textarea value={intForm.description} onChange={(e) => setIntForm({ ...intForm, description: e.target.value })} /></div>
                <div>
                  <Label>Poster / Image URL</Label>
                  <Input value={intForm.image_url} onChange={(e) => setIntForm({ ...intForm, image_url: e.target.value })} placeholder="https://…/banner.jpg" />
                  {intForm.image_url && <img src={intForm.image_url} alt="Preview" className="mt-2 w-full max-h-56 object-cover rounded-md border border-border" />}
                </div>
                <Button onClick={submitInt} disabled={busy}>{busy ? "Submitting…" : "Submit for Approval"}</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Jobs;

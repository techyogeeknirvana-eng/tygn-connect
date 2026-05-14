import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Plus, ExternalLink, Clock, AlertCircle, Sparkles, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  location: string | null;
  link: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
}

const Events = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "", description: "", event_date: "", location: "", link: "", image_url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [autofilling, setAutofilling] = useState(false);

  const autofillFromLink = async () => {
    if (!form.link.trim()) {
      toast({ title: "Paste a registration link first", variant: "destructive" });
      return;
    }
    setAutofilling(true);
    const { data, error } = await supabase.functions.invoke("fetch-link-metadata", {
      body: { url: form.link.trim() },
    });
    setAutofilling(false);
    if (error || !data || data.error) {
      toast({ title: "Could not fetch link", description: error?.message || data?.error, variant: "destructive" });
      return;
    }
    setForm((f) => ({
      ...f,
      title: f.title || data.title || "",
      description: f.description || data.description || "",
      image_url: f.image_url || data.image || "",
    }));
    toast({ title: "Auto-filled from link" });
  };

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("status", "approved")
      .order("event_date", { ascending: true });
    if (error) console.error(error);
    setEvents((data as EventRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Login required", variant: "destructive" });
      return;
    }
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("events").insert({
      user_id: user.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      event_date: form.event_date || null,
      location: form.location.trim() || null,
      link: form.link.trim() || null,
      image_url: form.image_url.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Submitted!", description: "Your event is awaiting admin approval." });
    setForm({ title: "", description: "", event_date: "", location: "", link: "", image_url: "" });
    setActiveTab("upcoming");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="space-y-2 mb-8">
          <div className="flex items-center space-x-2">
            <Calendar className="w-8 h-8 text-secondary" />
            <h1 className="text-3xl font-bold">Events & Hackathons</h1>
          </div>
          <p className="text-muted-foreground">Discover community-approved events and submit your own.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Browse Events</TabsTrigger>
            <TabsTrigger value="submit">Submit Event</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {loading ? (
              <p className="text-center py-12 text-muted-foreground">Loading…</p>
            ) : events.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No approved events yet. Check back soon.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((e) => (
                  <Card key={e.id} className="overflow-hidden">
                    {e.image_url && (
                      <img src={e.image_url} alt={e.title} className="w-full h-48 object-cover" loading="lazy" />
                    )}
                    <CardContent className="p-6 space-y-3">
                      <h3 className="text-xl font-semibold">{e.title}</h3>
                      {e.description && <p className="text-sm text-muted-foreground">{e.description}</p>}
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {e.event_date && (
                          <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{new Date(e.event_date).toLocaleString()}</div>
                        )}
                        {e.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{e.location}</div>}
                      </div>
                      <Badge variant="outline" className="text-secondary">Approved</Badge>
                      {e.link && (
                        <Button size="sm" onClick={() => window.open(e.link!, "_blank")}>
                          <ExternalLink className="w-4 h-4 mr-2" />Register
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" />Submit New Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/40 p-3 rounded-md text-sm flex gap-2 items-start">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-accent" />
                  <span>All submissions require admin approval before becoming visible to other users.</span>
                </div>
                <div>
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date & Time</Label>
                    <Input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Registration Link</Label>
                  <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://…" />
                </div>
                <div>
                  <Label>Registration Link</Label>
                  <div className="flex gap-2">
                    <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://…" />
                    <Button type="button" variant="outline" onClick={autofillFromLink} disabled={autofilling}>
                      <Sparkles className="w-4 h-4 mr-2" />{autofilling ? "Fetching…" : "Auto-fill"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Paste the registration link and we'll extract title, description, and image automatically.</p>
                </div>
                <div>
                  <Label>Poster / Image URL</Label>
                  <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…/banner.jpg" />
                  {form.image_url && (
                    <div className="mt-2 rounded-md overflow-hidden border border-border">
                      <img src={form.image_url} alt="Preview" className="w-full max-h-56 object-cover" />
                    </div>
                  )}
                </div>
                <Button onClick={handleSubmit} disabled={submitting}>{submitting ? "Submitting…" : "Submit for Approval"}</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;

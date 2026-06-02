import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Image as ImageIcon } from "lucide-react";

export type EditTable = "events" | "jobs" | "internships";

const FIELDS: Record<EditTable, { key: string; label: string; type: "text" | "textarea" | "date" }[]> = {
  events: [
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "event_date", label: "Event date", type: "date" },
    { key: "location", label: "Location", type: "text" },
    { key: "link", label: "Register link", type: "text" },
    { key: "image_url", label: "Image URL", type: "text" },
  ],
  jobs: [
    { key: "title", label: "Title", type: "text" },
    { key: "company", label: "Company", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "job_type", label: "Type", type: "text" },
    { key: "salary_range", label: "Salary", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "link", label: "Apply link", type: "text" },
    { key: "image_url", label: "Image URL", type: "text" },
  ],
  internships: [
    { key: "title", label: "Title", type: "text" },
    { key: "company", label: "Company", type: "text" },
    { key: "location", label: "Location", type: "text" },
    { key: "duration", label: "Duration", type: "text" },
    { key: "stipend", label: "Stipend", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "link", label: "Apply link", type: "text" },
    { key: "image_url", label: "Image URL", type: "text" },
  ],
};

export const AdminEditDialog = ({
  open, onOpenChange, table, row, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  table: EditTable;
  row: any | null;
  onSaved?: () => void;
}) => {
  const { toast } = useToast();
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (row) {
      const init: Record<string, any> = {};
      FIELDS[table].forEach((f) => {
        let v = row[f.key];
        if (f.type === "date" && v) v = new Date(v).toISOString().slice(0, 16);
        init[f.key] = v ?? "";
      });
      setForm(init);
    }
  }, [row, table]);

  const save = async () => {
    if (!row) return;
    setSaving(true);
    const payload: Record<string, any> = { ...form };
    if (payload.event_date) payload.event_date = new Date(payload.event_date).toISOString();
    Object.keys(payload).forEach((k) => { if (payload[k] === "") payload[k] = null; });
    const { error } = await supabase.from(table).update(payload).eq("id", row.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Saved" });
    onOpenChange(false);
    onSaved?.();
  };

  if (!row) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0a0f1f] border border-cyan-300/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-cyan-200">
            <Save className="w-4 h-4" /> Edit {table.slice(0, -1)}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {FIELDS[table].map((f) => (
            <div key={f.key}>
              <Label className="text-xs text-white/60">{f.label}</Label>
              {f.type === "textarea" ? (
                <Textarea value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={4} />
              ) : (
                <Input
                  type={f.type === "date" ? "datetime-local" : "text"}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              )}
              {f.key === "image_url" && form.image_url && (
                <div className="mt-2 flex items-center gap-2 text-xs text-white/50">
                  <ImageIcon className="w-3 h-3" />
                  <img src={form.image_url} alt="preview" className="h-16 rounded border border-white/10" />
                </div>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving} className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-[#05060d]">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

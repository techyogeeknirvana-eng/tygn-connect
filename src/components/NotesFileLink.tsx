import { useState } from "react";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  value: string;
  fileName?: string;
}

/**
 * Renders a download/open link for a notes_contributions.file_url value.
 * - If it's an http(s) URL → opens directly in new tab.
 * - If it's a storage path under "notes-uploads" → creates a short-lived
 *   signed URL and downloads the file.
 */
export const NotesFileLink = ({ value, fileName }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isHttp = /^https?:\/\//i.test(value);

  const handleDownload = async () => {
    if (isHttp) {
      window.open(value, "_blank", "noopener,noreferrer");
      return;
    }
    setLoading(true);
    try {
      const path = value.replace(/^notes-uploads\//, "");
      const { data, error } = await supabase
        .storage
        .from("notes-uploads")
        .createSignedUrl(path, 60 * 10, {
          download: fileName || path.split("/").pop() || "notes-file",
        });
      if (error) throw error;
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      toast({
        title: "Download failed",
        description: err?.message || "Could not generate download link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-1 text-xs text-cyan-300 underline mt-1 disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : isHttp ? <ExternalLink className="w-3 h-3" /> : <Download className="w-3 h-3" />}
      {isHttp ? "Open file" : "Download file"}
    </button>
  );
};

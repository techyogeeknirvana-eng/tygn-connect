import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Image, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const AskQuestionDialog = ({ onQuestionPosted }: { onQuestionPosted: () => void }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        const isValidType = file.type.startsWith('image/') || 
                           file.type === 'application/pdf' ||
                           file.type === 'application/msword' ||
                           file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
        
        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not supported. Please upload images, PDFs, or Word documents.`,
            variant: "destructive"
          });
        }
        if (!isValidSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds 10MB limit.`,
            variant: "destructive"
          });
        }
        
        return isValidType && isValidSize;
      });
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a question.",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      let fileUrls: string[] = [];

      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          const fileName = `${user.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('question-attachments')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('question-attachments')
            .getPublicUrl(fileName);

          fileUrls.push(publicUrl);
        }
      }

      // Create question
      const { error } = await supabase
        .from('community_questions')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          file_urls: fileUrls.length > 0 ? fileUrls : null
        });

      if (error) throw error;

      toast({
        title: "Question Posted!",
        description: "Your question has been published to the community."
      });

      setTitle("");
      setContent("");
      setFiles([]);
      setOpen(false);
      onQuestionPosted();
    } catch (error: any) {
      console.error('Error posting question:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to post question.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ask Question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ask the Community</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="question-title">Question Title *</Label>
            <Input
              id="question-title"
              placeholder="How to optimize this recursive solution?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/200 characters
            </p>
          </div>

          <div>
            <Label htmlFor="question-content">Details *</Label>
            <Textarea
              id="question-content"
              placeholder="Provide detailed information about your question..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px]"
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.length}/5000 characters
            </p>
          </div>

          <div>
            <Label>Attachments (Optional)</Label>
            <div className="mt-2">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload images, PDFs, or Word documents
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 10MB per file
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2">
                      {file.type.startsWith('image/') ? (
                        <Image className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      )}
                      <span className="text-sm truncate max-w-xs">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Posting..." : "Post Question"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

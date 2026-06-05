import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, X, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface NotesContributeFormProps {
  onClose: () => void;
}

const NotesContributeForm = ({ onClose }: NotesContributeFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedPath, setUploadedPath] = useState<string>("");
  const [formData, setFormData] = useState({
    contributorName: "",
    email: "",
    contactNumber: "",
    college: "",
    subjectName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 20MB",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({ title: "Sign in required", variant: "destructive" });
      return;
    }

    setSelectedFile(file);
    setFileUploading(true);
    setUploadedPath("");

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${user.id}/${Date.now()}-${safeName}`;
      const { error } = await supabase.storage
        .from("notes-uploads")
        .upload(path, file, { upsert: false, contentType: file.type || undefined });

      if (error) throw error;

      setUploadedPath(path);
      toast({
        title: "File uploaded",
        description: `${file.name} is ready. Submit the form to finish.`,
      });
    } catch (err: any) {
      console.error(err);
      setSelectedFile(null);
      toast({
        title: "Upload failed",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setFileUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Error", description: "You must be logged in to contribute notes", variant: "destructive" });
      return;
    }

    if (
      !formData.contributorName ||
      !formData.email ||
      !formData.contactNumber ||
      !formData.college ||
      !formData.subjectName ||
      !uploadedPath
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and upload a file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const contentBlock = `Email: ${formData.email}\nContact: ${formData.contactNumber}\nCollege: ${formData.college}\nOriginal file: ${selectedFile?.name || ""}`;
      const { error } = await supabase.from("notes_contributions").insert({
        contributor_name: formData.contributorName,
        subject: formData.subjectName,
        content: contentBlock,
        file_url: uploadedPath, // storage path; admin generates signed URL
        user_id: user.id,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Submitted!",
        description: "Your notes were submitted for admin approval.",
      });

      setFormData({
        contributorName: "",
        email: "",
        contactNumber: "",
        college: "",
        subjectName: "",
      });
      setSelectedFile(null);
      setUploadedPath("");
      onClose();
    } catch (error: any) {
      console.error("Error submitting notes:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to submit notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Contribute Notes</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contributorName">Your Name *</Label>
              <Input id="contributorName" name="contributorName" value={formData.contributorName} onChange={handleInputChange} placeholder="Enter your full name" required />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com" required />
            </div>
            <div>
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input id="contactNumber" name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleInputChange} placeholder="+91-XXXXXXXXXX" required />
            </div>
            <div>
              <Label htmlFor="college">College Name *</Label>
              <Input id="college" name="college" value={formData.college} onChange={handleInputChange} placeholder="Your college name" required />
            </div>
          </div>

          <div>
            <Label htmlFor="subjectName">Subject Name *</Label>
            <Input id="subjectName" name="subjectName" value={formData.subjectName} onChange={handleInputChange} placeholder="e.g., Data Structures, Operating Systems" required />
          </div>

          <div>
            <Label htmlFor="file">Upload Notes File *</Label>
            <div className="mt-2">
              <label htmlFor="file" className="flex items-center justify-center w-full p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                <div className="text-center">
                  {fileUploading ? (
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
                  ) : uploadedPath ? (
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  ) : (
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {fileUploading
                      ? "Uploading..."
                      : selectedFile
                      ? `${selectedFile.name}${uploadedPath ? " (uploaded)" : ""}`
                      : "Click to upload PDF, DOC, DOCX, PPT, or images"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Max file size: 20MB</p>
                </div>
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={fileUploading}
                />
              </label>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              📝 Your contribution will be reviewed by our admin team before being made available to the community. Thank you for helping fellow students!
            </p>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={uploading || fileUploading || !uploadedPath}>
              {uploading ? "Submitting..." : "Submit Notes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotesContributeForm;

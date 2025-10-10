import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';

export default function NotesContributeForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    contributor_name: '',
    college: '',
    contact_number: '',
    email: '',
    subject_name: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Error', description: 'Please sign in to contribute notes' });
      return;
    }
    if (!file) {
      toast({ title: 'Error', description: 'Please select a file' });
      return;
    }

    setUploading(true);
    try {
      // Upload file to a storage bucket (you'll need to create this in Supabase)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `notes/${fileName}`;

      // For now, we'll use a placeholder URL since storage isn't set up yet
      const fileUrl = `https://placeholder.com/${filePath}`;

      const { error } = await supabase.from('notes_contributions').insert({
        ...formData,
        file_url: fileUrl,
        created_by: user.id,
        status: 'pending',
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Your notes have been submitted for approval!' });
      setOpen(false);
      setFormData({
        contributor_name: '',
        college: '',
        contact_number: '',
        email: '',
        subject_name: '',
      });
      setFile(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-tygn-yellow text-tygn-blue hover:bg-tygn-yellow/90 font-semibold">
          <Upload className="mr-2 h-4 w-4" />
          Contribute Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contribute Your Notes</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              required
              value={formData.contributor_name}
              onChange={(e) => setFormData({ ...formData, contributor_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="college">College/University *</Label>
            <Input
              id="college"
              required
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="phone">Contact Number *</Label>
            <Input
              id="phone"
              required
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject Name *</Label>
            <Input
              id="subject"
              required
              value={formData.subject_name}
              onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="file">Upload Notes File *</Label>
            <Input
              id="file"
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.txt"
            />
          </div>
          <Button type="submit" disabled={uploading} className="w-full bg-tygn-yellow text-tygn-blue hover:bg-tygn-yellow/90">
            {uploading ? 'Uploading...' : 'Submit for Approval'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

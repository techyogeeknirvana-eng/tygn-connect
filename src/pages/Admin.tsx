import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  CheckCircle, 
  XCircle,
  Clock,
  MessageSquare,
  Calendar,
  Briefcase,
  FileText,
  BookOpen,
  UserCheck
} from "lucide-react";
import { AdminUserManagement } from '@/components/AdminUserManagement';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Admin = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [managerEmail, setManagerEmail] = useState("");
  
  // Approval states
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [pendingQuizzes, setPendingQuizzes] = useState<any[]>([]);
  const [pendingNotes, setPendingNotes] = useState<any[]>([]);
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);

  useEffect(() => {
    checkAdminStatus();
    if (isAdmin) {
      loadPendingContent();
    }
  }, [user, isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('is_admin_email', { uid: user.id });
      
      if (error) throw error;
      setIsAdmin(data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin access",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPendingContent = async () => {
    try {
      // Load pending events
      const { data: events, error: eventsError } = await supabase
        .from('events' as any)
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (eventsError) throw eventsError;
      setPendingEvents(events || []);

      // Load pending jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs' as any)
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (jobsError) throw jobsError;
      setPendingJobs(jobs || []);

      // Load pending quizzes
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false });
      
      if (quizzesError) throw quizzesError;
      setPendingQuizzes(quizzes || []);

      // Load pending notes
      const { data: notes, error: notesError } = await supabase
        .from('notes_contributions' as any)
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (notesError) throw notesError;
      setPendingNotes(notes || []);

    } catch (error) {
      console.error('Error loading pending content:', error);
      toast({
        title: "Error",
        description: "Failed to load pending content",
        variant: "destructive",
      });
    }
  };

  const handleAddManager = async () => {
    if (!managerEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    try {
      // Find user by email
      const { data: profiles, error: searchError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (searchError) throw searchError;

      if (!profiles || profiles.length === 0) {
        toast({
          title: "User Not Found",
          description: "No user found with that email address",
          variant: "destructive",
        });
        return;
      }

      // Get or create Manager role
      let { data: managerRole, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'Manager')
        .single();

      if (roleError || !managerRole) {
        const { data: newRole, error: createRoleError } = await supabase
          .from('roles')
          .insert({
            name: 'Manager',
            description: 'Content manager with approval permissions',
            is_default: false
          })
          .select()
          .single();
        
        if (createRoleError) throw createRoleError;
        managerRole = newRole;
      }

      // Assign role to user
      const { error: assignError } = await supabase
        .from('user_roles')
        .insert({
          user_id: profiles[0].id,
          role_id: managerRole.id
        });

      if (assignError) {
        if (assignError.code === '23505') {
          toast({
            title: "Already a Manager",
            description: "This user is already assigned the Manager role",
          });
        } else {
          throw assignError;
        }
        return;
      }

      toast({
        title: "Manager Added!",
        description: `Successfully assigned Manager role to ${managerEmail}`,
      });
      setManagerEmail("");

    } catch (error) {
      console.error('Error adding manager:', error);
      toast({
        title: "Error",
        description: "Failed to add manager",
        variant: "destructive",
      });
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events' as any)
        .update({ status: 'approved' })
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Event Approved",
        description: "The event is now visible to all users",
      });
      
      loadPendingContent();
    } catch (error) {
      console.error('Error approving event:', error);
      toast({
        title: "Error",
        description: "Failed to approve event",
        variant: "destructive",
      });
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events' as any)
        .update({ status: 'rejected' })
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Event Rejected",
        description: "The event has been rejected",
      });
      
      loadPendingContent();
    } catch (error) {
      console.error('Error rejecting event:', error);
      toast({
        title: "Error",
        description: "Failed to reject event",
        variant: "destructive",
      });
    }
  };

  const handleApproveJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs' as any)
        .update({ status: 'approved' })
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Job Approved",
        description: "The job posting is now visible to all users",
      });
      
      loadPendingContent();
    } catch (error) {
      console.error('Error approving job:', error);
      toast({
        title: "Error",
        description: "Failed to approve job",
        variant: "destructive",
      });
    }
  };

  const handleRejectJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs' as any)
        .update({ status: 'rejected' })
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Job Rejected",
        description: "The job posting has been rejected",
      });
      
      loadPendingContent();
    } catch (error) {
      console.error('Error rejecting job:', error);
      toast({
        title: "Error",
        description: "Failed to reject job",
        variant: "destructive",
      });
    }
  };

  const handleApproveNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes_contributions' as any)
        .update({ status: 'approved' })
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Note Approved",
        description: "The note contribution has been approved",
      });
      
      loadPendingContent();
    } catch (error) {
      console.error('Error approving note:', error);
      toast({
        title: "Error",
        description: "Failed to approve note",
        variant: "destructive",
      });
    }
  };

  const handleRejectNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes_contributions' as any)
        .update({ status: 'rejected' })
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Note Rejected",
        description: "The note contribution has been rejected",
      });
      
      loadPendingContent();
    } catch (error) {
      console.error('Error rejecting note:', error);
      toast({
        title: "Error",
        description: "Failed to reject note",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage roles and approve content</p>
          </div>
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="approvals">Content Approvals</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="roles">Role Management</TabsTrigger>
          </TabsList>

          {/* Content Approvals */}
          <TabsContent value="approvals" className="space-y-6">
            {/* Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span>Pending Events ({pendingEvents.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No pending events</p>
                ) : (
                  pendingEvents.map((event) => (
                    <Card key={event.id} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.description?.substring(0, 100)}...
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>
                              <span>📍 {event.location}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-secondary border-secondary"
                              onClick={() => handleApproveEvent(event.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive"
                              onClick={() => handleRejectEvent(event.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-accent" />
                  <span>Pending Jobs ({pendingJobs.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingJobs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No pending jobs</p>
                ) : (
                  pendingJobs.map((job) => (
                    <Card key={job.id} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{job.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {job.company} • {job.location}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline">{job.job_type}</Badge>
                              <Badge variant="outline">{job.salary_range}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-secondary border-secondary"
                              onClick={() => handleApproveJob(job.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive"
                              onClick={() => handleRejectJob(job.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Pending Notes ({pendingNotes.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingNotes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No pending notes</p>
                ) : (
                  pendingNotes.map((note) => (
                    <Card key={note.id} className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{note.subject_name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              By: {note.contributor_name} • {note.college}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>📧 {note.email}</span>
                              <span>📞 {note.contact_number}</span>
                            </div>
                            {note.file_url && (
                              <a
                                href={note.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline mt-2 inline-block"
                              >
                                View File →
                              </a>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-secondary border-secondary"
                              onClick={() => handleApproveNote(note.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive"
                              onClick={() => handleRejectNote(note.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <AdminUserManagement />
          </TabsContent>

          {/* Role Management */}
          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Add Manager Role</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="manager-email">User Email</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="manager-email"
                      type="email"
                      placeholder="user@example.com"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                    />
                    <Button onClick={handleAddManager}>
                      Add Manager
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Managers can approve content submissions from users.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

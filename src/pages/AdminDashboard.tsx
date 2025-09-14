import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PendingContent {
  id: string;
  title: string;
  type: 'event' | 'job' | 'quiz' | 'note';
  created_by: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  content: any;
}

const AdminDashboard: React.FC = () => {
  const [pendingContent, setPendingContent] = useState<PendingContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingContent();
  }, []);

  const fetchPendingContent = async () => {
    try {
      setLoading(true);
      // This would fetch from multiple tables once they're created
      // For now, showing the UI structure
      setPendingContent([]);
    } catch (error) {
      console.error('Error fetching pending content:', error);
      toast.error('Failed to load pending content');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (id: string, type: string, action: 'approve' | 'reject') => {
    try {
      // Update status in respective table
      toast.success(`Content ${action}d successfully`);
      fetchPendingContent();
    } catch (error) {
      console.error(`Error ${action}ing content:`, error);
      toast.error(`Failed to ${action} content`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h1>
        
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pending Content Approval
                  <Badge variant="outline" className="text-yellow-600">
                    {pendingContent.filter(c => c.status === 'pending').length} Pending
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading pending content...</div>
                ) : pendingContent.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending content to review
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingContent.filter(c => c.status === 'pending').map((item) => (
                      <Card key={item.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className={getStatusColor(item.status)}>
                                  {item.type.toUpperCase()}
                                </Badge>
                                <span className="font-semibold">{item.title}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Submitted by user {item.created_by} on {new Date(item.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproval(item.id, item.type, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApproval(item.id, item.type, 'reject')}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Event management features will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Job posting management features will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Quiz management features will be available here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
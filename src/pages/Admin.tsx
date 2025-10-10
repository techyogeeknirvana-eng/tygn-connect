import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Admin() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [managerEmail, setManagerEmail] = useState('');
  const [pendingQuizzes, setPendingQuizzes] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [pendingNotes, setPendingNotes] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.email !== 'techyogeeknirvana@gmail.com') {
      navigate('/');
      return;
    }
    fetchPendingItems();
  }, [user, navigate]);

  const fetchPendingItems = async () => {
    const { data: quizzes } = await supabase.from('quizzes').select('*').eq('status', 'pending');
    const { data: events } = await supabase.from('events').select('*').eq('status', 'pending');
    const { data: jobs } = await supabase.from('jobs').select('*').eq('status', 'pending');
    const { data: notes } = await supabase.from('notes_contributions').select('*').eq('status', 'pending');
    setPendingQuizzes(quizzes || []);
    setPendingEvents(events || []);
    setPendingJobs(jobs || []);
    setPendingNotes(notes || []);
  };

  const assignManager = async () => {
    // For now, just use profile lookup - admin needs service role for auth.admin
    const { data: profiles } = await supabase.from('profiles').select('id').eq('full_name', managerEmail).single();
    if (!profiles) {
      toast({ title: 'Error', description: 'User not found by name' });
      return;
    }
    const { data: managerRole } = await supabase.from('roles').select('id').eq('name', 'Manager').single();
    const { error } = await supabase.from('user_roles').insert({ user_id: profiles.id, role_id: managerRole?.id });
    if (error) {
      toast({ title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Manager role assigned' });
      setManagerEmail('');
    }
  };

  const approveItem = async (table: string, id: string) => {
    const { error } = await (supabase as any).from(table).update({ status: 'approved' }).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Item approved' });
      fetchPendingItems();
    }
  };

  const rejectItem = async (table: string, id: string) => {
    const { error } = await (supabase as any).from(table).delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Item rejected' });
      fetchPendingItems();
    }
  };

  return (
    <main className="min-h-screen bg-tygn-bg py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-tygn-blue uppercase mb-8">Admin Dashboard</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Assign Manager Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter email address"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
              />
              <Button onClick={assignManager} className="bg-tygn-yellow text-tygn-blue hover:bg-tygn-yellow/90">
                Assign Manager
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="quizzes">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quizzes">Quizzes ({pendingQuizzes.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({pendingEvents.length})</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({pendingJobs.length})</TabsTrigger>
            <TabsTrigger value="notes">Notes ({pendingNotes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="quizzes">
            <div className="space-y-4">
              {pendingQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">Topic: {quiz.topic}</p>
                    <div className="flex gap-4">
                      <Button onClick={() => approveItem('quizzes', quiz.id)} className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button onClick={() => rejectItem('quizzes', quiz.id)} variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="space-y-4">
              {pendingEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    <p className="text-xs text-gray-500 mb-4">
                      {new Date(event.event_date).toLocaleString()} • {event.location}
                    </p>
                    <div className="flex gap-4">
                      <Button onClick={() => approveItem('events', event.id)} className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button onClick={() => rejectItem('events', event.id)} variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="space-y-4">
              {pendingJobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                    <p className="text-sm font-semibold text-tygn-blue mb-2">{job.company}</p>
                    <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                    <div className="flex gap-4">
                      <Button onClick={() => approveItem('jobs', job.id)} className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button onClick={() => rejectItem('jobs', job.id)} variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="space-y-4">
              {pendingNotes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold mb-2">{note.subject_name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Contributed by: {note.contributor_name} • {note.college}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Contact: {note.email} • {note.contact_number}
                    </p>
                    <div className="flex gap-4">
                      <Button onClick={() => approveItem('notes_contributions', note.id)} className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button onClick={() => rejectItem('notes_contributions', note.id)} variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

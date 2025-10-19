import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Mail, Phone, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PendingUser {
  id: string;
  full_name: string;
  phone_number?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  email?: string;
}

export const AdminUserManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Get pending users
      const { data: pending, error: pendingError } = await supabase
        .from('profiles')
        .select('*')
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;

      // Get approved users
      const { data: approved, error: approvedError } = await supabase
        .from('profiles')
        .select('*')
        .eq('approval_status', 'approved')
        .order('approved_at', { ascending: false })
        .limit(20);

      if (approvedError) throw approvedError;

      // Fetch emails from auth.users for each user
      const pendingWithEmails = await Promise.all(
        (pending || []).map(async (profile) => {
          const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
          return {
            ...profile,
            email: authData?.user?.email
          };
        })
      );

      const approvedWithEmails = await Promise.all(
        (approved || []).map(async (profile) => {
          const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
          return {
            ...profile,
            email: authData?.user?.email
          };
        })
      );

      setPendingUsers(pendingWithEmails as PendingUser[]);
      setApprovedUsers(approvedWithEmails as PendingUser[]);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: user?.id
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'User Approved',
        description: 'User has been approved and can now access the platform.',
      });

      loadUsers();
    } catch (error: any) {
      console.error('Error approving user:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve user',
        variant: 'destructive',
      });
    }
  };

  const handleRejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: 'rejected',
          approved_by: user?.id
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'User Rejected',
        description: 'User registration has been rejected.',
        variant: 'destructive',
      });

      loadUsers();
    } catch (error: any) {
      console.error('Error rejecting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject user',
        variant: 'destructive',
      });
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          approval_status: 'rejected'
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'User Deactivated',
        description: 'User has been deactivated.',
        variant: 'destructive',
      });

      loadUsers();
    } catch (error: any) {
      console.error('Error deactivating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to deactivate user',
        variant: 'destructive',
      });
    }
  };

  const UserCard = ({ user, isPending }: { user: PendingUser; isPending: boolean }) => (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-lg">{user.full_name}</h3>
            </div>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              {user.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span>{user.email}</span>
                </div>
              )}
              {user.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{user.phone_number}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Registered: {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Badge variant={isPending ? 'secondary' : 'default'}>
            {user.approval_status}
          </Badge>
        </div>

        <div className="flex gap-2">
          {isPending ? (
            <>
              <Button
                size="sm"
                onClick={() => handleApproveUser(user.id)}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRejectUser(user.id)}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDeactivateUser(user.id)}
              className="flex-1"
            >
              Deactivate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Approvals ({pendingUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No pending user approvals</p>
          ) : (
            pendingUsers.map((user) => (
              <UserCard key={user.id} user={user} isPending={true} />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Approved Users ({approvedUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {approvedUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No approved users yet</p>
          ) : (
            approvedUsers.map((user) => (
              <UserCard key={user.id} user={user} isPending={false} />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

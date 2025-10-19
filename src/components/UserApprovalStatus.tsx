import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export const UserApprovalStatus = () => {
  const { userProfile, isApproved } = useAuth();

  if (isApproved) {
    return null; // Don't show anything if user is approved
  }

  const getStatusIcon = () => {
    switch (userProfile?.approval_status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (userProfile?.approval_status) {
      case 'pending':
        return {
          title: 'Account Pending Approval',
          description: 'Your account is awaiting admin approval. You will receive access once approved.',
          variant: 'secondary' as const
        };
      case 'rejected':
        return {
          title: 'Account Not Approved',
          description: 'Your account registration was not approved. Please contact support for more information.',
          variant: 'destructive' as const
        };
      default:
        return {
          title: 'Account Pending',
          description: 'Please wait while we review your account.',
          variant: 'secondary' as const
        };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <CardTitle>{status.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{status.description}</p>
          <Badge variant={status.variant} className="text-sm">
            Status: {userProfile?.approval_status || 'pending'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

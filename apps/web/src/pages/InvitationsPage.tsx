import { motion } from 'framer-motion';
import { useTeam } from '@/hooks/useTeam';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Check, X, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InvitationsPage() {
  const { invitations, isLoading, error, respondToInvite } = useTeam();

  const handleRespondToInvite = async (invitationId: string, status: 'accepted' | 'rejected') => {
    await respondToInvite(invitationId, status);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading invitations..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Team Invitations
              </h1>
            </div>
            <p className="text-gray-600">
              Manage your pending team invitations.
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-700 mb-6">
              {error}
            </div>
          )}

          {invitations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No pending invitations
                </h3>
                <p className="text-gray-600 mb-6">
                  You don't have any pending team invitations at the moment.
                </p>
                <Link to="/teams">
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    View Teams
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <Card key={invitation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Invitation to {invitation.teamName}
                        </CardTitle>
                        <CardDescription>
                          You've been invited to join this team
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <p>Invited by: {invitation.invitedByUserId}</p>
                        <p>Invited on: {invitation.createdAt.toLocaleDateString()}</p>
                        <p>Expires: {invitation.expiresAt.toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleRespondToInvite(invitation.id, 'accepted')}
                          className="flex-1"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleRespondToInvite(invitation.id, 'rejected')}
                          className="flex-1"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

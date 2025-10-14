import { motion } from 'framer-motion';
import { useTeam } from '@/hooks/useTeam';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamCard } from '@/components/teams/TeamCard';
import { TeamMemberList } from '@/components/teams/TeamMemberList';
import { TeamLeaderControls } from '@/components/teams/TeamLeaderControls';
import { Users, Plus, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeamsPage() {
  const { team, invitations, isLoading, error } = useTeam();

  if (isLoading) {
    return <LoadingSpinner message="Loading team information..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is not in a team
  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Join a Team
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Team up with friends and compete in monthly step and calorie challenges. 
                Create your own team or join an existing one to start competing!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create New Team
                  </CardTitle>
                  <CardDescription>
                    Start your own team and invite friends to join the competition.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/teams/create">
                    <Button className="w-full">
                      Create Team
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Join Existing Team
                  </CardTitle>
                  <CardDescription>
                    You have {invitations.length} pending invitation{invitations.length !== 1 ? 's' : ''}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/invitations">
                    <Button variant="outline" className="w-full">
                      View Invitations
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // User is in a team
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Team
            </h1>
            <p className="text-gray-600">
              Manage your team and track your progress in the monthly competition.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <TeamCard team={team} />
              <TeamMemberList team={team} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Actions</CardTitle>
                  <CardDescription>
                    Manage your team and members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TeamLeaderControls team={team} />
                </CardContent>
              </Card>

              {invitations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Invitations</CardTitle>
                    <CardDescription>
                      You have {invitations.length} pending invitation{invitations.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/invitations">
                      <Button variant="outline" className="w-full">
                        View Invitations
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

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
      <div className="min-h-screen bg-black text-white relative flex items-center justify-center">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <img 
            src="/hero-2.png"
            alt="Fitness background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/70" />
        </div>
        <div className="relative z-10 w-full max-w-md">
          <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-red-400 font-manrope">Error</CardTitle>
              <CardDescription className="text-gray-300 font-manrope">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()} className="font-manrope">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // User is not in a team
  if (!team) {
    return (
      <div className="min-h-screen bg-black text-white relative">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <img 
            src="/hero-2.png"
            alt="Fitness background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/70" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2 font-pacifico">
                Join a Team
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto font-manrope">
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
    <div className="min-h-screen bg-black text-white relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/hero-2.png"
          alt="Fitness background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/70" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 font-pacifico">
              My Team
            </h1>
            <p className="text-gray-300 font-manrope">
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

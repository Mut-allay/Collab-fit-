import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTeam } from '@/hooks/useTeam';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Plus, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TeamQuickView() {
  const { currentUser } = useAuth();
  const { team, invitations } = useTeam();

  if (!currentUser) return null;

  if (!team) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            My Team
          </CardTitle>
          <CardDescription>
            Join or create a team to compete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            You're not part of a team yet. Join the competition!
          </p>
          <div className="flex gap-2">
            <Link to="/teams/create">
              <Button size="sm" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </Link>
            {invitations.length > 0 && (
              <Link to="/invitations">
                <Button variant="outline" size="sm">
                  {invitations.length} Invitation{invitations.length !== 1 ? 's' : ''}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          My Team
        </CardTitle>
        <CardDescription>
          {team.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {team.currentMonthTotal.steps.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Steps</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(team.currentMonthTotal.calories).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Calories</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to="/teams">
            <Button variant="outline" size="sm" className="flex-1">
              View Team
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="outline" size="sm">
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

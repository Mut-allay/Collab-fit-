import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTeam } from '@/hooks/useTeam';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Crown, Footprints, Flame } from 'lucide-react';
import type { Team } from '@fitspark/shared';

interface TeamCardProps {
  team: Team;
  showActions?: boolean;
}

export function TeamCard({ team, showActions = true }: TeamCardProps) {
  const { user } = useAuth();
  const { removeMember, leaveCurrentTeam, isLoading } = useTeam();
  
  const isLeader = user?.uid === team.leaderId;
  const isMember = team.memberIds.includes(user?.uid || '');

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      await removeMember(memberId);
    }
  };

  const handleLeaveTeam = async () => {
    if (confirm('Are you sure you want to leave this team?')) {
      await leaveCurrentTeam();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {team.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {team.description || 'No description provided'}
            </CardDescription>
          </div>
          <Badge variant={team.isActive ? 'default' : 'secondary'}>
            {team.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Team Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Footprints className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-muted-foreground">Steps</span>
            </div>
            <div className="text-2xl font-bold">
              {team.currentMonthTotal.steps.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-muted-foreground">Calories</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(team.currentMonthTotal.calories).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Team Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground">Leader:</span>
            <span className="font-medium">
              {isLeader ? 'You' : 'Team Leader'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span className="text-muted-foreground">Members:</span>
            <span className="font-medium">{team.memberIds.length}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && isMember && (
          <div className="flex gap-2 pt-2">
            {isLeader ? (
              <Button variant="outline" size="sm" disabled>
                You are the leader
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLeaveTeam}
                disabled={isLoading}
              >
                Leave Team
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

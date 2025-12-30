import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { TeamLeaderboardEntry } from '@fitspark/shared';
import { useEffect } from 'react';

export function LeaderboardPreview() {
  const { leaderboard, loadLeaderboard } = useLeaderboard();

  // Load current month's leaderboard
  useEffect(() => {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    loadLeaderboard(month, year);
  }, [loadLeaderboard]);

  const topTeams = leaderboard?.teams
    .sort((a: TeamLeaderboardEntry, b: TeamLeaderboardEntry) => b.totalSteps - a.totalSteps)
    .slice(0, 3) || [];

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 1:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 2:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="bg-yellow-500 text-xs">1st</Badge>;
      case 1:
        return <Badge className="bg-gray-400 text-xs">2nd</Badge>;
      case 2:
        return <Badge className="bg-amber-600 text-xs">3rd</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-manrope text-white">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Top Teams
        </CardTitle>
        <CardDescription className="text-gray-300 font-manrope">
          This month's leaders
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {topTeams.length > 0 ? (
          <>
            {topTeams.map((team: TeamLeaderboardEntry, index: number) => (
              <div
                key={team.teamId}
                className="flex items-center justify-between p-2 rounded-lg bg-black/40 backdrop-blur-sm border border-cyan-500/20"
              >
                <div className="flex items-center gap-2">
                  {getRankIcon(index)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white font-manrope">{team.teamName}</span>
                      {getRankBadge(index)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-300 font-manrope">
                      <Users className="h-3 w-3" />
                      {team.memberCount} members
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm text-cyan-300 font-manrope">
                    {team.totalSteps.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 font-manrope">steps</div>
                </div>
              </div>
            ))}
            
            <Link to="/leaderboard">
              <Button variant="outline" size="sm" className="w-full">
                View Full Leaderboard
              </Button>
            </Link>
          </>
        ) : (
          <div className="text-center py-4">
            <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300 font-manrope">
              No teams competing yet
            </p>
            <Link to="/teams">
              <Button variant="outline" size="sm" className="mt-2">
                Join the Competition
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

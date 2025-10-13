import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Users, Footprints, Flame } from 'lucide-react';
import type { MonthlyLeaderboard } from '@fitspark/shared';

interface LeaderboardTableProps {
  leaderboard: MonthlyLeaderboard;
  metric: 'steps' | 'calories';
  onMetricChange: (metric: 'steps' | 'calories') => void;
}

export function LeaderboardTable({ leaderboard, metric, onMetricChange }: LeaderboardTableProps) {
  const sortedTeams = [...leaderboard.teams].sort((a, b) => {
    if (metric === 'steps') {
      return b.totalSteps - a.totalSteps;
    } else {
      return b.totalCalories - a.totalCalories;
    }
  });

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return <Badge className="bg-yellow-500">1st</Badge>;
      case 1:
        return <Badge className="bg-gray-400">2nd</Badge>;
      case 2:
        return <Badge className="bg-amber-600">3rd</Badge>;
      default:
        return <Badge variant="secondary">{index + 1}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Monthly Leaderboard</CardTitle>
            <CardDescription>
              {leaderboard.month} {leaderboard.year}
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={metric === 'steps' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onMetricChange('steps')}
            >
              <Footprints className="mr-2 h-4 w-4" />
              Steps
            </Button>
            <Button
              variant={metric === 'calories' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onMetricChange('calories')}
            >
              <Flame className="mr-2 h-4 w-4" />
              Calories
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {sortedTeams.map((team, index) => (
            <div
              key={team.teamId}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{team.teamName}</h3>
                    {getRankBadge(index)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {team.memberCount} members
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {metric === 'steps' 
                    ? team.totalSteps.toLocaleString()
                    : Math.round(team.totalCalories).toLocaleString()
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  {metric === 'steps' ? 'steps' : 'calories'}
                </div>
              </div>
            </div>
          ))}
          
          {sortedTeams.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No teams found for this month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

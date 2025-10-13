import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTeam } from '@/hooks/useTeam';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, UserMinus, Footprints, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Team, User } from '@fitspark/shared';

interface TeamMemberListProps {
  team: Team;
  showActions?: boolean;
}

interface MemberWithStats extends User {
  steps: number;
  calories: number;
}

export function TeamMemberList({ team, showActions = true }: TeamMemberListProps) {
  const { user } = useAuth();
  const { removeMember, isLoading } = useTeam();
  const [members, setMembers] = useState<MemberWithStats[]>([]);

  const isLeader = user?.uid === team.leaderId;

  // Load member details
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];

    const loadMembers = async () => {
      const memberPromises = team.memberIds.map(async (memberId) => {
        const userRef = doc(db, 'users', memberId);
        return new Promise<MemberWithStats>((resolve) => {
          const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              const userData = doc.data() as User;
              resolve({
                ...userData,
                steps: 0, // TODO: Get actual steps from daily activity
                calories: 0, // TODO: Get actual calories from daily activity
              });
            }
          });
          unsubscribes.push(unsubscribe);
        });
      });

      const memberData = await Promise.all(memberPromises);
      setMembers(memberData);
    };

    loadMembers();

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [team.memberIds]);

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      await removeMember(memberId);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          {members.length} member{members.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.uid}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(member.displayName || member.email)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {member.displayName || member.email}
                    </span>
                    {member.uid === team.leaderId && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                    {member.uid === user?.uid && (
                      <Badge variant="secondary" className="text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Footprints className="h-3 w-3" />
                      {member.steps.toLocaleString()} steps
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {Math.round(member.calories).toLocaleString()} cal
                    </div>
                  </div>
                </div>
              </div>

              {showActions && isLeader && member.uid !== team.leaderId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveMember(member.uid)}
                  disabled={isLoading}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

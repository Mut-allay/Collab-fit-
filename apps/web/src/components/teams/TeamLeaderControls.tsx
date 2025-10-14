import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, Settings } from 'lucide-react';
import { TeamInviteModal } from './TeamInviteModal';
import type { Team } from '@fitspark/shared';

interface TeamLeaderControlsProps {
  team: Team;
}

export function TeamLeaderControls({ team }: TeamLeaderControlsProps) {
  const { currentUser } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const isLeader = currentUser?.uid === team.leaderId;

  if (!isLeader) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowInviteModal(true)}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        Invite Member
      </Button>
      
      <Button variant="outline" size="sm" disabled>
        <Settings className="mr-2 h-4 w-4" />
        Team Settings
      </Button>

      <TeamInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        teamId={team.id}
      />
    </div>
  );
}

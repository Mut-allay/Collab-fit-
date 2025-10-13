import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  createTeam,
  getTeam,
  updateTeam,
  addTeamMember,
  removeTeamMember,
  leaveTeam,
  sendTeamInvitation,
  respondToInvitation,
  onTeamInvitationsUpdate,
} from '@/lib/firestoreService';
import { updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Team, TeamInvitation, CreateTeam } from '@fitspark/shared';

interface TeamState {
  team: Team | null;
  invitations: TeamInvitation[];
  isLoading: boolean;
  error: string | null;
}

interface TeamActions {
  createNewTeam: (teamData: CreateTeam) => Promise<string | null>;
  updateTeamInfo: (updates: Partial<Team>) => Promise<void>;
  inviteUser: (userId: string) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
  leaveCurrentTeam: () => Promise<void>;
  respondToInvite: (invitationId: string, status: 'accepted' | 'rejected') => Promise<void>;
  clearError: () => void;
}

export function useTeam(): TeamState & TeamActions {
  const { user } = useAuth();
  const [state, setState] = useState<TeamState>({
    team: null,
    invitations: [],
    isLoading: true,
    error: null,
  });

  // Load user's team on mount
  useEffect(() => {
    if (!user) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const loadTeam = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Get user's team ID from their profile
        const userRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userRef, async (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            const teamId = userData.teamId;
            
            if (teamId) {
              const team = await getTeam(teamId);
              setState(prev => ({
                ...prev,
                team,
                isLoading: false,
              }));
            } else {
              setState(prev => ({
                ...prev,
                team: null,
                isLoading: false,
              }));
            }
          }
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error loading team:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load team',
        }));
      }
    };

    const unsubscribe = loadTeam();
    return () => {
      if (unsubscribe) {
        unsubscribe.then(unsub => unsub && unsub());
      }
    };
  }, [user]);

  // Load team invitations
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onTeamInvitationsUpdate(user.uid, (invitations) => {
      setState(prev => ({ ...prev, invitations }));
    });

    return unsubscribe;
  }, [user]);

  const createNewTeam = useCallback(async (teamData: CreateTeam): Promise<string | null> => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return null;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const teamId = await createTeam(user.uid, teamData);
      
      // Update user's team ID
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        teamId,
      });

      setState(prev => ({ ...prev, isLoading: false }));
      return teamId;
    } catch (error) {
      console.error('Error creating team:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create team',
      }));
      return null;
    }
  }, [user]);

  const updateTeamInfo = useCallback(async (updates: Partial<Team>): Promise<void> => {
    if (!state.team) {
      setState(prev => ({ ...prev, error: 'No team selected' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await updateTeam(state.team.id, updates);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error updating team:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update team',
      }));
    }
  }, [state.team]);

  const inviteUser = useCallback(async (userId: string): Promise<void> => {
    if (!user || !state.team) {
      setState(prev => ({ ...prev, error: 'No team selected' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await sendTeamInvitation(state.team.id, userId, user.uid);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error inviting user:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to invite user',
      }));
    }
  }, [user, state.team]);

  const removeMember = useCallback(async (userId: string): Promise<void> => {
    if (!state.team) {
      setState(prev => ({ ...prev, error: 'No team selected' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await removeTeamMember(state.team.id, userId);
      
      // Update the removed user's team ID
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        teamId: null,
      });
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error removing member:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to remove member',
      }));
    }
  }, [state.team]);

  const leaveCurrentTeam = useCallback(async (): Promise<void> => {
    if (!user || !state.team) {
      setState(prev => ({ ...prev, error: 'No team selected' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await leaveTeam(state.team.id, user.uid);
      
      // Update user's team ID
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        teamId: null,
      });
      
      setState(prev => ({ ...prev, team: null, isLoading: false }));
    } catch (error) {
      console.error('Error leaving team:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to leave team',
      }));
    }
  }, [user, state.team]);

  const respondToInvite = useCallback(async (
    invitationId: string, 
    status: 'accepted' | 'rejected'
  ): Promise<void> => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await respondToInvitation(invitationId, status);
      
      if (status === 'accepted') {
        // Update user's team ID - this will be handled by the invitation response
        // The team ID will be updated when the user is added to the team
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('Error responding to invitation:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to respond to invitation',
      }));
    }
  }, [user]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    createNewTeam,
    updateTeamInfo,
    inviteUser,
    removeMember,
    leaveCurrentTeam,
    respondToInvite,
    clearError,
  };
}

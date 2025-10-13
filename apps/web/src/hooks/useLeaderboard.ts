import { useState, useEffect, useCallback } from 'react';
import { getMonthlyLeaderboard } from '@/lib/firestoreService';
import type { MonthlyLeaderboard } from '@fitspark/shared';

interface LeaderboardState {
  leaderboard: MonthlyLeaderboard | null;
  isLoading: boolean;
  error: string | null;
}

interface LeaderboardActions {
  loadLeaderboard: (month: string, year: number) => Promise<void>;
  clearError: () => void;
}

export function useLeaderboard(): LeaderboardState & LeaderboardActions {
  const [state, setState] = useState<LeaderboardState>({
    leaderboard: null,
    isLoading: false,
    error: null,
  });

  const loadLeaderboard = useCallback(async (month: string, year: number): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const leaderboard = await getMonthlyLeaderboard(month, year);
      
      setState(prev => ({
        ...prev,
        leaderboard,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load leaderboard',
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    loadLeaderboard,
    clearError,
  };
}

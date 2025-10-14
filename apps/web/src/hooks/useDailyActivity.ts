import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserDailyActivity } from '@/lib/firestoreService';
import type { DailyActivityLog } from '@fitspark/shared';

interface DailyActivityState {
  activities: DailyActivityLog[];
  isLoading: boolean;
  error: string | null;
}

interface DailyActivityActions {
  loadActivities: (startDate: string, endDate: string) => Promise<void>;
  getTodayActivity: () => DailyActivityLog | null;
  getTotalSteps: (startDate: string, endDate: string) => number;
  getTotalCalories: (startDate: string, endDate: string) => number;
  clearError: () => void;
}

export function useDailyActivity(): DailyActivityState & DailyActivityActions {
  const { currentUser } = useAuth();
  const [state, setState] = useState<DailyActivityState>({
    activities: [],
    isLoading: false,
    error: null,
  });

  const loadActivities = useCallback(async (startDate: string, endDate: string): Promise<void> => {
    if (!currentUser) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const activities = await getUserDailyActivity(currentUser.uid, startDate, endDate);
      
      setState(prev => ({
        ...prev,
        activities,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading daily activities:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load activities',
      }));
    }
  }, [currentUser]);

  const getTodayActivity = useCallback((): DailyActivityLog | null => {
    const today = new Date().toISOString().split('T')[0];
    return state.activities.find(activity => activity.date === today) || null;
  }, [state.activities]);

  const getTotalSteps = useCallback((startDate: string, endDate: string): number => {
    return state.activities
      .filter(activity => activity.date >= startDate && activity.date <= endDate)
      .reduce((total, activity) => total + activity.steps, 0);
  }, [state.activities]);

  const getTotalCalories = useCallback((startDate: string, endDate: string): number => {
    return state.activities
      .filter(activity => activity.date >= startDate && activity.date <= endDate)
      .reduce((total, activity) => total + activity.calories, 0);
  }, [state.activities]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    loadActivities,
    getTodayActivity,
    getTotalSteps,
    getTotalCalories,
    clearError,
  };
}

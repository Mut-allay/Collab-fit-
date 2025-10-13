import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  initGoogleFit, 
  connectGoogleFit, 
  disconnectGoogleFit, 
  isGoogleFitConnected,
  getLastSyncTime,
  syncDailySteps,
  syncCalories
} from '@/lib/googleFitService';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GoogleFitState {
  isConnected: boolean;
  isLoading: boolean;
  lastSyncTime: Date | null;
  error: string | null;
}

interface GoogleFitActions {
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  syncData: () => Promise<void>;
  clearError: () => void;
}

export function useGoogleFit(): GoogleFitState & GoogleFitActions {
  const { user } = useAuth();
  const [state, setState] = useState<GoogleFitState>({
    isConnected: false,
    isLoading: true,
    lastSyncTime: null,
    error: null,
  });

  // Initialize Google Fit API on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        await initGoogleFit();
        
        const connected = await isGoogleFitConnected();
        const lastSync = await getLastSyncTime();
        
        setState(prev => ({
          ...prev,
          isConnected: connected,
          lastSyncTime: lastSync,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Failed to initialize Google Fit:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to initialize Google Fit',
        }));
      }
    };

    if (user) {
      initialize();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  const connect = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setState(prev => ({ ...prev, error: 'User not authenticated' }));
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const success = await connectGoogleFit();
      
      if (success) {
        // Update user's Google Fit connection status in Firestore
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          googleFitConnected: true,
          googleFitLastSync: new Date(),
        });

        setState(prev => ({
          ...prev,
          isConnected: true,
          lastSyncTime: new Date(),
          isLoading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to connect to Google Fit',
        }));
      }
      
      return success;
    } catch (error) {
      console.error('Error connecting to Google Fit:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to connect to Google Fit',
      }));
      return false;
    }
  }, [user]);

  const disconnect = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await disconnectGoogleFit();
      
      // Update user's Google Fit connection status in Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        googleFitConnected: false,
        googleFitLastSync: null,
      });

      setState(prev => ({
        ...prev,
        isConnected: false,
        lastSyncTime: null,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error disconnecting from Google Fit:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to disconnect from Google Fit',
      }));
    }
  }, [user]);

  const syncData = useCallback(async (): Promise<void> => {
    if (!user || !state.isConnected) {
      setState(prev => ({ ...prev, error: 'Google Fit not connected' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Sync data for the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      // Sync steps and calories
      await Promise.all([
        syncDailySteps(startDate, endDate),
        syncCalories(startDate, endDate),
      ]);
      
      // Update last sync time
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        googleFitLastSync: new Date(),
      });

      setState(prev => ({
        ...prev,
        lastSyncTime: new Date(),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error syncing Google Fit data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sync data',
      }));
    }
  }, [user, state.isConnected]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    syncData,
    clearError,
  };
}

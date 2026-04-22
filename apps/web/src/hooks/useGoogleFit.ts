import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  initiateGoogleFitConnect,
  disconnectGoogleFit,
  syncGoogleFitNow,
} from '@/lib/googleFitService';

export function useGoogleFit() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    if (!currentUser) return;
    initiateGoogleFitConnect(currentUser.uid);
  }, [currentUser]);

  const disconnect = useCallback(async () => {
    if (!currentUser) return;
    setIsDisconnecting(true);
    setError(null);
    try {
      const idToken = await currentUser.getIdToken();
      await disconnectGoogleFit(idToken);
      await updateUserProfile({ googleFitConnected: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    } finally {
      setIsDisconnecting(false);
    }
  }, [currentUser, updateUserProfile]);

  const syncData = useCallback(async () => {
    if (!currentUser) return;
    setIsSyncing(true);
    setError(null);
    try {
      const idToken = await currentUser.getIdToken();
      await syncGoogleFitNow(idToken);
      await updateUserProfile({}); // Reload profile to pick up new googleFitLastSync
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  }, [currentUser, updateUserProfile]);

  const clearError = useCallback(() => setError(null), []);

  return {
    isConnected: userProfile?.googleFitConnected ?? false,
    lastSyncTime: userProfile?.googleFitLastSync ?? null,
    isSyncing,
    isDisconnecting,
    error,
    connect,
    disconnect,
    syncData,
    clearError,
  };
}

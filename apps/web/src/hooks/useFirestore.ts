import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import * as FirestoreService from "@/lib/firestoreService";
import type {
  WorkoutLog,
  WorkoutProgram,
  MetricSnapshot,
  Exercise,
  CreateWorkoutLog,
  CreateMetricSnapshot,
} from "@fitspark/shared";

// This generic hook is quite clean already. We'll keep its structure.
export function useDocument<T>(collectionName: string, documentId: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    FirestoreService.getDocument<T>(collectionName, documentId)
      .then(setData)
      .catch((err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [collectionName, documentId]);

  return { data, loading, error };
}

// Hook for user's workout logs
export function useWorkoutLogs() {
  const { currentUser } = useAuth();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setWorkoutLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = FirestoreService.onWorkoutLogsUpdate(
      currentUser.uid,
      (logs) => {
        setWorkoutLogs(logs);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Actions are now clean one-liners calling the service
  const addWorkoutLog = (logData: CreateWorkoutLog) => {
    if (!currentUser) throw new Error("User not authenticated");
    return FirestoreService.addWorkoutLog(currentUser.uid, logData);
  };

  const updateWorkoutLog = (logId: string, updates: Partial<WorkoutLog>) => {
    return FirestoreService.updateWorkoutLog(logId, updates);
  };

  const deleteWorkoutLog = (logId: string) => {
    return FirestoreService.deleteWorkoutLog(logId);
  };

  return {
    workoutLogs,
    loading,
    error,
    addWorkoutLog,
    updateWorkoutLog,
    deleteWorkoutLog,
  };
}

// Hook for exercises
export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    FirestoreService.getExercises()
      .then(setExercises)
      .catch((err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { exercises, loading, error };
}

// Hook for user's metric snapshots
export function useMetricSnapshots() {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState<MetricSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setMetrics([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = FirestoreService.onMetricSnapshotsUpdate(
      currentUser.uid,
      (metricData) => {
        setMetrics(metricData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addMetricSnapshot = (metricData: CreateMetricSnapshot) => {
    if (!currentUser) throw new Error("User not authenticated");
    return FirestoreService.addMetricSnapshot(currentUser.uid, metricData);
  };

  return { metrics, loading, error, addMetricSnapshot };
}

// Hook for workout programs
export function useWorkoutPrograms() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    FirestoreService.getPublicWorkoutPrograms()
      .then(setPrograms)
      .catch((err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  return { programs, loading, error };
}

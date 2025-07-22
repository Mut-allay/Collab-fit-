import { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import type {
  WorkoutLog,
  WorkoutProgram,
  MetricSnapshot,
  Exercise,
  CreateWorkoutLog,
  CreateMetricSnapshot,
} from "@fitspark/shared";

// Generic Firestore hook
export function useDocument<T>(collectionName: string, documentId: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      setLoading(false);
      return;
    }

    const fetchDocument = async () => {
      try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [collectionName, documentId]);

  return { data, loading, error };
}

// Hook for user's workout logs
export function useWorkoutLogs() {
  const { currentUser } = useAuth();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setWorkoutLogs([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "workoutLogs"),
      where("userId", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const logs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
          startTime: doc.data().startTime?.toDate(),
          endTime: doc.data().endTime?.toDate(),
        })) as WorkoutLog[];

        setWorkoutLogs(logs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const addWorkoutLog = async (logData: CreateWorkoutLog) => {
    if (!currentUser) throw new Error("User not authenticated");

    const newLog = {
      ...logData,
      userId: currentUser.uid,
      timestamp: Timestamp.fromDate(new Date()),
      startTime: Timestamp.fromDate(new Date()),
      completed: false,
    };

    const docRef = await addDoc(collection(db, "workoutLogs"), newLog);
    return docRef.id;
  };

  const updateWorkoutLog = async (
    logId: string,
    updates: Partial<WorkoutLog>
  ) => {
    const logRef = doc(db, "workoutLogs", logId);
    await updateDoc(logRef, {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  };

  const deleteWorkoutLog = async (logId: string) => {
    await deleteDoc(doc(db, "workoutLogs", logId));
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "exercises"));
        const exerciseData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Exercise[];

        setExercises(exerciseData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch exercises"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  return { exercises, loading, error };
}

// Hook for user's metric snapshots
export function useMetricSnapshots() {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState<MetricSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setMetrics([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "metricSnapshots"),
      where("userId", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const metricData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        })) as MetricSnapshot[];

        setMetrics(metricData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const addMetricSnapshot = async (metricData: CreateMetricSnapshot) => {
    if (!currentUser) throw new Error("User not authenticated");

    const newMetric = {
      ...metricData,
      userId: currentUser.uid,
      timestamp: Timestamp.fromDate(new Date()),
    };

    const docRef = await addDoc(collection(db, "metricSnapshots"), newMetric);
    return docRef.id;
  };

  return {
    metrics,
    loading,
    error,
    addMetricSnapshot,
  };
}

// Hook for workout programs
export function useWorkoutPrograms() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        // Fetch public programs
        const q = query(
          collection(db, "workoutPrograms"),
          where("visibility", "==", "public"),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const programData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as WorkoutProgram[];

        setPrograms(programData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch programs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return { programs, loading, error };
}

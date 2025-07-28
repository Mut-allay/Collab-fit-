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
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  WorkoutLog,
  WorkoutProgram,
  MetricSnapshot,
  Exercise,
  CreateWorkoutLog,
  CreateMetricSnapshot,
} from "@fitspark/shared";

// --- Generic Document ---
export async function getDocument<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

// --- Workout Logs ---
export function onWorkoutLogsUpdate(
  userId: string,
  callback: (logs: WorkoutLog[]) => void
) {
  const q = query(collection(db, "workoutLogs"), where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Safely convert Timestamps to Dates
      timestamp: doc.data().timestamp?.toDate(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
    })) as WorkoutLog[];

    // Sort by timestamp descending in JavaScript to avoid Firestore indexing issues
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    callback(logs);
  });
}

export async function addWorkoutLog(
  userId: string,
  logData: CreateWorkoutLog
): Promise<string> {
  const newLog = {
    ...logData,
    userId: userId,
    timestamp: serverTimestamp(),
    startTime: serverTimestamp(),
    completed: false,
  };
  const docRef = await addDoc(collection(db, "workoutLogs"), newLog);
  return docRef.id;
}

export function updateWorkoutLog(
  logId: string,
  updates: Partial<WorkoutLog>
): Promise<void> {
  const logRef = doc(db, "workoutLogs", logId);
  return updateDoc(logRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export function deleteWorkoutLog(logId: string): Promise<void> {
  return deleteDoc(doc(db, "workoutLogs", logId));
}

// --- Exercises ---
export async function getExercises(): Promise<Exercise[]> {
  const querySnapshot = await getDocs(collection(db, "exercises"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Exercise[];
}

// --- Metric Snapshots ---
export function onMetricSnapshotsUpdate(
  userId: string,
  callback: (metrics: MetricSnapshot[]) => void
) {
  const q = query(
    collection(db, "metricSnapshots"),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snapshot) => {
    const metrics = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate(),
    })) as MetricSnapshot[];

    // Sort in JavaScript
    metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    callback(metrics);
  });
}

export async function addMetricSnapshot(
  userId: string,
  metricData: CreateMetricSnapshot
): Promise<string> {
  const newMetric = {
    ...metricData,
    userId: userId,
    timestamp: Timestamp.fromDate(new Date()),
  };
  const docRef = await addDoc(collection(db, "metricSnapshots"), newMetric);
  return docRef.id;
}

// --- Workout Programs ---
export async function getPublicWorkoutPrograms(): Promise<WorkoutProgram[]> {
  const q = query(
    collection(db, "workoutPrograms"),
    where("visibility", "==", "public")
  );
  const querySnapshot = await getDocs(q);
  const programs = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as WorkoutProgram[];

  // Sort in JavaScript
  programs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return programs;
}

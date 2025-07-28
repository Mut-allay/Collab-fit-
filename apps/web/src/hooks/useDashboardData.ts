import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getDocument } from "@/lib/firestoreService";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { WorkoutProgram, WorkoutLog } from "@fitspark/shared";

// Define the shape of the data this hook will return
export interface DashboardData {
  selectedPlan: WorkoutProgram | null;
  todaysWorkout: any; // Replace 'any' with a specific Phase type if available
  weeklyProgress: any[]; // Replace 'any' with a specific ProgressDay type
}

export function useDashboardData() {
  const { currentUser, userProfile } = useAuth();
  const [data, setData] = useState<DashboardData>({
    selectedPlan: null,
    todaysWorkout: null,
    weeklyProgress: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!currentUser || !userProfile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch selected plan
        let selectedPlan: WorkoutProgram | null = null;
        if (userProfile.selectedPlanId) {
          selectedPlan = await getDocument<WorkoutProgram>(
            "workoutPrograms",
            userProfile.selectedPlanId
          );
        }

        // Determine today's workout
        const todaysWorkout = selectedPlan
          ? selectedPlan.phases[
              new Date().getDay() % selectedPlan.phases.length
            ]
          : null;

        // Fetch weekly progress
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const logsRef = collection(db, "workoutLogs");
        const q = query(
          logsRef,
          where("userId", "==", currentUser.uid),
          where("startTime", ">=", startOfWeek),
          where("startTime", "<=", endOfWeek)
        );
        const snapshot = await getDocs(q);
        const logs = snapshot.docs.map((doc) => ({
          ...doc.data(),
          startTime: doc.data().startTime.toDate(),
        })) as WorkoutLog[];

        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weeklyProgress = weekDays.map((day, index) => {
          const dayDate = new Date(startOfWeek);
          dayDate.setDate(dayDate.getDate() + index);
          const dayLogs = logs.filter(
            (log) =>
              new Date(log.startTime).toDateString() === dayDate.toDateString()
          );
          return {
            day,
            date: dayDate,
            completed: dayLogs.length > 0,
            workoutCount: dayLogs.length,
          };
        });

        setData({ selectedPlan, todaysWorkout, weeklyProgress });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard data."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUser, userProfile]);

  return { ...data, loading, error };
}

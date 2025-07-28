import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorkoutLog, ExerciseStats } from "@/types/workout";

export function useWorkoutHistory() {
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [selectedWeek, setSelectedWeek] = useState<string>("default");
  const [selectedMonth, setSelectedMonth] = useState<string>("default");
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLog | null>(
    null
  );

  useEffect(() => {
    if (currentUser) {
      fetchWorkoutHistory();
    }
  }, [currentUser, timeRange, selectedWeek, selectedMonth]);

  const fetchWorkoutHistory = async () => {
    if (!currentUser) return;

    try {
      let startDate = new Date();
      let endDate = new Date();

      // Handle specific week selection
      if (timeRange === "week" && selectedWeek && selectedWeek !== "default") {
        const weekStart = new Date(selectedWeek);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        startDate = weekStart;
        endDate = weekEnd;
      }
      // Handle specific month selection
      else if (
        timeRange === "month" &&
        selectedMonth &&
        selectedMonth !== "default"
      ) {
        const parts = selectedMonth.split("-");
        if (parts.length === 2) {
          const year = parseInt(parts[0]!, 10);
          const month = parseInt(parts[1]!, 10);
          if (!isNaN(year) && !isNaN(month)) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0, 23, 59, 59, 999);
          }
        }
      }
      // Handle default time ranges
      else {
        switch (timeRange) {
          case "week":
            startDate.setDate(startDate.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case "quarter":
            startDate.setMonth(startDate.getMonth() - 3);
            break;
          case "year":
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
        }
      }

      const workoutLogsRef = collection(db, "workoutLogs");
      const q = query(
        workoutLogsRef,
        where("userId", "==", currentUser.uid),
        where("startTime", ">=", startDate),
        where("startTime", "<=", endDate),
        orderBy("startTime", "desc")
      );

      const snapshot = await getDocs(q);
      const logs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate(),
      })) as WorkoutLog[];

      setWorkoutLogs(logs);
      calculateExerciseStats(logs);
    } catch (error) {
      console.error("Error fetching workout history:", error);
      toast({
        title: "Error",
        description: "Failed to load workout history. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateExerciseStats = (logs: WorkoutLog[]) => {
    const exerciseMap = new Map<string, ExerciseStats>();

    logs.forEach((log) => {
      log.sets.forEach((set) => {
        const existing = exerciseMap.get(set.exerciseName) || {
          name: set.exerciseName,
          totalSets: 0,
          totalReps: 0,
          totalVolume: 0,
          maxWeight: 0,
          avgWeight: 0,
          workoutCount: 0,
        };

        existing.totalSets += 1;
        existing.totalReps += set.reps;
        existing.totalVolume += set.weight * set.reps;
        existing.maxWeight = Math.max(existing.maxWeight, set.weight);
        existing.workoutCount = new Set(
          logs
            .filter((l) =>
              l.sets.some((s) => s.exerciseName === set.exerciseName)
            )
            .map((l) => l.id)
        ).size;

        exerciseMap.set(set.exerciseName, existing);
      });
    });

    // Calculate average weights
    exerciseMap.forEach((stats) => {
      stats.avgWeight = Math.round(stats.totalVolume / stats.totalReps);
    });

    const sortedStats = Array.from(exerciseMap.values()).sort(
      (a, b) => b.totalVolume - a.totalVolume
    );

    setExerciseStats(sortedStats);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getVolumeChartData = () => {
    return workoutLogs.map((log) => ({
      date: log.startTime.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      volume: log.totalVolume,
    }));
  };

  const getExerciseChartData = () => {
    return exerciseStats.slice(0, 10).map((stat) => ({
      exercise: stat.name,
      volume: stat.totalVolume,
    }));
  };

  // Helper functions for time period selection
  const getWeekOptions = () => {
    const weeks = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i * 7);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const weekLabel = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
      const weekValue = weekStart.toISOString().split("T")[0];

      weeks.push({ label: weekLabel, value: weekValue });
    }
    return weeks;
  };

  const getMonthOptions = () => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      const monthLabel = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      const monthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      months.push({ label: monthLabel, value: monthValue });
    }
    return months;
  };

  const getCurrentTimeRangeLabel = () => {
    switch (timeRange) {
      case "week":
        return selectedWeek && selectedWeek !== "default"
          ? `Week of ${selectedWeek}`
          : "Last 7 days";
      case "month":
        return selectedMonth && selectedMonth !== "default"
          ? `Month of ${selectedMonth}`
          : "Last 30 days";
      case "quarter":
        return "Last 3 months";
      case "year":
        return "Last 12 months";
      default:
        return "Last 30 days";
    }
  };

  return {
    // State
    workoutLogs,
    exerciseStats,
    loading,
    timeRange,
    selectedWeek,
    selectedMonth,
    selectedWorkout,

    // Actions
    setTimeRange,
    setSelectedWeek,
    setSelectedMonth,
    setSelectedWorkout,

    // Computed
    formatDate,
    formatDuration,
    getVolumeChartData,
    getExerciseChartData,
    getWeekOptions,
    getMonthOptions,
    getCurrentTimeRangeLabel,
  };
}

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorkoutLog, ProgressMetrics, AchievementLevel } from "@/types/workout";
import { Trophy, Medal, Sprout } from "lucide-react";

export function useProgressData() {
  const { currentUser } = useAuth();

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [selectedWeek, setSelectedWeek] = useState<string>("default");
  const [selectedMonth, setSelectedMonth] = useState<string>("default");
  const [hasAnyWorkoutData, setHasAnyWorkoutData] = useState<boolean>(false);
  const [selectedRangeHasData, setSelectedRangeHasData] =
    useState<boolean>(true);



  const checkUserWorkoutHistory = useCallback(async () => {
    if (!currentUser) return;

    try {
      const workoutLogsRef = collection(db, "workoutLogs");
      const q = query(
        workoutLogsRef,
        where("userId", "==", currentUser.uid),
        orderBy("startTime", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      setHasAnyWorkoutData(!snapshot.empty);
    } catch (error) {
      console.error("Error checking user workout history:", error);
    }
  }, [currentUser]);

  const fetchProgressData = useCallback(async () => {
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
      setSelectedRangeHasData(logs.length > 0);
      calculateMetrics(logs);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, timeRange, selectedWeek, selectedMonth]);

  useEffect(() => {
    if (currentUser) {
      fetchProgressData();
      checkUserWorkoutHistory();
    }
  }, [currentUser, timeRange, selectedWeek, selectedMonth, fetchProgressData, checkUserWorkoutHistory]);

  const calculateMetrics = (logs: WorkoutLog[]) => {
    if (logs.length === 0) {
      setMetrics(null);
      return;
    }

    const totalWorkouts = logs.length;
    const totalVolume = logs.reduce((sum, log) => sum + log.totalVolume, 0);
    const totalTime = logs.reduce((sum, log) => sum + log.duration, 0);
    const avgWorkoutDuration = Math.round(totalTime / totalWorkouts);
    const avgVolumePerWorkout = Math.round(totalVolume / totalWorkouts);

    // Calculate consistency score (workouts per week)
    const weeks = Math.max(
      1,
      Math.ceil(
        (Date.now() -
          (logs[logs.length - 1]?.startTime.getTime() || Date.now())) /
          (7 * 24 * 60 * 60 * 1000)
      )
    );
    const consistencyScore = Math.round((totalWorkouts / weeks) * 100);

    // Calculate strength gain (volume increase over time)
    const recentLogs = logs.slice(0, Math.min(5, logs.length));
    const olderLogs = logs.slice(-Math.min(5, logs.length));
    const recentAvgVolume =
      recentLogs.reduce((sum, log) => sum + log.totalVolume, 0) /
      recentLogs.length;
    const olderAvgVolume =
      olderLogs.reduce((sum, log) => sum + log.totalVolume, 0) /
      olderLogs.length;
    const strengthGain = Math.round(
      ((recentAvgVolume - olderAvgVolume) / olderAvgVolume) * 100
    );

    // Calculate endurance gain (duration increase)
    const recentAvgDuration =
      recentLogs.reduce((sum, log) => sum + log.duration, 0) /
      recentLogs.length;
    const olderAvgDuration =
      olderLogs.reduce((sum, log) => sum + log.duration, 0) / olderLogs.length;
    const enduranceGain = Math.round(
      ((recentAvgDuration - olderAvgDuration) / olderAvgDuration) * 100
    );

    setMetrics({
      totalWorkouts,
      totalVolume,
      totalTime,
      avgWorkoutDuration,
      avgVolumePerWorkout,
      consistencyScore,
      strengthGain,
      enduranceGain,
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

  const getVolumeTrendData = () => {
    const weeklyData = new Map<string, number>();

    workoutLogs.forEach((log) => {
      const weekStart = new Date(log.startTime);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split("T")[0] || "";

      weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + log.totalVolume);
    });

    return Array.from(weeklyData.entries())
      .sort(([a], [b]) => (a || "").localeCompare(b || ""))
      .map(([week, volume]) => ({
        week: new Date(week || "").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        volume,
      }));
  };

  const getWorkoutFrequencyData = () => {
    const dailyData = new Map<string, number>();

    workoutLogs.forEach((log) => {
      const dayKey = log.startTime.toISOString().split("T")[0] || "";
      dailyData.set(dayKey, (dailyData.get(dayKey) || 0) + 1);
    });

    return Array.from(dailyData.entries())
      .sort(([a], [b]) => (a || "").localeCompare(b || ""))
      .slice(-14) // Last 14 days
      .map(([day, count]) => ({
        day: new Date(day || "").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        workouts: count,
      }));
  };

  const getAchievementLevel = (score: number): AchievementLevel => {
    if (score >= 90)
      return {
        level: "Elite",
        color: "text-purple-600",
        icon: Trophy,
        iconName: "Trophy",
      };
    if (score >= 80)
      return {
        level: "Excellent",
        color: "text-green-600",
        icon: Medal,
        iconName: "Medal",
      };
    if (score >= 70)
      return {
        level: "Good",
        color: "text-blue-600",
        icon: Medal,
        iconName: "Medal",
      };
    if (score >= 60)
      return {
        level: "Fair",
        color: "text-yellow-600",
        icon: Medal,
        iconName: "Medal",
      };
    return {
      level: "Beginner",
      color: "text-gray-600",
      icon: Sprout,
      iconName: "Sprout",
    };
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
    metrics,
    loading,
    timeRange,
    selectedWeek,
    selectedMonth,
    hasAnyWorkoutData,
    selectedRangeHasData,

    // Actions
    setTimeRange,
    setSelectedWeek,
    setSelectedMonth,

    // Computed
    formatDuration,
    getVolumeTrendData,
    getWorkoutFrequencyData,
    getAchievementLevel,
    getWeekOptions,
    getMonthOptions,
    getCurrentTimeRangeLabel,
  };
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  TrendingUp,
  Target,
  Calendar,
  Award,
  Activity,
  Zap,
  Clock,
} from "lucide-react";

interface WorkoutLog {
  id: string;
  userId: string;
  workoutPlanId: string;
  phaseId: string;
  phaseName: string;
  startTime: Date;
  endTime?: Date;
  sets: SetLog[];
  totalVolume: number;
  duration: number;
}

interface SetLog {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

interface ProgressMetrics {
  totalWorkouts: number;
  totalVolume: number;
  totalTime: number;
  avgWorkoutDuration: number;
  avgVolumePerWorkout: number;
  consistencyScore: number;
  strengthGain: number;
  enduranceGain: number;
}

export default function ProgressPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");

  useEffect(() => {
    if (currentUser) {
      fetchProgressData();
    }
  }, [currentUser, timeRange]);

  const fetchProgressData = async () => {
    if (!currentUser) return;

    try {
      const startDate = new Date();
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

      const workoutLogsRef = collection(db, "workoutLogs");
      const q = query(
        workoutLogsRef,
        where("userId", "==", currentUser.uid),
        where("startTime", ">=", startDate),
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
      calculateMetrics(logs);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const getAchievementLevel = (score: number) => {
    if (score >= 90)
      return { level: "Elite", color: "text-purple-600", icon: "🏆" };
    if (score >= 80)
      return { level: "Excellent", color: "text-green-600", icon: "🥇" };
    if (score >= 70)
      return { level: "Good", color: "text-blue-600", icon: "🥈" };
    if (score >= 60)
      return { level: "Fair", color: "text-yellow-600", icon: "🥉" };
    return { level: "Beginner", color: "text-gray-600", icon: "🌱" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">📈</div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Progress Tracking</h1>
                <p className="text-sm text-muted-foreground">
                  Monitor your fitness journey
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {["week", "month", "quarter", "year"].map((range) => (
                <Button
                  key={range}
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeRange(range as any)}
                  className={
                    timeRange === range ? "bg-spark-50 border-spark-200" : ""
                  }
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {!metrics ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2">No Progress Data Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start working out to see your progress tracking in action
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Start Your First Workout
            </Button>
          </motion.div>
        ) : (
          <>
            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Workouts
                      </p>
                      <p className="text-2xl font-bold">
                        {metrics.totalWorkouts}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-spark-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Volume
                      </p>
                      <p className="text-2xl font-bold">
                        {metrics.totalVolume.toLocaleString()} lbs
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-spark-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg Duration
                      </p>
                      <p className="text-2xl font-bold">
                        {formatDuration(metrics.avgWorkoutDuration)}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-spark-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Consistency
                      </p>
                      <p className="text-2xl font-bold">
                        {metrics.consistencyScore}%
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-spark-600" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Volume Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Volume Trend
                  </CardTitle>
                  <CardDescription>Weekly volume progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getVolumeTrendData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip
                          formatter={(value: any) => [
                            `${value.toLocaleString()} lbs`,
                            "Volume",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="volume"
                          stroke="#f97316"
                          fill="#f97316"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Workout Frequency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Workout Frequency
                  </CardTitle>
                  <CardDescription>Daily workout consistency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getWorkoutFrequencyData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="workouts" fill="#f97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Strength Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Strength Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${metrics.strengthGain >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {metrics.strengthGain >= 0 ? "+" : ""}
                      {metrics.strengthGain}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Volume increase over time
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Endurance Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Endurance Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${metrics.enduranceGain >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {metrics.enduranceGain >= 0 ? "+" : ""}
                      {metrics.enduranceGain}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Duration improvement
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Level */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Achievement Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl mb-2">
                      {getAchievementLevel(metrics.consistencyScore).icon}
                    </div>
                    <div
                      className={`text-xl font-bold ${getAchievementLevel(metrics.consistencyScore).color}`}
                    >
                      {getAchievementLevel(metrics.consistencyScore).level}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on consistency
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

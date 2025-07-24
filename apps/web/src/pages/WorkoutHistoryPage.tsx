import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, TrendingUp, Dumbbell } from "lucide-react";

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

interface ExerciseStats {
  name: string;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  maxWeight: number;
  avgWeight: number;
  workoutCount: number;
}

export default function WorkoutHistoryPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">(
    "month"
  );
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLog | null>(
    null
  );

  useEffect(() => {
    if (currentUser) {
      fetchWorkoutHistory();
    }
  }, [currentUser, timeFilter]);

  const fetchWorkoutHistory = async () => {
    if (!currentUser) return;

    try {
      const startDate = new Date();
      switch (timeFilter) {
        case "week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
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
        orderBy("startTime", "desc"),
        limit(50)
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
    } finally {
      setLoading(false);
    }
  };

  const calculateExerciseStats = (logs: WorkoutLog[]) => {
    const exerciseMap = new Map<string, ExerciseStats>();

    logs.forEach((log) => {
      log.sets.forEach((set) => {
        if (!exerciseMap.has(set.exerciseId)) {
          exerciseMap.set(set.exerciseId, {
            name: set.exerciseName,
            totalSets: 0,
            totalReps: 0,
            totalVolume: 0,
            maxWeight: 0,
            avgWeight: 0,
            workoutCount: 0,
          });
        }

        const stats = exerciseMap.get(set.exerciseId)!;
        stats.totalSets += 1;
        stats.totalReps += set.reps;
        stats.totalVolume += set.weight * set.reps;
        stats.maxWeight = Math.max(stats.maxWeight, set.weight);
      });
    });

    // Calculate averages and workout counts
    exerciseMap.forEach((stats) => {
      stats.avgWeight = Math.round(stats.totalVolume / stats.totalReps);
      stats.workoutCount = logs.filter((log) =>
        log.sets.some((set) => set.exerciseId === stats.name)
      ).length;
    });

    setExerciseStats(Array.from(exerciseMap.values()));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
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
    return workoutLogs
      .slice(0, 10)
      .reverse()
      .map((log) => ({
        date: formatDate(log.startTime),
        volume: log.totalVolume,
        duration: log.duration,
      }));
  };

  const getExerciseChartData = () => {
    return exerciseStats.slice(0, 5).map((stat) => ({
      name: stat.name,
      volume: stat.totalVolume,
      sets: stat.totalSets,
    }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-muted-foreground">
            Loading your workout history...
          </p>
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
                <h1 className="text-2xl font-bold">Workout History</h1>
                <p className="text-sm text-muted-foreground">
                  Track your fitness journey
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeFilter("week")}
                className={
                  timeFilter === "week" ? "bg-spark-50 border-spark-200" : ""
                }
              >
                Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeFilter("month")}
                className={
                  timeFilter === "month" ? "bg-spark-50 border-spark-200" : ""
                }
              >
                Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeFilter("year")}
                className={
                  timeFilter === "year" ? "bg-spark-50 border-spark-200" : ""
                }
              >
                Year
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-spark-600">
                {workoutLogs.length}
              </div>
              <p className="text-sm text-muted-foreground">Total Workouts</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-spark-600">
                {workoutLogs
                  .reduce((sum, log) => sum + log.totalVolume, 0)
                  .toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                Total Volume (lbs)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-spark-600">
                {formatDuration(
                  workoutLogs.reduce((sum, log) => sum + log.duration, 0)
                )}
              </div>
              <p className="text-sm text-muted-foreground">Total Time</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-spark-600">
                {exerciseStats.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Exercises Performed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Volume Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Volume Trend
              </CardTitle>
              <CardDescription>Your workout volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getVolumeChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip
                      formatter={(value: any) => [
                        `${value.toLocaleString()} lbs`,
                        "Volume",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Exercise Distribution
              </CardTitle>
              <CardDescription>Volume by exercise type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getExerciseChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="volume"
                    >
                      {getExerciseChartData().map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [
                        `${value.toLocaleString()} lbs`,
                        "Volume",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Workouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Workouts
              </CardTitle>
              <CardDescription>Your latest workout sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workoutLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🏋️</div>
                    <p className="text-muted-foreground">
                      No workouts found for this period
                    </p>
                    <Button
                      onClick={() => navigate("/dashboard")}
                      className="mt-4"
                    >
                      Start Your First Workout
                    </Button>
                  </div>
                ) : (
                  workoutLogs.map((workout) => (
                    <div
                      key={workout.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedWorkout(workout)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {workout.phaseName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(workout.startTime)}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-spark-600">
                              {workout.totalVolume.toLocaleString()}
                            </div>
                            <div className="text-muted-foreground">lbs</div>
                          </div>

                          <div className="text-center">
                            <div className="font-semibold text-spark-600">
                              {formatDuration(workout.duration)}
                            </div>
                            <div className="text-muted-foreground">time</div>
                          </div>

                          <div className="text-center">
                            <div className="font-semibold text-spark-600">
                              {workout.sets.length}
                            </div>
                            <div className="text-muted-foreground">sets</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {selectedWorkout.phaseName}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWorkout(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-spark-600">
                      {selectedWorkout.totalVolume.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Volume
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-spark-600">
                      {formatDuration(selectedWorkout.duration)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Duration
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-spark-600">
                      {selectedWorkout.sets.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Sets</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Exercise Details</h3>
                  <div className="space-y-2">
                    {Array.from(
                      new Set(selectedWorkout.sets.map((s) => s.exerciseName))
                    ).map((exerciseName) => {
                      const exerciseSets = selectedWorkout.sets.filter(
                        (s) => s.exerciseName === exerciseName
                      );
                      const totalVolume = exerciseSets.reduce(
                        (sum, set) => sum + set.weight * set.reps,
                        0
                      );
                      const maxWeight = Math.max(
                        ...exerciseSets.map((s) => s.weight)
                      );

                      return (
                        <div key={exerciseName} className="border rounded p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{exerciseName}</span>
                            <Badge variant="outline">
                              {exerciseSets.length} sets
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {totalVolume.toLocaleString()} lbs • Max:{" "}
                            {maxWeight} lbs
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

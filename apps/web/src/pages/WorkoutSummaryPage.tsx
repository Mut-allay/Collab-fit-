import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  ArrowLeft,
  Share2,
  TrendingUp,
  Calendar,
  RotateCcw,
} from "lucide-react";

interface SetLog {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

interface WorkoutSession {
  workoutPlanId: string;
  phaseId: string;
  phaseName: string;
  startTime: Date;
  endTime?: Date;
  sets: SetLog[];
  totalVolume: number;
  duration: number;
}

export default function WorkoutSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { planId, phaseId } = useParams();

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [exerciseStats, setExerciseStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session data from navigation state or params
    if (location.state?.session) {
      setSession(location.state.session);
      processSessionData(location.state.session);
    } else {
      // Fallback: try to load from localStorage or redirect
      navigate("/dashboard");
    }
    setLoading(false);
  }, [location.state, navigate]);

  const processSessionData = (sessionData: WorkoutSession) => {
    // Group sets by exercise and calculate stats
    const exerciseMap = new Map();

    sessionData.sets.forEach((set) => {
      if (!exerciseMap.has(set.exerciseId)) {
        exerciseMap.set(set.exerciseId, {
          name: set.exerciseName,
          sets: 0,
          totalReps: 0,
          totalVolume: 0,
          maxWeight: 0,
          avgWeight: 0,
        });
      }

      const exercise = exerciseMap.get(set.exerciseId);
      exercise.sets += 1;
      exercise.totalReps += set.reps;
      exercise.totalVolume += set.weight * set.reps;
      exercise.maxWeight = Math.max(exercise.maxWeight, set.weight);
    });

    // Calculate averages
    exerciseMap.forEach((exercise) => {
      exercise.avgWeight = Math.round(
        exercise.totalVolume / exercise.totalReps
      );
    });

    setExerciseStats(Array.from(exerciseMap.values()));
  };

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPerformanceMessage = (volume: number, duration: number) => {
    const volumePerMinute = volume / duration;

    if (volumePerMinute > 50) return "🔥 Exceptional performance!";
    if (volumePerMinute > 30) return "💪 Great work today!";
    if (volumePerMinute > 15) return "👍 Solid effort!";
    return "💪 Keep pushing forward!";
  };

  const shareWorkout = () => {
    if (navigator.share) {
      navigator.share({
        title: "FitSpark Workout Complete!",
        text: `Just completed ${session?.phaseName} - ${session?.totalVolume} lbs total volume in ${formatDuration(session?.duration || 0)}! 💪`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Just completed ${session?.phaseName} - ${session?.totalVolume} lbs total volume in ${formatDuration(session?.duration || 0)}! 💪`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">🏋️</div>
          <p className="text-muted-foreground">
            Loading your workout summary...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-muted-foreground">Workout summary not found</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-spark-500 to-fitness-500 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={shareWorkout}
              className="text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold mb-2">Workout Complete!</h1>
            <p className="text-xl opacity-90">{session.phaseName}</p>
            <p className="text-lg opacity-80 mt-2">
              {getPerformanceMessage(session.totalVolume, session.duration)}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">💪</div>
              <div className="text-2xl font-bold text-spark-600">
                {session.totalVolume.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">
                Total Volume (lbs)
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">⏰</div>
              <div className="text-2xl font-bold text-spark-600">
                {formatDuration(session.duration)}
              </div>
              <p className="text-sm text-muted-foreground">Duration</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-spark-600">
                {session.sets.length}
              </div>
              <p className="text-sm text-muted-foreground">Sets Completed</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Workout Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Exercise Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Exercise Performance
              </CardTitle>
              <CardDescription>Volume lifted per exercise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={exerciseStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip
                      formatter={(value: any) => [`${value} lbs`, "Volume"]}
                      labelFormatter={(label) => `Exercise: ${label}`}
                    />
                    <Bar dataKey="totalVolume" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Time</p>
                  <p className="font-semibold">
                    {formatTime(session.startTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Time</p>
                  <p className="font-semibold">
                    {session.endTime ? formatTime(session.endTime) : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Workout Plan</p>
                <p className="font-semibold">{session.phaseName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total Reps</p>
                <p className="font-semibold">
                  {session.sets.reduce((sum, set) => sum + set.reps, 0)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Average Weight</p>
                <p className="font-semibold">
                  {Math.round(
                    session.totalVolume /
                      session.sets.reduce((sum, set) => sum + set.reps, 0)
                  )}{" "}
                  lbs
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercise Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Exercise Breakdown
              </CardTitle>
              <CardDescription>
                Detailed performance for each exercise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exerciseStats.map((exercise, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{exercise.name}</h3>
                      <Badge variant="outline">{exercise.sets} sets</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Volume</p>
                        <p className="font-semibold">
                          {exercise.totalVolume} lbs
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Reps</p>
                        <p className="font-semibold">{exercise.totalReps}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Max Weight</p>
                        <p className="font-semibold">
                          {exercise.maxWeight} lbs
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Weight</p>
                        <p className="font-semibold">
                          {exercise.avgWeight} lbs
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={() => navigate("/dashboard")}
            className="flex-1"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Button
            onClick={() => navigate(`/workout/${planId}/${phaseId}`)}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Repeat Workout
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

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
import {
  Dumbbell,
  ArrowLeft,
  Share2,
  TrendingUp,
  Calendar,
  Trophy,
  Target,
} from "lucide-react";
import { useWorkoutSummary } from "@/hooks/useWorkoutSummary";

export default function WorkoutSummaryPage() {
  const {
    // State
    session,
    exerciseStats,
    loading,

    // Computed
    formatDuration,
    formatTime,
    getPerformanceMessage,
    getVolumeData,

    // Actions
    shareWorkout,
  } = useWorkoutSummary();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">
            <Trophy className="h-12 w-12 mx-auto text-spark-600 animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading your workout summary...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-2xl font-semibold mb-2">No workout data</h2>
          <p className="text-muted-foreground mb-4">
            No workout session data found.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const volumeData = getVolumeData();

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/hero-2.png"
          alt="Fitness background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/70" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/40 backdrop-blur-sm border-b border-cyan-500/30 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="text-center">
              <h1 className="text-lg font-semibold">Workout Complete! 🎉</h1>
              <p className="text-sm text-muted-foreground">
                {session.phaseName}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={shareWorkout}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-spark-50 to-spark-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-spark-600" />
                Workout Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-spark-600">
                    {formatDuration(session.duration)}
                  </div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-spark-600">
                    {session.totalVolume}kg
                  </div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-spark-600">
                    {session.sets.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Sets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-spark-600">
                    {exerciseStats.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Exercises</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-center text-lg font-medium">
                  {getPerformanceMessage(session.totalVolume, session.duration)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Volume by Exercise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-spark-600" />
                  Volume by Exercise
                </CardTitle>
                <CardDescription>
                  Total weight lifted per exercise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#0891b2" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Exercise Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-spark-600" />
                  Exercise Breakdown
                </CardTitle>
                <CardDescription>
                  Sets and reps per exercise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {exerciseStats.map((exercise, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {exercise.sets} sets • {exercise.totalReps} reps
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-spark-600">
                          {exercise.totalVolume}kg
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Max: {exercise.maxWeight}kg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Session Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-spark-600" />
                Session Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Workout Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span>{session.workoutPlanId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phase:</span>
                      <span>{session.phaseName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Started:</span>
                      <span>{formatTime(session.startTime)}</span>
                    </div>
                    {session.endTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ended:</span>
                        <span>{formatTime(session.endTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Performance Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Volume per minute:</span>
                      <span>
                        {Math.round(session.totalVolume / session.duration)}kg/min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sets per minute:</span>
                      <span>
                        {(session.sets.length / session.duration).toFixed(1)}/min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg set volume:</span>
                      <span>
                        {Math.round(session.totalVolume / session.sets.length)}kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
        >
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workout
          </Button>
          <Button
            onClick={() => window.location.href = "/dashboard"}
            className="bg-spark-600 hover:bg-spark-700"
            size="lg"
          >
            <Target className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
          <Button
            onClick={shareWorkout}
            variant="outline"
            size="lg"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Achievement
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, TrendingUp, Dumbbell, BarChart3 } from "lucide-react";
// import Navbar from "@/components/layout/navbar/Navbar";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";

export default function WorkoutHistoryPage() {
  const navigate = useNavigate();
  const {
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
  } = useWorkoutHistory();



  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">
            <BarChart3 className="h-12 w-12 mx-auto text-spark-600" />
          </div>
          <p className="text-muted-foreground">
            Loading your workout history...
          </p>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* Header and Time Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-8"
        >
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">
              Workout History
            </h1>
            <p className="text-sm text-muted-foreground">
              Review your completed workouts, track performance trends, and
              analyze your fitness progress over time
            </p>
          </div>

          {/* Time Period Selection */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Choose the time period you want to review. You can view your
                  workout history for the past week, month, or year to analyze
                  your fitness patterns and progress.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Time Range Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Period Type</label>
                  <Select
                    value={timeRange}
                    onValueChange={(value) => {
                      setTimeRange(value as "week" | "month" | "quarter" | "year");
                      setSelectedWeek("default");
                      setSelectedMonth("default");
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Specific Week Selection */}
                {timeRange === "week" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Select Week</label>
                    <Select
                      value={selectedWeek}
                      onValueChange={setSelectedWeek}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Choose a week" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Last 7 days</SelectItem>
                        {getWeekOptions().map((week) => (
                          <SelectItem key={week.value} value={week.value || ""}>
                            {week.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Specific Month Selection */}
                {timeRange === "month" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Select Month</label>
                    <Select
                      value={selectedMonth}
                      onValueChange={setSelectedMonth}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Choose a month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Last 30 days</SelectItem>
                        {getMonthOptions().map((month) => (
                          <SelectItem
                            key={month.value}
                            value={month.value || ""}
                          >
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Current Selection Display */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">
                Currently viewing:{" "}
                <span className="text-spark-600">
                  {getCurrentTimeRangeLabel()}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats Overview */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Workout Summary
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Key metrics showing your overall workout activity for the selected
            time period. These numbers help you understand your training volume
            and consistency.
          </p>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-spark-600">
                {workoutLogs.length}
              </div>
              <p className="text-sm text-muted-foreground">Total Workouts</p>
              <p className="text-xs text-muted-foreground mt-1">
                Completed sessions
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-spark-600">
                {formatDuration(
                  workoutLogs.reduce((sum, log) => sum + log.duration, 0)
                )}
              </div>
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="text-xs text-muted-foreground mt-1">
                Time spent training
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-spark-600">
                {exerciseStats.length}
              </div>
              <p className="text-sm text-muted-foreground">
                Exercises Performed
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Different exercises
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Overview */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Analytics
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Visual insights into your workout patterns and exercise
            distribution. These charts help you understand your training focus
            and volume trends over time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Volume Trend Chart */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Volume Trend
              </CardTitle>
              <CardDescription>
                Shows your total weight lifted per workout session. Higher
                points indicate more intense workouts with greater total volume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getVolumeChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      fontSize={12}
                      label={{
                        value: "Workout Date",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />
                    <YAxis
                      fontSize={12}
                      label={{
                        value: "Volume (kg)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toLocaleString()} kg`,
                        "Total Volume",
                      ]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="volume"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                      name="Workout Volume"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Exercise Distribution */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Exercise Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of your total volume by exercise type. Larger slices
                represent exercises you've focused on more during this period.
              </CardDescription>
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
                      nameKey="name"
                    >
                      {getExerciseChartData().map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${value.toLocaleString()} kg`,
                        "Volume",
                      ]}
                      labelFormatter={(label) => `Exercise: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Workouts Overview */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Workouts
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Detailed list of your completed workout sessions. Click on any
            workout to view detailed exercise breakdown and performance metrics.
          </p>
        </div>

        {/* Recent Workouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Workout Sessions
              </CardTitle>
              <CardDescription>
                Your completed workout sessions with volume, duration, and set
                counts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workoutLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">
                      <Dumbbell className="h-12 w-12 mx-auto text-spark-600" />
                    </div>
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
                            <div className="text-muted-foreground">kg</div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg w-full max-w-md mx-2 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">
                  {selectedWorkout.phaseName}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWorkout(null)}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-spark-600">
                      {selectedWorkout.totalVolume.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Volume
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-spark-600">
                      {formatDuration(selectedWorkout.duration)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Duration
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-spark-600">
                      {selectedWorkout.sets.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Sets</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 text-base">
                    Exercise Details
                  </h3>
                  <div className="space-y-3">
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
                        <div
                          key={exerciseName}
                          className="border rounded-lg p-3"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">
                              {exerciseName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {exerciseSets.length} sets
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {totalVolume.toLocaleString()} kg • Max: {maxWeight}{" "}
                            kg
                          </div>
                          <div className="space-y-1">
                            {exerciseSets.map((set, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center text-xs bg-gray-50 px-2 py-1 rounded"
                              >
                                <span>Set {set.setNumber}</span>
                                <span className="font-medium">
                                  {set.weight} kg × {set.reps} reps
                                </span>
                              </div>
                            ))}
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

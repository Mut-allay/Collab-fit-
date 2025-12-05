import React from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Target,
  Calendar,
  Award,
  Activity,
  Zap,
  Clock,
  Rocket,
  BarChart3,
  Trophy,
} from "lucide-react";
// import Navbar from "@/components/layout/navbar/Navbar";
import { useProgressData } from "@/hooks/useProgressData";

export default function ProgressPage() {
  const navigate = useNavigate();
  const {
    // State
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
  } = useProgressData();

  const renderEmptyState = () => {
    if (!hasAnyWorkoutData) {
      // User has never worked out - show get started message
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">
            <Rocket className="h-16 w-16 mx-auto text-spark-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't started any workouts yet. Choose a workout plan and
            begin your fitness transformation today!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/plans")}
              className="bg-spark-600 hover:bg-spark-700"
            >
              Browse Workout Plans
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </motion.div>
      );
    } else if (!selectedRangeHasData) {
      // User has workout data but not in selected range - show different message
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">
            <Calendar className="h-16 w-16 mx-auto text-spark-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            No Data for Selected Period
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You don't have any workout data for{" "}
            <span className="font-semibold text-spark-600">
              {getCurrentTimeRangeLabel()}
            </span>
            . Try selecting a different time period or check your workout
            history.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/workout-history")}
              className="bg-spark-600 hover:bg-spark-700"
            >
              View Workout History
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setTimeRange("month");
                setSelectedWeek("default");
                setSelectedMonth("default");
              }}
            >
              Reset to Recent Data
            </Button>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">
            <TrendingUp className="h-12 w-12 mx-auto text-spark-600" />
          </div>
          <p className="text-muted-foreground">Loading your progress...</p>
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
        {!metrics ? (
          renderEmptyState()
        ) : (
          <>
            {/* Key Metrics with Descriptions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mb-8"
            >
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">
                  Progress Tracking
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor your fitness journey
                </p>
              </div>
              {/* Time Period Selection */}
              <div className="bg-white rounded-lg border p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Choose the time period you want to analyze. You can view
                      your progress for specific weeks, months, quarters, or
                      years.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Time Range Type */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">Period Type</label>
                      <Select
                        value={timeRange}
                        onValueChange={(value) => {
                          setTimeRange(value as any);
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
                        <label className="text-sm font-medium">
                          Select Week
                        </label>
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
                              <SelectItem
                                key={week.value}
                                value={week.value || ""}
                              >
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
                        <label className="text-sm font-medium">
                          Select Month
                        </label>
                        <Select
                          value={selectedMonth}
                          onValueChange={setSelectedMonth}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Choose a month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">
                              Last 30 days
                            </SelectItem>
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

              {/* Metrics Overview */}
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Key metrics showing your fitness progress over the selected
                  time period. These numbers help you understand your workout
                  patterns and overall performance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
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
                    <p className="text-xs text-muted-foreground">
                      Number of completed workout sessions in this period
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Volume
                        </p>
                        <p className="text-2xl font-bold">
                          {metrics.totalVolume.toLocaleString()} kg
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-spark-600" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Combined weight lifted across all exercises
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
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
                    <p className="text-xs text-muted-foreground">
                      Average time spent per workout session
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
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
                    <p className="text-xs text-muted-foreground">
                      How regularly you've been working out
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Progress Charts with Enhanced Descriptions */}
            <div className="space-y-6 mb-8">
              {/* Charts Overview */}
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progress Analytics
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Visual insights into your workout patterns and progress
                  trends. These charts help you understand your consistency and
                  performance over time.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Volume Trend */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Volume Trend
                    </CardTitle>
                    <CardDescription>
                      Shows your total weight lifted per week. Higher bars
                      indicate more intense or frequent workouts.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getVolumeTrendData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="week"
                            fontSize={12}
                            label={{
                              value: "Week",
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
                            formatter={(value: any) => [
                              `${value.toLocaleString()} kg`,
                              "Total Volume",
                            ]}
                            labelFormatter={(label) => `Week: ${label}`}
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
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Workout Frequency
                    </CardTitle>
                    <CardDescription>
                      Number of workouts completed each week. Consistent bars
                      show good workout habits.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getWorkoutFrequencyData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="day"
                            fontSize={12}
                            label={{
                              value: "Day of Week",
                              position: "insideBottom",
                              offset: -5,
                            }}
                          />
                          <YAxis
                            fontSize={12}
                            label={{
                              value: "Workouts",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            formatter={(value: any) => [value, "Workouts"]}
                            labelFormatter={(label) => `Day: ${label}`}
                          />
                          <Bar dataKey="workouts" fill="#f97316" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Performance Insights with Enhanced Descriptions */}
            <div className="space-y-6">
              {/* Insights Overview */}
              <div>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Performance Insights
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Detailed analysis of your strength and endurance improvements.
                  These metrics help you understand your fitness progression and
                  areas for focus.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Strength Progress */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Strength Progress
                    </CardTitle>
                    <CardDescription>
                      Measures your ability to lift heavier weights over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold ${metrics.strengthGain >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {metrics.strengthGain >= 0 ? "+" : ""}
                        {metrics.strengthGain}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 mb-3">
                        Volume increase over time
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Positive % = Getting stronger</p>
                        <p>• Negative % = Need more focus</p>
                        <p>• Based on weight progression</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Endurance Progress */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Endurance Progress
                    </CardTitle>
                    <CardDescription>
                      Tracks your ability to sustain longer workouts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold ${metrics.enduranceGain >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {metrics.enduranceGain >= 0 ? "+" : ""}
                        {metrics.enduranceGain}%
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 mb-3">
                        Duration improvement
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Positive % = Better stamina</p>
                        <p>• Negative % = Need cardio focus</p>
                        <p>• Based on workout duration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievement Level */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Achievement Level
                    </CardTitle>
                    <CardDescription>
                      Your current fitness level based on consistency
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {React.createElement(
                          getAchievementLevel(metrics.consistencyScore).icon
                        )}
                      </div>
                      <div
                        className={`text-xl font-bold ${getAchievementLevel(metrics.consistencyScore).color}`}
                      >
                        {getAchievementLevel(metrics.consistencyScore).level}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 mb-3">
                        Based on consistency
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>• Beginner: 0-30% consistency</p>
                        <p>• Intermediate: 31-70% consistency</p>
                        <p>• Advanced: 71-100% consistency</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

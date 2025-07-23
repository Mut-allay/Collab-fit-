import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
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
import {
  Play,
  Target,
  Calendar,
  Settings,
  Plus,
  TrendingUp,
  Dumbbell,
  User,
} from "lucide-react";

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  goal: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  phases: Array<{
    id: string;
    name: string;
    description: string;
    exercises: any[];
    estimatedDuration: number;
  }>;
}

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200",
};

const GOAL_ICONS = {
  general_fitness: "💪",
  strength: "🏋️",
  weight_loss: "🔥",
  muscle_gain: "💪",
  endurance: "🏃",
};

export default function DashboardPage() {
  const { currentUser, userProfile, logout } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [todaysWorkout, setTodaysWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile?.selectedPlanId) {
      fetchSelectedPlan();
    } else {
      setLoading(false);
    }
  }, [userProfile?.selectedPlanId]);

  const fetchSelectedPlan = async () => {
    if (!userProfile?.selectedPlanId) return;

    try {
      const planRef = doc(db, "workoutPrograms", userProfile.selectedPlanId);
      const planSnap = await getDoc(planRef);

      if (planSnap.exists()) {
        const planData = { id: planSnap.id, ...planSnap.data() } as WorkoutPlan;
        setSelectedPlan(planData);

        // Calculate today's workout (simple rotation based on day of week)
        const dayOfWeek = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
        const workoutIndex = dayOfWeek % planData.phases.length;
        setTodaysWorkout(planData.phases[workoutIndex]);
      }
    } catch (error) {
      console.error("Error fetching selected plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getDayName = () => {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🏋️‍♂️</div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-first container with proper padding */}
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {/* Header - Mobile optimized */}
        <div className="mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">
                {getGreeting()},{" "}
                <span className="text-spark-600">
                  {currentUser?.displayName?.split(" ")[0] || "Fitness Warrior"}
                </span>
                ! 👋
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Ready to crush your {getDayName()} workout?
              </p>
            </div>

            {/* Action buttons - Only show on desktop */}
            <div className="hidden sm:flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile")}
                className="w-full sm:w-auto"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full sm:w-auto"
              >
                <Settings className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Main content - Single column on mobile, grid on larger screens */}
        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Workout Card - Mobile optimized */}
            {selectedPlan && todaysWorkout ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-spark-500/10 via-spark-400/5 to-fitness-500/10" />
                  <CardHeader className="relative pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl flex items-center gap-2 mb-1">
                          <Dumbbell className="h-5 w-5 text-spark-600" />
                          Today's Workout
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {getDayName()} • {todaysWorkout.estimatedDuration}{" "}
                          minutes
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-white/80 backdrop-blur-sm w-fit"
                      >
                        {todaysWorkout.exercises.length} exercises
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative pt-0">
                    <div className="mb-6">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
                        {todaysWorkout.name}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {todaysWorkout.description}
                      </p>
                    </div>

                    {/* Mobile-first button layout */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        size="lg"
                        className="flex-1 h-12 sm:h-11 text-base font-medium"
                        variant="spark"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Start Workout
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate(`/plans/${selectedPlan.id}`)}
                        className="flex-1 h-12 sm:h-11 text-base font-medium"
                      >
                        View Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              /* No Plan Selected - Mobile optimized */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
                      <Target className="h-5 w-5 text-spark-600" />
                      Choose Your Workout Plan
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Select a workout plan to start your fitness journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="py-6 sm:py-8">
                      <div className="text-5xl sm:text-6xl mb-4">🎯</div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-900">
                        No workout plan selected
                      </h3>
                      <p className="text-muted-foreground mb-6 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                        Choose from our curated workout plans designed for your
                        goals and experience level.
                      </p>
                      <Button
                        onClick={() => navigate("/plans")}
                        variant="spark"
                        size="lg"
                        className="h-12 px-8 text-base font-medium"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Browse Workout Plans
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Weekly Progress - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-5 w-5 text-spark-600" />
                    This Week's Progress
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Track your weekly workout consistency
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-7 gap-2 sm:gap-3">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => {
                        const isToday =
                          new Date().getDay() ===
                          [
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                          ].indexOf(day);
                        const isCompleted = Math.random() > 0.6; // Placeholder logic

                        return (
                          <div key={day} className="text-center">
                            <p className="text-xs text-muted-foreground mb-2 sm:mb-3">
                              {day}
                            </p>
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-medium mx-auto ${
                                isToday
                                  ? "bg-spark-500 text-white ring-2 ring-spark-200 shadow-lg"
                                  : isCompleted
                                    ? "bg-green-100 text-green-800 border-2 border-green-200"
                                    : "bg-gray-100 text-gray-500 border-2 border-gray-200"
                              }`}
                            >
                              {isCompleted
                                ? "✓"
                                : [
                                    "Sun",
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                  ].indexOf(day) + 1}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Quick Stats & Actions - Mobile optimized */}
          <div className="space-y-6">
            {/* Current Plan Info */}
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">
                        {GOAL_ICONS[
                          selectedPlan.goal as keyof typeof GOAL_ICONS
                        ] || "💪"}
                      </span>
                      Current Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">
                        {selectedPlan.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${DIFFICULTY_COLORS[selectedPlan.difficulty as keyof typeof DIFFICULTY_COLORS]}`}
                      >
                        {selectedPlan.difficulty}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                          Duration
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedPlan.durationWeeks} weeks
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                          Sessions
                        </p>
                        <p className="font-semibold text-gray-900">
                          {selectedPlan.sessionsPerWeek}/week
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/plans")}
                      className="w-full h-11 font-medium"
                    >
                      Change Plan
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Quick Actions - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-11 justify-start font-medium"
                  >
                    <TrendingUp className="h-4 w-4 mr-3" />
                    View Progress
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-11 justify-start font-medium"
                  >
                    <Calendar className="h-4 w-4 mr-3" />
                    Workout History
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-11 justify-start font-medium"
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Motivational Quote - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-spark-50 via-orange-50 to-fitness-50 border-spark-200 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">💪</div>
                  <p className="text-sm sm:text-base font-medium text-spark-800 leading-relaxed mb-2">
                    "The only bad workout is the one that didn't happen."
                  </p>
                  <p className="text-xs text-spark-600">- FitSpark Team</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Loader2,
  Clock,
  Target,
  Calendar,
  Users,
  ChevronLeft,
  Play,
  BarChart3,
  Dumbbell,
  Timer,
  Zap,
} from "lucide-react";
import { usePlanView } from "@/hooks/usePlanView";
import { DIFFICULTY_COLORS, GOAL_ICONS } from "@/types/workout";

export default function ViewPlanPage() {
  const navigate = useNavigate();
  const {
    // State
    plan,
    exerciseDetails,
    loading,
    selectedPhase,
    selectingPlan,
    userProfile,

    // Actions
    setSelectedPhase,

    // Handlers
    handleSelectPlan,
    formatExerciseDisplay,
  } = usePlanView();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading workout plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-2xl font-semibold mb-2">Plan not found</h2>
          <p className="text-muted-foreground mb-4">
            The workout plan you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/plans")}>Browse Plans</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/plans")}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Plans
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">
                  {React.createElement(
                    GOAL_ICONS[plan.goal as keyof typeof GOAL_ICONS] || Zap
                  )}{" "}
                  {plan.title}
                </h1>
                <Badge
                  variant="outline"
                  className={DIFFICULTY_COLORS[plan.difficulty]}
                >
                  {plan.difficulty}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                {plan.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Plan Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Plan Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold">{plan.durationWeeks}</p>
                <p className="text-sm text-muted-foreground">Weeks</p>
              </div>
              <div className="text-center">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold">{plan.sessionsPerWeek}</p>
                <p className="text-sm text-muted-foreground">Sessions/Week</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-2xl font-bold">{plan.phases?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Workouts</p>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-lg font-bold">
                  {plan.goal.replace("_", " ")}
                </p>
                <p className="text-sm text-muted-foreground">Goal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Workouts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Workouts ({plan.phases?.length || 0})
            </CardTitle>
            <CardDescription>
              Choose a workout to see the exercises and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Workout Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {plan.phases?.map((phase, index) => (
                <Button
                  key={phase.id}
                  variant={selectedPhase === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPhase(index)}
                >
                  {phase.name}
                </Button>
              ))}
            </div>

            {/* Selected Workout Details */}
            {plan.phases && plan.phases[selectedPhase] && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {plan.phases[selectedPhase].name}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    {plan.phases[selectedPhase].description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Timer className="h-4 w-4" />
                      {plan.phases[selectedPhase].estimatedDuration} minutes
                    </div>
                    <div className="flex items-center gap-1">
                      <Dumbbell className="h-4 w-4" />
                      {plan.phases[selectedPhase].exercises?.length || 0}{" "}
                      exercises
                    </div>
                  </div>
                </div>

                {/* Exercises List */}
                <div className="space-y-2">
                  {plan.phases[selectedPhase].exercises?.map(
                    (exercise, exerciseIndex) => {
                      const details = exerciseDetails[exercise.exerciseId];
                      return (
                        <div
                          key={`${exercise.exerciseId}-${exerciseIndex}`}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {details?.name || exercise.exerciseId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {details?.muscleGroups?.join(", ")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatExerciseDisplay(exercise, details)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {exercise.restTime}s rest
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons - Mobile Responsive */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          variant="spark"
          size="lg"
          onClick={handleSelectPlan}
          disabled={selectingPlan}
          className="flex-1 w-full sm:w-auto"
        >
          {selectingPlan ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : userProfile?.selectedPlanId === plan.id ? (
            <Play className="h-4 w-4 mr-2" />
          ) : (
            <Target className="h-4 w-4 mr-2" />
          )}
          {userProfile?.selectedPlanId === plan.id
            ? "Current Plan"
            : "Select This Plan"}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/plans")}
          className="w-full sm:w-auto"
        >
          Browse Other Plans
        </Button>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Exercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  duration?: number;
  weight?: number;
  restTime: number;
}

interface WorkoutPhase {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  estimatedDuration: number;
}

interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  goal: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  visibility: "public" | "private";
  tags: string[];
  phases: WorkoutPhase[];
  trainerId: string;
  createdAt: any;
  updatedAt: any;
}

interface ExerciseDetails {
  id: string;
  name: string;
  description: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  instructions?: string[];
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

export default function ViewPlanPage() {
  const { planId } = useParams<{ planId: string }>();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState<
    Record<string, ExerciseDetails>
  >({});
  const [loading, setLoading] = useState(true);
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const [selectingPlan, setSelectingPlan] = useState(false);
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (planId) {
      fetchPlanDetails(planId);
    }
  }, [planId]);

  const fetchPlanDetails = async (id: string) => {
    try {
      // Fetch plan details
      const planRef = doc(db, "workoutPrograms", id);
      const planSnap = await getDoc(planRef);

      if (!planSnap.exists()) {
        toast({
          title: "Plan not found",
          description: "The requested workout plan could not be found.",
          variant: "destructive",
        });
        navigate("/plans");
        return;
      }

      const planData = { id: planSnap.id, ...planSnap.data() } as WorkoutPlan;
      setPlan(planData);

      // Fetch exercise details for all exercises in the plan
      const exerciseIds = new Set<string>();
      planData.phases.forEach((phase) => {
        phase.exercises.forEach((exercise) => {
          exerciseIds.add(exercise.exerciseId);
        });
      });

      const exerciseDetailsMap: Record<string, ExerciseDetails> = {};

      // Fetch each exercise
      for (const exerciseId of exerciseIds) {
        const exerciseRef = doc(db, "exercises", exerciseId);
        const exerciseSnap = await getDoc(exerciseRef);
        if (exerciseSnap.exists()) {
          exerciseDetailsMap[exerciseId] = {
            id: exerciseSnap.id,
            ...exerciseSnap.data(),
          } as ExerciseDetails;
        }
      }

      setExerciseDetails(exerciseDetailsMap);
    } catch (error) {
      console.error("Error fetching plan details:", error);
      toast({
        title: "Error loading plan",
        description: "Failed to load plan details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async () => {
    if (!currentUser || !plan) {
      navigate("/login");
      return;
    }

    setSelectingPlan(true);

    try {
      await updateUserProfile({
        selectedPlanId: plan.id,
        planSelectedAt: new Date(),
      });

      toast({
        title: "Plan selected! 🎉",
        description: `${plan.title} is now your active workout plan.`,
      });

      // Navigate to dashboard after selection
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error selecting plan:", error);
      toast({
        title: "Error selecting plan",
        description: "Failed to save your plan selection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSelectingPlan(false);
    }
  };

  const formatExerciseDisplay = (
    exercise: Exercise,
    details: ExerciseDetails | undefined
  ) => {
    if (!details) return `${exercise.sets} sets`;

    let display = `${exercise.sets} sets`;
    if (exercise.reps) display += ` × ${exercise.reps} reps`;
    if (exercise.duration) display += ` × ${exercise.duration}s`;
    if (exercise.weight) display += ` @ ${exercise.weight}lbs`;

    return display;
  };

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
                  {GOAL_ICONS[plan.goal as keyof typeof GOAL_ICONS] || "💪"}{" "}
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

      {/* Action Buttons */}
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button
          variant="spark"
          size="lg"
          onClick={handleSelectPlan}
          disabled={selectingPlan}
          className="flex-1"
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

        <Button variant="outline" size="lg" onClick={() => navigate("/plans")}>
          Browse Other Plans
        </Button>
      </motion.div>
    </div>
  );
}

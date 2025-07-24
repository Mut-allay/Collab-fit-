import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
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
import { Loader2, Clock, Target, Calendar, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  phases: any[];
  trainerId: string;
  createdAt: any;
  updatedAt: any;
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

export default function PlanSelectionPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  useEffect(() => {
    filterPlans();
  }, [plans, selectedCategory, selectedDifficulty]);

  const filterPlans = () => {
    let filtered = [...plans];

    // Filter by category/goal
    if (selectedCategory !== "all") {
      filtered = filtered.filter((plan) => plan.goal === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(
        (plan) => plan.difficulty === selectedDifficulty
      );
    }

    setFilteredPlans(filtered);
  };

  const categories = [
    { id: "all", name: "All", icon: "🏋️" },
    { id: "strength", name: "Strength", icon: "💪" },
    { id: "general_fitness", name: "General Fitness", icon: "🏃" },
    { id: "weight_loss", name: "Weight Loss", icon: "🔥" },
    { id: "muscle_gain", name: "Muscle Gain", icon: "💪" },
    { id: "endurance", name: "Endurance", icon: "🏃" },
  ];

  const difficulties = [
    { id: "all", name: "All Levels" },
    { id: "beginner", name: "Beginner" },
    { id: "intermediate", name: "Intermediate" },
    { id: "advanced", name: "Advanced" },
  ];

  const fetchWorkoutPlans = async () => {
    try {
      const plansRef = collection(db, "workoutPrograms");
      const publicPlansQuery = query(
        plansRef,
        where("visibility", "==", "public")
      );
      const snapshot = await getDocs(publicPlansQuery);

      const plansData: WorkoutPlan[] = [];
      snapshot.forEach((doc) => {
        plansData.push({ id: doc.id, ...doc.data() } as WorkoutPlan);
      });

      // Sort by difficulty and popularity
      plansData.sort((a, b) => {
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      });

      setPlans(plansData);
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      toast({
        title: "Error loading plans",
        description: "Failed to load workout plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setSelectedPlan(planId);

    try {
      await updateUserProfile({
        selectedPlanId: planId,
        planSelectedAt: new Date(),
      });

      toast({
        title: "Plan selected! 🎉",
        description:
          "Your workout plan has been saved. Ready to start your fitness journey!",
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
      setSelectedPlan(null);
    }
  };

  const handleViewDetails = (planId: string) => {
    navigate(`/plans/${planId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading workout plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <motion.h1
          className="text-2xl sm:text-4xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Choose Your Workout Plan 🏋️‍♂️
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Select a workout plan that matches your fitness goals and experience
          level
        </motion.p>
      </div>

      {/* Current Selection */}
      {userProfile?.selectedPlanId && (
        <motion.div
          className="mb-6 p-4 bg-spark-50 border border-spark-200 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-spark-800 font-medium">
            ✅ You currently have a plan selected. Choose a new one to switch.
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        className="mb-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Category Filters */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Difficulty Filters */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Difficulty</h3>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty.id}
                variant={
                  selectedDifficulty === difficulty.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className="text-xs sm:text-sm"
              >
                {difficulty.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredPlans.length} of {plans.length} plans
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredPlans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      {GOAL_ICONS[plan.goal as keyof typeof GOAL_ICONS] || "💪"}
                      {plan.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {plan.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={DIFFICULTY_COLORS[plan.difficulty]}
                  >
                    {plan.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Plan Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.durationWeeks} weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.sessionsPerWeek}x/week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.goal.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{plan.phases?.length || 0} workouts</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {plan.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(plan.id)}
                    className="flex-1"
                  >
                    View Details
                  </Button>
                  <Button
                    variant={
                      userProfile?.selectedPlanId === plan.id
                        ? "default"
                        : "spark"
                    }
                    size="sm"
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={selectedPlan === plan.id}
                    className="flex-1"
                  >
                    {selectedPlan === plan.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : userProfile?.selectedPlanId === plan.id ? (
                      "Current Plan"
                    ) : (
                      "Select Plan"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {plans.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🏋️‍♂️</div>
          <h2 className="text-2xl font-semibold mb-2">
            No workout plans available
          </h2>
          <p className="text-muted-foreground">
            Check back later for new workout plans!
          </p>
        </motion.div>
      )}

      {/* Back to Dashboard */}
      <div className="mt-8 text-center">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

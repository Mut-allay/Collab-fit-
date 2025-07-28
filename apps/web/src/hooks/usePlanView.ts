import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WorkoutPlan, Exercise } from "@/types/workout";

export function usePlanView() {
  const { planId } = useParams<{ planId: string }>();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState<
    Record<string, Exercise>
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

      const exerciseDetailsMap: Record<string, Exercise> = {};

      // Fetch each exercise
      for (const exerciseId of exerciseIds) {
        const exerciseRef = doc(db, "exercises", exerciseId);
        const exerciseSnap = await getDoc(exerciseRef);
        if (exerciseSnap.exists()) {
          exerciseDetailsMap[exerciseId] = {
            id: exerciseSnap.id,
            ...exerciseSnap.data(),
          } as Exercise;
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
        title: "Plan selected!",
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
    exercise: any,
    details: Exercise | undefined
  ) => {
    if (!details) return `${exercise.sets} sets`;

    let display = `${exercise.sets} sets`;
    if (exercise.reps) display += ` × ${exercise.reps} reps`;
    if (exercise.duration) display += ` × ${exercise.duration}s`;
    if (exercise.weight) display += ` @ ${exercise.weight}lbs`;

    return display;
  };

  return {
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
  };
}

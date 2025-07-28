import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getPublicWorkoutPrograms } from "@/lib/firestoreService";
import type { WorkoutProgram } from "@fitspark/shared";

export function usePlanSelection() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [allPlans, setAllPlans] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // State for the currently processing selection
  const [selectingPlanId, setSelectingPlanId] = useState<string | null>(null);

  // Fetch plans on mount
  useEffect(() => {
    async function fetchPlans() {
      try {
        const plansData = await getPublicWorkoutPrograms();
        setAllPlans(plansData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load workout plans.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, [toast]);

  // Filter plans whenever the source data or filters change
  const filteredPlans = useMemo(() => {
    return allPlans
      .filter(
        (plan) => selectedCategory === "all" || plan.goal === selectedCategory
      )
      .filter(
        (plan) =>
          selectedDifficulty === "all" || plan.difficulty === selectedDifficulty
      );
  }, [allPlans, selectedCategory, selectedDifficulty]);

  // Handle the plan selection logic
  const handleSelectPlan = useCallback(
    async (planId: string) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setSelectingPlanId(planId);
      try {
        await updateUserProfile({
          selectedPlanId: planId,
          planSelectedAt: new Date(),
        });
        toast({
          title: "Plan Selected!",
          description: "Your new workout plan has been saved.",
        });
        setTimeout(() => navigate("/dashboard"), 1500);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to save your selection.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setSelectingPlanId(null);
      }
    },
    [currentUser, navigate, toast, updateUserProfile]
  );

  return {
    loading,
    error,
    allPlans,
    filteredPlans,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    selectingPlanId,
    handleSelectPlan,
    currentPlanId: userProfile?.selectedPlanId,
  };
}

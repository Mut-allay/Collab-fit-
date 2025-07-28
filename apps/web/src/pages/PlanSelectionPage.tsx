import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePlanSelection } from "@/hooks/usePlanSelection";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { PlanFilters } from "@/components/plans/PlanFilters";
import { PlanGrid } from "@/components/plans/PlanGrid";

export default function PlanSelectionPage() {
  const navigate = useNavigate();
  const {
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
    currentPlanId,
  } = usePlanSelection();

  if (loading) {
    return <LoadingSpinner message="Loading workout plans..." />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Choose Your Workout Plan 🏋️‍♂️</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select a plan that matches your fitness goals and experience level.
        </p>
      </motion.div>

      {currentPlanId && (
        <motion.div
          className="mb-6 p-4 bg-spark-50 border border-spark-200 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-spark-800 font-medium">
            ✅ You currently have a plan selected. Choose a new one to switch.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <PlanFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
        />
        <div className="text-sm text-muted-foreground mb-6">
          Showing {filteredPlans.length} of {allPlans.length} plans
        </div>
      </motion.div>

      <PlanGrid
        plans={filteredPlans}
        currentPlanId={currentPlanId}
        selectingPlanId={selectingPlanId}
        onSelectPlan={handleSelectPlan}
      />

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

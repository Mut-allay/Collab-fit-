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

      <div className="relative z-10 container mx-auto p-6 max-w-6xl">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 font-pacifico text-white">Choose Your Workout Plan 🏋️‍♂️</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-manrope">
          Select a plan that matches your fitness goals and experience level.
        </p>
      </motion.div>

      {currentPlanId && (
        <motion.div
          className="mb-6 p-4 bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
            <p className="text-cyan-300 font-medium font-manrope">
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
        <div className="text-sm text-gray-300 mb-6 font-manrope">
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
    </div>
  );
}

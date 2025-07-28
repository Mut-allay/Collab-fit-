import { motion } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TodaysWorkout } from "@/components/dashboard/TodaysWorkout";
import { NoPlanPrompt } from "@/components/dashboard/NoPlanPrompt";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ComingSoon } from "@/components/dashboard/ComingSoon";

export default function DashboardPage() {
  const { selectedPlan, todaysWorkout, weeklyProgress, loading, error } = useDashboardData();

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardHeader />
        </motion.div>

        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {selectedPlan && todaysWorkout ? (
                <TodaysWorkout plan={selectedPlan} workout={todaysWorkout} />
              ) : (
                <NoPlanPrompt />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <WeeklyProgress progress={weeklyProgress} />
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <QuickActions />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ComingSoon />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

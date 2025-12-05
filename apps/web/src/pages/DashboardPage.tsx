import { motion } from "framer-motion";
import { useDashboardData } from "@/hooks/useDashboardData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TodaysWorkout } from "@/components/dashboard/TodaysWorkout";
import { NoPlanPrompt } from "@/components/dashboard/NoPlanPrompt";
import { WeeklyProgress } from "@/components/dashboard/WeeklyProgress";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
import { DailyActivityWidget } from "@/components/dashboard/DailyActivityWidget";
import { TeamQuickView } from "@/components/dashboard/TeamQuickView";
import { LeaderboardPreview } from "@/components/dashboard/LeaderboardPreview";

export default function DashboardPage() {
  const { selectedPlan, todaysWorkout, weeklyProgress, loading, error } = useDashboardData();

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
              <DailyActivityWidget />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <TeamQuickView />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <LeaderboardPreview />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <ComingSoon />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

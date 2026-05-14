import { motion } from "framer-motion";
import { Trophy, ArrowRight, Sparkles } from "lucide-react";
import type { OnboardingMetrics } from "@/overhaul/src/types";

interface OnboardingSuccessProps {
  metrics?: OnboardingMetrics;
  onComplete?: () => void;
}

export default function OnboardingSuccess({ metrics, onComplete }: OnboardingSuccessProps) {
  const handleStartJourney = () => {
    onComplete?.();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-10"
      >
        {/* Celebration Animation */}
        <div className="relative mx-auto w-32 h-32">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Trophy className="w-32 h-32 text-primary-fixed" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sparkles className="w-40 h-40 text-primary/30" />
          </motion.div>
        </div>

        <div className="space-y-4">
          <h1 className="font-headline font-black text-5xl md:text-6xl tracking-tighter text-on-surface">
            You're all set, <span className="text-primary-fixed">{metrics?.fullName?.split(" ")[0] || "Runner"}</span>!
          </h1>
          <p className="text-on-surface-variant text-xl">
            Your personalized running journey begins now.
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-surface-container-low rounded-3xl p-8 text-left space-y-4">
          <div className="text-sm font-label uppercase tracking-widest text-on-surface-variant">
            Your Profile
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Goal</div>
            <div className="text-right font-medium capitalize">
              {metrics?.goal?.replace("-", " ") || "General Fitness"}
            </div>
            <div>Weekly Target</div>
            <div className="text-right font-medium">{metrics?.weeklyGoal || 20} km</div>
            <div>Level</div>
            <div className="text-right font-medium capitalize">{metrics?.fitnessLevel}</div>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={handleStartJourney}
            className="w-full py-6 rounded-full bg-kinetic-gradient text-on-primary-fixed font-headline font-black uppercase tracking-[0.5em] text-lg flex items-center justify-center gap-3 group"
          >
            Start Training
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-on-surface-variant text-xs mt-6">
            Pro tip: Turn on notifications for the best experience
          </p>
        </div>
      </motion.div>
    </div>
  );
}

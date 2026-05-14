import { motion } from "framer-motion";
import type { FitnessLevel, OnboardingProps } from "@/overhaul/src/types";

const activityLevels: {
  id: FitnessLevel;
  label: string;
  desc: string;
}[] = [
  { id: "beginner", label: "Beginner", desc: "New to running or getting back" },
  { id: "intermediate", label: "Intermediate", desc: "Regular runner (3-5x/week)" },
  { id: "advanced", label: "Advanced", desc: "Experienced, training for races" },
];

export default function OnboardingStep3({
  metrics,
  onUpdateMetrics,
  onBack,
  onContinue,
  isLoading,
}: OnboardingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Progress + Header */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <span className="font-headline font-black text-4xl text-surface-container-highest tracking-tighter opacity-50">
            03
          </span>
          <span className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant">
            Step 3 of 4
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary-container w-[75%] rounded-full" />
        </div>
      </div>

      <div>
        <h2 className="font-headline font-extrabold text-4xl md:text-5xl leading-none tracking-tight text-on-surface mb-4">
          What's your <span className="text-primary-fixed italic">current level?</span>
        </h2>
      </div>

      <form onSubmit={onContinue} className="space-y-10">
        {/* Activity Level */}
        <div>
          <h3 className="font-headline font-bold text-xl mb-6">Experience Level</h3>
          <div className="space-y-3">
            {activityLevels.map((level) => (
              <label
                key={level.id}
                className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <input
                  type="radio"
                  name="level"
                  checked={metrics.fitnessLevel === level.id}
                  onChange={() => onUpdateMetrics({ fitnessLevel: level.id })}
                  className="w-5 h-5 accent-primary"
                />
                <div>
                  <div className="font-semibold">{level.label}</div>
                  <div className="text-sm text-on-surface-variant">{level.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Weekly Target */}
        <div>
          <label className="block font-label text-sm mb-3">Weekly Running Goal</label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={metrics.weeklyGoal || 20}
            onChange={(e) => onUpdateMetrics({ weeklyGoal: parseInt(e.target.value, 10) })}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-sm mt-1">
            <span>5 km</span>
            <span className="font-semibold text-primary">{metrics.weeklyGoal || 20} km</span>
            <span>100 km</span>
          </div>
        </div>

        <div className="flex gap-4 pt-8">
          <button
            onClick={onBack}
            type="button"
            className="flex-1 py-5 rounded-full bg-surface-container-highest text-primary font-headline font-bold uppercase tracking-widest"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] py-5 rounded-full bg-kinetic-gradient text-on-primary-fixed font-headline font-black uppercase tracking-widest disabled:opacity-70"
          >
            {isLoading ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

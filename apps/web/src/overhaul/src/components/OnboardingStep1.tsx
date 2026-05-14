import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import type { Gender, OnboardingProps } from "@/overhaul/src/types";

export default function OnboardingStep1({
  metrics,
  onUpdateMetrics,
  onContinue,
  isLoading,
}: OnboardingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div>
        <div className="flex justify-between items-end mb-4">
          <span className="font-headline font-black text-4xl text-surface-container-highest tracking-tighter opacity-50">
            01
          </span>
          <span className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant">
            Step 1 of 4
          </span>
        </div>
        <Progress value={25} className="h-1.5" />
      </div>

      <div>
        <h2 className="font-headline font-extrabold text-4xl md:text-5xl leading-none tracking-tight text-on-surface mb-4">
          Complete your profile
        </h2>
        <p className="text-on-surface-variant text-lg">
          Just a few more details before you begin.
        </p>
      </div>

      <form onSubmit={onContinue} className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label text-sm mb-2 text-on-surface-variant">
                Gender
              </label>
              <select
                value={metrics.gender || ""}
                onChange={(e) => onUpdateMetrics({ gender: e.target.value as Gender })}
                className="w-full bg-surface-container-low p-5 rounded-2xl text-lg"
                disabled={isLoading}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="block font-label text-sm mb-2 text-on-surface-variant">
                Date of Birth
              </label>
              <input
                type="date"
                value={metrics.dateOfBirth || ""}
                onChange={(e) => onUpdateMetrics({ dateOfBirth: e.target.value })}
                className="w-full bg-surface-container-low p-5 rounded-2xl text-lg"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 rounded-full bg-kinetic-gradient text-on-primary-fixed font-headline font-black uppercase tracking-widest disabled:opacity-70 transition-opacity"
        >
          {isLoading ? "Saving..." : "Continue"}
        </button>
      </form>
    </motion.div>
  );
}

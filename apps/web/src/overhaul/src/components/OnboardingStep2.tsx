import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { OnboardingProps } from "@/overhaul/src/types";

export default function OnboardingStep2({
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
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      {/* Progress Indicator */}
      <div>
        <div className="flex justify-between items-end mb-4">
          <span className="font-headline font-black text-4xl text-surface-container-highest tracking-tighter opacity-50">
            02
          </span>
          <span className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant">
            Step 2 of 4
          </span>
        </div>
        <Progress value={50} className="h-1.5 bg-surface-container-highest" />
      </div>

      {/* Section Heading */}
      <div>
        <h2 className="font-headline font-extrabold text-4xl md:text-5xl leading-none tracking-tight text-on-surface mb-4">
          Tell us about your <span className="text-primary-fixed italic">fitness journey.</span>
        </h2>
        <p className="text-on-surface-variant text-lg max-w-md">
          Precision starts with the right data. Help us tailor your kinetic profile.
        </p>
      </div>

      {/* Onboarding Form */}
      <form onSubmit={onContinue} className="space-y-12">
        {/* Bio-Metrics Bento Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-6 rounded-xl border-none">
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
              Height (cm)
            </label>
            <input
              type="number"
              placeholder="185"
              value={metrics.height}
              onChange={(e) => onUpdateMetrics({ height: e.target.value })}
              className="w-full bg-transparent border-none text-4xl font-headline font-bold text-on-surface focus:ring-0 p-0 placeholder:text-surface-container-highest"
            />
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl border-none">
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
              Weight (kg)
            </label>
            <input
              type="number"
              placeholder="82"
              value={metrics.weight}
              onChange={(e) => onUpdateMetrics({ weight: e.target.value })}
              className="w-full bg-transparent border-none text-4xl font-headline font-bold text-on-surface focus:ring-0 p-0 placeholder:text-surface-container-highest"
            />
          </div>
        </div>

        {/* Join Code Section (Added from images) */}
        <div>
          <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Join a Team or Corporation
          </h3>
          <div className="bg-surface-container-low p-8 rounded-xl space-y-4">
            <p className="text-on-surface-variant text-sm max-w-sm">
              Have a code from your team or company? Enter it here to sync with your colleagues and start competing.
            </p>
            <div>
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
                Enter Join Code
              </label>
              <input
                type="text"
                placeholder="e.g., TECHCORP-2024"
                value={metrics.joinCode || ""}
                onChange={(e) => onUpdateMetrics({ joinCode: e.target.value })}
                className="w-full bg-surface-container p-4 rounded-xl border border-outline-variant/10 focus:ring-1 focus:ring-primary-dim outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Primary Navigation Actions */}
        <div className="flex items-center gap-4 pt-8">
          <button
            onClick={onBack}
            className="flex-1 py-5 rounded-full bg-surface-container-highest text-primary font-headline font-bold uppercase tracking-widest text-sm hover:bg-surface-variant active:scale-95 transition-all"
            type="button"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] py-5 rounded-full bg-kinetic-gradient text-on-primary-fixed font-headline font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_40px_rgba(202,253,0,0.2)] active:scale-95 transition-all disabled:opacity-70"
          >
            {isLoading ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>

      {/* Decorative Floating Quote */}
      <div className="mt-20 border-l-2 border-primary-container/20 pl-6 py-2">
        <p className="text-on-surface-variant italic font-body text-sm">
          "The only bad workout is the one that didn't happen."
        </p>
        <p className="text-primary-dim font-headline font-bold text-xs uppercase tracking-widest mt-2">
          Community Pulse
        </p>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import { 
  Dumbbell, 
  HeartPulse, 
  Droplets, 
  Trophy, 
  RefreshCw 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { OnboardingProps, FitnessGoal } from "@/src/types";

export default function OnboardingStep2({
  metrics,
  onUpdateMetrics,
  onBack,
  onContinue,
  onConnectGoogleFit
}: OnboardingProps) {
  const goalOptions = [
    {
      id: "lose-weight",
      label: "Lose Weight",
      desc: "Burn fat & increase metabolic rate",
      icon: <Droplets className="w-8 h-8" />,
    },
    {
      id: "build-muscle",
      label: "Build Muscle",
      desc: "Hypertrophy & strength training",
      icon: <Dumbbell className="w-8 h-8" />,
    },
    {
      id: "general-fitness",
      label: "General Fitness",
      desc: "Stay active & improve endurance",
      icon: <HeartPulse className="w-8 h-8" />,
    },
    {
      id: "social-competition",
      label: "Social Competition",
      desc: "Climb leaderboards with friends",
      icon: <Trophy className="w-8 h-8" />,
    },
  ];

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
        <Progress value={40} className="h-1.5 bg-surface-container-highest" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container-low p-6 rounded-xl border-none">
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">
              Age
            </label>
            <input
              type="number"
              placeholder="24"
              value={metrics.age}
              onChange={(e) => onUpdateMetrics({ age: e.target.value })}
              className="w-full bg-transparent border-none text-4xl font-headline font-bold text-primary focus:ring-0 p-0 placeholder:text-surface-container-highest"
            />
          </div>
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

        {/* Goal Selection Grid */}
        <div>
          <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            Primary Objective
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goalOptions.map((option) => (
              <label key={option.id} className="relative group cursor-pointer">
                <input
                  type="radio"
                  name="goal"
                  className="peer hidden"
                  checked={metrics.goal === option.id}
                  onChange={() => onUpdateMetrics({ goal: option.id as FitnessGoal })}
                />
                <div className="h-full p-6 rounded-xl bg-surface-container transition-all border border-transparent peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary-fixed/20 hover:bg-surface-container-high">
                  <div className="mb-4 block text-3xl">
                    {option.icon}
                  </div>
                  <div className="font-headline font-bold text-lg leading-tight">
                    {option.label}
                  </div>
                  <div className="text-sm opacity-70 mt-1 font-label">
                    {option.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Data Integration Section */}
        <div className="p-8 rounded-xl bg-surface-container-high relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-headline font-bold text-xl mb-1">Sync Ecosystem</h4>
              <p className="text-on-surface-variant text-sm">
                Automatically import your existing health logs.
              </p>
            </div>
            <button
              onClick={onConnectGoogleFit}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-surface-container-lowest text-on-surface rounded-full border border-outline-variant/20 hover:bg-surface-bright transition-colors group/btn"
              type="button"
            >
              <RefreshCw className="w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-500" />
              <span className="font-label font-bold text-sm uppercase tracking-widest">
                Connect with Google Fit
              </span>
            </button>
          </div>
          {/* Abstract Decorative Background */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
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
            className="flex-[2] py-5 rounded-full bg-kinetic-gradient text-on-primary-fixed font-headline font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_40px_rgba(202,253,0,0.2)] active:scale-95 transition-all"
            type="submit"
          >
            Continue
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

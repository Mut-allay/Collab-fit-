4. OnboardingStep4.tsx
   tsximport { motion } from "framer-motion";
   import { RefreshCw, Bell, Shield } from "lucide-react";
   import { OnboardingProps } from "@/overhaul/src/types";

export default function OnboardingStep4({
metrics,
onUpdateMetrics,
onBack,
onComplete,
onConnectGoogleFit,
}: OnboardingProps) {
return (
<motion.div
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
className="space-y-12" >
{/_ Progress _/}
<div className="mb-12">
<div className="flex justify-between items-end mb-4">
<span className="font-headline font-black text-4xl text-surface-container-highest tracking-tighter opacity-50">
04
</span>
<span className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant">
Step 4 of 4
</span>
</div>
<div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary-container w-full rounded-full" />
</div>
</div>

      <div>
        <h2 className="font-headline font-extrabold text-4xl md:text-5xl leading-none tracking-tight text-on-surface mb-4">
          Almost there. Let's connect.
        </h2>
        <p className="text-on-surface-variant text-lg max-w-md">
          Final touches to personalize your experience.
        </p>
      </div>

      <form onSubmit={onComplete} className="space-y-12">
        {/* Data Sync */}
        <div className="p-8 rounded-xl bg-surface-container-high relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-headline font-bold text-xl mb-1">Sync Your Data</h4>
              <p className="text-on-surface-variant text-sm">
                Import your runs, steps, and heart rate automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={onConnectGoogleFit}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-surface-container-lowest text-on-surface rounded-full border border-outline-variant/20 hover:bg-surface-bright transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-label font-bold text-sm uppercase tracking-widest">
                Connect Google Fit
              </span>
            </button>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
        </div>

        {/* Notifications */}
        <div>
          <h3 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full" />
            Notification Preferences
          </h3>
          <div className="space-y-4">
            {[
              { label: "Daily motivation & streaks", key: "dailyMotivation" },
              { label: "Weekly progress summary", key: "weeklySummary" },
              { label: "Run reminders & challenges", key: "runReminders" },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  checked={metrics[item.key as keyof typeof metrics] ?? true}
                  onChange={(e) =>
                    onUpdateMetrics({ [item.key]: e.target.checked })
                  }
                  className="w-6 h-6 accent-primary"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex gap-3 text-on-surface-variant text-sm bg-surface-container-low p-5 rounded-2xl">
          <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>Your data is encrypted and never shared without your consent.</p>
        </div>

        {/* Final Navigation */}
        <div className="flex items-center gap-4 pt-8">
          <button
            onClick={onBack}
            type="button"
            className="flex-1 py-5 rounded-full bg-surface-container-highest text-primary font-headline font-bold uppercase tracking-widest text-sm hover:bg-surface-variant active:scale-95 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-[2] py-5 rounded-full bg-kinetic-gradient text-on-primary-fixed font-headline font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_40px_rgba(202,253,0,0.2)] active:scale-95 transition-all"
          >
            Start My Journey
          </button>
        </div>
      </form>
    </motion.div>

);
}

5. Main Orchestrator: OnboardingFlow.tsx
   tsximport { useEffect } from "react";
   import { useOnboardingStore } from "@/store/onboardingStore";
   import OnboardingStep1 from "./OnboardingStep1";
   import OnboardingStep2 from "./OnboardingStep2";
   import OnboardingStep3 from "./OnboardingStep3";
   import OnboardingStep4 from "./OnboardingStep4";

export default function OnboardingFlow() {
const { step, metrics, updateMetrics, setStep, reset } = useOnboardingStore();

// Optional: Auto-save to localStorage
useEffect(() => {
localStorage.setItem("onboardingMetrics", JSON.stringify(metrics));
}, [metrics]);

const handleUpdateMetrics = (data: any) => {
updateMetrics(data);
};

const handleContinue = (e?: React.FormEvent) => {
e?.preventDefault();
if (step < 4) {
setStep(step + 1);
}
};

const handleBack = () => {
if (step > 1) setStep(step - 1);
};

const handleComplete = async (e: React.FormEvent) => {
e.preventDefault();
// TODO: Send data to backend
console.log("Onboarding Completed:", metrics);

    // Simulate success
    setTimeout(() => {
      alert("Welcome to FIT&LIT! 🎉"); // Replace with real success screen / redirect
      reset();
      // router.push('/dashboard'); // or whatever your next route is
    }, 300);

};

const handleConnectGoogleFit = () => {
// Implement OAuth flow here
console.log("Connecting to Google Fit...");
// You can update metrics with sync status if needed
};

const commonProps = {
metrics,
onUpdateMetrics: handleUpdateMetrics,
onBack: handleBack,
onContinue: handleContinue,
onConnectGoogleFit: handleConnectGoogleFit,
onComplete: handleComplete,
};

return (
<div className="min-h-screen bg-background text-on-surface pb-12">
<div className="max-w-2xl mx-auto px-6 pt-28">
{step === 1 && <OnboardingStep1 {...commonProps} />}
{step === 2 && <OnboardingStep2 {...commonProps} />}
{step === 3 && <OnboardingStep3 {...commonProps} />}
{step === 4 && <OnboardingStep4 {...commonProps} />}
</div>
</div>
);
}

Final Store Reminder (onboardingStore.ts)
Make sure this exists:
TypeScriptimport { create } from 'zustand';

export type OnboardingMetrics = {
fullName?: string;
gender?: string;
dateOfBirth?: string;
age?: string | number;
height?: string | number;
weight?: string | number;
joinCode?: string;
goal?: string;
fitnessLevel?: string;
weeklyGoal?: number;
dailyMotivation?: boolean;
weeklySummary?: boolean;
runReminders?: boolean;
};

type OnboardingStore = {
step: number;
metrics: OnboardingMetrics;
setStep: (step: number) => void;
updateMetrics: (data: Partial<OnboardingMetrics>) => void;
reset: () => void;
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
step: 1,
metrics: {},
setStep: (step) => set({ step }),
updateMetrics: (data) =>
set((state) => ({ metrics: { ...state.metrics, ...data } })),
reset: () => set({ step: 1, metrics: {} }),
}));

Next Steps Recommendation:

Put all step files in a folder: components/onboarding/
Import and use <OnboardingFlow /> in your routing (e.g., /onboarding)
Later replace the alert() with a proper success animation + redirect to dashboard.

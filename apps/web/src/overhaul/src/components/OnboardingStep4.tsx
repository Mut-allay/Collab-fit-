import { motion } from "framer-motion";
import { RefreshCw, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { initiateGoogleFitConnect } from "@/lib/googleFitService";
import type { OnboardingMetrics, OnboardingProps } from "@/overhaul/src/types";

type NotificationPrefKey = Pick<
  OnboardingMetrics,
  "dailyMotivation" | "weeklySummary" | "runReminders"
>;

const NOTIFICATION_ITEMS: {
  label: string;
  key: keyof NotificationPrefKey;
}[] = [
  { label: "Daily motivation & streaks", key: "dailyMotivation" },
  { label: "Weekly progress summary", key: "weeklySummary" },
  { label: "Run reminders & challenges", key: "runReminders" },
];

export default function OnboardingStep4({
  metrics,
  onUpdateMetrics,
  onBack,
  onComplete,
  isLoading,
}: OnboardingProps) {
  const { currentUser } = useAuth();
  const [isConnectingGoogleFit, setIsConnectingGoogleFit] = useState(false);

  const handleConnectGoogleFit = () => {
    if (!currentUser?.uid) {
      console.error("User not authenticated");
      return;
    }
    setIsConnectingGoogleFit(true);
    try {
      initiateGoogleFitConnect(currentUser.uid);
    } catch (error) {
      console.error("Failed to initiate Google Fit connection:", error);
      setIsConnectingGoogleFit(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-12"
    >
      {/* Progress */}
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
              onClick={handleConnectGoogleFit}
              disabled={isConnectingGoogleFit || !currentUser}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-surface-container-lowest text-on-surface rounded-full border border-outline-variant/20 hover:bg-surface-bright transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${isConnectingGoogleFit ? "animate-spin" : "group-hover/btn:rotate-180 transition-transform duration-500"}`} />
              <span className="font-label font-bold text-sm uppercase tracking-widest">
                {isConnectingGoogleFit ? "Connecting..." : "Connect Google Fit"}
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
            {NOTIFICATION_ITEMS.map((item) => {
              const raw = metrics[item.key];
              const checked =
                typeof raw === "boolean" ? raw : true;
              return (
              <label
                key={item.key}
                className="flex items-center justify-between p-5 rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span>{item.label}</span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    onUpdateMetrics({ [item.key]: e.target.checked })
                  }
                  className="w-6 h-6 accent-primary"
                />
              </label>
            )})}
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
            disabled={isLoading}
            className="flex-[2] py-5 rounded-full bg-kinetic-gradient text-on-primary-fixed font-headline font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_40px_rgba(202,253,0,0.2)] active:scale-95 transition-all disabled:opacity-70"
          >
            {isLoading ? "Starting..." : "Start My Journey"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

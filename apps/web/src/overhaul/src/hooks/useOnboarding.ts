import { useState, type FormEvent } from "react";
import type { OnboardingMetrics, ScreenState } from "@/overhaul/src/types";

export function useOnboarding() {
  const [screen, setScreen] = useState<ScreenState>("landing");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<OnboardingMetrics>({
    fullName: "",
    gender: undefined,
    dateOfBirth: "",
    age: "24",
    height: "185",
    weight: "82",
    goal: "build-muscle",
    joinCode: "",
    fitnessLevel: "intermediate",
    weeklyGoal: 20,
    preferredWorkoutTime: "morning",
    terrainPreference: "road",
    dailyReminder: true,
    dailyMotivation: true,
    weeklySummary: true,
    runReminders: true,
  });

  const updateMetrics = (updates: Partial<OnboardingMetrics>) => {
    setMetrics((prev: OnboardingMetrics) => ({ ...prev, ...updates }));
  };

  const handleBack = () => {
    if (screen === "onboarding") {
      if (step > 1) {
        // From step 3 (formerly 4) go back to step 2
        // From step 2 go back to step 1
        // From step 1 go back to signup
        if (step === 3) {
          setStep(2);
        } else if (step === 2) {
          setStep(1);
        } else if (step === 1) {
          setScreen("signup");
        }
      } else {
        setScreen("signup");
      }
    } else {
      setScreen("landing");
    }
  };

  const handleContinue = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    // Simulate network save
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);

    if (screen === "onboarding") {
      if (step === 1) {
        setStep(2);
        return;
      }
      if (step === 2) {
        // Skip step 3, go directly to step 3 (formerly step 4)
        setStep(3);
        return;
      }
      if (step === 3) {
        // Step 3 → success screen (step 4)
        setStep(4);
        return;
      }
      return;
    }

    setScreen("dashboard");
  };

  const handleComplete = async (e?: FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    console.log("Onboarding complete:", metrics);
    // Success screen already shown (step 4 shows success, go to step 5)
    setStep(5);
  };

  /** UI only: Firebase session + AuthContext `currentUser` are set inside Login/Signup via `useAuth`. */
  const handleAuthSuccess = () => {
    setScreen("dashboard");
  };

  const connectGoogleFit = () => {
    console.log("Connecting to Google Fit...");
  };

  return {
    screen,
    setScreen,
    step,
    isLoading,
    metrics,
    updateMetrics,
    handleBack,
    handleContinue,
    handleComplete,
    handleAuthSuccess,
    connectGoogleFit,
  };
}

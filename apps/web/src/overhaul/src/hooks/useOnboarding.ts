import { useState, type FormEvent } from "react";
import { UserMetrics, ScreenState } from "@/overhaul/src/types";

export function useOnboarding() {
  const [screen, setScreen] = useState<ScreenState>("landing");
  const [metrics, setMetrics] = useState<UserMetrics>({
    age: "24",
    height: "185",
    weight: "82",
    goal: "build-muscle",
    joinCode: "",
  });

  const updateMetrics = (updates: Partial<UserMetrics>) => {
    setMetrics((prev) => ({ ...prev, ...updates }));
  };

  const handleBack = () => {
    if (screen === "onboarding") {
      setScreen("signup");
    } else {
      setScreen("landing");
    }
  };

  const handleContinue = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", metrics);
    setScreen("dashboard");
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
    metrics,
    updateMetrics,
    handleBack,
    handleContinue,
    handleAuthSuccess,
    connectGoogleFit,
  };
}

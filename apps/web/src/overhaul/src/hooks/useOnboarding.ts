import { useState, type FormEvent } from "react";
import { UserMetrics, ScreenState } from "@/src/types";

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

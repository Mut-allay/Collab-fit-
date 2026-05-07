import { useState } from "react";
import { useOnboardingStore } from "@/store/onboardingStore";
import OnboardingStep1 from "./OnboardingStep1";
import OnboardingStep2 from "./OnboardingStep2";
import OnboardingStep3 from "./OnboardingStep3";
import OnboardingStep4 from "./OnboardingStep4";
import OnboardingSuccess from "./OnboardingSuccess";
import type { OnboardingMetrics } from "@/overhaul/src/types";

export default function OnboardingFlow() {
  const { step, metrics, updateMetrics, setStep } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateMetrics = (data: Partial<OnboardingMetrics>) =>
    updateMetrics(data);

  const handleContinue = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    // Simulate network save
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    if (step < 4) setStep(step + 1);
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setStep(5); // Success screen
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const commonProps = {
    metrics,
    onUpdateMetrics: handleUpdateMetrics,
    onBack: handleBack,
    onContinue: handleContinue,
    onComplete: handleComplete,
    onConnectGoogleFit: () => console.log("Connecting Google Fit..."),
    isLoading,
  };

  return (
    <div className="min-h-screen bg-background pb-12 overflow-x-hidden">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-20 md:pt-28">
        {step === 1 && <OnboardingStep1 {...commonProps} />}
        {step === 2 && <OnboardingStep2 {...commonProps} />}
        {step === 3 && <OnboardingStep3 {...commonProps} />}
        {step === 4 && <OnboardingStep4 {...commonProps} />}
        {step === 5 && <OnboardingSuccess />}
      </div>
    </div>
  );
}

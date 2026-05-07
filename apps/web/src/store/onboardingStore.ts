import { create } from "zustand";
import { OnboardingMetrics } from "@/overhaul/src/types";

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

import React from "react";

export type ScreenState =
  | "landing"
  | "login"
  | "signup"
  | "onboarding"
  | "dashboard"
  | "workouts"
  | "clubs"
  | "leaderboard"
  | "map"
  | "corporate"
  | "challenges"
  | "social"
  | "active-workout"
  | "profile";

export type FitnessGoal = "lose-weight" | "build-muscle" | "general-fitness" | "social-competition";

export interface UserMetrics {
  age: string;
  height: string;
  weight: string;
  goal: FitnessGoal;
  joinCode?: string;
}

export interface OnboardingProps {
  metrics: UserMetrics;
  onUpdateMetrics: (updates: Partial<UserMetrics>) => void;
  onBack: () => void;
  onContinue: (e: React.FormEvent) => void;
  onConnectGoogleFit: () => void;
  key?: string;
}

export interface AuthProps {
  onNavigate: (screen: ScreenState) => void;
  onSuccess: () => void;
  key?: string;
}

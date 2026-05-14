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
export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type Gender = "male" | "female" | "non-binary" | "prefer-not";

export type OnboardingMetrics = {
  // Step 1
  fullName?: string;
  gender?: Gender;
  dateOfBirth?: string;

  // Step 2
  age?: string | number;
  height?: string | number;
  weight?: string | number;
  joinCode?: string;
  goal?: FitnessGoal;

  // Step 3
  fitnessLevel?: FitnessLevel;
  weeklyGoal?: number;

  // Step 4
  dailyMotivation?: boolean;
  weeklySummary?: boolean;
  runReminders?: boolean;

  // Legacy support
  preferredWorkoutTime?: string;
  terrainPreference?: string;
  dailyReminder?: boolean;

  // Future extensions
  hasSyncedHealthApp?: boolean;
};

/** Alias for backward compatibility */
export type UserMetrics = OnboardingMetrics;

export interface OnboardingProps {
  metrics: OnboardingMetrics;
  onUpdateMetrics: (data: Partial<OnboardingMetrics>) => void;
  onBack?: () => void;
  onContinue?: (e?: React.FormEvent) => void;
  onComplete?: (e: React.FormEvent) => void;
  onConnectGoogleFit?: () => void;
  isLoading?: boolean;
  key?: string;
}

export interface AuthProps {
  onNavigate: (screen: ScreenState) => void;
  onSuccess: () => void;
  key?: string;
}

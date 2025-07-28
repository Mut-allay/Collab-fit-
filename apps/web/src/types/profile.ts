import { UserSchema } from "@fitspark/shared";

// Form validation schema
export const ProfileFormSchema = UserSchema.pick({
  displayName: true,
  age: true,
  gender: true,
  height: true,
  weight: true,
  goal: true,
  fitnessExperience: true,
});

export type ProfileFormData = {
  displayName: string;
  age: number | undefined;
  gender: "male" | "female" | "other" | "prefer_not_to_say" | undefined;
  height: number | undefined;
  weight: number | undefined;
  goal:
    | "weight_loss"
    | "muscle_gain"
    | "strength"
    | "endurance"
    | "general_fitness"
    | undefined;
  fitnessExperience: "beginner" | "intermediate" | "advanced" | undefined;
};

export interface AppSettings {
  darkMode: boolean;
  dailyReminders: boolean;
  weeklyEmails: boolean;
}

export interface MotivationalStats {
  currentStreak: number;
  totalWorkouts: number;
  timeSpentWorkingOut: number; // in minutes
}

export interface BMICalculation {
  value: string;
  category: string;
}

export const GOAL_OPTIONS = [
  { value: "weight_loss", label: "Lose Weight" },
  { value: "muscle_gain", label: "Gain Muscle" },
  { value: "strength", label: "Build Strength" },
  { value: "endurance", label: "Improve Endurance" },
  { value: "general_fitness", label: "General Fitness" },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

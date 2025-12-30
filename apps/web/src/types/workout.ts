import { z } from "zod";
import * as React from "react";

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
  sets: number;
  reps: number;
  restSeconds: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  weight?: number;
  restTime?: number;
  duration?: number;
  distance?: number;
}

export interface WorkoutPhase {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  estimatedDuration: number;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  goal: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  visibility: "public" | "private";
  tags: string[];
  phases: WorkoutPhase[];
  trainerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SetLog {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutSession {
  workoutPlanId: string;
  phaseId: string;
  phaseName: string;
  startTime: Date;
  endTime?: Date;
  sets: SetLog[];
  totalVolume: number;
  duration: number;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutPlanId: string;
  phaseId: string;
  phaseName: string;
  startTime: Date;
  endTime?: Date;
  sets: SetLog[];
  totalVolume: number;
  duration: number;
}

export interface ExerciseStats {
  name: string;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  maxWeight: number;
  avgWeight: number;
  workoutCount: number;
}

export interface ProgressMetrics {
  totalWorkouts: number;
  totalVolume: number;
  totalTime: number;
  avgWorkoutDuration: number;
  avgVolumePerWorkout: number;
  consistencyScore: number;
  strengthGain: number;
  enduranceGain: number;
}

export interface AchievementLevel {
  level: string;
  color: string;
  icon: React.ElementType;
  iconName: string;
}

export const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200",
} as const;

export const GOAL_ICONS = {
  general_fitness: "Zap",
  strength: "Dumbbell",
  weight_loss: "Flame",
  muscle_gain: "Zap",
  endurance: "Activity",
} as const;

export const workoutLoggingSchema = z.object({
  weight: z
    .number()
    .min(0.5, "Weight must be at least 0.5kg")
    .max(1000, "Weight cannot exceed 1000kg")
    .refine((val) => !isNaN(val), "Please enter a valid weight"),
  reps: z
    .number()
    .int("Reps must be a whole number")
    .min(1, "Reps must be at least 1")
    .max(200, "Reps cannot exceed 200")
    .refine((val) => !isNaN(val), "Please enter valid reps"),
});

export type WorkoutLoggingValues = z.infer<typeof workoutLoggingSchema>;

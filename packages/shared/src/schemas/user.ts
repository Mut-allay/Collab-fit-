import { z } from "zod";

export const UserRoleSchema = z.enum(["user", "trainer", "admin"]);

// Onboarding form schema
export const OnboardingSchema = z.object({
  // Step 1: Basic Info
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  age: z
    .number()
    .int()
    .min(13, "Must be at least 13 years old")
    .max(120, "Invalid age"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),

  // Step 2: Physical Info
  height: z
    .number()
    .positive("Height must be positive")
    .min(100, "Height must be at least 100cm")
    .max(250, "Height must be less than 250cm"),
  weight: z
    .number()
    .positive("Weight must be positive")
    .min(30, "Weight must be at least 30kg")
    .max(300, "Weight must be less than 300kg"),
  targetWeight: z
    .number()
    .positive("Target weight must be positive")
    .min(30, "Target weight must be at least 30kg")
    .max(300, "Target weight must be less than 300kg"),

  // Step 3: Fitness Goals
  goal: z.enum([
    "weight_loss",
    "muscle_gain",
    "strength",
    "endurance",
    "general_fitness",
  ]),
  fitnessExperience: z.enum(["beginner", "intermediate", "advanced"]),

  // Step 4: Activity & Schedule
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
  workoutDaysPerWeek: z
    .number()
    .int()
    .min(1, "At least 1 day per week")
    .max(7, "Maximum 7 days per week"),
  workoutDuration: z
    .number()
    .int()
    .positive("Duration must be positive")
    .min(15, "Minimum 15 minutes")
    .max(180, "Maximum 180 minutes"),

  // Step 5: Equipment & Health
  equipment: z.array(z.string()).min(1, "Select at least one equipment option"),
  injuries: z.array(z.string()).optional(),
});

export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  role: UserRoleSchema.default("user"),

  // Onboarding data
  goal: z
    .enum([
      "weight_loss",
      "muscle_gain",
      "strength",
      "endurance",
      "general_fitness",
    ])
    .optional(),
  activityLevel: z
    .enum([
      "sedentary",
      "lightly_active",
      "moderately_active",
      "very_active",
      "extremely_active",
    ])
    .optional(),
  age: z.number().int().min(13).max(120).optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  height: z.number().positive().optional(), // in cm
  weight: z.number().positive().optional(), // in kg
  targetWeight: z.number().positive().optional(), // in kg
  fitnessExperience: z
    .enum(["beginner", "intermediate", "advanced"])
    .optional(),
  workoutDaysPerWeek: z.number().int().min(1).max(7).optional(),
  workoutDuration: z.number().int().positive().optional(), // in minutes
  equipment: z.array(z.string()).optional(),
  injuries: z.array(z.string()).optional(),

  // Plan selection - THESE ARE THE MISSING FIELDS
  selectedPlanId: z.string().optional(),
  planSelectedAt: z.date().optional(),

  // Metadata
  onboardingCompleted: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TrainerProfileSchema = z.object({
  userId: z.string(),
  bio: z.string().max(500).optional(),
  certifications: z.array(z.string()).default([]),
  clientCount: z.number().min(0).default(0),
  status: z.enum(["active", "inactive", "pending"]).default("pending"),
  specialties: z.array(z.string()).default([]),
  yearsExperience: z.number().min(0).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserProfileUpdateSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

export const TrainerProfileUpdateSchema = z.object({
  bio: z.string().max(500).optional(),
  certifications: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  yearsExperience: z.number().min(0).optional(),
});

export type User = z.infer<typeof UserSchema>;
export type OnboardingData = z.infer<typeof OnboardingSchema>;
export type TrainerProfile = z.infer<typeof TrainerProfileSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;
export type TrainerProfileUpdate = z.infer<typeof TrainerProfileUpdateSchema>;

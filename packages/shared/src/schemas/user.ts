import { z } from "zod";

export const UserRoleSchema = z.enum(["user", "trainer", "admin"]);

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
export type TrainerProfile = z.infer<typeof TrainerProfileSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;
export type TrainerProfileUpdate = z.infer<typeof TrainerProfileUpdateSchema>;

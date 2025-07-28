"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerProfileUpdateSchema = exports.UserProfileUpdateSchema = exports.TrainerProfileSchema = exports.UserSchema = exports.UserRoleSchema = void 0;
const zod_1 = require("zod");
exports.UserRoleSchema = zod_1.z.enum(["user", "trainer", "admin"]);
exports.UserSchema = zod_1.z.object({
    uid: zod_1.z.string(),
    email: zod_1.z.string().email(),
    displayName: zod_1.z.string().optional(),
    photoURL: zod_1.z.string().url().optional(),
    role: exports.UserRoleSchema.default("user"),
    // Onboarding data
    goal: zod_1.z
        .enum([
        "weight_loss",
        "muscle_gain",
        "strength",
        "endurance",
        "general_fitness",
    ])
        .optional(),
    activityLevel: zod_1.z
        .enum([
        "sedentary",
        "lightly_active",
        "moderately_active",
        "very_active",
        "extremely_active",
    ])
        .optional(),
    age: zod_1.z.number().int().min(13).max(120).optional(),
    gender: zod_1.z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
    height: zod_1.z.number().positive().optional(), // in cm
    weight: zod_1.z.number().positive().optional(), // in kg
    targetWeight: zod_1.z.number().positive().optional(), // in kg
    fitnessExperience: zod_1.z
        .enum(["beginner", "intermediate", "advanced"])
        .optional(),
    workoutDaysPerWeek: zod_1.z.number().int().min(1).max(7).optional(),
    workoutDuration: zod_1.z.number().int().positive().optional(), // in minutes
    equipment: zod_1.z.array(zod_1.z.string()).optional(),
    injuries: zod_1.z.array(zod_1.z.string()).optional(),
    // Plan selection - THESE ARE THE MISSING FIELDS
    selectedPlanId: zod_1.z.string().optional(),
    planSelectedAt: zod_1.z.date().optional(),
    // Metadata
    onboardingCompleted: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.TrainerProfileSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    bio: zod_1.z.string().max(500).optional(),
    certifications: zod_1.z.array(zod_1.z.string()).default([]),
    clientCount: zod_1.z.number().min(0).default(0),
    status: zod_1.z.enum(["active", "inactive", "pending"]).default("pending"),
    specialties: zod_1.z.array(zod_1.z.string()).default([]),
    yearsExperience: zod_1.z.number().min(0).optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.UserProfileUpdateSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(1).max(100).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
});
exports.TrainerProfileUpdateSchema = zod_1.z.object({
    bio: zod_1.z.string().max(500).optional(),
    certifications: zod_1.z.array(zod_1.z.string()).optional(),
    specialties: zod_1.z.array(zod_1.z.string()).optional(),
    yearsExperience: zod_1.z.number().min(0).optional(),
});

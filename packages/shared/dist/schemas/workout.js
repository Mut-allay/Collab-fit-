"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWorkoutLogSchema = exports.CreateWorkoutProgramSchema = exports.WorkoutLogSchema = exports.LoggedSetSchema = exports.WorkoutProgramSchema = exports.WorkoutSessionSchema = exports.WorkoutSetSchema = exports.ExerciseSchema = void 0;
const zod_1 = require("zod");
exports.ExerciseSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    category: zod_1.z.enum(['strength', 'cardio', 'flexibility', 'sports']),
    muscleGroups: zod_1.z.array(zod_1.z.string()),
    equipment: zod_1.z.array(zod_1.z.string()).default([]),
    instructions: zod_1.z.array(zod_1.z.string()).default([]),
    videoUrl: zod_1.z.string().url().optional(),
    imageUrl: zod_1.z.string().url().optional(),
});
exports.WorkoutSetSchema = zod_1.z.object({
    exerciseId: zod_1.z.string(),
    sets: zod_1.z.number().min(1),
    reps: zod_1.z.number().min(1).optional(),
    weight: zod_1.z.number().min(0).optional(),
    duration: zod_1.z.number().min(0).optional(), // seconds
    distance: zod_1.z.number().min(0).optional(), // meters
    restTime: zod_1.z.number().min(0).default(60), // seconds
});
exports.WorkoutSessionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    exercises: zod_1.z.array(exports.WorkoutSetSchema),
    estimatedDuration: zod_1.z.number().min(0), // minutes
});
exports.WorkoutProgramSchema = zod_1.z.object({
    id: zod_1.z.string(),
    trainerId: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
    goal: zod_1.z.enum(['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness']),
    durationWeeks: zod_1.z.number().min(1).max(52),
    sessionsPerWeek: zod_1.z.number().min(1).max(7),
    phases: zod_1.z.array(exports.WorkoutSessionSchema),
    visibility: zod_1.z.enum(['public', 'private', 'clients_only']).default('private'),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.LoggedSetSchema = zod_1.z.object({
    exerciseId: zod_1.z.string(),
    setNumber: zod_1.z.number().min(1),
    reps: zod_1.z.number().min(0).optional(),
    weight: zod_1.z.number().min(0).optional(),
    duration: zod_1.z.number().min(0).optional(),
    distance: zod_1.z.number().min(0).optional(),
    completed: zod_1.z.boolean().default(true),
});
exports.WorkoutLogSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    programId: zod_1.z.string().optional(),
    sessionId: zod_1.z.string().optional(),
    name: zod_1.z.string(),
    timestamp: zod_1.z.date(),
    startTime: zod_1.z.date(),
    endTime: zod_1.z.date().optional(),
    sets: zod_1.z.array(exports.LoggedSetSchema),
    notes: zod_1.z.string().optional(),
    completed: zod_1.z.boolean().default(false),
});
exports.CreateWorkoutProgramSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(1000).optional(),
    difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
    goal: zod_1.z.enum(['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness']),
    durationWeeks: zod_1.z.number().min(1).max(52),
    sessionsPerWeek: zod_1.z.number().min(1).max(7),
    phases: zod_1.z.array(exports.WorkoutSessionSchema),
    visibility: zod_1.z.enum(['public', 'private', 'clients_only']).default('private'),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
exports.CreateWorkoutLogSchema = zod_1.z.object({
    programId: zod_1.z.string().optional(),
    sessionId: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1).max(200),
    sets: zod_1.z.array(exports.LoggedSetSchema),
    notes: zod_1.z.string().max(1000).optional(),
});

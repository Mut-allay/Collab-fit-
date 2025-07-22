import { z } from 'zod';

export const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.enum(['strength', 'cardio', 'flexibility', 'sports']),
  muscleGroups: z.array(z.string()),
  equipment: z.array(z.string()).default([]),
  instructions: z.array(z.string()).default([]),
  videoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
});

export const WorkoutSetSchema = z.object({
  exerciseId: z.string(),
  sets: z.number().min(1),
  reps: z.number().min(1).optional(),
  weight: z.number().min(0).optional(),
  duration: z.number().min(0).optional(), // seconds
  distance: z.number().min(0).optional(), // meters
  restTime: z.number().min(0).default(60), // seconds
});

export const WorkoutSessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  exercises: z.array(WorkoutSetSchema),
  estimatedDuration: z.number().min(0), // minutes
});

export const WorkoutProgramSchema = z.object({
  id: z.string(),
  trainerId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  goal: z.enum(['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness']),
  durationWeeks: z.number().min(1).max(52),
  sessionsPerWeek: z.number().min(1).max(7),
  phases: z.array(WorkoutSessionSchema),
  visibility: z.enum(['public', 'private', 'clients_only']).default('private'),
  tags: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LoggedSetSchema = z.object({
  exerciseId: z.string(),
  setNumber: z.number().min(1),
  reps: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
  duration: z.number().min(0).optional(),
  distance: z.number().min(0).optional(),
  completed: z.boolean().default(true),
});

export const WorkoutLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  programId: z.string().optional(),
  sessionId: z.string().optional(),
  name: z.string(),
  timestamp: z.date(),
  startTime: z.date(),
  endTime: z.date().optional(),
  sets: z.array(LoggedSetSchema),
  notes: z.string().optional(),
  completed: z.boolean().default(false),
});

export const CreateWorkoutProgramSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  goal: z.enum(['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness']),
  durationWeeks: z.number().min(1).max(52),
  sessionsPerWeek: z.number().min(1).max(7),
  phases: z.array(WorkoutSessionSchema),
  visibility: z.enum(['public', 'private', 'clients_only']).default('private'),
  tags: z.array(z.string()).default([]),
});

export const CreateWorkoutLogSchema = z.object({
  programId: z.string().optional(),
  sessionId: z.string().optional(),
  name: z.string().min(1).max(200),
  sets: z.array(LoggedSetSchema),
  notes: z.string().max(1000).optional(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;
export type WorkoutSet = z.infer<typeof WorkoutSetSchema>;
export type WorkoutSession = z.infer<typeof WorkoutSessionSchema>;
export type WorkoutProgram = z.infer<typeof WorkoutProgramSchema>;
export type LoggedSet = z.infer<typeof LoggedSetSchema>;
export type WorkoutLog = z.infer<typeof WorkoutLogSchema>;
export type CreateWorkoutProgram = z.infer<typeof CreateWorkoutProgramSchema>;
export type CreateWorkoutLog = z.infer<typeof CreateWorkoutLogSchema>; 
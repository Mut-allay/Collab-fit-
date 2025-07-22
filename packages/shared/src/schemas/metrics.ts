import { z } from 'zod';

export const MetricSnapshotSchema = z.object({
  id: z.string(),
  userId: z.string(),
  timestamp: z.date(),
  heartRate: z.number().min(30).max(220).optional(),
  heartRateVariability: z.number().min(0).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  sleepQuality: z.number().min(1).max(10).optional(), // 1-10 scale
  calories: z.number().min(0).optional(),
  steps: z.number().min(0).optional(),
  weight: z.number().min(20).max(1000).optional(), // kg
  bodyFatPercentage: z.number().min(0).max(100).optional(),
  muscleMass: z.number().min(0).optional(), // kg
  hydration: z.number().min(0).max(10).optional(), // 1-10 scale
  stressLevel: z.number().min(1).max(10).optional(), // 1-10 scale
  energy: z.number().min(1).max(10).optional(), // 1-10 scale
  mood: z.number().min(1).max(10).optional(), // 1-10 scale
  notes: z.string().max(500).optional(),
});

export const BiometricEntrySchema = z.object({
  weight: z.number().min(20).max(1000).optional(),
  bodyFatPercentage: z.number().min(0).max(100).optional(),
  muscleMass: z.number().min(0).optional(),
  measurements: z.record(z.string(), z.number()).optional(), // chest, waist, arms, etc.
});

export const CreateMetricSnapshotSchema = z.object({
  heartRate: z.number().min(30).max(220).optional(),
  heartRateVariability: z.number().min(0).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  sleepQuality: z.number().min(1).max(10).optional(),
  calories: z.number().min(0).optional(),
  steps: z.number().min(0).optional(),
  weight: z.number().min(20).max(1000).optional(),
  bodyFatPercentage: z.number().min(0).max(100).optional(),
  muscleMass: z.number().min(0).optional(),
  hydration: z.number().min(0).max(10).optional(),
  stressLevel: z.number().min(1).max(10).optional(),
  energy: z.number().min(1).max(10).optional(),
  mood: z.number().min(1).max(10).optional(),
  notes: z.string().max(500).optional(),
});

export const WearableDataSchema = z.object({
  source: z.enum(['apple_health', 'google_fit', 'whoop', 'fitbit', 'garmin', 'manual']),
  deviceId: z.string().optional(),
  syncedAt: z.date(),
  data: z.record(z.string(), z.unknown()),
});

export type MetricSnapshot = z.infer<typeof MetricSnapshotSchema>;
export type BiometricEntry = z.infer<typeof BiometricEntrySchema>;
export type CreateMetricSnapshot = z.infer<typeof CreateMetricSnapshotSchema>;
export type WearableData = z.infer<typeof WearableDataSchema>; 
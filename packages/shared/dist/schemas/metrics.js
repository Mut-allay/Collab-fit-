"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WearableDataSchema = exports.CreateMetricSnapshotSchema = exports.BiometricEntrySchema = exports.MetricSnapshotSchema = void 0;
const zod_1 = require("zod");
exports.MetricSnapshotSchema = zod_1.z.object({
    id: zod_1.z.string(),
    userId: zod_1.z.string(),
    timestamp: zod_1.z.date(),
    heartRate: zod_1.z.number().min(30).max(220).optional(),
    heartRateVariability: zod_1.z.number().min(0).optional(),
    sleepHours: zod_1.z.number().min(0).max(24).optional(),
    sleepQuality: zod_1.z.number().min(1).max(10).optional(), // 1-10 scale
    calories: zod_1.z.number().min(0).optional(),
    steps: zod_1.z.number().min(0).optional(),
    weight: zod_1.z.number().min(20).max(1000).optional(), // kg
    bodyFatPercentage: zod_1.z.number().min(0).max(100).optional(),
    muscleMass: zod_1.z.number().min(0).optional(), // kg
    hydration: zod_1.z.number().min(0).max(10).optional(), // 1-10 scale
    stressLevel: zod_1.z.number().min(1).max(10).optional(), // 1-10 scale
    energy: zod_1.z.number().min(1).max(10).optional(), // 1-10 scale
    mood: zod_1.z.number().min(1).max(10).optional(), // 1-10 scale
    notes: zod_1.z.string().max(500).optional(),
});
exports.BiometricEntrySchema = zod_1.z.object({
    weight: zod_1.z.number().min(20).max(1000).optional(),
    bodyFatPercentage: zod_1.z.number().min(0).max(100).optional(),
    muscleMass: zod_1.z.number().min(0).optional(),
    measurements: zod_1.z.record(zod_1.z.string(), zod_1.z.number()).optional(), // chest, waist, arms, etc.
});
exports.CreateMetricSnapshotSchema = zod_1.z.object({
    heartRate: zod_1.z.number().min(30).max(220).optional(),
    heartRateVariability: zod_1.z.number().min(0).optional(),
    sleepHours: zod_1.z.number().min(0).max(24).optional(),
    sleepQuality: zod_1.z.number().min(1).max(10).optional(),
    calories: zod_1.z.number().min(0).optional(),
    steps: zod_1.z.number().min(0).optional(),
    weight: zod_1.z.number().min(20).max(1000).optional(),
    bodyFatPercentage: zod_1.z.number().min(0).max(100).optional(),
    muscleMass: zod_1.z.number().min(0).optional(),
    hydration: zod_1.z.number().min(0).max(10).optional(),
    stressLevel: zod_1.z.number().min(1).max(10).optional(),
    energy: zod_1.z.number().min(1).max(10).optional(),
    mood: zod_1.z.number().min(1).max(10).optional(),
    notes: zod_1.z.string().max(500).optional(),
});
exports.WearableDataSchema = zod_1.z.object({
    source: zod_1.z.enum(['apple_health', 'google_fit', 'whoop', 'fitbit', 'garmin', 'manual']),
    deviceId: zod_1.z.string().optional(),
    syncedAt: zod_1.z.date(),
    data: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()),
});

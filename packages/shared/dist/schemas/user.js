"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerProfileUpdateSchema = exports.UserProfileUpdateSchema = exports.TrainerProfileSchema = exports.UserSchema = exports.UserRoleSchema = void 0;
const zod_1 = require("zod");
exports.UserRoleSchema = zod_1.z.enum(['user', 'trainer', 'admin']);
exports.UserSchema = zod_1.z.object({
    uid: zod_1.z.string(),
    email: zod_1.z.string().email(),
    displayName: zod_1.z.string().optional(),
    role: exports.UserRoleSchema,
    avatarUrl: zod_1.z.string().url().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.TrainerProfileSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    bio: zod_1.z.string().max(500).optional(),
    certifications: zod_1.z.array(zod_1.z.string()).default([]),
    clientCount: zod_1.z.number().min(0).default(0),
    status: zod_1.z.enum(['active', 'inactive', 'pending']).default('pending'),
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

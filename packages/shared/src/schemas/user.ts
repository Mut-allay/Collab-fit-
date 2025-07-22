import { z } from 'zod';

export const UserRoleSchema = z.enum(['user', 'trainer', 'admin']);

export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  role: UserRoleSchema,
  avatarUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TrainerProfileSchema = z.object({
  userId: z.string(),
  bio: z.string().max(500).optional(),
  certifications: z.array(z.string()).default([]),
  clientCount: z.number().min(0).default(0),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
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
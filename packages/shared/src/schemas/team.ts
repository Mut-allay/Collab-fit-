import { z } from 'zod';

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  leaderId: z.string(),
  memberIds: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
  currentMonthTotal: z.object({
    steps: z.number().min(0).default(0),
    calories: z.number().min(0).default(0),
  }).default({ steps: 0, calories: 0 }),
  isActive: z.boolean().default(true),
});

export const TeamInvitationSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  teamName: z.string(),
  invitedUserId: z.string(),
  invitedByUserId: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected']).default('pending'),
  createdAt: z.date(),
  expiresAt: z.date(),
});

export const DailyActivityLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(), // YYYY-MM-DD format
  steps: z.number().min(0).default(0),
  calories: z.number().min(0).default(0),
  source: z.enum(['google_fit', 'manual']).default('google_fit'),
  syncedAt: z.date(),
  lastUpdated: z.date(),
});

export const TeamMemberStatsSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  steps: z.number().min(0).default(0),
  calories: z.number().min(0).default(0),
});

export const TeamLeaderboardEntrySchema = z.object({
  teamId: z.string(),
  teamName: z.string(),
  totalSteps: z.number().min(0).default(0),
  totalCalories: z.number().min(0).default(0),
  memberCount: z.number().min(0).default(0),
  members: z.array(TeamMemberStatsSchema).default([]),
});

export const MonthlyLeaderboardSchema = z.object({
  id: z.string(), // format: "YYYY-MM"
  month: z.string(),
  year: z.number(),
  teams: z.array(TeamLeaderboardEntrySchema).default([]),
  lastUpdated: z.date(),
});

// Create schemas
export const CreateTeamSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const CreateTeamInvitationSchema = z.object({
  teamId: z.string(),
  invitedUserId: z.string(),
});

export const UpdateDailyActivitySchema = z.object({
  date: z.string(),
  steps: z.number().min(0),
  calories: z.number().min(0),
});

// Export types
export type Team = z.infer<typeof TeamSchema>;
export type TeamInvitation = z.infer<typeof TeamInvitationSchema>;
export type DailyActivityLog = z.infer<typeof DailyActivityLogSchema>;
export type TeamMemberStats = z.infer<typeof TeamMemberStatsSchema>;
export type TeamLeaderboardEntry = z.infer<typeof TeamLeaderboardEntrySchema>;
export type MonthlyLeaderboard = z.infer<typeof MonthlyLeaderboardSchema>;
export type CreateTeam = z.infer<typeof CreateTeamSchema>;
export type CreateTeamInvitation = z.infer<typeof CreateTeamInvitationSchema>;
export type UpdateDailyActivity = z.infer<typeof UpdateDailyActivitySchema>;

import { z } from 'zod';
export declare const UserRoleSchema: z.ZodEnum<["user", "trainer", "admin"]>;
export declare const UserSchema: z.ZodObject<{
    uid: z.ZodString;
    email: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["user", "trainer", "admin"]>;
    avatarUrl: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    uid: string;
    email: string;
    role: "user" | "trainer" | "admin";
    createdAt: Date;
    updatedAt: Date;
    displayName?: string | undefined;
    avatarUrl?: string | undefined;
}, {
    uid: string;
    email: string;
    role: "user" | "trainer" | "admin";
    createdAt: Date;
    updatedAt: Date;
    displayName?: string | undefined;
    avatarUrl?: string | undefined;
}>;
export declare const TrainerProfileSchema: z.ZodObject<{
    userId: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    certifications: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    clientCount: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["active", "inactive", "pending"]>>;
    specialties: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    yearsExperience: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    createdAt: Date;
    updatedAt: Date;
    status: "active" | "inactive" | "pending";
    userId: string;
    certifications: string[];
    clientCount: number;
    specialties: string[];
    bio?: string | undefined;
    yearsExperience?: number | undefined;
}, {
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status?: "active" | "inactive" | "pending" | undefined;
    bio?: string | undefined;
    certifications?: string[] | undefined;
    clientCount?: number | undefined;
    specialties?: string[] | undefined;
    yearsExperience?: number | undefined;
}>;
export declare const UserProfileUpdateSchema: z.ZodObject<{
    displayName: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    displayName?: string | undefined;
    avatarUrl?: string | undefined;
}, {
    displayName?: string | undefined;
    avatarUrl?: string | undefined;
}>;
export declare const TrainerProfileUpdateSchema: z.ZodObject<{
    bio: z.ZodOptional<z.ZodString>;
    certifications: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    specialties: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    yearsExperience: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    bio?: string | undefined;
    certifications?: string[] | undefined;
    specialties?: string[] | undefined;
    yearsExperience?: number | undefined;
}, {
    bio?: string | undefined;
    certifications?: string[] | undefined;
    specialties?: string[] | undefined;
    yearsExperience?: number | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export type TrainerProfile = z.infer<typeof TrainerProfileSchema>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserProfileUpdate = z.infer<typeof UserProfileUpdateSchema>;
export type TrainerProfileUpdate = z.infer<typeof TrainerProfileUpdateSchema>;

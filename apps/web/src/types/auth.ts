import { User } from "firebase/auth";
import type { User as FitSparkUser } from "@fitspark/shared";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Defines the shape of the data and functions provided by the AuthContext.
 * This is the "contract" that any component using `useAuth()` can expect.
 */
export interface AuthContextType {
  currentUser: User | null;
  userProfile: FitSparkUser | null;
  loading: boolean;
  sessionExpiry: Date | null;
  signup: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<FitSparkUser>) => Promise<void>;
}

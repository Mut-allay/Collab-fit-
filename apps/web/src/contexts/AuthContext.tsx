import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "firebase/auth";
import * as AuthService from "@/lib/authService";
import { useSessionManager } from "@/hooks/useSessionManager";
import { AuthContextType } from "@/types/auth"; // <-- IMPORTED TYPE
import type { User as FitSparkUser } from "@fitspark/shared";

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the custom hook for easy consumption
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Create the Provider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // --- STATE MANAGEMENT ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FitSparkUser | null>(null);
  const [loading, setLoading] = useState(true);

  // --- HOOKS ---
  // Delegate session management to our custom hook
  const { sessionExpiry } = useSessionManager(currentUser);

  // --- DATA FETCHING & ACTIONS ---
  // Use useCallback to memoize functions and prevent unnecessary re-renders
  const loadUserProfile = useCallback(async (uid: string) => {
    try {
      const profile = await AuthService.getUserProfile(uid);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading user profile:", error);
      setUserProfile(null);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, displayName?: string) => {
    await AuthService.signupUser(email, password, displayName);
    // onAuthChange will handle setting the user state
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await AuthService.loginUser(email, password);
    // onAuthChange will handle setting the user state
  }, []);

  const logout = useCallback(() => {
    return AuthService.logoutUser();
    // onAuthChange will handle setting the user state
  }, []);

  const resetPassword = useCallback((email: string) => {
    return AuthService.sendPasswordReset(email);
  }, []);

  const updateUserProfile = useCallback(async (data: Partial<FitSparkUser>) => {
    if (!currentUser) throw new Error("No user logged in to update profile.");
    await AuthService.updateUserProfileData(currentUser.uid, data);
    // Refresh the profile in our state after updating
    await loadUserProfile(currentUser.uid);
  }, [currentUser, loadUserProfile]);


  // --- EFFECTS ---
  // Main effect to listen for auth changes from Firebase
  useEffect(() => {
    setLoading(true);
    const unsubscribe = AuthService.onAuthChange(async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [loadUserProfile]);


  // --- VALUE & PROVIDER ---
  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    sessionExpiry,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

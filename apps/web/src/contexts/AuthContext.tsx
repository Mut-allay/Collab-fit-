import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { User as FitSparkUser, UserRole } from "@fitspark/shared";

interface AuthContextType {
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
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FitSparkUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);

  // Session timeout duration (24 hours)
  const SESSION_TIMEOUT_HOURS = 24;

  async function signup(email: string, password: string, displayName?: string) {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update Firebase Auth profile
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Create user document in Firestore
    const userData: Omit<FitSparkUser, "createdAt" | "updatedAt"> = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || "",
      role: "user" as UserRole,
      onboardingCompleted: false,
    };

    await setDoc(doc(db, "users", user.uid), {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // Provide user-friendly error messages
      switch (error.code) {
        case "auth/invalid-credential":
          throw new Error(
            "The email or password you entered is incorrect. Please check your credentials and try again."
          );
        case "auth/user-not-found":
          throw new Error(
            "No account found with this email address. Please check your email or create a new account."
          );
        case "auth/too-many-requests":
          throw new Error(
            "Too many failed login attempts. Please wait a few minutes before trying again."
          );
        case "auth/user-disabled":
          throw new Error(
            "This account has been disabled. Please contact support for assistance."
          );
        default:
          throw new Error(
            "Unable to sign in at the moment. Please check your internet connection and try again."
          );
      }
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  async function updateUserProfile(data: Partial<FitSparkUser>) {
    if (!currentUser) throw new Error("No user logged in");

    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(
      userRef,
      {
        ...data,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    // Refresh user profile
    await loadUserProfile(currentUser.uid);
  }

  async function loadUserProfile(uid: string) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as FitSparkUser);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  }

  async function refreshSession() {
    if (!currentUser) return;

    // Force token refresh
    await currentUser.getIdToken(true);

    // Update session expiry
    const newExpiry = new Date();
    newExpiry.setHours(newExpiry.getHours() + SESSION_TIMEOUT_HOURS);
    setSessionExpiry(newExpiry);

    // Store in localStorage
    localStorage.setItem("sessionExpiry", newExpiry.toISOString());
  }

  function checkSessionExpiry() {
    if (!sessionExpiry) return false;

    const now = new Date();
    if (now > sessionExpiry) {
      // Session expired, logout user
      logout();
      return true;
    }
    return false;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await loadUserProfile(user.uid);

        // Set session expiry
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + SESSION_TIMEOUT_HOURS);
        setSessionExpiry(expiry);
        localStorage.setItem("sessionExpiry", expiry.toISOString());
      } else {
        setUserProfile(null);
        setSessionExpiry(null);
        localStorage.removeItem("sessionExpiry");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Check session expiry every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkSessionExpiry();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [sessionExpiry]);

  // Refresh session on user activity
  useEffect(() => {
    const handleUserActivity = () => {
      if (currentUser && sessionExpiry) {
        refreshSession();
      }
    };

    // Listen for user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [currentUser, sessionExpiry]);

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
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

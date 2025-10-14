import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { User as FitSparkUser, UserRole } from "@fitspark/shared";

/**
 * Signs up a new user with email, password, and optional display name.
 * Creates a corresponding user document in Firestore.
 */
export async function signupUser(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateFirebaseProfile(user, { displayName });
  }

  const userData: Omit<FitSparkUser, "createdAt" | "updatedAt"> = {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName || "",
    role: "user" as UserRole,
    onboardingCompleted: false,
    googleFitConnected: false,
  };

  await setDoc(doc(db, "users", user.uid), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
}

/**
 * Logs in a user with email and password.
 * Throws a user-friendly error on failure.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Firebase Auth Error:", error.code, error.message);
    // This detailed error handling is excellent. We keep it here.
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
      case "auth/network-request-failed":
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      default:
        console.error("❌ Unhandled auth error:", error);
        throw new Error(
          `Authentication error: ${error.message || "Unknown error occurred"}`
        );
    }
  }
}

/**
 * Logs out the current user.
 */
export function logoutUser(): Promise<void> {
  return signOut(auth);
}

/**
 * Sends a password reset email to the given email address.
 */
export function sendPasswordReset(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Fetches a user's profile from Firestore.
 */
export async function getUserProfile(
  uid: string
): Promise<FitSparkUser | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data() as FitSparkUser;
  }
  return null;
}

/**
 * Updates a user's profile data in Firestore.
 */
export function updateUserProfileData(
  uid: string,
  data: Partial<FitSparkUser>
): Promise<void> {
  const userRef = doc(db, "users", uid);
  return setDoc(
    userRef,
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

/**
 * Sets up a listener for authentication state changes.
 * The callback will be fired whenever the user logs in or out.
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Forces a refresh of the user's ID token.
 */
export function forceTokenRefresh(user: User): Promise<string> {
  return user.getIdToken(true);
}

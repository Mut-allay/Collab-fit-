import { useState, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import { forceTokenRefresh, logoutUser } from "@/lib/authService";

// Session timeout duration (e.g., 24 hours)
const SESSION_TIMEOUT_HOURS = 24;
// Minimum time between refreshes (e.g., 5 minutes) to avoid spamming Firebase
const MIN_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function useSessionManager(currentUser: User | null) {
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

  // Memoize the logout function to prevent re-renders
  const handleLogout = useCallback(() => {
    logoutUser().catch((error) =>
      console.error("Failed to logout on session expiry:", error)
    );
  }, []);

  // Effect to initialize session state from localStorage on login
  useEffect(() => {
    if (currentUser) {
      const storedExpiry = localStorage.getItem("sessionExpiry");
      const storedRefresh = localStorage.getItem("lastRefreshTime");

      if (storedExpiry) {
        setSessionExpiry(new Date(storedExpiry));
      } else {
        // If no expiry, set a new one
        const newExpiry = new Date();
        newExpiry.setHours(newExpiry.getHours() + SESSION_TIMEOUT_HOURS);
        setSessionExpiry(newExpiry);
        localStorage.setItem("sessionExpiry", newExpiry.toISOString());
      }

      if (storedRefresh) {
        setLastRefreshTime(parseInt(storedRefresh, 10));
      }
    } else {
      // Clear state and localStorage on logout
      setSessionExpiry(null);
      setLastRefreshTime(0);
      localStorage.removeItem("sessionExpiry");
      localStorage.removeItem("lastRefreshTime");
    }
  }, [currentUser]);

  // Effect for periodically checking if the session has expired
  useEffect(() => {
    const checkSession = () => {
      if (sessionExpiry && new Date() > sessionExpiry) {
        handleLogout();
        return true;
      }
      return false;
    };

    const intervalId = setInterval(checkSession, 60 * 1000); // Check every minute
    return () => clearInterval(intervalId);
  }, [sessionExpiry, handleLogout]);

  // Effect for refreshing the session token based on user activity
  useEffect(() => {
    if (!currentUser) return;

    const refreshSession = async () => {
      const now = Date.now();
      if (now - lastRefreshTime < MIN_REFRESH_INTERVAL_MS) {
        return; // Debounce: Don't refresh too frequently
      }

      try {
        await forceTokenRefresh(currentUser);
        const newExpiry = new Date();
        newExpiry.setHours(newExpiry.getHours() + SESSION_TIMEOUT_HOURS);

        setSessionExpiry(newExpiry);
        setLastRefreshTime(now);

        localStorage.setItem("sessionExpiry", newExpiry.toISOString());
        localStorage.setItem("lastRefreshTime", now.toString());
      } catch (error) {
        console.warn("Session refresh failed:", error);
      }
    };

    let activityTimeoutId: NodeJS.Timeout;

    const handleUserActivity = () => {
      clearTimeout(activityTimeoutId);
      activityTimeoutId = setTimeout(refreshSession, 30 * 1000); // Refresh 30s after last activity
    };

    const events: (keyof DocumentEventMap)[] = [
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) =>
      document.addEventListener(event, handleUserActivity, true)
    );

    return () => {
      clearTimeout(activityTimeoutId);
      events.forEach((event) =>
        document.removeEventListener(event, handleUserActivity, true)
      );
    };
  }, [currentUser, lastRefreshTime]);

  return { sessionExpiry };
}

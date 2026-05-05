import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

/** For overhaul App (no Router): handle `?googleFit=` after OAuth redirect, then strip it from URL. */
export function GoogleFitOAuthStandalone() {
  const { updateUserProfile } = useAuth();

  useEffect(() => {
    const googleFit = new URLSearchParams(window.location.search).get(
      "googleFit"
    );
    if (!googleFit) return;

    if (googleFit === "connected") {
      toast.success(
        "Google Fit connected! Your activity will sync automatically."
      );
      void updateUserProfile({ googleFitConnected: true });
    } else if (googleFit === "error") {
      toast.error("Could not connect Google Fit. Please try again.");
    }

    const p = new URLSearchParams(window.location.search);
    p.delete("googleFit");
    const qs = p.toString();
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

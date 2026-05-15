import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLanding from "@/overhaul/src/components/AuthLanding";
import { useAuth } from "@/contexts/AuthContext";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

const ONBOARDING_FLAG = "fitlit-onboarding-complete";

function shouldRedirectToOnboarding() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ONBOARDING_FLAG) !== "true";
}

export default function LandingRoute() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const onNav = createOverhaulNavigate(navigate);

  useEffect(() => {
    if (!loading && currentUser) {
      if (shouldRedirectToOnboarding()) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [currentUser, loading, navigate]);

  if (loading || currentUser) {
    return null;
  }

  return (
    <div className="overhaul dark min-h-screen">
      <AuthLanding
        onNavigate={onNav}
        onSuccess={() => navigate(shouldRedirectToOnboarding() ? "/onboarding" : "/dashboard")}
      />
    </div>
  );
}

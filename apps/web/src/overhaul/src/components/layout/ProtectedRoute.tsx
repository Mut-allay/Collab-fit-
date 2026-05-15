import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

function onboardingComplete() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("fitlit-onboarding-complete") === "true";
}

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface grid place-items-center px-6">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-high p-8 text-center shadow-lg">
          <p className="font-headline text-xl font-black tracking-tight text-primary">Loading session…</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!onboardingComplete() && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

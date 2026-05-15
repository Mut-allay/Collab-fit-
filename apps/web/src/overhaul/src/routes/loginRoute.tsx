import { Navigate, useNavigate } from "react-router-dom";
import Login from "@/overhaul/src/components/Login";
import { useAuth } from "@/contexts/AuthContext";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

const ONBOARDING_FLAG = "fitlit-onboarding-complete";

function getPostLoginPath() {
  if (typeof window === "undefined") return "/dashboard";
  return window.localStorage.getItem(ONBOARDING_FLAG) === "true" ? "/dashboard" : "/onboarding";
}

export default function LoginRoute() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const onNav = createOverhaulNavigate(navigate);

  if (loading) {
    return null;
  }

  if (currentUser) {
    return <Navigate to={getPostLoginPath()} replace />;
  }

  return (
    <div className="overhaul dark min-h-screen">
      <Login
        onNavigate={onNav}
        onSuccess={() => navigate(getPostLoginPath())}
      />
    </div>
  );
}

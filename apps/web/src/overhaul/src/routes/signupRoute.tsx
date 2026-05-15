import { Navigate, useNavigate } from "react-router-dom";
import SignUp from "@/overhaul/src/components/SignUp";
import { useAuth } from "@/contexts/AuthContext";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

const ONBOARDING_FLAG = "fitlit-onboarding-complete";

function getPostLoginPath() {
  if (typeof window === "undefined") return "/dashboard";
  return window.localStorage.getItem(ONBOARDING_FLAG) === "true" ? "/dashboard" : "/onboarding";
}

export default function SignupRoute() {
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
      <SignUp
        onNavigate={onNav}
        onSuccess={() => navigate("/onboarding")}
      />
    </div>
  );
}

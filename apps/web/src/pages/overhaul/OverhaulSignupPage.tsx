import { Navigate, useNavigate } from "react-router-dom";
import SignUp from "@/overhaul/src/components/SignUp";
import { useAuth } from "@/contexts/AuthContext";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

export default function OverhaulSignupPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const onNav = createOverhaulNavigate(navigate);

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="overhaul dark min-h-screen">
      <SignUp
        onNavigate={onNav}
        onSuccess={() => navigate("/dashboard")}
      />
    </div>
  );
}

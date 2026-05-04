import { Navigate, useNavigate } from "react-router-dom";
import Login from "@/overhaul/src/components/Login";
import { useAuth } from "@/contexts/AuthContext";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

export default function OverhaulLoginPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const onNav = createOverhaulNavigate(navigate);

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="overhaul dark min-h-screen">
      <Login
        onNavigate={onNav}
        onSuccess={() => navigate("/dashboard")}
      />
    </div>
  );
}

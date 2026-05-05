import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLanding from "@/overhaul/src/components/AuthLanding";
import { useAuth } from "@/contexts/AuthContext";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

export default function LandingRoute() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const onNav = createOverhaulNavigate(navigate);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  if (currentUser) {
    return null;
  }

  return (
    <div className="overhaul dark min-h-screen">
      <AuthLanding
        onNavigate={onNav}
        onSuccess={() => navigate("/dashboard")}
      />
    </div>
  );
}

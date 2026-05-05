import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { DashboardShell } from "@/overhaul/src/components/DashboardShell";
import { useAuth } from "@/contexts/AuthContext";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

export default function DashboardRoute() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const onNav = createOverhaulNavigate(navigate);
  const { updateUserProfile } = useAuth();

  useEffect(() => {
    const googleFit = searchParams.get("googleFit");
    if (!googleFit) return;
    if (googleFit === "connected") {
      toast.success(
        "Google Fit connected! Your activity will sync automatically."
      );
      void updateUserProfile({ googleFitConnected: true });
    } else if (googleFit === "error") {
      toast.error("Could not connect Google Fit. Please try again.");
    }
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <DashboardShell onNavigate={onNav} />;
}

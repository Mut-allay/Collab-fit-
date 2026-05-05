import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "@/overhaul/src/components/Leaderboard";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

export default function LeaderboardRoute() {
  const navigate = useNavigate();
  const onNav = useMemo(() => createOverhaulNavigate(navigate), [navigate]);

  return (
    <div className="overhaul dark min-h-screen">
      <Leaderboard onNavigate={onNav} />
    </div>
  );
}

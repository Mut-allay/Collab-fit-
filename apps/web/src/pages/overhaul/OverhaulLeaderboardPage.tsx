import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "@/overhaul/src/components/Leaderboard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useMonthlyLeaderboardQuery } from "@/hooks/useMonthlyLeaderboardQuery";
import { mapLeaderboardToRows } from "@/lib/leaderboardUi";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export default function OverhaulLeaderboardPage() {
  const navigate = useNavigate();
  const onNav = useMemo(() => createOverhaulNavigate(navigate), [navigate]);
  const { userProfile } = useAuth();
  const [metric, setMetric] = useState<"steps" | "calories">("steps");
  const [period, setPeriod] = useState(() => {
    const n = new Date();
    return {
      month: MONTHS[n.getMonth()] ?? "January",
      year: n.getFullYear(),
    };
  });

  const { data: lb, isLoading, isError, error } = useMonthlyLeaderboardQuery(
    period.month,
    period.year
  );

  const rows = useMemo(() => {
    if (!lb || !lb.teams?.length) return [];
    return mapLeaderboardToRows(lb, {
      userTeamId: userProfile?.teamId,
      metric,
    });
  }, [lb, userProfile?.teamId, metric]);

  const lastUpdatedText = lb?.lastUpdated
    ? lb.lastUpdated.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  const monthLabel = `${period.month} ${period.year}`;

  const shiftMonth = (delta: number) => {
    setPeriod(({ month, year }) => {
      let idx = MONTHS.indexOf(month as (typeof MONTHS)[number]);
      if (idx < 0) idx = new Date().getMonth();
      idx += delta;
      let y = year;
      if (idx < 0) {
        idx = 11;
        y -= 1;
      } else if (idx > 11) {
        idx = 0;
        y += 1;
      }
      return { month: MONTHS[idx] ?? "January", year: y };
    });
  };

  if (isLoading && lb === undefined) {
    return (
      <div className="overhaul dark min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading leaderboard…" />
      </div>
    );
  }

  return (
    <div className="overhaul dark min-h-screen">
      <Leaderboard
        onNavigate={onNav}
        teams={rows}
        lastUpdatedText={lastUpdatedText}
        monthLabel={monthLabel}
        onPrevMonth={() => shiftMonth(-1)}
        onNextMonth={() => shiftMonth(1)}
        errorMessage={
          isError
            ? error instanceof Error
              ? error.message
              : "Failed to load leaderboard"
            : undefined
        }
        metric={metric}
        onMetricChange={setMetric}
        heroTrendText={null}
      />
    </div>
  );
}

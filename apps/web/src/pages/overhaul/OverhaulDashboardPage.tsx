import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Dashboard from "@/overhaul/src/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";
import {
  summarizeDailyLogs,
  useDailyActivityLogsQuery,
} from "@/hooks/useDailyActivityLogsQuery";
import {
  initiateGoogleFitConnect,
  syncGoogleFitNow,
} from "@/lib/googleFitService";

const STEPS_GOAL = 10_000;
const CALORIES_GOAL = 600;
const DISTANCE_GOAL_METERS = 8000;

export default function OverhaulDashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSyncingGoogleFit, setIsSyncingGoogleFit] = useState(false);
  const queryClient = useQueryClient();
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const onNav = createOverhaulNavigate(navigate);

  const { data: logs = [] } = useDailyActivityLogsQuery(currentUser?.uid);
  const summary = summarizeDailyLogs(logs, {
    stepsGoal: STEPS_GOAL,
    caloriesGoal: CALORIES_GOAL,
    distanceGoalMeters: DISTANCE_GOAL_METERS,
  });

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

  const handleConnectGoogleFit = useCallback(() => {
    if (!currentUser) return;
    initiateGoogleFitConnect(currentUser.uid);
  }, [currentUser]);

  const handleSyncGoogleFit = useCallback(async () => {
    if (!currentUser) return;
    setIsSyncingGoogleFit(true);
    try {
      const idToken = await currentUser.getIdToken();
      await syncGoogleFitNow(idToken);
      await updateUserProfile({});
      await queryClient.invalidateQueries({ queryKey: ["dailyActivityLogs"] });
      toast.success("Sync complete!");
    } catch {
      toast.error("Sync failed. Check the Network tab and try again.");
    } finally {
      setIsSyncingGoogleFit(false);
    }
  }, [currentUser, updateUserProfile, queryClient]);

  const avatar = userProfile?.photoURL ?? currentUser?.photoURL ?? null;

  return (
    <div className="overhaul dark min-h-screen">
      <Dashboard
        onNavigate={onNav}
        userAvatarUrl={avatar}
        todaySteps={summary.todaySteps}
        stepsGoal={STEPS_GOAL}
        todayCalories={summary.todayCalories}
        caloriesGoal={CALORIES_GOAL}
        todayDistanceMeters={summary.todayDistanceMeters}
        distanceGoalMeters={DISTANCE_GOAL_METERS}
        weeklyBarPercentages={summary.weeklyBarPercentages}
        weeklyStepCounts={summary.weeklyStepCounts}
        weeklyDistanceMeters={summary.weeklyDistanceMeters}
        highlightDayIndex={summary.highlightDayIndex}
        googleFitConnected={Boolean(userProfile?.googleFitConnected)}
        onConnectGoogleFit={handleConnectGoogleFit}
        onSyncGoogleFit={handleSyncGoogleFit}
        isSyncingGoogleFit={isSyncingGoogleFit}
      />
    </div>
  );
}

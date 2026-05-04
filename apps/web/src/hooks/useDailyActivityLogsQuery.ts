import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserDailyActivity } from "@/lib/firestoreService";
import type { DailyActivityLog } from "@fitspark/shared";

function toYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function useDailyActivityLogsQuery(userId: string | undefined) {
  const range = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    return { startDate: toYMD(start), endDate: toYMD(end) };
  }, []);

  return useQuery({
    queryKey: ["dailyActivityLogs", userId, range.startDate, range.endDate],
    queryFn: () => getUserDailyActivity(userId!, range.startDate, range.endDate),
    enabled: Boolean(userId),
  });
}

export function summarizeDailyLogs(
  logs: DailyActivityLog[],
  opts: {
    stepsGoal: number;
    caloriesGoal: number;
    distanceGoalMeters: number;
  }
) {
  const byDate = new Map(logs.map((l) => [l.date, l]));
  const end = new Date();
  const dayKeys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    dayKeys.push(toYMD(d));
  }
  const stepsSeries = dayKeys.map((k) => byDate.get(k)?.steps ?? 0);
  const distanceSeries = dayKeys.map((k) => byDate.get(k)?.distanceMeters ?? 0);
  const maxSteps = Math.max(1, ...stepsSeries);
  const weeklyBarPercentages = stepsSeries.map((s) =>
    Math.round((s / maxSteps) * 100)
  );
  const todayKey = toYMD(new Date());
  const today = byDate.get(todayKey);
  const todaySteps = today?.steps ?? 0;
  const todayCalories = Math.round(today?.calories ?? 0);
  const todayDistanceMeters = Math.round(today?.distanceMeters ?? 0);
  const stepsProgress = Math.min(1, todaySteps / opts.stepsGoal);
  const caloriesProgress = Math.min(1, todayCalories / opts.caloriesGoal);
  const distanceProgress = Math.min(
    1,
    todayDistanceMeters / Math.max(1, opts.distanceGoalMeters)
  );
  const peakIdx = stepsSeries.indexOf(Math.max(...stepsSeries));
  return {
    todaySteps,
    todayCalories,
    todayDistanceMeters,
    weeklyBarPercentages,
    weeklyStepCounts: stepsSeries,
    weeklyDistanceMeters: distanceSeries,
    stepsProgress,
    caloriesProgress,
    distanceProgress,
    highlightDayIndex: peakIdx >= 0 ? peakIdx : 0,
  };
}

import { useQuery } from "@tanstack/react-query";
import { getMonthlyLeaderboard } from "@/lib/firestoreService";
import type { MonthlyLeaderboard } from "@fitspark/shared";

function normalizeLastUpdated(
  doc: NonNullable<Awaited<ReturnType<typeof getMonthlyLeaderboard>>>
): MonthlyLeaderboard {
  const raw = doc.lastUpdated as unknown;
  const lastUpdated =
    raw && typeof (raw as { toDate?: () => Date }).toDate === "function"
      ? (raw as { toDate: () => Date }).toDate()
      : raw instanceof Date
        ? raw
        : new Date();
  return { ...doc, lastUpdated };
}

export function useMonthlyLeaderboardQuery(
  month: string,
  year: number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["monthlyLeaderboard", year, month],
    queryFn: async () => {
      const raw = await getMonthlyLeaderboard(month, year);
      return raw ? normalizeLastUpdated(raw) : null;
    },
    enabled: options?.enabled !== false,
  });
}

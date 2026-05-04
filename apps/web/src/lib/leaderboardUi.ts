import type { MonthlyLeaderboard, TeamLeaderboardEntry } from "@fitspark/shared";

export type LeaderboardTeamRow = {
  rank: string;
  name: string;
  members: number;
  points: string;
  isPremium?: boolean;
  isUserTeam?: boolean;
  avatars: string[];
};

export function formatCompactPoints(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.round(n));
}

function avatarUrl(name: string) {
  const q = encodeURIComponent(name || "?");
  return `https://ui-avatars.com/api/?name=${q}&size=128&background=1d2024&color=cafd00`;
}

export function mapLeaderboardToRows(
  lb: MonthlyLeaderboard,
  opts: { userTeamId?: string; metric: "steps" | "calories" }
): LeaderboardTeamRow[] {
  const sorted = [...lb.teams].sort((a, b) =>
    opts.metric === "calories"
      ? b.totalCalories - a.totalCalories
      : b.totalSteps - a.totalSteps
  );
  return sorted.map((t: TeamLeaderboardEntry, i) => {
    const score =
      opts.metric === "calories" ? t.totalCalories : t.totalSteps;
    const avatars = (t.members ?? [])
      .slice(0, 3)
      .map((m) => avatarUrl(m.displayName));
    while (avatars.length < 2) {
      avatars.push(avatarUrl("Member"));
    }
    return {
      rank: String(i + 1).padStart(2, "0"),
      name: t.teamName,
      members: t.memberCount,
      points: formatCompactPoints(score),
      isUserTeam: Boolean(opts.userTeamId && t.teamId === opts.userTeamId),
      avatars,
    };
  });
}

export function findUserTeamIndex(
  rows: LeaderboardTeamRow[]
): number {
  return rows.findIndex((r) => r.isUserTeam);
}

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Bell,
  LayoutDashboard,
  Dumbbell,
  User,
  Trophy,
  Briefcase,
} from "lucide-react";
import type { ScreenState } from "@/overhaul/src/types";
import type { LeaderboardTeamRow } from "@/lib/leaderboardUi";
import { mapLeaderboardToRows } from "@/lib/leaderboardUi";
import { useAuth } from "@/contexts/AuthContext";
import { useMonthlyLeaderboardQuery } from "@/hooks/useMonthlyLeaderboardQuery";

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

const DEFAULT_LEADERBOARD_AVATAR =
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=512&auto=format&fit=crop";

function LeaderboardSkeleton() {
  return (
    <div className="space-y-10 animate-pulse" aria-busy aria-label="Loading leaderboard">
      <section className="rounded-3xl p-8 bg-surface-container-low border border-outline-variant/10 h-72" />
      <div className="flex justify-center gap-2">
        <div className="h-10 w-24 rounded-xl bg-surface-container-highest" />
        <div className="h-10 w-24 rounded-xl bg-surface-container-highest" />
      </div>
      <div className="rounded-2xl h-14 bg-surface-container-low border border-outline-variant/10" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-surface-container border border-outline-variant/5"
          />
        ))}
      </div>
    </div>
  );
}

interface LeaderboardProps {
  onNavigate: (screen: ScreenState) => void;
  teams?: LeaderboardTeamRow[];
  heroTrendText?: string | null;
  lastUpdatedText?: string | null;
  monthLabel?: string;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  errorMessage?: string | null;
  metric?: "steps" | "calories";
  onMetricChange?: (m: "steps" | "calories") => void;
}

export default function Leaderboard({
  onNavigate,
  teams: teamsFromProps,
  lastUpdatedText: lastUpdatedProp,
  errorMessage: errorProp,
  metric: metricProp,
}: LeaderboardProps) {
  const { userProfile } = useAuth();
  const [activeFilter, setActiveFilter] = useState<"global" | "regional" | "friends">(
    "global"
  );

  const [period] = useState(() => {
    const n = new Date();
    return {
      month: MONTHS[n.getMonth()] ?? "January",
      year: n.getFullYear(),
    };
  });

  const [internalMetric, setInternalMetric] = useState<"steps" | "calories">(
    "steps"
  );

  const controlled = teamsFromProps !== undefined;

  const metric =
    metricProp !== undefined ? metricProp : internalMetric;

  const {
    data: lb,
    isLoading,
    isFetching,
    isError,
    error,
  } = useMonthlyLeaderboardQuery(period.month, period.year, {
    enabled: !controlled,
  });

  const teamsRowsFromQuery = useMemo(() => {
    if (!lb) return [];
    return mapLeaderboardToRows(lb, {
      userTeamId: userProfile?.teamId,
      metric,
    });
  }, [lb, userProfile?.teamId, metric]);

  const teamsRows = controlled ? teamsFromProps! : teamsRowsFromQuery;

  const lastUpdatedComputed =
    !controlled &&
    lb?.lastUpdated instanceof Date &&
    lb.lastUpdated.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const lastUpdatedText = controlled ? lastUpdatedProp : lastUpdatedComputed;

  const queryError =
    !controlled && isError
      ? error instanceof Error
        ? error.message
        : "Failed to load leaderboard"
      : null;

  const showSkeleton =
    !controlled && ((isLoading && lb === undefined) || (!lb && isFetching));

  const showEmpty =
    !controlled &&
    lb === null &&
    !isFetching &&
    !isLoading &&
    !isError;

  const mergedError = errorProp ?? queryError ?? null;

  const userTeam = teamsRows.find((t) => t.isUserTeam);
  const podiumRows = teamsRows.slice(0, 3);
  const scoreColumnLabel =
    metric === "calories" ? "KCAL (approx)" : "STEPS (approx)";
  const avatarUrl = userProfile?.photoURL ?? DEFAULT_LEADERBOARD_AVATAR;
  const heroName = userTeam?.name ?? "Team Titan";
  const heroRank = userTeam?.rank ?? "--";
  const heroPoints = userTeam?.points ?? 0;

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-32 selection:bg-primary-container selection:text-on-primary-container">
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <Zap className="text-primary-fixed w-6 h-6 fill-primary-fixed" />
          <h1 className="font-headline font-black tracking-tighter uppercase text-2xl italic text-primary-fixed">
            FIT&LIT
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container"
          >
            <Bell className="w-5 h-5" />
          </button>
          <img
            src={avatarUrl}
            alt="Your avatar"
            className="h-10 w-10 rounded-full object-cover border border-outline-variant/10"
          />
        </div>
      </header>

      <main className="pt-28 px-4 pb-32 max-w-5xl mx-auto">
        {mergedError ? (
          <p className="text-sm text-error font-label">{mergedError}</p>
        ) : null}

        {showSkeleton ? (
          <LeaderboardSkeleton />
        ) : (
          <>
            <section className="rounded-[2.5rem] border border-outline-variant/10 bg-surface-container-low shadow-2xl p-6 md:p-8">
              <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary-container/10 px-4 py-2 text-[11px] uppercase font-black tracking-[0.24em] text-primary">
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </div>
                  <div className="max-w-2xl">
                    <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant font-bold">
                      Your team status
                    </p>
                    <h2 className="mt-3 text-4xl font-headline font-black tracking-tight text-on-surface">
                      {heroName}
                    </h2>
                    <p className="mt-3 text-sm text-on-surface-variant max-w-xl">
                      {userTeam
                        ? "Your team is currently competing for the top spot in the monthly leaderboard. Keep the streak going."
                        : "Join a team to start earning leaderboard points and unlock team rewards."}
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-outline-variant/10 bg-background p-5 shadow-lg">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant font-black">
                    Current rank
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary text-4xl font-black">
                      {heroRank}
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-on-surface-variant font-bold">
                        Score
                      </p>
                      <p className="mt-2 text-3xl font-black text-on-surface">
                        {heroPoints}
                      </p>
                      <p className="text-xs uppercase tracking-[0.24em] text-on-surface-variant font-bold">
                        {scoreColumnLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                  {(["global", "regional", "friends"] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-2xl px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] transition ${
                        activeFilter === filter
                          ? "bg-primary text-on-primary-fixed shadow-lg"
                          : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(["steps", "calories"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setInternalMetric(option)}
                      className={`rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-[0.24em] transition ${
                        metric === option
                          ? "bg-kinetic-gradient text-on-primary-fixed shadow-lg"
                          : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <div className="grid gap-4 mt-6 md:grid-cols-3">
              {podiumRows.map((team, idx) => (
                <div
                  key={team.rank}
                  className={`rounded-[2rem] border border-outline-variant/10 bg-surface-container-low p-5 shadow-lg ${
                    idx === 1 ? "md:col-span-1" : ""
                  } ${team.isUserTeam ? "border-primary-container/70 ring-1 ring-primary-container/20" : ""}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant font-black">
                        {team.rank === "01" ? "Leader" : `#${team.rank}`}
                      </p>
                      <h3 className="mt-3 text-xl font-headline font-black tracking-tight text-on-surface">
                        {team.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-on-surface-variant uppercase tracking-[0.2em] font-bold">
                        {scoreColumnLabel}
                      </p>
                      <p className="mt-2 text-2xl font-black text-on-surface">
                        {team.points}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {team.avatars.slice(0, 4).map((avatar, index) => (
                      <img
                        key={index}
                        src={avatar}
                        alt="Team avatar"
                        className="h-10 w-10 rounded-full border border-background object-cover"
                      />
                    ))}
                    {team.members > (team.avatars?.length ?? 0) ? (
                      <span className="text-xs uppercase tracking-[0.3em] text-on-surface-variant font-bold">
                        +{team.members - (team.avatars?.length ?? 0)}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-outline-variant/10 bg-surface-container-low p-4 shadow-lg mt-6">
              <div className="hidden md:grid grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr] gap-4 px-2 py-3 text-xs uppercase tracking-[0.24em] text-on-surface-variant font-black">
                <span>Team</span>
                <span className="text-right">Members</span>
                <span className="text-right">Score</span>
                <span className="text-right">Rank</span>
              </div>
              <div className="space-y-3">
                {showEmpty || teamsRows.length === 0 ? (
                  <div className="py-12 text-center text-sm text-on-surface-variant">
                    No leaderboard data available yet.
                  </div>
                ) : (
                  teamsRows.slice(0, 10).map((team) => (
                    <div
                      key={team.rank}
                      className={`grid gap-4 rounded-3xl border border-outline-variant/10 bg-background p-4 text-sm ${
                        team.isUserTeam ? "border-primary-container/60 bg-primary-container/5" : ""
                      } md:grid-cols-[1.5fr_0.8fr_0.8fr_0.6fr] md:items-center`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {team.avatars.slice(0, 3).map((avatar, index) => (
                            <img
                              key={index}
                              src={avatar}
                              alt="Team avatar"
                              className="h-8 w-8 rounded-full border border-background object-cover"
                            />
                          ))}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface">{team.name}</p>
                          <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
                            {team.members} members
                          </p>
                        </div>
                      </div>
                      <p className="text-right font-semibold text-on-surface">{team.members}</p>
                      <p className="text-right font-bold text-on-surface">{team.points}</p>
                      <p className="text-right font-black text-primary">{team.rank}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {lastUpdatedText ? (
              <p className="mt-4 text-center text-sm text-on-surface-variant">
                Last updated: {lastUpdatedText}
              </p>
            ) : null}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 w-full pb-8 pt-4 px-6 z-50 bg-background/80 backdrop-blur-xl border-t border-outline-variant/10 shadow-[0_-20px_40px_rgba(0,0,0,0.6)] rounded-t-[3rem] flex justify-around items-end">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <LayoutDashboard className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">
            Dashboard
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("workouts")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <Dumbbell className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">
            Workouts
          </span>
        </button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate("social")}
          className="flex flex-col items-center justify-center bg-kinetic-gradient text-on-primary-fixed rounded-full h-14 w-14 -translate-y-4 shadow-xl shadow-primary/20"
        >
          <Trophy className="w-6 h-6 fill-current" />
        </motion.button>

        <button
          type="button"
          onClick={() => onNavigate("corporate")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <Briefcase className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">
            Work
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <User className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">
            Profile
          </span>
        </button>
      </nav>
    </div>
  );
}

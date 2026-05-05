import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TeamLeaderboardEntry } from "@fitspark/shared";
import {
  Zap,
  Bell,
  TrendingUp,
  Award,
  LayoutDashboard,
  Dumbbell,
  User,
  Medal,
  Trophy,
  Briefcase,
  ChevronDown,
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

function sortLbTeams(
  teams: TeamLeaderboardEntry[],
  metric: "steps" | "calories"
): TeamLeaderboardEntry[] {
  return [...teams].sort((a, b) =>
    metric === "calories"
      ? b.totalCalories - a.totalCalories
      : b.totalSteps - a.totalSteps
  );
}

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
  heroTrendText = null,
  lastUpdatedText: lastUpdatedProp,
  monthLabel: monthLabelProp,
  onPrevMonth: onPrevMonthProp,
  onNextMonth: onNextMonthProp,
  errorMessage: errorProp,
  metric: metricProp,
  onMetricChange: onMetricChangeProp,
}: LeaderboardProps) {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "annual">(
    "monthly"
  );

  const [period, setPeriod] = useState(() => {
    const n = new Date();
    return {
      month: MONTHS[n.getMonth()] ?? "January",
      year: n.getFullYear(),
    };
  });

  const [internalMetric, setInternalMetric] = useState<"steps" | "calories">(
    "steps"
  );
  const [expandedRank, setExpandedRank] = useState<string | null>(null);

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
    setExpandedRank(null);
  };

  const onPrevMonth = controlled ? onPrevMonthProp : () => shiftMonth(-1);
  const onNextMonth = controlled ? onNextMonthProp : () => shiftMonth(1);

  const monthLabel = controlled ? monthLabelProp : `${period.month} ${period.year}`;

  const sortedEntries = useMemo(() => {
    if (!lb?.teams?.length) return [];
    return sortLbTeams(lb.teams, metric);
  }, [lb, metric]);

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

  const toggleExpand = (rank: string) => {
    setExpandedRank((prev) => (prev === rank ? null : rank));
  };

  const expandedEntry = useMemo(() => {
    if (!expandedRank || sortedEntries.length === 0) return null;
    const idx = Number.parseInt(expandedRank, 10) - 1;
    if (idx >= 0 && idx < sortedEntries.length) return sortedEntries[idx]!;
    return sortedEntries.find(
      (_t, i) => String(i + 1).padStart(2, "0") === expandedRank
    ) ?? null;
  }, [expandedRank, sortedEntries]);

  const userTeam = teamsRows.find((t) => t.isUserTeam);
  const heroRank = userTeam?.rank ?? "—";
  const heroName = userTeam?.name ?? "Join a team to compete";
  const heroPoints = userTeam?.points ?? "—";
  const scoreColumnLabel =
    metric === "calories" ? "KCAL (approx)" : "STEPS (approx)";

  const metricToggle =
    controlled && onMetricChangeProp ? (
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => onMetricChangeProp("steps")}
          className={`px-4 py-2 rounded-xl font-headline text-[10px] font-black uppercase tracking-widest transition-all ${
            metric === "steps"
              ? "bg-kinetic-gradient text-on-primary-fixed shadow-lg"
              : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Steps
        </button>
        <button
          type="button"
          onClick={() => onMetricChangeProp("calories")}
          className={`px-4 py-2 rounded-xl font-headline text-[10px] font-black uppercase tracking-widest transition-all ${
            metric === "calories"
              ? "bg-kinetic-gradient text-on-primary-fixed shadow-lg"
              : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Calories
        </button>
      </div>
    ) : !controlled ? (
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={() => setInternalMetric("steps")}
          className={`px-4 py-2 rounded-xl font-headline text-[10px] font-black uppercase tracking-widest transition-all ${
            metric === "steps"
              ? "bg-kinetic-gradient text-on-primary-fixed shadow-lg"
              : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Steps
        </button>
        <button
          type="button"
          onClick={() => setInternalMetric("calories")}
          className={`px-4 py-2 rounded-xl font-headline text-[10px] font-black uppercase tracking-widest transition-all ${
            metric === "calories"
              ? "bg-kinetic-gradient text-on-primary-fixed shadow-lg"
              : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Calories
        </button>
      </div>
    ) : null;

  const monthNavSlot =
    monthLabel && (onPrevMonth || onNextMonth) ? (
      <div className="flex items-center gap-3 w-full justify-center">
        <button
          type="button"
          onClick={onPrevMonth}
          className="px-3 py-2 rounded-xl bg-surface-container-highest text-primary hover:bg-surface-bright transition-colors disabled:opacity-40"
          disabled={!onPrevMonth}
        >
          ‹
        </button>
        <span className="text-on-surface font-bold tracking-normal normal-case text-sm">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          className="px-3 py-2 rounded-xl bg-surface-container-highest text-primary hover:bg-surface-bright transition-colors disabled:opacity-40"
          disabled={!onNextMonth}
        >
          ›
        </button>
      </div>
    ) : null;

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
        </div>
      </header>

      <main className="pt-28 px-6 max-w-2xl mx-auto space-y-10">
        {mergedError ? (
          <p className="text-sm text-error font-label">{mergedError}</p>
        ) : null}

        {showSkeleton ? (
          <LeaderboardSkeleton />
        ) : (
          <>
            <section className="relative overflow-hidden rounded-3xl p-8 bg-surface-container-low shadow-2xl border border-outline-variant/10 group">
              <div className="absolute -right-10 -top-10 opacity-5 transition-transform duration-700 group-hover:scale-110">
                <span className="font-headline font-black text-[12rem] italic tracking-tighter leading-none select-none">
                  #{heroRank}
                </span>
              </div>
              <div className="relative z-10">
                <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant font-bold">
                  Current Team Standing
                </span>
                <div className="mt-4 flex items-end gap-4">
                  <h2 className="font-headline text-7xl font-black italic text-primary-fixed leading-none">
                    Rank {heroRank}
                  </h2>
                  {heroTrendText ? (
                    <div className="pb-1 flex items-center gap-1">
                      <TrendingUp className="text-primary-fixed w-5 h-5" />
                      <span className="font-label text-sm text-primary-fixed font-bold">
                        {heroTrendText}
                      </span>
                    </div>
                  ) : null}
                </div>
                <p className="font-headline text-2xl mt-2 text-on-surface font-bold">
                  {heroName}
                </p>
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-black">
                      Team score ({metric})
                    </span>
                    <span className="font-headline text-3xl font-black text-on-surface">
                      {heroPoints}{" "}
                      <span className="text-sm font-normal text-on-surface-variant italic">
                        {scoreColumnLabel}
                      </span>
                    </span>
                  </div>
                  <div className="flex -space-x-3">
                    {userTeam?.avatars.map((url, i) => (
                      <img
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-surface-container-low object-cover shadow-lg"
                        src={url}
                        alt="Member"
                      />
                    ))}
                    {userTeam ? (
                      <div className="w-10 h-10 rounded-full border-2 border-surface-container-low bg-surface-container-highest flex items-center justify-center text-[10px] font-black text-primary shadow-lg">
                        +
                        {Math.max(
                          0,
                          userTeam.members - (userTeam.avatars?.length ?? 0)
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>

            {(monthLabel && (onPrevMonth || onNextMonth)) ||
            lastUpdatedText ? (
              <div className="flex flex-col gap-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                <div className="flex items-center justify-between gap-4">
                  {monthNavSlot}
                </div>
                {lastUpdatedText ? (
                  <p className="text-center text-on-surface-variant/80 normal-case tracking-normal">
                    Last updated: {lastUpdatedText}
                  </p>
                ) : null}
              </div>
            ) : null}

            {metricToggle}

            <div className="flex space-x-2 p-1.5 bg-surface-container-low rounded-2xl shadow-inner border border-outline-variant/10">
              {(["weekly", "monthly", "annual"] as const).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 rounded-xl font-headline text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? "bg-kinetic-gradient text-on-primary-fixed shadow-lg"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {showEmpty ? (
                <p className="text-center text-on-surface-variant font-body text-sm py-12">
                  No data for this month yet
                </p>
              ) : teamsRows.length === 0 ? (
                <p className="text-center text-on-surface-variant font-body text-sm py-12">
                  No data for this month yet
                </p>
              ) : (
                <AnimatePresence mode="popLayout">
                  {teamsRows.map((team, idx) => {
                  const expanded = expandedRank === team.rank;
                  const sortedEntryForRow =
                    sortedEntries[idx] ??
                    sortedEntries.find((e) => e.teamName === team.name);

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={`${team.rank}-${team.name}`}
                      className={`rounded-2xl transition-all shadow-lg border border-outline-variant/5 overflow-hidden ${
                        team.isUserTeam
                          ? "bg-primary-container/10 border-primary-container/50 ring-1 ring-primary-container/20"
                          : "bg-surface-container hover:bg-surface-container-highest"
                      }`}
                    >
                      <motion.button
                        type="button"
                        layout="position"
                        onClick={() => {
                          if (!controlled && sortedEntryForRow?.members?.length)
                            toggleExpand(team.rank);
                        }}
                        disabled={
                          controlled ||
                          !sortedEntryForRow?.members?.length ||
                          sortedEntryForRow.members.length === 0
                        }
                        className="flex items-center gap-4 p-5 w-full text-left cursor-pointer disabled:cursor-default"
                      >
                        <div className="w-12 flex flex-col items-center">
                          <span
                            className={`font-headline text-2xl font-black italic ${
                              team.rank === "01" || team.isUserTeam
                                ? "text-primary"
                                : "text-on-surface-variant"
                            }`}
                          >
                            {team.rank}
                          </span>
                          {team.rank === "01" && (
                            <Medal className="text-primary w-4 h-4 mt-0.5" />
                          )}
                          {team.isUserTeam && team.rank !== "01" && (
                            <Award className="text-primary w-4 h-4 mt-0.5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`font-headline font-bold text-lg ${
                                team.isUserTeam ? "text-primary" : "text-on-surface"
                              }`}
                            >
                              {team.name}
                            </h3>
                            {!controlled &&
                            (sortedEntryForRow?.members?.length ?? 0) > 0 ? (
                              <ChevronDown
                                className={`w-5 h-5 shrink-0 text-on-surface-variant transition-transform ${expanded ? "rotate-180" : ""}`}
                              />
                            ) : null}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex -space-x-2">
                              {team.avatars.map((url, i) => (
                                <img
                                  key={i}
                                  className="w-6 h-6 rounded-full object-cover border border-background shadow-xs"
                                  src={url}
                                  alt="Avatar"
                                />
                              ))}
                            </div>
                            <span className="font-label text-[10px] text-on-surface-variant font-black uppercase tracking-tighter">
                              {team.members} members
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-headline font-black block tracking-tighter ${
                              team.isUserTeam ? "text-primary" : "text-on-surface"
                            }`}
                          >
                            {team.points}
                          </span>
                          <p className="font-label text-[10px] uppercase text-on-surface-variant tracking-tighter font-bold">
                            {scoreColumnLabel}
                          </p>
                        </div>
                      </motion.button>

                      {!controlled &&
                      expanded &&
                      expandedRank === team.rank &&
                      (expandedEntry?.members?.length ?? 0) > 0 ? (
                        <AnimatePresence mode="sync">
                          <motion.div
                            key="members"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-outline-variant/10 overflow-hidden bg-surface-container-low/80"
                          >
                            <div className="px-5 py-4 space-y-3">
                              <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                                Member breakdown
                              </p>
                              <AnimatePresence mode="popLayout">
                                {(expandedEntry?.members ?? []).map((m, mi) => (
                                  <motion.div
                                    key={m.userId}
                                    layout
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ delay: mi * 0.03 }}
                                    className="flex justify-between text-sm font-body"
                                  >
                                    <span className="text-on-surface">
                                      {m.displayName || "Member"}
                                    </span>
                                    <span className="text-on-surface-variant font-mono tabular-nums">
                                      {metric === "calories"
                                        ? `${Math.round(m.calories)} kcal`
                                        : `${Math.round(m.steps)} steps`}
                                    </span>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      ) : null}
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              )}
            </div>
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

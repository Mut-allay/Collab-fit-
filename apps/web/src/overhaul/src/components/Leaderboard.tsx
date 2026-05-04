import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import type { ScreenState } from "@/src/types";
import type { LeaderboardTeamRow } from "@/lib/leaderboardUi";

const DEFAULT_TEAMS: LeaderboardTeamRow[] = [
  {
    rank: "01",
    name: "Neon Sprinters",
    members: 12,
    points: "154.2K",
    isPremium: true,
    avatars: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
    ],
  },
  {
    rank: "02",
    name: "Iron Titans",
    members: 8,
    points: "148.9K",
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100&auto=format&fit=crop",
    ],
  },
  {
    rank: "03",
    name: "Pulse Chasers",
    members: 15,
    points: "132.5K",
    avatars: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
    ],
  },
  {
    rank: "04",
    name: "Alpha Wolves Elite",
    members: 11,
    points: "128.4K",
    isUserTeam: true,
    avatars: [
      "https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=100&auto=format&fit=crop",
    ],
  },
  {
    rank: "05",
    name: "Velocity Squad",
    members: 10,
    points: "119.1K",
    avatars: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=100&auto=format&fit=crop",
    ],
  },
  {
    rank: "06",
    name: "Midnight Runners",
    members: 14,
    points: "112.7K",
    avatars: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    ],
  },
];

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
  heroTrendText = "+2 Spots",
  lastUpdatedText,
  monthLabel,
  onPrevMonth,
  onNextMonth,
  errorMessage,
  metric = "steps",
  onMetricChange,
}: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "annual">(
    "monthly"
  );
  const teams = teamsFromProps ?? DEFAULT_TEAMS;
  const userTeam = teams.find((t) => t.isUserTeam);
  const heroRank = userTeam?.rank ?? "—";
  const heroName = userTeam?.name ?? "Join a team to compete";
  const heroPoints = userTeam?.points ?? "—";
  const scoreColumnLabel =
    metric === "calories" ? "KCAL (approx)" : "STEPS (approx)";

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
        {errorMessage ? (
          <p className="text-sm text-error font-label">{errorMessage}</p>
        ) : null}

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
                    +{Math.max(0, userTeam.members - (userTeam.avatars?.length ?? 0))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {(monthLabel && (onPrevMonth || onNextMonth)) || lastUpdatedText ? (
          <div className="flex flex-col gap-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
            <div className="flex items-center justify-between gap-4">
              {monthLabel && (onPrevMonth || onNextMonth) ? (
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
              ) : null}
            </div>
            {lastUpdatedText ? (
              <p className="text-center text-on-surface-variant/80 normal-case tracking-normal">
                Last updated: {lastUpdatedText}
              </p>
            ) : null}
          </div>
        ) : null}

        {onMetricChange ? (
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => onMetricChange("steps")}
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
              onClick={() => onMetricChange("calories")}
              className={`px-4 py-2 rounded-xl font-headline text-[10px] font-black uppercase tracking-widest transition-all ${
                metric === "calories"
                  ? "bg-kinetic-gradient text-on-primary-fixed shadow-lg"
                  : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Calories
            </button>
          </div>
        ) : null}

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
          {teams.length === 0 ? (
            <p className="text-center text-on-surface-variant font-body text-sm py-12">
              No leaderboard data for this month yet. Sync activity and run the
              nightly aggregation job.
            </p>
          ) : (
            <AnimatePresence mode="popLayout">
              {teams.map((team, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={team.name}
                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all shadow-lg border border-outline-variant/5 ${
                    team.isUserTeam
                      ? "bg-primary-container/10 border-primary-container/50 ring-1 ring-primary-container/20"
                      : "bg-surface-container hover:bg-surface-container-highest"
                  }`}
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
                    <h3
                      className={`font-headline font-bold text-lg ${
                        team.isUserTeam ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {team.name}
                    </h3>
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
                        {team.members} Active Members
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
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
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

import { motion } from "framer-motion";
import {
  Zap,
  Bell,
  Trophy,
  Clock,
  Briefcase,
  Loader2,
  Link2,
  RefreshCw,
  Footprints,
  Flame,
  Route,
} from "lucide-react";
import type { ScreenState } from "@/overhaul/src/types";
import { ActivityRingGroup } from "@/overhaul/src/components/ui/ActivityRing";

interface DashboardProps {
  onNavigate: (screen: ScreenState) => void;
  userAvatarUrl?: string | null;
  todaySteps?: number;
  stepsGoal?: number;
  todayCalories?: number;
  caloriesGoal?: number;
  todayDistanceMeters?: number;
  distanceGoalMeters?: number;
  weeklyBarPercentages?: number[];
  weeklyStepCounts?: number[];
  weeklyDistanceMeters?: number[];
  highlightDayIndex?: number;
  googleFitConnected?: boolean;
  onConnectGoogleFit?: () => void;
  onSyncGoogleFit?: () => void | Promise<void>;
  isSyncingGoogleFit?: boolean;
  teamLeaderboardName?: string | null;
  teamLeaderboardRank?: string | null;
  teamLeaderboardPoints?: string | null;
}

const DEFAULT_WEEKLY = [40, 65, 90, 55, 75, 30, 45];
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=2574&auto=format&fit=crop";

export default function Dashboard({
  onNavigate,
  userAvatarUrl,
  todaySteps = 8421,
  stepsGoal = 10_000,
  todayCalories = 450,
  caloriesGoal = 600,
  todayDistanceMeters = 0,
  distanceGoalMeters = 8000,
  weeklyBarPercentages,
  weeklyStepCounts,
  weeklyDistanceMeters,
  highlightDayIndex = 2,
  googleFitConnected = false,
  onConnectGoogleFit,
  onSyncGoogleFit,
  isSyncingGoogleFit = false,
  teamLeaderboardName,
  teamLeaderboardRank,
  teamLeaderboardPoints,
}: DashboardProps) {
  const weeklyData = weeklyBarPercentages ?? DEFAULT_WEEKLY;
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const stepsRatio = Math.min(1, todaySteps / Math.max(1, stepsGoal));
  const calRatio = Math.min(1, todayCalories / Math.max(1, caloriesGoal));
  const distRatio = Math.min(
    1,
    todayDistanceMeters / Math.max(1, distanceGoalMeters)
  );
  const distKm = todayDistanceMeters / 1000;
  const distGoalKm = distanceGoalMeters / 1000;

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-32 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <Zap className="text-primary-fixed w-6 h-6 fill-current" />
          <h1 className="font-headline font-black tracking-tighter uppercase text-2xl italic text-primary-fixed tracking-widest">
            FIT&LIT
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
            <img 
              className="w-full h-full object-cover" 
              src={userAvatarUrl || DEFAULT_AVATAR}
              alt="Profile"
            />
          </div>
        </div>
      </header>

      <main className="pt-28 px-6 max-w-5xl mx-auto space-y-12">
        {/* Daily Activity Rings — compact, single-screen, Apple Fitness style */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-low rounded-3xl p-6 shadow-lg border border-outline-variant/10 flex items-center gap-6"
        >
          <div className="relative flex items-center justify-center shrink-0 w-44 h-44">
            <ActivityRingGroup
              size={176}
              strokeWidth={13}
              gap={5}
              rings={[
                { ratio: stepsRatio, colorClassName: "text-primary-container" },
                { ratio: calRatio, colorClassName: "text-error" },
                { ratio: distRatio, colorClassName: "text-secondary" },
              ]}
            />
            <div className="absolute text-center">
              <span className="block font-headline text-3xl font-black">
                {Math.round(((stepsRatio + calRatio + distRatio) / 3) * 100)}%
              </span>
              <span className="block font-label text-[10px] text-on-surface-variant mt-0.5 uppercase tracking-widest">
                Today
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex items-center gap-3">
              <Footprints className="w-4 h-4 text-primary-container shrink-0" />
              <span className="font-headline font-bold text-lg leading-none">
                {todaySteps.toLocaleString()}
              </span>
              <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                / {stepsGoal.toLocaleString()} steps
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Flame className="w-4 h-4 text-error shrink-0" />
              <span className="font-headline font-bold text-lg leading-none">
                {todayCalories.toLocaleString()}
              </span>
              <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                / {caloriesGoal.toLocaleString()} kcal
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Route className="w-4 h-4 text-secondary shrink-0" />
              <span className="font-headline font-bold text-lg leading-none">
                {distKm.toFixed(1)}
              </span>
              <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">
                / {distGoalKm.toFixed(1)} km
              </span>
            </div>
          </div>
        </motion.section>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured Workout */}
          <div className="md:col-span-2 relative h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl group border border-outline-variant/10">
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
              alt="Workout"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-0 p-8 w-full space-y-4">
              <span className="inline-block bg-error text-on-error font-label text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Upcoming Session
              </span>
              <h2 className="font-headline text-5xl font-black italic uppercase leading-[0.9]">Full Body HIIT</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-on-surface-variant font-label text-xs uppercase tracking-widest">
                  <Clock className="w-4 h-4" />
                  45 min
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant font-label text-xs uppercase tracking-widest">
                  <Zap className="w-4 h-4" />
                  Hard
                </div>
              </div>
              <button 
                onClick={() => onNavigate("active-workout")}
                className="bg-kinetic-gradient text-on-primary-fixed px-10 py-4 rounded-xl font-headline font-bold text-lg uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                Start Now
              </button>
            </div>
          </div>

          {/* Right Column Stack */}
          <div className="flex flex-col gap-6">
            {/* Google Fit */}
            <div className="bg-surface-container-low rounded-3xl p-6 shadow-lg border border-outline-variant/10 space-y-4">
              <div className="flex justify-between items-start">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Data pipeline
                </span>
                <Link2 className="text-primary-container w-5 h-5" />
              </div>
              <h3 className="font-headline text-xl font-bold">Google Fit</h3>
              <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                {googleFitConnected
                  ? "Connected — sync pulls the last 7 days from Google and writes dailyActivityLogs."
                  : "Connect to authorize Google Fit; your Render backend stores tokens and syncs buckets into Firestore."}
              </p>
              <div className="flex flex-col gap-2">
                {!googleFitConnected ? (
                  <button
                    type="button"
                    onClick={() => onConnectGoogleFit?.()}
                    className="w-full bg-kinetic-gradient text-on-primary-fixed font-label font-bold py-3 rounded-xl uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all"
                  >
                    Connect Google Fit
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSyncingGoogleFit}
                    onClick={() => void onSyncGoogleFit?.()}
                    className="w-full inline-flex items-center justify-center gap-2 bg-surface-container-highest text-primary font-label font-bold py-3 rounded-xl uppercase text-[10px] tracking-widest hover:bg-surface-bright transition-colors disabled:opacity-60"
                  >
                    {isSyncingGoogleFit ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                        Syncing…
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 shrink-0" />
                        Sync now
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Team leaderboard card */}
            <div className="bg-surface-container rounded-3xl p-6 shadow-lg border border-outline-variant/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Your Team
                  </span>
                  <h3 className="font-headline text-2xl font-black mt-2">Leaderboard</h3>
                </div>
                <div className="text-right">
                  <p className="font-headline text-4xl font-black text-primary-fixed">
                    {teamLeaderboardRank ? teamLeaderboardRank.replace(/^0+/, "") : "—"}
                  </p>
                  <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Team rank
                  </span>
                </div>
              </div>
              <div className="mt-6 border-t border-outline-variant/10 pt-5">
                <p className="text-on-surface-variant text-sm">
                  {teamLeaderboardName ?? "No team joined yet"}
                </p>
                <p className="font-headline text-3xl font-black mt-3">
                  {teamLeaderboardPoints ?? "—"}
                  <span className="text-sm font-semibold text-on-surface-variant ml-2">pts</span>
                </p>
              </div>
            </div>

            {/* Team Status Card */}
            <div className="bg-surface-container rounded-3xl p-6 flex-grow flex flex-col justify-between border-l-4 border-secondary shadow-lg">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Community</span>
                  <Trophy className="text-secondary w-5 h-5" />
                </div>
                <h3 className="font-headline text-2xl font-bold">Team Status</h3>
                <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                  Your team is in <span className="text-secondary font-bold">3rd place!</span> Keep pushing to hit the podium this week.
                </p>
              </div>
              <button 
                onClick={() => onNavigate("leaderboard")}
                className="w-full mt-6 bg-surface-container-highest text-primary font-label font-bold py-3 rounded-xl uppercase text-[10px] tracking-widest hover:bg-surface-bright transition-colors"
              >
                View Leaderboard
              </button>
            </div>

            {/* Corporate Hub Access */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => onNavigate("corporate")}
              className="bg-surface-container rounded-3xl p-6 shadow-xl border border-outline-variant/10 cursor-pointer group mb-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary-container/20 p-3 rounded-2xl">
                  <Briefcase className="text-primary-container w-6 h-6" />
                </div>
                <div className="bg-surface-container-highest text-[8px] font-black uppercase px-2 py-1 rounded-full text-on-surface-variant group-hover:text-primary-container transition-colors">
                  TechCorp HUB
                </div>
              </div>
              <h3 className="font-headline font-black text-xl uppercase italic">Corporate Arena</h3>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">
                Colleague Battle • Rank #01
              </p>
            </motion.div>
          </div>
        </div>

        {/* Weekly Progress Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-headline text-3xl font-black italic uppercase tracking-tight">Weekly Burn</h3>
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.3em] font-bold">Last 7 Days</span>
          </div>
          <div className="bg-surface-container rounded-3xl p-8 grid grid-cols-7 items-end gap-3 h-48 shadow-lg border border-outline-variant/10">
            {weeklyData.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className={`w-full rounded-full relative group cursor-pointer`}
                >
                  <div className={`absolute inset-0 w-full rounded-full ${idx === highlightDayIndex ? 'bg-kinetic-gradient' : 'bg-primary-container/20 hover:bg-primary-container/40'} transition-colors`} />
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background px-2 py-1 rounded text-[8px] font-bold whitespace-nowrap max-w-[120px] text-center leading-tight">
                    {(weeklyStepCounts?.[idx] ?? Math.round((val / 100) * 12_000)).toLocaleString()}{" "}
                    steps
                    {Array.isArray(weeklyDistanceMeters) ? (
                      <>
                        <br />
                        {((weeklyDistanceMeters[idx] ?? 0) / 1000).toFixed(1)} km
                      </>
                    ) : null}
                  </div>
                </motion.div>
                <span className={`font-label text-[10px] ${idx === highlightDayIndex ? 'text-primary font-black' : 'text-on-surface-variant'} transition-colors`}>
                  {days[idx]}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

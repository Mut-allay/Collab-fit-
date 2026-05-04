import { motion } from "framer-motion";
import {
  Zap,
  Bell,
  LayoutDashboard,
  Dumbbell,
  Trophy,
  User,
  Scale,
  Award,
  Clock,
  MapPin,
  Briefcase,
  Loader2,
  Link2,
  RefreshCw,
} from "lucide-react";
import type { ScreenState } from "@/src/types";

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
}: DashboardProps) {
  const weeklyData = weeklyBarPercentages ?? DEFAULT_WEEKLY;
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const stepsRatio = Math.min(1, todaySteps / Math.max(1, stepsGoal));
  const calRatio = Math.min(1, todayCalories / Math.max(1, caloriesGoal));
  const distRatio = Math.min(
    1,
    todayDistanceMeters / Math.max(1, distanceGoalMeters)
  );
  const ring = 553;
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
        {/* Daily Activity Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Steps Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-low rounded-3xl p-8 relative overflow-hidden group shadow-lg border border-outline-variant/10"
          >
            <div className="absolute -right-4 -bottom-8 opacity-5">
              <span className="font-headline text-[12rem] font-black leading-none italic">01</span>
            </div>
            <div className="relative z-10 space-y-4">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Daily Activity</span>
              <h3 className="font-headline text-3xl font-bold">Steps Tracked</h3>
              <div className="relative flex items-center justify-center w-48 h-48 mt-4 mx-auto lg:mx-0">
                <svg className="absolute w-full h-full -rotate-90">
                  <circle className="text-surface-container-lowest" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12" />
                  <circle 
                    className="text-primary-container" 
                    cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" 
                    strokeWidth="12" 
                    strokeDasharray={ring} 
                    strokeDashoffset={ring - ring * stepsRatio} 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center">
                  <span className="block font-headline text-4xl font-black">{todaySteps.toLocaleString()}</span>
                  <span className="block font-label text-xs text-on-surface-variant mt-1">/ {stepsGoal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Calories Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-container-low rounded-3xl p-8 relative overflow-hidden group shadow-lg border border-outline-variant/10"
          >
            <div className="absolute -right-4 -bottom-8 opacity-5">
              <span className="font-headline text-[12rem] font-black leading-none italic">02</span>
            </div>
            <div className="relative z-10 space-y-4">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Metabolic Load</span>
              <h3 className="font-headline text-3xl font-bold">Calories Burned</h3>
              <div className="relative flex items-center justify-center w-48 h-48 mt-4 mx-auto lg:mx-0">
                <svg className="absolute w-full h-full -rotate-90">
                  <circle className="text-surface-container-lowest" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12" />
                  <circle 
                    className="text-error" 
                    cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" 
                    strokeWidth="12" 
                    strokeDasharray={ring} 
                    strokeDashoffset={ring - ring * calRatio} 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center">
                  <span className="block font-headline text-4xl font-black">{todayCalories.toLocaleString()}</span>
                  <span className="block font-label text-xs text-on-surface-variant mt-1">/ {caloriesGoal.toLocaleString()} KCAL</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Distance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-surface-container-low rounded-3xl p-8 relative overflow-hidden group shadow-lg border border-outline-variant/10"
          >
            <div className="absolute -right-4 -bottom-8 opacity-5">
              <span className="font-headline text-[12rem] font-black leading-none italic">
                03
              </span>
            </div>
            <div className="relative z-10 space-y-4">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                Movement
              </span>
              <h3 className="font-headline text-3xl font-bold">Distance</h3>
              <div className="relative flex items-center justify-center w-48 h-48 mt-4 mx-auto lg:mx-0">
                <svg className="absolute w-full h-full -rotate-90">
                  <circle
                    className="text-surface-container-lowest"
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                  />
                  <circle
                    className="text-secondary"
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={ring}
                    strokeDashoffset={ring - ring * distRatio}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center">
                  <span className="block font-headline text-4xl font-black">
                    {distKm.toFixed(1)}
                  </span>
                  <span className="block font-label text-xs text-on-surface-variant mt-1">
                    / {distGoalKm.toFixed(1)} km
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

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

            {/* Quick Actions */}
            <div className="bg-surface-container-low rounded-3xl p-6 shadow-lg border border-outline-variant/10">
              <h3 className="font-headline text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-4 bg-surface-container rounded-2xl group hover:bg-surface-container-highest transition-all">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Scale className="text-primary-container w-6 h-6" />
                  </div>
                  <span className="font-label text-[10px] uppercase font-bold text-on-surface text-center tracking-tighter">Log Weight</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-surface-container rounded-2xl group hover:bg-surface-container-highest transition-all">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Award className="text-primary-container w-6 h-6" />
                  </div>
                  <span className="font-label text-[10px] uppercase font-bold text-on-surface text-center tracking-tighter">Join Challenge</span>
                </button>
              </div>
            </div>
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full pb-8 pt-4 px-6 z-50 bg-background/80 backdrop-blur-xl border-t border-outline-variant/10 shadow-[0_-20px_40px_rgba(0,0,0,0.6)] rounded-t-[3rem] flex justify-around items-end">
        {/* Dashboard (Active) */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center justify-center bg-kinetic-gradient text-on-primary-fixed rounded-full h-14 w-14 -translate-y-4 shadow-xl shadow-primary/20"
        >
          <LayoutDashboard className="w-6 h-6 fill-current" />
        </motion.button>
        
        {/* Workouts */}
        <button 
          onClick={() => onNavigate("workouts")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <Dumbbell className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Explore</span>
        </button>
        
        {/* Map */}
        <button 
          onClick={() => onNavigate("map")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <MapPin className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Clubs</span>
        </button>
        
        {/* Social */}
        <button 
          onClick={() => onNavigate("social")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <Trophy className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Social</span>
        </button>
        
        {/* Profile */}
        <button
          type="button"
          onClick={() => onNavigate("profile")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <User className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}

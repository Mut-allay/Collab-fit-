import { motion } from "framer-motion";
import {
  Bell,
  QrCode,
  Swords,
  LayoutDashboard,
  Dumbbell,
  Trophy,
  User,
  TrendingUp,
  Briefcase,
  ChevronRight,
  Bike,
  Activity,
} from "lucide-react";
import { ScreenState } from "@/overhaul/src/types";

interface CorporateHubProps {
  onNavigate: (screen: ScreenState) => void;
  key?: string;
}

export default function CorporateHub({ onNavigate }: CorporateHubProps) {
  const employees = [
    {
      rank: "01",
      name: "Marcus Sterling",
      dept: "DevOps Engineering",
      points: "12,850",
      activity: "Powerlifting",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop"
    },
    {
      rank: "02",
      name: "Elena Loft",
      dept: "Product Design",
      points: "11,204",
      activity: "Endurance",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
    },
    {
      rank: "03",
      name: "Jordan Vance",
      dept: "Global HR",
      points: "10,980",
      activity: "Cycling",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-32 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/30">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=100&auto=format&fit=crop" 
              alt="Profile"
            />
          </div>
        </div>
        <h1 className="font-headline font-black tracking-tighter uppercase text-2xl italic text-primary-fixed">
          CORPORATE HUB
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-primary-fixed hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 duration-200">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-surface-container-low p-8 border border-outline-variant/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px] transition-transform duration-700 group-hover:scale-110" />
          <div className="relative z-10 space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-highest border border-outline-variant/20">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="font-label text-[10px] font-black uppercase tracking-widest text-primary-container">TechCorp Official Hub</span>
            </div>
            <h2 className="font-headline text-5xl font-black tracking-tight leading-[0.9] uppercase italic grayscale group-hover:grayscale-0 transition-all">
              Elevate Your <br/><span className="text-primary-fixed">Company Performance.</span>
            </h2>
            <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-sm font-medium">
              Join the 1,240 TechCorp athletes crushing their daily goals. Real-time stats, colleague challenges, and corporate glory.
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto">
            <button className="w-full md:w-auto px-8 py-5 bg-kinetic-gradient text-on-primary-fixed font-headline font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(202,253,0,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
              <QrCode className="w-5 h-5" />
              Join with Code
            </button>
          </div>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Inter-Corporate Battles */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="md:col-span-8 bg-surface-container rounded-3xl p-8 relative overflow-hidden group shadow-2xl border border-outline-variant/5"
          >
            <div className="flex justify-between items-start mb-10 relative z-10">
              <div>
                <h3 className="font-headline text-2xl font-black uppercase tracking-tight italic">Inter-Corporate Battles</h3>
                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.3em] mt-1">Global Industry Ranking</p>
              </div>
              <Swords className="text-primary-container w-8 h-8 fill-current" />
            </div>

            <div className="space-y-10 relative z-10">
              {/* TechCorp */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center font-headline font-black text-primary-container border border-primary-container/20 shadow-lg">TC</div>
                    <div>
                      <p className="font-headline font-black uppercase text-sm italic">TechCorp</p>
                      <p className="font-label text-[10px] text-primary-container font-black uppercase tracking-widest">Current Leader</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline text-3xl font-black italic tracking-tighter">84,920</p>
                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-tighter">Total XP</p>
                  </div>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "84%" }}
                    className="h-full bg-kinetic-gradient shadow-[0_0_15px_rgba(202,253,0,0.5)]" 
                  />
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex items-center justify-center opacity-30">
                <div className="h-[1px] flex-grow bg-outline-variant/30" />
                <span className="px-6 font-headline text-[10px] font-black italic tracking-[0.4em] text-on-surface-variant">VERSUS</span>
                <div className="h-[1px] flex-grow bg-outline-variant/30" />
              </div>

              {/* CloudNine */}
              <div className="space-y-4 opacity-70 group-hover:opacity-100 transition-opacity">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center font-headline font-black text-on-surface-variant border border-outline-variant/20">C9</div>
                    <div>
                      <p className="font-headline font-black uppercase text-sm italic">CloudNine</p>
                      <p className="font-label text-[10px] text-on-surface-variant font-black uppercase tracking-widest">Challenger</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline text-3xl font-black italic tracking-tighter">76,410</p>
                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-tighter">Total XP</p>
                  </div>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "76%" }}
                    className="h-full bg-surface-variant" 
                  />
                </div>
              </div>
            </div>

            {/* Background Decor */}
            <div className="absolute -bottom-10 -right-10 font-headline text-[120px] font-black text-on-surface-variant/5 pointer-events-none italic select-none">BATTLE</div>
          </motion.div>

          {/* Team Energy Pulse */}
          <div className="md:col-span-4 bg-surface-container rounded-3xl p-8 flex flex-col justify-between border-l-4 border-primary-container shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-headline font-black uppercase text-[10px] tracking-[0.3em] text-on-surface-variant mb-6 italic">Team Energy</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="font-headline text-7xl font-black italic text-primary-fixed leading-none">92</span>
                <span className="font-headline text-2xl font-black mb-2">%</span>
              </div>
              <p className="font-label text-[10px] uppercase font-black text-on-surface-variant tracking-wider leading-relaxed">Peak performance reached in 12 departments</p>
            </div>
            
            <div className="mt-12 space-y-4 relative z-10">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Active Now</span>
                <span className="text-primary-container">412 Users</span>
              </div>
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    className="w-10 h-10 rounded-full border-4 border-surface-container object-cover shadow-xl" 
                    src={`https://i.pravatar.cc/100?u=corporate${i}`} 
                    alt="Active Colleague" 
                  />
                ))}
                <div className="flex-1" />
                <div className="w-10 h-10 rounded-full border-4 border-surface-container bg-kinetic-gradient text-on-primary-fixed flex items-center justify-center text-[10px] font-black italic shadow-xl">
                  +409
                </div>
              </div>
            </div>
            
            {/* Energy Wave Background */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-5 pointer-events-none grayscale group-hover:grayscale-0 transition-all">
              <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                <path d="M0,100 C100,50 150,150 200,100 C250,50 300,150 400,100 L400,200 L0,200 Z" fill="currentColor" className="text-primary-container" />
              </svg>
            </div>
          </div>
        </div>

        {/* Employee Leaderboard */}
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-headline text-4xl font-black uppercase tracking-tight italic">Colleague <span className="text-primary-fixed">Leaderboard</span></h2>
              <p className="text-on-surface-variant font-black text-[10px] uppercase tracking-[0.3em] mt-1">Season 04: Velocity</p>
            </div>
            <button className="font-headline text-[10px] font-black uppercase tracking-widest text-primary-fixed border-b-2 border-primary-container/30 pb-1 hover:border-primary-fixed transition-colors">
              View All Employees
            </button>
          </div>

          <div className="bg-surface-container-low rounded-[2rem] overflow-hidden shadow-2xl border border-outline-variant/10">
            {/* Header */}
            <div className="grid grid-cols-12 px-8 py-4 bg-surface-container-high font-headline text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10">
              <div className="col-span-1">Rank</div>
              <div className="col-span-6">Athlete</div>
              <div className="col-span-3 text-right">Activity</div>
              <div className="col-span-2 text-right">Points</div>
            </div>

            {/* List */}
            <div className="divide-y divide-outline-variant/5">
              {employees.map((emp) => (
                <div 
                  key={emp.rank}
                  className="grid grid-cols-12 px-8 py-6 items-center hover:bg-surface-container transition-all group cursor-pointer"
                >
                  <div className={`col-span-1 font-headline font-black italic text-2xl ${emp.rank === '01' ? 'text-primary-fixed' : 'text-on-surface-variant/40'}`}>
                    {emp.rank}
                  </div>
                  <div className="col-span-6 flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-transform group-hover:scale-110 shadow-xl ${emp.rank === '01' ? 'border-primary-fixed shadow-primary-fixed/20' : 'border-outline-variant/20'}`}>
                      <img className="w-full h-full object-cover" src={emp.avatar} alt={emp.name} />
                    </div>
                    <div>
                      <h4 className="font-headline font-black uppercase text-lg italic group-hover:text-primary-fixed transition-colors tracking-tight">{emp.name}</h4>
                      <p className="font-label text-[10px] text-on-surface-variant uppercase font-black tracking-widest">{emp.dept}</p>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest rounded-xl border border-outline-variant/10 group-hover:border-primary-container/20 transition-all shadow-sm">
                      {emp.activity === "Powerlifting" && <Activity className="w-3 h-3 text-primary-container" />}
                      {emp.activity === "Endurance" && <TrendingUp className="w-3 h-3 text-primary-container" />}
                      {emp.activity === "Cycling" && <Bike className="w-3 h-3 text-primary-container" />}
                      <span className="font-label text-[10px] font-black uppercase tracking-tighter text-on-surface-variant group-hover:text-primary-container transition-colors">
                        {emp.activity}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="font-headline font-black text-xl italic tracking-tighter">{emp.points}</p>
                    <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-tighter">XP PTS</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-4 p-8 bg-surface-container-high/30">
              <button className="flex-1 py-4 px-6 rounded-2xl border-2 border-outline-variant/20 font-headline font-black uppercase text-xs tracking-widest hover:bg-surface-container transition-all active:scale-95">
                Back
              </button>
              <button className="flex-[2] py-4 px-6 rounded-2xl bg-kinetic-gradient text-on-primary-fixed font-headline font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="pt-20 pb-8 flex flex-col items-center">
          <div className="flex items-center gap-6 mb-4">
            <div className="h-[2px] w-12 bg-primary-container/20" />
            <p className="font-headline text-2xl font-black tracking-[0.5em] text-on-surface-variant/40 uppercase italic">TechCorp</p>
            <div className="h-[2px] w-12 bg-primary-container/20" />
          </div>
          <p className="text-on-surface-variant font-label text-[8px] uppercase tracking-[0.3em] font-black opacity-30">Powered by Kinetic High-Performance Editorial Engine</p>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full pb-8 pt-4 px-6 z-50 bg-background/80 backdrop-blur-xl border-t border-outline-variant/10 shadow-[0_-20px_40px_rgba(0,0,0,0.6)] rounded-t-[3rem] flex justify-around items-end">
        {/* Dashboard */}
        <button 
          onClick={() => onNavigate("dashboard")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <LayoutDashboard className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Dashboard</span>
        </button>
        
        {/* Workouts */}
        <button 
          onClick={() => onNavigate("workouts")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <Dumbbell className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Workouts</span>
        </button>
        
        {/* Corporate (Active) */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center justify-center bg-kinetic-gradient text-on-primary-fixed rounded-full h-14 w-14 -translate-y-4 shadow-xl shadow-primary/20"
        >
          <Briefcase className="w-6 h-6 fill-current" />
        </motion.button>
        
        {/* Leaderboard */}
        <button 
          onClick={() => onNavigate("leaderboard")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <Trophy className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Social</span>
        </button>

        {/* Profile */}
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group">
          <User className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}

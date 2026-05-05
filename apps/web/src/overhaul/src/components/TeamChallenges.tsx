import { motion } from "framer-motion";
import { 
  Bell, 
  Search, 
  Timer, 
  Star, 
  Flashlight as Flash, 
  Mountain, 
  Info, 
  Check, 
  X, 
  Plus,
  LayoutDashboard,
  Dumbbell,
  Trophy,
  User,
  Swords,
  ChevronRight
} from "lucide-react";
import { ScreenState } from "@/overhaul/src/types";

interface TeamChallengesProps {
  onNavigate: (screen: ScreenState) => void;
  key?: string;
}

export default function TeamChallenges({ onNavigate }: TeamChallengesProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-32 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/20 shadow-lg transition-transform hover:scale-105">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=100&auto=format&fit=crop" 
              alt="Profile"
            />
          </div>
          <h1 className="font-headline font-black tracking-tighter uppercase text-2xl italic text-primary-fixed">
            TEAM BATTLES
          </h1>
        </div>
        <button className="text-primary-fixed hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 duration-200">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto space-y-12">
        {/* Search Bar */}
        <section>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary-fixed transition-colors" />
            <input 
              className="w-full bg-surface-container-low border-2 border-transparent rounded-2xl py-5 pl-12 pr-6 text-on-surface placeholder:text-on-surface-variant focus:border-primary-container/20 focus:bg-surface-container transition-all font-label text-sm font-medium shadow-xl" 
              placeholder="Find a Team to Challenge..." 
              type="text"
            />
          </div>
        </section>

        {/* Active Challenges */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-error-dim font-headline font-black text-[10px] tracking-[0.3em] uppercase italic">Live Combat</span>
              <h2 className="text-4xl font-headline font-black tracking-tight mt-1 italic uppercase">ACTIVE <span className="text-primary-fixed">CHALLENGES</span></h2>
            </div>
            <span className="text-on-surface-variant font-black text-[10px] uppercase tracking-[0.2em] mb-1">2 Running</span>
          </div>

          {/* Matchup Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative bg-surface-container-highest/40 backdrop-blur-3xl rounded-[2.5rem] p-10 overflow-hidden shadow-2xl border border-outline-variant/10 group"
          >
            {/* Background Decor */}
            <div className="absolute -right-8 -bottom-12 text-[15rem] font-headline font-black text-on-surface-variant/5 pointer-events-none select-none italic">
              01
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
                {/* Team Alpha */}
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="w-28 h-28 rounded-full p-1.5 bg-kinetic-gradient shadow-[0_0_30px_rgba(202,253,0,0.3)]">
                    <img 
                      className="w-full h-full rounded-full object-cover bg-surface border-4 border-surface" 
                      src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" 
                      alt="Alpha Wolves"
                    />
                  </div>
                  <div>
                    <h3 className="font-headline font-black text-xl italic uppercase tracking-tight">Alpha Wolves</h3>
                    <p className="text-primary-fixed font-black text-[10px] uppercase tracking-[0.3em] mt-1">12,450 PTS</p>
                  </div>
                </div>

                {/* VS Component */}
                <div className="flex flex-col items-center">
                  <div className="text-6xl font-headline font-black italic text-on-surface-variant/10 mb-4 select-none">VS</div>
                  <div className="flex items-center gap-2 bg-surface-container-highest px-6 py-2.5 rounded-full border border-outline-variant/20 shadow-lg">
                    <Timer className="w-4 h-4 text-error-dim animate-pulse" />
                    <span className="font-label text-sm font-black text-on-surface tracking-widest">14:22:05</span>
                  </div>
                </div>

                {/* Team Neon */}
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="w-28 h-28 rounded-full p-1.5 bg-gradient-to-br from-tertiary-fixed to-tertiary-dim shadow-[0_0_30px_rgba(252,224,71,0.2)]">
                    <img 
                      className="w-full h-full rounded-full object-cover bg-surface border-4 border-surface" 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" 
                      alt="Neon Sprinters"
                    />
                  </div>
                  <div>
                    <h3 className="font-headline font-black text-xl italic uppercase tracking-tight">Neon Sprinters</h3>
                    <p className="text-tertiary-fixed font-black text-[10px] uppercase tracking-[0.3em] mt-1">11,920 PTS</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="flex justify-between font-label text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">
                  <span className="text-primary-fixed">Dominance: 52%</span>
                  <span>48%</span>
                </div>
                <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden flex shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "52%" }}
                    className="h-full bg-kinetic-gradient shadow-[0_0_20px_rgba(202,253,0,0.4)]" 
                  />
                  <div className="h-full flex-1" />
                </div>
                <div className="flex justify-center pt-6">
                  <div className="inline-flex items-center gap-3 px-8 py-3 bg-primary-container/10 rounded-full border border-primary-container/20 group-hover:bg-primary-container/20 transition-all cursor-default shadow-sm">
                    <Star className="w-4 h-4 text-primary-container fill-current" />
                    <span className="font-headline font-black text-xs text-primary-container uppercase tracking-[0.2em]">Stakes: 500 Team Points</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Invites */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-headline font-black tracking-tight italic uppercase tracking-widest">PENDING INVITES</h2>
              <span className="px-3 py-1 bg-error-dim text-on-error rounded-xl text-[10px] font-black tracking-widest italic shadow-lg shadow-error/20">NEW</span>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Voltage Squad", icon: <Flash className="w-5 h-5 text-secondary-fixed" />, task: "10K Step Race" },
                { name: "Apex Climbers", icon: <Mountain className="w-5 h-5 text-tertiary-fixed" />, task: "Vertical Gain" }
              ].map((invite, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-lg hover:bg-surface-container transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center shadow-md border border-outline-variant/5">
                      {invite.icon}
                    </div>
                    <div>
                      <h4 className="font-headline font-black text-base italic uppercase tracking-tight group-hover:text-primary-fixed transition-colors">{invite.name}</h4>
                      <p className="text-on-surface-variant font-label text-[10px] font-black uppercase tracking-widest mt-1">
                        Challenged you to: <span className="text-on-surface italic">{invite.task}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-surface-container-highest text-error-dim hover:bg-error-container/20 transition-all active:scale-90 border border-outline-variant/5 shadow-sm">
                      <X className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-kinetic-gradient text-on-primary-fixed hover:scale-110 shadow-xl shadow-primary/20 transition-all active:scale-90">
                      <Check className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Pro Rivals */}
          <section className="space-y-6">
            <h2 className="text-2xl font-headline font-black tracking-tight italic uppercase tracking-widest">Pro Rivals</h2>
            <div className="bg-surface-container rounded-[2.5rem] p-8 border-l-8 border-primary-fixed shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] text-primary-container font-black uppercase tracking-[0.4em] mb-2 italic">Recommended</p>
                <div className="flex items-start justify-between mb-8">
                  <h4 className="font-headline font-black text-2xl leading-none uppercase italic">Titan <br/>Brigade</h4>
                  <div className="p-2 rounded-xl bg-surface-container-highest">
                    <Info className="w-5 h-5 text-primary-container" />
                  </div>
                </div>
                
                <div className="space-y-5 mb-10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-black uppercase tracking-widest text-[10px]">Win Rate</span>
                    <span className="font-headline font-black text-primary-fixed italic text-lg">78%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-black uppercase tracking-widest text-[10px]">Avg Daily Activity</span>
                    <span className="font-headline font-black text-on-surface italic text-lg">4.2h</span>
                  </div>
                </div>
                
                <button className="w-full py-5 bg-surface-container-highest text-primary-fixed font-headline font-black text-xs uppercase tracking-[0.3em] rounded-2xl border-2 border-primary-container/10 hover:bg-kinetic-gradient hover:text-on-primary-fixed hover:border-transparent transition-all active:scale-95 shadow-xl italic">
                  SEND CHALLENGE
                </button>
              </div>

              {/* Background Decor */}
              <div className="absolute -bottom-6 -right-6 text-7xl font-headline font-black text-on-surface-variant/5 pointer-events-none italic select-none">RIVAL</div>
            </div>
          </section>
        </div>

        {/* Global Pagination / Actions */}
        <div className="flex items-center gap-6 pt-12">
          <button 
            className="flex-1 py-6 px-10 rounded-2xl border-4 border-outline-variant/10 font-headline font-black uppercase text-sm tracking-[0.3em] hover:bg-surface-container transition-all active:scale-95 italic text-on-surface-variant"
          >
            BACK
          </button>
          <button 
            className="flex-[2] py-6 px-10 rounded-2xl bg-kinetic-gradient text-on-primary-fixed font-headline font-black uppercase text-sm tracking-[0.3em] shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 italic"
          >
            NEXT
            <ChevronRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-28 right-6 z-40 md:right-12">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-kinetic-gradient shadow-[0_15px_35px_rgba(202,253,0,0.4)] flex items-center justify-center text-on-primary-fixed transition-all"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      </div>

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
        
        {/* Challenges (Active) */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center justify-center bg-kinetic-gradient text-on-primary-fixed rounded-full h-14 w-14 -translate-y-4 shadow-xl shadow-primary/20"
        >
          <Swords className="w-6 h-6 fill-current" />
          <span className="sr-only">Challenges</span>
        </motion.button>
        
        {/* Social */}
        <button 
          onClick={() => onNavigate("social")}
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

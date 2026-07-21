import { motion } from "framer-motion";
import {
  Zap,
  ArrowRight,
  Dumbbell,
  Activity,
  Flower2 as Yoga,
  Footprints,
  LayoutDashboard,
  Trophy,
  User,
  Bell,
  MapPin,
  Bolt,
} from "lucide-react";
import { ScreenState } from "@/overhaul/src/types";

interface WorkoutsProps {
  onNavigate: (screen: ScreenState) => void;
  key?: string;
}

export default function Workouts({ onNavigate }: WorkoutsProps) {
  const programs = [
    {
      id: 1,
      title: "30 Day Shred",
      desc: "High-intensity metabolic conditioning designed for maximum fat loss.",
      level: "Advanced",
      duration: "4 Weeks",
      img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Strength Basics",
      desc: "Master the fundamental movements and build a rock-solid foundation.",
      level: "Beginner",
      duration: "6 Weeks",
      img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  const categories = [
    { id: "strength", label: "Strength", icon: <Dumbbell className="w-8 h-8" />, img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" },
    { id: "hiit", label: "HIIT", icon: <Activity className="w-8 h-8" />, img: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=2070&auto=format&fit=crop" },
    { id: "yoga", label: "Yoga", icon: <Yoga className="w-8 h-8" />, img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop" },
    { id: "cardio", label: "Cardio", icon: <Zap className="w-8 h-8" />, img: "https://images.unsplash.com/photo-1541625602330-2277a1cd1f59?q=80&w=2070&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-32">
       {/* Top Bar */}
       <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <Bolt className="text-primary-fixed w-6 h-6 fill-current" />
          <h1 className="font-headline font-black tracking-tighter uppercase text-2xl italic text-primary-fixed tracking-widest">
            FIT&LIT
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="pt-28 space-y-12">
        {/* Start Run */}
        <section className="px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-surface-container-low border border-outline-variant/10 p-8 shadow-lg"
          >
            <div className="absolute -right-6 -bottom-8 opacity-5">
              <Footprints className="w-48 h-48" />
            </div>
            <div className="relative z-10 space-y-4">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-primary-dim font-bold">
                Today's Focus
              </span>
              <h2 className="font-headline text-4xl font-black italic uppercase leading-[0.9]">
                Start a Run
              </h2>
              <p className="text-on-surface-variant text-sm max-w-md font-body">
                Lace up and log the miles. Track pace, distance, and calories in real time.
              </p>
              <button
                onClick={() => onNavigate("active-workout")}
                className="inline-flex items-center gap-2 bg-kinetic-gradient text-on-primary-fixed px-10 py-4 rounded-xl font-headline font-bold text-lg uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-primary/20"
              >
                <Footprints className="w-5 h-5" />
                Start Run
              </button>
            </div>
          </motion.div>
        </section>

        {/* Categories Grid */}
        <section className="px-6">
          <h2 className="text-2xl font-headline font-black tracking-tight mb-6">Browse by Discipline</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <motion.div 
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                className="relative h-40 rounded-3xl overflow-hidden group cursor-pointer bg-surface-container border border-outline-variant/10 shadow-lg"
              >
                <img 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-500" 
                  src={cat.img}
                  alt={cat.label}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="text-primary mb-2 transition-transform group-hover:scale-110">
                    {cat.icon}
                  </div>
                  <span className="font-headline font-bold text-lg uppercase tracking-wider">{cat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recommended Programs */}
        <section>
          <div className="flex justify-between items-end px-6 mb-6">
            <div>
              <span className="text-primary-dim font-headline text-xs tracking-[0.2em] uppercase font-bold">Elite Selection</span>
              <h2 className="text-3xl font-headline font-black tracking-tight mt-1">Recommended Programs</h2>
            </div>
            <button className="text-on-surface-variant text-sm font-label font-bold uppercase tracking-widest flex items-center gap-1 hover:text-primary transition-colors">
              See All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-6 px-6 no-scrollbar pb-4 snap-x">
            {programs.map((program) => (
              <motion.div 
                key={program.id}
                whileHover={{ y: -5 }}
                className="flex-none w-[85%] md:w-[400px] snap-start group relative overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                <img 
                  alt={program.title} 
                  className="w-full h-[480px] object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={program.img}
                />
                <div className="absolute bottom-0 left-0 p-8 z-20 w-full space-y-4">
                  <div className="flex gap-2">
                    <span className="bg-primary/20 backdrop-blur-md text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                      {program.level}
                    </span>
                    <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                      {program.duration}
                    </span>
                  </div>
                  <h3 className="text-4xl font-headline font-black text-white leading-[0.9] mb-2">{program.title}</h3>
                  <p className="text-on-surface-variant text-sm max-w-[85%] font-body">{program.desc}</p>
                  <button 
                    onClick={() => onNavigate("active-workout")}
                    className="bg-kinetic-gradient text-on-primary-fixed px-8 py-3 rounded-full font-headline font-bold text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                  >
                    Start Journey
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
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
        
        {/* Workouts (Active) */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center justify-center bg-kinetic-gradient text-on-primary-fixed rounded-full h-14 w-14 -translate-y-4 shadow-xl shadow-primary/20"
        >
          <Dumbbell className="w-6 h-6 fill-current" />
        </motion.button>
        
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

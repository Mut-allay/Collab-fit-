import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  ArrowRight,
  Dumbbell,
  Activity,
  Flower2 as Yoga,
  Footprints,
  Bell,
  Bolt,
  PlusCircle,
  Users,
  MapPin,
} from "lucide-react";
import { ScreenState } from "@/overhaul/src/types";

interface WorkoutsProps {
  onNavigate: (screen: ScreenState) => void;
  key?: string;
}

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=2574&auto=format&fit=crop";
const START_RUN_BG =
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop";

export default function Workouts({ onNavigate }: WorkoutsProps) {
  const [slide, setSlide] = useState(0);
  const slideCount = 3;

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
        <div className="flex items-center gap-3">
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container">
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate("profile")}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container shrink-0"
          >
            <img className="w-full h-full object-cover" src={DEFAULT_AVATAR} alt="Profile" />
          </button>
        </div>
      </header>

      <main className="pt-28 space-y-12">
        {/* Hero Carousel: Start Run / Create a Running Trail / Club Hub */}
        <section className="px-6">
          <div className="relative overflow-hidden rounded-3xl shadow-lg">
            <motion.div
              className="flex"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              animate={{ x: `-${slide * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              onDragEnd={(_, info) => {
                const threshold = 60;
                if (info.offset.x < -threshold && slide < slideCount - 1) {
                  setSlide(slide + 1);
                } else if (info.offset.x > threshold && slide > 0) {
                  setSlide(slide - 1);
                }
              }}
            >
              {/* Slide 1: Start Run */}
              <div className="relative w-full shrink-0 p-8 min-h-[320px] flex items-end">
                <img
                  className="absolute inset-0 w-full h-full object-cover"
                  src={START_RUN_BG}
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
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
              </div>

              {/* Slide 2: Create a Running Trail */}
              <div className="relative w-full shrink-0 p-8 min-h-[320px] flex items-end bg-surface-container-low border border-outline-variant/10">
                <div className="absolute -right-6 -bottom-8 opacity-5">
                  <MapPin className="w-48 h-48" />
                </div>
                <div className="relative z-10 space-y-4">
                  <span className="font-label text-xs uppercase tracking-[0.2em] text-primary-dim font-bold">
                    Build Your Own
                  </span>
                  <h2 className="font-headline text-4xl font-black italic uppercase leading-[0.9]">
                    Create a Running Trail
                  </h2>
                  <p className="text-on-surface-variant text-sm max-w-md font-body">
                    Map out a custom route, save your favorite paths, and share them with your club.
                  </p>
                  <button
                    onClick={() => onNavigate("map")}
                    className="inline-flex items-center gap-2 bg-kinetic-gradient text-on-primary-fixed px-10 py-4 rounded-xl font-headline font-bold text-lg uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-primary/20"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Create Trail
                  </button>
                </div>
              </div>

              {/* Slide 3: Club Hub */}
              <div className="relative w-full shrink-0 p-8 min-h-[320px] flex items-end bg-surface-container-low border border-outline-variant/10">
                <div className="absolute -right-6 -bottom-8 opacity-5">
                  <Users className="w-48 h-48" />
                </div>
                <div className="relative z-10 space-y-4">
                  <span className="font-label text-xs uppercase tracking-[0.2em] text-primary-dim font-bold">
                    Community
                  </span>
                  <h2 className="font-headline text-4xl font-black italic uppercase leading-[0.9]">
                    Club Hub
                  </h2>
                  <p className="text-on-surface-variant text-sm max-w-md font-body">
                    Join or create a run club, compete in live challenges, and train together.
                  </p>
                  <button
                    onClick={() => onNavigate("social")}
                    className="inline-flex items-center gap-2 bg-kinetic-gradient text-on-primary-fixed px-10 py-4 rounded-xl font-headline font-bold text-lg uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-primary/20"
                  >
                    <Users className="w-5 h-5" />
                    Join or Create a Club
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === slide ? "w-6 bg-primary" : "w-1.5 bg-surface-container-highest"
                }`}
              />
            ))}
          </div>
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
    </div>
  );
}

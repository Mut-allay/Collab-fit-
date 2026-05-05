import { useState } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Settings,
  Search,
  SlidersHorizontal,
  MapPin,
  AlertTriangle,
  Compass,
  Users,
  Bell,
  User,
  Clock,
  ArrowRight,
} from "lucide-react";
import { ScreenState } from "@/overhaul/src/types";

interface RunClubMapProps {
  onNavigate: (screen: ScreenState) => void;
  key?: string;
}

export default function RunClubMap({ onNavigate }: RunClubMapProps) {
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  const nearbyClubs = [
    {
      id: 1,
      name: "NEON STRIDERS",
      isLive: true,
      time: "Starts in 15m",
      distance: "4.2km",
      joined: 18,
      img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "PACE CHASERS",
      isLive: false,
      tag: "Tonight",
      time: "0.8km away",
      distance: "12km",
      joined: 42,
      img: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="h-screen w-full bg-background text-on-background font-body overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Bar */}
      <header className="absolute top-0 w-full z-50 bg-background/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div 
            onClick={() => onNavigate("dashboard")}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container cursor-pointer"
          >
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=2574&auto=format&fit=crop"
              alt="Profile"
            />
          </div>
          <h1 className="font-headline font-black tracking-tighter uppercase text-2xl italic text-primary-fixed">
            FIT&LIT
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-primary-fixed hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 duration-200">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="relative h-full w-full pt-20">
        {/* Map Background */}
        <div className="absolute inset-0 z-0 bg-surface-container-lowest">
          <img 
            className="w-full h-full object-cover opacity-40 grayscale contrast-125" 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop"
            alt="Dark Map Grid"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
          
          {/* Decorative Mesh Overlay */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(202, 253, 0, 0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }} 
          />

          {/* Map Interactive Elements */}
          {/* Safe Zone */}
          <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl animate-pulse" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1/4 left-1/3 mt-20 ml-20 flex flex-col items-center group cursor-pointer"
          >
            <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-1 shadow-lg shadow-primary-container/20 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
              Safe Zone
            </div>
            <MapPin className="w-8 h-8 text-primary-container fill-current" />
          </motion.div>

          {/* Caution Zone */}
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-error/10 rounded-full blur-2xl" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-1/3 right-1/4 mt-12 ml-12 flex flex-col items-center group cursor-pointer"
          >
            <div className="bg-error text-on-error px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase mb-1 shadow-lg shadow-error/20 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
              Caution Area
            </div>
            <AlertTriangle className="w-8 h-8 text-error fill-current" />
          </motion.div>

          {/* Active Club Pin */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary-container/40 rounded-full animate-ping scale-150" />
              <div className="relative bg-surface-bright p-1 rounded-full border-2 border-primary-container shadow-2xl transition-transform group-hover:scale-110">
                <img 
                  className="w-10 h-10 rounded-full object-cover" 
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop"
                  alt="Club Icon"
                />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-surface-container p-2 rounded-lg border border-outline-variant/10 w-32 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                <p className="font-headline font-black text-[10px] uppercase tracking-tighter">Neon Sprinters</p>
                <p className="text-[8px] text-on-surface-variant font-bold uppercase">12 Members Live</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Search Interface */}
        <div className="absolute top-6 left-6 right-6 z-20 max-w-xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-on-surface-variant group-focus-within:text-primary-container transition-colors" />
            </div>
            <input 
              className="w-full bg-surface-container-high/80 backdrop-blur-md border-none rounded-2xl py-5 pl-12 pr-12 text-on-surface font-headline font-bold text-sm tracking-widest placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary-container transition-all shadow-2xl" 
              placeholder="EXPLORE CLUBS OR ROUTES..." 
              type="text"
            />
            <button className="absolute inset-y-0 right-4 flex items-center text-primary-container hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Sheet UI */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: isSheetExpanded ? "20%" : "0%" }}
          className="absolute bottom-0 left-0 right-0 z-40"
        >
          <div className="max-w-4xl mx-auto w-full px-6">
            {/* Create Button */}
            <div className="flex justify-center mb-6">
              <button 
                onClick={() => onNavigate("clubs")}
                className="bg-kinetic-gradient text-on-primary-fixed px-10 py-5 rounded-2xl font-headline font-black text-sm tracking-[0.2em] uppercase shadow-[0_20px_40px_rgba(202,253,0,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
              >
                <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                Create Jogging Trail
              </button>
            </div>

            {/* Content Area */}
            <div className="bg-surface-container-low/95 backdrop-blur-2xl rounded-t-[3rem] px-8 pt-8 pb-32 border-t border-outline-variant/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
              {/* Handle */}
              <button 
                onClick={() => setIsSheetExpanded(!isSheetExpanded)}
                className="w-12 h-1.5 bg-outline-variant/20 rounded-full mx-auto mb-8 hover:bg-outline-variant/40 transition-colors" 
              />

              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[10px] font-black tracking-[0.3em] text-primary-container uppercase mb-1">Live Updates</p>
                  <h2 className="text-3xl font-headline font-black text-on-surface tracking-tighter italic uppercase">NEARBY CLUBS</h2>
                </div>
                <span className="text-on-surface-variant text-[10px] font-black font-label uppercase tracking-[0.2em] mb-1">12 Active Now</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyClubs.map((club) => (
                  <motion.div 
                    key={club.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-surface-container p-5 rounded-2xl flex items-center gap-5 hover:bg-surface-container-high transition-all cursor-pointer group border border-outline-variant/5 shadow-lg"
                  >
                    <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                      <img 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        src={club.img}
                        alt={club.name}
                      />
                      {club.isLive && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-primary-container rounded-full border-2 border-surface-container group-hover:animate-ping" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-headline font-black text-lg text-on-surface truncate italic">{club.name}</h3>
                        {club.isLive && (
                          <span className="bg-error text-[8px] font-black text-on-error px-2 py-0.5 rounded-full uppercase animate-pulse">Live</span>
                        )}
                        {club.tag && (
                          <span className="bg-surface-container-highest text-[8px] font-black text-on-surface-variant px-2 py-0.5 rounded-full uppercase">{club.tag}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-on-surface-variant font-bold text-[10px] uppercase tracking-wider">
                          <Clock className="w-3 h-3" />
                          {club.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-on-surface-variant font-bold text-[10px] uppercase tracking-wider">
                          <MapPin className="w-3 h-3" />
                          {club.distance}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-2xl font-headline font-black text-primary-container italic leading-none">{club.joined}</p>
                      <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-tighter mt-1">Joined</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Browse All Link */}
              <button 
                onClick={() => onNavigate("clubs")}
                className="mt-8 w-full py-4 border border-outline-variant/20 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary-container hover:border-primary-container/40 transition-all group"
              >
                Browse Club Hub <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full pb-8 pt-4 px-6 z-50 bg-background/80 backdrop-blur-xl border-t border-outline-variant/10 shadow-[0_-20px_40px_rgba(0,0,0,0.6)] rounded-t-[3rem] flex justify-around items-end">
        {/* Explore */}
        <button 
          onClick={() => onNavigate("workouts")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <Compass className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Explore</span>
        </button>
        
        {/* Map / Clubs (Active) */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center justify-center bg-kinetic-gradient text-on-primary-fixed rounded-full h-14 w-14 -translate-y-4 shadow-xl shadow-primary/20"
        >
          <Users className="w-6 h-6 fill-current" />
        </motion.button>
        
        {/* Add */}
        <button 
          onClick={() => onNavigate("clubs")}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group"
        >
          <PlusCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Create</span>
        </button>
        
        {/* Alerts */}
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group">
          <Bell className="w-6 h-6 transition-transform group-hover:scale-110" />
          <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">Alerts</span>
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

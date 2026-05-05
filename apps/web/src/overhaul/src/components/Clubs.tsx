import { motion } from "framer-motion";
import {
  Settings,
  PlusCircle,
  Users,
  ArrowRight,
  Compass,
  Bell,
  User,
  Plus,
  MapPin,
} from "lucide-react";
import { ScreenState } from "@/overhaul/src/types";

interface ClubsProps {
  onNavigate: (screen: ScreenState) => void;
  key?: string;
}

export default function Clubs({ onNavigate }: ClubsProps) {
  const topPerformers = [
    { id: 1, name: "Alex Rivera", miles: "42.5mi", rank: "01" },
    { id: 2, name: "Sarah Chen", miles: "38.2mi", rank: "02" },
    { id: 3, name: "Jordan Lee", miles: "36.9mi", rank: "03" },
  ];

  const competitions = [
    {
      id: 1,
      tag: "City Siege 2024",
      title: "Midnight Metropolis",
      status: "Live",
      clubs: 12,
      progress: 64,
      color: "border-error",
      tagColor: "text-error"
    },
    {
      id: 2,
      tag: "Global Summit",
      title: "Vertical Velocity",
      status: "Starts in 2 Days",
      clubs: 8,
      progress: 0,
      color: "border-primary-container",
      tagColor: "text-primary-container"
    }
  ];

  const discoveryClubs = [
    {
      id: 1,
      name: "Coastal Elite",
      location: "Palo Alto",
      members: 42,
      tags: ["Trail", "Marathon Prep"],
      img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Concrete Crew",
      location: "Oakland",
      members: 89,
      tags: ["Night Run", "Urban"],
      img: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Tempo Tribe",
      location: "Downtown",
      members: 214,
      tags: ["Competitive", "Speed"],
      img: "https://images.unsplash.com/photo-1534367507873-dcd108500206?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-32 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
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

      <main className="pt-24 space-y-12">
        {/* Hero Section */}
        <section className="relative px-6 pt-8 pb-12 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="relative z-10 space-y-8">
            <div className="relative">
              <span className="font-headline font-black text-[8rem] leading-none opacity-5 absolute -top-12 -left-4 select-none italic">CLUB</span>
              <h1 className="font-headline font-black text-6xl lg:text-8xl tracking-tighter leading-[0.9] text-on-background relative uppercase italic">
                RUN CLUB<br/><span className="text-primary-container">HUB</span>
              </h1>
            </div>
            <p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
              High-octane collective performance. Join the elite, track your miles, and dominate the regional leaderboards.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-kinetic-gradient text-on-primary-fixed px-8 py-4 rounded-xl font-headline font-black uppercase tracking-widest flex items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                <PlusCircle className="w-5 h-5" />
                Create a Club
              </button>
              <button 
                onClick={() => onNavigate("map")}
                className="bg-surface-container text-primary-fixed border border-primary-container/20 px-8 py-4 rounded-xl font-headline font-black uppercase tracking-widest flex items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                <MapPin className="w-5 h-5" />
                View Map
              </button>
            </div>
          </div>
        </section>

        {/* My Club Section */}
        <section className="px-6 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-primary-container" />
            <h2 className="font-headline font-bold text-2xl uppercase tracking-widest">My Club</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main Club Card */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="md:col-span-8 bg-surface-container rounded-3xl p-8 relative overflow-hidden group shadow-2xl border border-outline-variant/10"
            >
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop"
                  alt="Neon Sprinters"
                />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between space-y-12">
                <div>
                  <div className="inline-block bg-primary-container text-on-primary-container text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mb-4">
                    Active Now
                  </div>
                  <h3 className="font-headline font-black text-4xl lg:text-6xl uppercase italic tracking-tighter mb-2">Neon Sprinters</h3>
                  <p className="text-primary-container font-label font-bold uppercase tracking-widest text-sm">San Francisco Chapter</p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em]">Weekly Miles</p>
                    <p className="font-headline font-black text-4xl text-on-surface italic">1,482</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em]">Rank</p>
                    <p className="font-headline font-black text-4xl text-primary-container italic">#04</p>
                  </div>
                  <div className="hidden lg:block space-y-1">
                    <p className="text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em]">Members</p>
                    <p className="font-headline font-black text-4xl text-on-surface italic">128</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Leaderboard Mini Card */}
            <div className="md:col-span-4 bg-surface-container-high rounded-3xl p-6 flex flex-col gap-6 shadow-xl border border-outline-variant/10">
              <h4 className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant">Top Performers</h4>
              <div className="space-y-4">
                {topPerformers.map((performer) => (
                  <div key={performer.id} className="flex items-center justify-between p-4 bg-surface-container rounded-2xl group hover:bg-surface-container-highest transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs italic ${performer.rank === '01' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                        {performer.rank}
                      </div>
                      <span className="font-bold text-sm">{performer.name}</span>
                    </div>
                    <span className={`font-headline font-black ${performer.rank === '01' ? 'text-primary-container' : 'text-on-surface'}`}>
                      {performer.miles}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-auto w-full py-4 bg-surface-container-highest rounded-xl text-primary font-bold text-xs uppercase tracking-widest hover:bg-surface-bright transition-colors">
                View All Stats
              </button>
            </div>
          </div>
        </section>

        {/* Live Competitions */}
        <section className="space-y-8">
          <div className="px-6 flex justify-between items-end">
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-error" />
              <h2 className="font-headline font-bold text-2xl uppercase tracking-widest">Live Competitions</h2>
            </div>
            <button className="text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group">
              See Challenges <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="flex overflow-x-auto px-6 gap-6 no-scrollbar pb-4 snap-x">
            {competitions.map((comp) => (
              <motion.div 
                key={comp.id}
                whileTap={{ scale: 0.98 }}
                className={`min-w-[320px] lg:min-w-[450px] bg-surface-container rounded-3xl p-6 border-l-4 ${comp.color} relative overflow-hidden shrink-0 shadow-lg snap-start`}
              >
                {comp.status === "Live" && (
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-error text-on-error font-black text-[10px] px-3 py-1 rounded-full uppercase animate-pulse">Live</span>
                  </div>
                )}
                <p className={`text-xs font-black uppercase tracking-[0.3em] mb-2 ${comp.tagColor}`}>{comp.tag}</p>
                <h3 className="font-headline font-black text-3xl uppercase leading-tight mb-4 italic">{comp.title}</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-container bg-surface-container-highest overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i + comp.id}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{comp.clubs} Clubs Competing</span>
                </div>

                <div className="bg-surface-container-highest rounded-2xl p-5">
                  {comp.progress > 0 ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>Your Club Progress</span>
                        <span>{comp.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${comp.progress}%` }}
                          className="h-full bg-error rounded-full" 
                        />
                      </div>
                    </div>
                  ) : (
                    <button className="w-full py-3 bg-primary-container text-on-primary-fixed font-black uppercase text-xs rounded-xl tracking-widest hover:scale-[1.02] transition-transform">
                      Register Club
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Discover Communities */}
        <section className="px-6 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-on-surface-variant" />
            <h2 className="font-headline font-bold text-2xl uppercase tracking-widest">Discover Communities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoveryClubs.map((club) => (
              <motion.div 
                key={club.id}
                whileHover={{ y: -5 }}
                className="bg-surface-container-low p-6 rounded-3xl group hover:bg-surface-container transition-all border border-outline-variant/10 shadow-lg"
              >
                <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                  <img 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                    src={club.img}
                    alt={club.name}
                  />
                </div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-headline font-black text-xl uppercase italic group-hover:text-primary-container transition-colors">{club.name}</h4>
                    <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest flex items-center gap-1 mt-1">
                      {club.location} • {club.members} Members
                    </p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-container hover:scale-110 transition-transform shadow-lg group-hover:bg-primary-container group-hover:text-on-primary-container">
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {club.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-black uppercase tracking-tighter text-on-surface-variant group-hover:bg-surface-variant transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
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
        
        {/* Clubs (Active) */}
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center justify-center bg-kinetic-gradient text-on-primary-fixed rounded-full h-14 w-14 -translate-y-4 shadow-xl shadow-primary/20"
        >
          <Users className="w-6 h-6 fill-current" />
        </motion.button>
        
        {/* Add */}
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:text-primary transition-all group">
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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Send,
  PlusCircle,
  HandMetal,
  MessageCircle,
  Activity,
  ArrowRight,
  Plus,
} from "lucide-react";
import { ScreenState } from "@/overhaul/src/types";

interface SocialFeedProps {
  onNavigate: (screen: ScreenState) => void;
  key?: string;
}

type Tab = "team" | "clubs" | "global";

export default function SocialFeed({ onNavigate }: SocialFeedProps) {
  const [activeTab, setActiveTab] = useState<Tab>("team");
  const [message, setMessage] = useState("");

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
      tagColor: "text-error",
    },
    {
      id: 2,
      tag: "Global Summit",
      title: "Vertical Velocity",
      status: "Starts in 2 Days",
      clubs: 8,
      progress: 0,
      color: "border-primary-container",
      tagColor: "text-primary-container",
    },
  ];

  const discoveryClubs = [
    {
      id: 1,
      name: "Coastal Elite",
      location: "Palo Alto",
      members: 42,
      tags: ["Trail", "Marathon Prep"],
      img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Concrete Crew",
      location: "Oakland",
      members: 89,
      tags: ["Night Run", "Urban"],
      img: "https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=2070&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Tempo Tribe",
      location: "Downtown",
      members: 214,
      tags: ["Competitive", "Speed"],
      img: "https://images.unsplash.com/photo-1534367507873-dcd108500206?q=80&w=2070&auto=format&fit=crop",
    },
  ];

  const teamMessages = [
    {
      id: 1,
      user: "Marcus",
      text: "Yo team! Who's hitting the 6PM HIIT session? ⚡️",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
      isSelf: false,
      timestamp: "10:24 AM"
    },
    {
      id: 2,
      type: "achievement",
      user: "Sarah J.",
      achievement: "Achieved Beast Mode",
      title: "Morning 5K Sprint",
      stat: "19:42",
      statLabel: "Personal Best",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
      timestamp: "2H AGO"
    },
    {
      id: 3,
      user: "You",
      text: "I'm in! Let's crush those sets. 🔥 See you there @Marcus",
      avatar: "https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=100&auto=format&fit=crop",
      isSelf: true,
      timestamp: "12:15 PM"
    },
    {
      id: 4,
      user: "David",
      text: "Just logged my cardio for the day...",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      isSelf: false,
      isStats: true,
      stats: [
        { label: "Distance", value: "12.4", unit: "km" },
        { label: "Heart Rate", value: "164", unit: "bpm", color: "text-error" }
      ],
      timestamp: "12:30 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-48 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Bar */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 border-b border-outline-variant/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("profile")}
            className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-primary-container/20 shadow-lg"
          >
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1548690312-e3b507d17a12?q=80&w=100&auto=format&fit=crop"
              alt="Profile"
            />
          </button>
          <h1 className="font-headline font-black tracking-tighter uppercase text-2xl italic text-primary-fixed">
            Fit&Lit
          </h1>
        </div>
        <button className="text-primary-fixed hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 duration-200">
          <Bell className="w-6 h-6" />
        </button>
      </header>

      <main className="pt-24 px-4 md:px-8 max-w-4xl mx-auto space-y-8">
        {/* Tab Control */}
        <div className="flex p-1.5 bg-surface-container-low rounded-[1.5rem] sticky top-24 z-40 shadow-xl border border-outline-variant/10">
          <button
            onClick={() => setActiveTab("team")}
            className={`flex-1 py-4 text-xs font-black font-headline uppercase tracking-widest rounded-xl transition-all ${activeTab === 'team' ? 'bg-surface-container-highest text-primary-fixed shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Team Chat
          </button>
          <button
            onClick={() => setActiveTab("clubs")}
            className={`flex-1 py-4 text-xs font-black font-headline uppercase tracking-widest rounded-xl transition-all ${activeTab === 'clubs' ? 'bg-surface-container-highest text-primary-fixed shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Clubs
          </button>
          <button
            onClick={() => setActiveTab("global")}
            className={`flex-1 py-4 text-xs font-black font-headline uppercase tracking-widest rounded-xl transition-all ${activeTab === 'global' ? 'bg-surface-container-highest text-primary-fixed shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            Global Feed
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="flex items-center justify-center">
            <span className="text-[10px] font-black font-label uppercase tracking-[0.3em] text-on-surface-variant bg-surface-container-low border border-outline-variant/10 px-6 py-2 rounded-full shadow-sm">
              Today's Activity
            </span>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "team" ? (
              <motion.div 
                key="team"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {teamMessages.map((msg) => (
                  <div key={msg.id}>
                    {msg.type === 'achievement' ? (
                      <div className="relative group">
                        <div className="absolute -left-4 -top-6 text-[10rem] font-black text-white/[0.02] font-headline select-none pointer-events-none italic">01</div>
                        <div className="bg-surface-container-low p-8 rounded-3xl relative overflow-hidden border border-outline-variant/5 shadow-2xl transition-all hover:bg-surface-container group/card">
                          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full border-2 border-primary-fixed p-1 bg-kinetic-gradient shadow-xl shadow-primary/20 transition-transform group-hover/card:scale-110">
                                <img className="w-full h-full object-cover rounded-full bg-surface border-4 border-surface" src={msg.avatar} alt={msg.user} />
                              </div>
                              <div>
                                <h3 className="font-headline font-black text-xl italic uppercase tracking-tight">{msg.user}</h3>
                                <p className="text-[10px] text-primary-fixed font-black uppercase tracking-[0.3em]">{msg.achievement}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{msg.timestamp}</span>
                          </div>

                          <div className="bg-surface-container-lowest/50 backdrop-blur-md p-6 rounded-2xl mb-8 border border-outline-variant/10 shadow-inner group-hover/card:bg-surface-container-lowest transition-colors">
                            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 text-center sm:text-left">
                              <div>
                                <p className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.3em] mb-2">Workout Complete</p>
                                <h4 className="text-3xl font-headline font-black tracking-tight italic uppercase">{msg.title}</h4>
                              </div>
                              <div className="sm:text-right">
                                <p className="text-primary-fixed text-5xl font-headline font-black italic tabular-nums leading-none">{msg.stat}</p>
                                <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest mt-1">{msg.statLabel}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <button className="flex-1 bg-kinetic-gradient text-on-primary-fixed py-4 rounded-2xl font-headline font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]">
                              <HandMetal className="w-4 h-4 fill-current" />
                              High Five
                            </button>
                            <button className="px-6 bg-surface-container-highest text-on-surface py-4 rounded-2xl font-headline font-black text-xs uppercase flex items-center justify-center active:scale-95 transition-all border border-outline-variant/10 shadow-lg hover:bg-surface-container">
                              <MessageCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`flex items-end gap-4 max-w-[90%] sm:max-w-[70%] ${msg.isSelf ? 'flex-row-reverse ml-auto' : ''}`}>
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-outline-variant/20 shadow-md">
                          <img className="w-full h-full object-cover" src={msg.avatar} alt={msg.user} />
                        </div>
                        <div className={`space-y-2 flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                          <p className="text-[10px] font-black font-label text-on-surface-variant uppercase tracking-widest px-1">
                            {msg.isSelf ? 'YOU' : msg.user}
                          </p>
                          <div className={`px-5 py-4 rounded-[1.5rem] shadow-xl transition-all ${msg.isSelf ? 'bg-kinetic-gradient text-on-primary-fixed rounded-br-none shadow-primary/20 hover:scale-[1.02]' : 'bg-surface-container-high rounded-bl-none border border-outline-variant/5'}`}>
                            {msg.isStats ? (
                              <div className="space-y-4">
                                <p className="text-sm font-bold leading-relaxed italic opacity-80 decoration-primary-container/30 underline underline-offset-4">"{msg.text}"</p>
                                <div className="grid grid-cols-2 gap-4">
                                  {msg.stats?.map((stat, sidx) => (
                                    <div key={sidx} className="bg-background/40 backdrop-blur-sm p-3 rounded-xl border border-outline-variant/10">
                                      <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                      <p className={`text-xl font-headline font-black italic tracking-tight ${stat.color || 'text-on-surface'}`}>
                                        {stat.value}
                                        <span className="text-[10px] ml-1 font-black opacity-40 italic">{stat.unit}</span>
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm font-bold tracking-tight leading-relaxed">{msg.text}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            ) : activeTab === "clubs" ? (
              <motion.div
                key="clubs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* My Club */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-primary-container" />
                    <h2 className="font-headline font-bold text-xl uppercase tracking-widest">My Club</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
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
                </div>

                {/* Live Competitions */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-[2px] bg-error" />
                      <h2 className="font-headline font-bold text-xl uppercase tracking-widest">Live Competitions</h2>
                    </div>
                    <button className="text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 group">
                      See Challenges <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <div className="flex overflow-x-auto gap-6 no-scrollbar pb-4 snap-x -mx-4 px-4 md:mx-0 md:px-0">
                    {competitions.map((comp) => (
                      <motion.div
                        key={comp.id}
                        whileTap={{ scale: 0.98 }}
                        className={`min-w-[320px] bg-surface-container rounded-3xl p-6 border-l-4 ${comp.color} relative overflow-hidden shrink-0 shadow-lg snap-start`}
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
                </div>

                {/* Discover Communities */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-on-surface-variant" />
                    <h2 className="font-headline font-bold text-xl uppercase tracking-widest">Discover Communities</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          {club.tags.map((tag) => (
                            <span key={tag} className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] font-black uppercase tracking-tighter text-on-surface-variant group-hover:bg-surface-variant transition-colors">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="global"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-4"
              >
                <div className="bg-surface-container p-6 rounded-full shadow-2xl border border-outline-variant/10">
                  <Activity className="w-12 h-12 text-on-surface-variant/20" />
                </div>
                <h3 className="font-headline font-black text-2xl uppercase italic text-on-surface/40">Global Feed Coming Soon</h3>
                <p className="text-on-surface-variant font-medium text-sm max-w-xs">Connecting elite athletes across the globe. Stay locked for the 0.5 update.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Chat Input — team tab only */}
      {activeTab === "team" && (
        <div className="fixed bottom-28 left-0 w-full px-6 pb-4 bg-gradient-to-t from-background via-background/90 to-transparent z-40 pointer-events-none">
          <div className="max-w-4xl mx-auto flex items-center gap-4 bg-surface-container-high rounded-full p-2.5 pr-3 shadow-2xl border border-outline-variant/20 backdrop-blur-xl pointer-events-auto group">
            <button className="w-12 h-12 flex items-center justify-center text-on-surface-variant hover:text-primary-fixed transition-all hover:rotate-90 active:scale-90">
              <PlusCircle className="w-6 h-6" />
            </button>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-on-surface placeholder:text-on-surface-variant font-bold tracking-tight"
              placeholder="Send a message to the team..."
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-90 ${message.trim() ? 'bg-kinetic-gradient text-on-primary-fixed shadow-primary/30 rotate-0' : 'bg-surface-container-highest text-on-surface-variant opacity-50 grayscale cursor-not-allowed'}`}>
              <Send className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

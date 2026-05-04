import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Bolt, Check, Lock, Play, Plus } from "lucide-react";
import { ScreenState } from "@/src/types";

interface ActiveWorkoutProps {
  onNavigate: (screen: ScreenState) => void;
  key?: string;
}

interface SetData {
  id: number;
  weight: number;
  reps: number;
  isDone: boolean;
  isCurrent: boolean;
}

export default function ActiveWorkout({ onNavigate }: ActiveWorkoutProps) {
  const [sets, setSets] = useState<SetData[]>([
    { id: 1, weight: 25.0, reps: 12, isDone: true, isCurrent: false },
    { id: 2, weight: 25.0, reps: 12, isDone: false, isCurrent: true },
    { id: 3, weight: 25.0, reps: 12, isDone: false, isCurrent: false },
  ]);

  const [restTime, setRestTime] = useState(45);
  const [totalRest, setTotalRest] = useState(45);
  const [isResting] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isResting && restTime > 0) {
      timer = setInterval(() => {
        setRestTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResting, restTime]);

  const toggleSetDone = (id: number) => {
    setSets(prev => prev.map(s => {
      if (s.id === id) return { ...s, isDone: !s.isDone };
      return s;
    }));
  };

  const updateReps = (id: number, val: number) => {
    setSets(prev => prev.map(s => {
      if (s.id === id) return { ...s, reps: val };
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 w-full border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <Bolt className="text-primary-fixed w-6 h-6 fill-current" />
          <h1 className="font-headline font-black tracking-tighter uppercase text-2xl italic text-primary-fixed tracking-widest">FIT&LIT</h1>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95 duration-200">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-4xl mx-auto space-y-8 pb-32">
        {/* Exercise Header & Visual Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div className="space-y-2">
            <span className="font-label text-primary-fixed uppercase tracking-widest text-[10px] font-bold">Current Exercise</span>
            <h2 className="font-headline text-4xl font-black tracking-tight leading-none text-on-background">Dumbbell Bench Press</h2>
            <div className="flex gap-4 pt-4">
              <div className="bg-surface-container-low px-4 py-2 rounded-lg border-l-4 border-primary">
                <p className="font-label text-[10px] uppercase text-on-surface-variant">Target</p>
                <p className="font-headline font-bold text-sm">Chest & Triceps</p>
              </div>
              <div className="bg-surface-container-low px-4 py-2 rounded-lg">
                <p className="font-label text-[10px] uppercase text-on-surface-variant">Tempo</p>
                <p className="font-headline font-bold text-sm">2-0-2-0</p>
              </div>
            </div>
          </div>
          {/* Technique Placeholder */}
          <div className="relative group aspect-video overflow-hidden rounded-lg shadow-2xl bg-surface-container-lowest">
            <img 
              alt="Technique visual" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
              src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 cursor-pointer hover:bg-primary/40 transition-all group/btn">
                <Play className="w-8 h-8 text-primary fill-current group-hover/btn:scale-110 transition-transform" />
              </div>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <span className="bg-surface-container-highest/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter text-primary">Video Guide</span>
            </div>
          </div>
        </section>

        {/* Main Interaction Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Set/Rep Tracker */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-surface-container-low p-1 rounded-lg">
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left">
                    <th className="px-6 pb-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Set</th>
                    <th className="px-6 pb-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Weight</th>
                    <th className="px-6 pb-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-center font-bold">Reps</th>
                    <th className="px-6 pb-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-right font-bold">Done</th>
                  </tr>
                </thead>
                <tbody className="font-headline">
                  {sets.map(set => (
                    <tr key={set.id} className={`${set.isDone ? 'bg-surface-container-highest' : 'bg-surface-container'} group`}>
                      <td className={`px-6 py-4 rounded-l-lg border-l-4 ${set.isDone ? 'border-primary-fixed' : set.isCurrent ? 'border-outline' : 'border-transparent'}`}>
                        <span className={`text-xl font-black ${set.isDone ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                          0{set.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{set.weight.toFixed(1)}</span>
                          <span className="text-[10px] text-on-surface-variant font-label uppercase">KG</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input 
                          className="w-12 bg-transparent border-b border-outline-variant text-center focus:outline-none focus:border-primary text-lg" 
                          type="number" 
                          value={set.reps}
                          onChange={(e) => updateReps(set.id, parseInt(e.target.value) || 0)}
                          disabled={!set.isCurrent && !set.isDone}
                        />
                      </td>
                      <td className="px-6 py-4 text-right rounded-r-lg">
                        <button 
                          onClick={() => toggleSetDone(set.id)}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors active:scale-90 ${set.isDone ? 'bg-primary text-slate-950' : 'border border-outline-variant text-outline-variant hover:border-primary hover:text-primary'}`}
                          disabled={!set.isCurrent && !set.isDone}
                        >
                          {set.isDone ? <Check className="w-5 h-5 stroke-[3]" /> : set.isCurrent ? <Check className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rest Timer Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-surface-container p-8 rounded-lg flex flex-col items-center justify-center text-center overflow-hidden h-full min-h-[350px]">
              {/* Background Large Number */}
              <div className="absolute -bottom-10 -right-4 font-headline text-[14rem] font-black text-surface-variant/30 leading-none select-none pointer-events-none italic">
                {restTime}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <span className="font-label text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Resting Period</span>
                <div className="relative flex items-center justify-center">
                  {/* Circular Progress Indicator */}
                  <svg className="w-48 h-48 -rotate-90">
                    <circle 
                      className="text-surface-container-highest" 
                      cx="96" cy="96" r="88" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                    />
                    <motion.circle 
                      className="text-primary rounded-full" 
                      cx="96" cy="96" r="88" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeDasharray="552.92"
                      animate={{ strokeDashoffset: 552.92 * (1 - restTime / totalRest) }}
                      transition={{ duration: 1, ease: "linear" }}
                      strokeWidth="8" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline text-5xl font-black tracking-tight text-on-background">00:{restTime.toString().padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="mt-8 flex gap-4">
                  <button 
                    onClick={() => {
                      setRestTime(prev => prev + 15);
                      setTotalRest(prev => prev + 15);
                    }}
                    className="bg-surface-container-highest px-6 py-2 rounded-full font-label text-xs font-bold flex items-center gap-2 hover:bg-surface-bright transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> 15s
                  </button>
                  <button 
                    onClick={() => setRestTime(0)}
                    className="bg-primary px-6 py-2 rounded-full font-label text-xs font-black text-slate-950 flex items-center gap-2 hover:opacity-90 transition-all active:scale-95"
                  >
                    SKIP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer-like Actions */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-3xl px-6 py-8 border-t border-outline-variant/10 flex flex-col md:flex-row gap-4 items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-label text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">Next Up</span>
            <span className="font-headline font-bold text-lg">Incline Cable Flyes</span>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => onNavigate("workouts")}
            className="flex-1 md:flex-none px-8 py-4 rounded-xl bg-surface-container-highest text-primary font-headline font-black text-sm uppercase tracking-widest hover:bg-surface-bright transition-all active:scale-95 border border-primary/20"
          >
            Finish Workout
          </button>
          <button 
            className="flex-1 md:flex-none px-12 py-4 rounded-xl bg-kinetic-gradient text-slate-950 font-headline font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
          >
            Next Exercise
          </button>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-primary/3 blur-[100px] -z-10 pointer-events-none"></div>
    </div>
  );
}

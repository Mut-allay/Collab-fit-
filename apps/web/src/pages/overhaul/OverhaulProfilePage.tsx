import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import ProfileView from "@/components/overhaul/ProfileView";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

export default function OverhaulProfilePage() {
  const navigate = useNavigate();
  const onNav = createOverhaulNavigate(navigate);

  return (
    <div className="overhaul dark min-h-screen bg-background pb-32">
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 border-b border-outline-variant/10">
        <button
          type="button"
          onClick={() => onNav("dashboard")}
          className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
        >
          ← Dashboard
        </button>
        <div className="flex items-center gap-2">
          <Zap className="text-primary-fixed w-6 h-6 fill-current" />
          <h1 className="font-headline font-black tracking-tighter uppercase text-lg italic text-primary-fixed">
            Profile
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNav("leaderboard")}
          className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors"
        >
          Leaderboard →
        </button>
      </header>

      <main className="pt-28 px-6 max-w-lg mx-auto">
        <ProfileView />
      </main>
    </div>
  );
}

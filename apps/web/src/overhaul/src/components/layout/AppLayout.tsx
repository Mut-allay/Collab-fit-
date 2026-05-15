import { NavLink, Outlet } from "react-router-dom";
import { Zap, Home, Activity, MapPin, Sparkles, Users } from "lucide-react";

const navItems = [
  { label: "Home", to: "/dashboard", icon: Home },
  { label: "Leaderboard", to: "/leaderboard", icon: Sparkles },
  { label: "Social", to: "/social", icon: Users },
  { label: "Map", to: "/map", icon: MapPin },
  { label: "Workouts", to: "/workouts", icon: Activity },
];

function NavItem({ label, to, icon: Icon }: { label: string; to: string; icon: typeof Home }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex flex-col items-center justify-center gap-1 rounded-3xl px-3 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
          isActive ? "bg-surface-container-high text-primary shadow-[0_10px_30px_rgba(202,253,0,0.2)]" : "text-on-surface-variant hover:text-primary"
        }`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-on-surface selection:bg-primary selection:text-on-primary">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl" />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/10 bg-background/95 backdrop-blur-xl px-4 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Zap className="w-7 h-7 text-primary-fixed" />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-on-surface-variant font-label">FIT&LIT</p>
              <h1 className="font-headline text-2xl font-black uppercase tracking-tighter text-on-surface">
                Live Run Intelligence
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <NavLink to="/profile" className="text-on-surface-variant hover:text-primary transition-colors text-sm uppercase tracking-[0.2em] font-bold">
              Profile
            </NavLink>
            <a href="/" className="text-on-surface-variant hover:text-primary transition-colors text-sm uppercase tracking-[0.2em] font-bold">
              Support
            </a>
          </div>
        </div>
      </header>

      <main className="relative pt-28 pb-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant/10 bg-background/95 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
}

import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Dumbbell, MapPin, Users, Trophy } from "lucide-react";

const TABS = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/workouts", label: "Workout", icon: Dumbbell },
  { to: "/map", label: "Map", icon: MapPin },
  { to: "/social", label: "Social", icon: Users },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full pb-8 pt-4 px-6 z-50 bg-background/80 backdrop-blur-xl border-t border-outline-variant/10 shadow-[0_-20px_40px_rgba(0,0,0,0.6)] rounded-t-[3rem] flex justify-around items-end">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className="flex flex-col items-center justify-center group"
        >
          {({ isActive }) =>
            isActive ? (
              <motion.div
                layoutId="bottom-nav-pill"
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="flex flex-col items-center justify-center bg-kinetic-gradient text-on-primary-fixed rounded-full h-14 w-14 -translate-y-4 shadow-xl shadow-primary/20"
              >
                <Icon className="w-6 h-6 fill-current" />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 group-hover:text-primary transition-all">
                <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                <span className="font-headline font-bold text-[8px] tracking-[0.2em] uppercase mt-1">
                  {label}
                </span>
              </div>
            )
          }
        </NavLink>
      ))}
    </nav>
  );
}

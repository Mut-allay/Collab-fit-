import {
  Home,
  Target,
  TrendingUp,
  Calendar,
  User,
  Settings,
  Zap,
  Dumbbell,
  Flame,
  Activity,
  type LucideIcon,
} from "lucide-react";

// --- Navigation Links ---
export const landingNavItems = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Reviews" },
];

export const appNavItems: { path: string; label: string; icon: LucideIcon }[] =
  [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/plans", label: "Plans", icon: Target },
    { path: "/progress", label: "Progress", icon: TrendingUp },
    { path: "/workout-history", label: "History", icon: Calendar },
  ];

export const userNavItems: { path: string; label: string; icon: LucideIcon }[] =
  [
    { path: "/profile", label: "Profile", icon: User },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

// --- Dashboard Configuration ---
export const DIFFICULTY_COLORS: { [key: string]: string } = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200",
};

export const GOAL_ICONS: { [key: string]: LucideIcon } = {
  general_fitness: Zap,
  strength: Dumbbell,
  weight_loss: Flame,
  muscle_gain: Zap,
  endurance: Activity,
};

// --- Plan Selection Filters ---
export const planCategories: { id: string; name: string; icon: LucideIcon }[] =
  [
    { id: "all", name: "All", icon: Dumbbell },
    { id: "strength", name: "Strength", icon: Zap },
    { id: "general_fitness", name: "General Fitness", icon: Activity },
    { id: "weight_loss", name: "Weight Loss", icon: Flame },
    { id: "muscle_gain", name: "Muscle Gain", icon: Zap },
    { id: "endurance", name: "Endurance", icon: Activity },
  ];

export const planDifficulties = [
  { id: "all", name: "All Levels" },
  { id: "beginner", name: "Beginner" },
  { id: "intermediate", name: "Intermediate" },
  { id: "advanced", name: "Advanced" },
];
  
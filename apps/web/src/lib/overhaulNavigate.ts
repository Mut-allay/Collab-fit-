import type { NavigateFunction } from "react-router-dom";
import type { ScreenState } from "@/overhaul/src/types";

const ROUTES: Partial<Record<ScreenState, string>> = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  leaderboard: "/leaderboard",
  workouts: "/plans",
  map: "/teams",
  social: "/leaderboard",
  corporate: "/teams",
  challenges: "/teams",
  profile: "/profile",
  onboarding: "/profile",
  clubs: "/teams",
  "active-workout": "/dashboard",
};

export function createOverhaulNavigate(navigate: NavigateFunction) {
  return (screen: ScreenState) => {
    const to = ROUTES[screen];
    if (to) navigate(to);
    else navigate("/dashboard");
  };
}

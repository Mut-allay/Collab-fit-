import type { NavigateFunction } from "react-router-dom";
import type { ScreenState } from "@/overhaul/src/types";

const ROUTES: Partial<Record<ScreenState, string>> = {
  landing: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  leaderboard: "/leaderboard",
  workouts: "/workouts",
  map: "/map",
  social: "/social",
  corporate: "/corporate",
  challenges: "/challenges",
  profile: "/profile",
  onboarding: "/onboarding",
  "active-workout": "/active-workout",
};

export function createOverhaulNavigate(navigate: NavigateFunction) {
  return (screen: ScreenState) => {
    const to = ROUTES[screen];
    if (to) navigate(to);
    else navigate("/dashboard");
  };
}

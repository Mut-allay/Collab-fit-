import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

// Layouts
import AuthLayout from "@/overhaul/src/components/layout/AuthLayout";
import AppLayout from "@/overhaul/src/components/layout/AppLayout";
import ProtectedRoute from "@/overhaul/src/components/layout/ProtectedRoute";

// Auth / public routes
import LandingRoute from "@/overhaul/src/routes/landingRoute";
import LoginRoute from "@/overhaul/src/routes/loginRoute";
import SignupRoute from "@/overhaul/src/routes/signupRoute";
import DataVerificationRoute from "@/overhaul/src/routes/DataVerificationRoute";

// Onboarding
import OnboardingFlow from "@/overhaul/src/components/OnboardingFlow";

// Authenticated page routes
import DashboardRoute from "@/overhaul/src/routes/dashboardRoute";
import LeaderboardRoute from "@/overhaul/src/routes/leaderboardRoute";
import ProfileRoute from "@/overhaul/src/routes/profileRoute";
import ProgressPage from "@/overhaul/src/routes/ProgressPage";
import PlanSelectionPage from "@/overhaul/src/routes/PlanSelectionPage";
import ViewPlanPage from "@/overhaul/src/routes/ViewPlanPage";
import WorkoutSessionPage from "@/overhaul/src/routes/WorkoutSessionPage";
import WorkoutSummaryPage from "@/overhaul/src/routes/WorkoutSummaryPage";
import WorkoutHistoryPage from "@/overhaul/src/routes/WorkoutHistoryPage";
import TeamsPage from "@/overhaul/src/routes/TeamsPage";
import CreateTeamPage from "@/overhaul/src/routes/CreateTeamPage";
import InvitationsPage from "@/overhaul/src/routes/InvitationsPage";

// Feature components with onNavigate prop — wrapped below
import Workouts from "@/overhaul/src/components/Workouts";
import RunClubMap from "@/overhaul/src/components/RunClubMap";
import SocialFeed from "@/overhaul/src/components/SocialFeed";
import ActiveWorkout from "@/overhaul/src/components/ActiveWorkout";
import CorporateHub from "@/overhaul/src/components/CorporateHub";
import TeamChallenges from "@/overhaul/src/components/TeamChallenges";

import { createOverhaulNavigate } from "@/lib/overhaulNavigate";

// Route wrappers that bridge onNavigate → useNavigate
function WorkoutsPage() {
  const nav = createOverhaulNavigate(useNavigate());
  return <Workouts onNavigate={nav} />;
}
function MapPage() {
  const nav = createOverhaulNavigate(useNavigate());
  return <RunClubMap onNavigate={nav} />;
}
function SocialPage() {
  const nav = createOverhaulNavigate(useNavigate());
  return <SocialFeed onNavigate={nav} />;
}
function ActiveWorkoutPage() {
  const nav = createOverhaulNavigate(useNavigate());
  return <ActiveWorkout onNavigate={nav} />;
}
function CorporatePage() {
  const nav = createOverhaulNavigate(useNavigate());
  return <CorporateHub onNavigate={nav} />;
}
function ChallengesPage() {
  const nav = createOverhaulNavigate(useNavigate());
  return <TeamChallenges onNavigate={nav} />;
}

const router = createBrowserRouter([
  // ─── Public / Auth (AuthLayout header) ──────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/", element: <LandingRoute /> },
      { path: "/auth", element: <LandingRoute /> },
      { path: "/login", element: <LoginRoute /> },
      { path: "/signup", element: <SignupRoute /> },
      { path: "/verify", element: <DataVerificationRoute /> },
    ],
  },

  // ─── Onboarding (auth required, no onboarding guard) ────────────────────────
  {
    element: <ProtectedRoute onboardingGuard={false} />,
    children: [{ path: "/onboarding", element: <OnboardingFlow /> }],
  },

  // ─── Authenticated app (AppLayout with top header + bottom nav) ──────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <DashboardRoute /> },
          { path: "/leaderboard", element: <LeaderboardRoute /> },
          { path: "/profile", element: <ProfileRoute /> },
          { path: "/social", element: <SocialPage /> },
          { path: "/map", element: <MapPage /> },
          { path: "/workouts", element: <WorkoutsPage /> },
          { path: "/corporate", element: <CorporatePage /> },
          { path: "/challenges", element: <ChallengesPage /> },
          { path: "/active-workout", element: <ActiveWorkoutPage /> },
          { path: "/progress", element: <ProgressPage /> },
          { path: "/plans", element: <PlanSelectionPage /> },
          { path: "/plans/:planId", element: <ViewPlanPage /> },
          { path: "/workout-history", element: <WorkoutHistoryPage /> },
          { path: "/teams", element: <TeamsPage /> },
          { path: "/teams/create", element: <CreateTeamPage /> },
          { path: "/teams/invitations", element: <InvitationsPage /> },
          { path: "/verification", element: <DataVerificationRoute /> },
        ],
      },
    ],
  },

  // ─── Fullscreen standalone (no nav shell) ───────────────────────────────────
  { path: "/workout/:planId/:phaseId", element: <WorkoutSessionPage /> },
  { path: "/workout-summary/:planId/:phaseId", element: <WorkoutSummaryPage /> },

  // ─── Catch-all ───────────────────────────────────────────────────────────────
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f0f0f",
            color: "#ffffff",
            border: "1px solid rgba(202,253,0,0.25)",
            borderRadius: "16px",
            fontFamily: "Manrope, sans-serif",
          },
        }}
      />
    </AuthProvider>
  );
}
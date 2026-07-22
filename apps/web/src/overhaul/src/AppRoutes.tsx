import { useMemo } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { createOverhaulNavigate } from "@/lib/overhaulNavigate";
import AuthLayout from "./components/layout/AuthLayout";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LandingRoute from "./routes/landingRoute";
import LoginRoute from "./routes/loginRoute";
import SignupRoute from "./routes/signupRoute";
import DashboardRoute from "./routes/dashboardRoute";
import LeaderboardRoute from "./routes/leaderboardRoute";
import ProfileRoute from "./routes/profileRoute";
import PlanSelectionPage from "./routes/PlanSelectionPage";
import ViewPlanPage from "./routes/ViewPlanPage";
import WorkoutSessionPage from "./routes/WorkoutSessionPage";
import WorkoutSummaryPage from "./routes/WorkoutSummaryPage";
import WorkoutHistoryPage from "./routes/WorkoutHistoryPage";
import ProgressPage from "./routes/ProgressPage";
import TeamsPage from "./routes/TeamsPage";
import CreateTeamPage from "./routes/CreateTeamPage";
import InvitationsPage from "./routes/InvitationsPage";
import DataVerificationRoute from "./routes/DataVerificationRoute";
import OnboardingFlow from "./components/OnboardingFlow";
import Workouts from "./components/Workouts";
import RunClubMap from "./components/RunClubMap";
import SocialFeed from "./components/SocialFeed";
import ActiveWorkout from "./components/ActiveWorkout";
import CorporateHub from "./components/CorporateHub";
import TeamChallenges from "./components/TeamChallenges";

function onboardingComplete() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("fitlit-onboarding-complete") === "true";
}

function WorkoutsRoute() {
  const navigate = useNavigate();
  return <Workouts onNavigate={createOverhaulNavigate(navigate)} />;
}

function RunClubMapRoute() {
  const navigate = useNavigate();
  return <RunClubMap onNavigate={createOverhaulNavigate(navigate)} />;
}

function SocialRoute() {
  const navigate = useNavigate();
  return <SocialFeed onNavigate={createOverhaulNavigate(navigate)} />;
}

function ActiveWorkoutRoute() {
  const navigate = useNavigate();
  return <ActiveWorkout onNavigate={createOverhaulNavigate(navigate)} />;
}

function CorporateRoute() {
  const navigate = useNavigate();
  return <CorporateHub onNavigate={createOverhaulNavigate(navigate)} />;
}

function ChallengesRoute() {
  const navigate = useNavigate();
  return <TeamChallenges onNavigate={createOverhaulNavigate(navigate)} />;
}

function OnboardingRoute() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface grid place-items-center">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-high p-8 text-center">
          <p className="font-headline font-black text-2xl text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (onboardingComplete()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <OnboardingFlow />;
}

export default function AppRoutes() {
  const { currentUser, loading } = useAuth();
  const isLoggedIn = Boolean(currentUser);
  const location = useLocation();

  const defaultRoute = useMemo(() => {
    if (loading) return "/auth";
    if (!isLoggedIn) return "/auth";
    return onboardingComplete() ? "/dashboard" : "/onboarding";
  }, [isLoggedIn, loading]);

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<LandingRoute />} />
        <Route path="auth" element={<LandingRoute />} />
        <Route path="login" element={<LoginRoute />} />
        <Route path="signup" element={<SignupRoute />} />
        <Route path="onboarding" element={<OnboardingRoute />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardRoute />} />
          <Route path="leaderboard" element={<LeaderboardRoute />} />
          <Route path="social" element={<SocialRoute />} />
          <Route path="map" element={<RunClubMapRoute />} />
          <Route path="workouts" element={<WorkoutsRoute />} />
          <Route path="profile" element={<ProfileRoute />} />
          <Route path="plans" element={<PlanSelectionPage />} />
          <Route path="plans/:planId" element={<ViewPlanPage />} />
          <Route path="plans/:planId/session/:phaseId" element={<WorkoutSessionPage />} />
          <Route path="plans/:planId/summary/:phaseId" element={<WorkoutSummaryPage />} />
          <Route path="workout-history" element={<WorkoutHistoryPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="teams/create" element={<CreateTeamPage />} />
          <Route path="teams/invitations" element={<InvitationsPage />} />
          <Route path="verification" element={<DataVerificationRoute />} />
          <Route path="corporate" element={<CorporateRoute />} />
          <Route path="challenges" element={<ChallengesRoute />} />
          <Route path="active-workout" element={<ActiveWorkoutRoute />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  );
}

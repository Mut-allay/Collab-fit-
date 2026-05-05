import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

import PublicLayout from "@/components/layout/PublicLayout";
import RequireAuth from "@/components/layout/RequireAuth";
import OverhaulAppLayout from "@/overhaul/src/components/AppLayout";

import LandingRoute from "@/overhaul/src/routes/landingRoute";
import LoginRoute from "@/overhaul/src/routes/loginRoute";
import SignupRoute from "@/overhaul/src/routes/signupRoute";
import DashboardRoute from "@/overhaul/src/routes/dashboardRoute";
import ProfileRoute from "@/overhaul/src/routes/profileRoute";
import LeaderboardRoute from "@/overhaul/src/routes/leaderboardRoute";
import DataVerificationRoute from "@/overhaul/src/routes/DataVerificationRoute";
import PlanSelectionPage from "@/overhaul/src/routes/PlanSelectionPage";
import ViewPlanPage from "@/overhaul/src/routes/ViewPlanPage";
import WorkoutSessionPage from "@/overhaul/src/routes/WorkoutSessionPage";
import WorkoutSummaryPage from "@/overhaul/src/routes/WorkoutSummaryPage";
import WorkoutHistoryPage from "@/overhaul/src/routes/WorkoutHistoryPage";
import ProgressPage from "@/overhaul/src/routes/ProgressPage";
import TeamsPage from "@/overhaul/src/routes/TeamsPage";
import CreateTeamPage from "@/overhaul/src/routes/CreateTeamPage";
import InvitationsPage from "@/overhaul/src/routes/InvitationsPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingRoute />,
    },
    {
      path: "/login",
      element: <LoginRoute />,
    },
    {
      path: "/signup",
      element: <SignupRoute />,
    },
    {
      element: <PublicLayout />,
      children: [
        {
          path: "/verify",
          element: <DataVerificationRoute />,
        },
      ],
    },
    {
      element: <RequireAuth />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardRoute />,
        },
        {
          path: "/profile",
          element: <ProfileRoute />,
        },
        {
          path: "/leaderboard",
          element: <LeaderboardRoute />,
        },
        {
          element: <OverhaulAppLayout />,
          children: [
            {
              path: "/plans",
              element: <PlanSelectionPage />,
            },
            {
              path: "/plans/:planId",
              element: <ViewPlanPage />,
            },
            {
              path: "/workout-history",
              element: <WorkoutHistoryPage />,
            },
            {
              path: "/progress",
              element: <ProgressPage />,
            },
            {
              path: "/teams",
              element: <TeamsPage />,
            },
            {
              path: "/teams/create",
              element: <CreateTeamPage />,
            },
            {
              path: "/invitations",
              element: <InvitationsPage />,
            },
          ],
        },
      ],
    },
    {
      path: "/workout/:planId/:phaseId",
      element: <WorkoutSessionPage />,
    },
    {
      path: "/workout-summary/:planId/:phaseId",
      element: <WorkoutSummaryPage />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid rgba(6, 182, 212, 0.3)",
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;

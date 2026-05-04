import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

// Layouts
import AppLayout from "@/components/layout/AppLayout";
import PublicLayout from "@/components/layout/PublicLayout";
import RequireAuth from "@/components/layout/RequireAuth";

// Pages
import LandingPage from "@/pages/LandingPage";
import OverhaulLoginPage from "@/pages/overhaul/OverhaulLoginPage";
import OverhaulSignupPage from "@/pages/overhaul/OverhaulSignupPage";
import OverhaulDashboardPage from "@/pages/overhaul/OverhaulDashboardPage";
import OverhaulProfilePage from "@/pages/overhaul/OverhaulProfilePage";
import OverhaulLeaderboardPage from "@/pages/overhaul/OverhaulLeaderboardPage";
import { DataVerificationPage } from "@/pages/DataVerificationPage";
import PlanSelectionPage from "@/pages/PlanSelectionPage";
import ViewPlanPage from "@/pages/ViewPlanPage";
import WorkoutSessionPage from "@/pages/WorkoutSessionPage";
import WorkoutSummaryPage from "@/pages/WorkoutSummaryPage";
import WorkoutHistoryPage from "@/pages/WorkoutHistoryPage";
import ProgressPage from "@/pages/ProgressPage";
import TeamsPage from "@/pages/TeamsPage";
import CreateTeamPage from "@/pages/CreateTeamPage";
import InvitationsPage from "@/pages/InvitationsPage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <OverhaulLoginPage />,
    },
    {
      path: "/signup",
      element: <OverhaulSignupPage />,
    },
    {
      element: <PublicLayout />,
      children: [
        {
          path: "/verify",
          element: <DataVerificationPage />,
        },
      ],
    },
    {
      element: <RequireAuth />,
      children: [
        {
          path: "/dashboard",
          element: <OverhaulDashboardPage />,
        },
        {
          path: "/profile",
          element: <OverhaulProfilePage />,
        },
        {
          path: "/leaderboard",
          element: <OverhaulLeaderboardPage />,
        },
        {
          element: <AppLayout />,
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

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

// Pages
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import { DataVerificationPage } from "@/pages/DataVerificationPage";
import PlanSelectionPage from "@/pages/PlanSelectionPage";
import ViewPlanPage from "@/pages/ViewPlanPage";
import ProfilePage from "@/pages/ProfilePage";
import WorkoutSessionPage from "@/pages/WorkoutSessionPage";
import WorkoutSummaryPage from "@/pages/WorkoutSummaryPage";
import WorkoutHistoryPage from "@/pages/WorkoutHistoryPage";
import ProgressPage from "@/pages/ProgressPage";
import TeamsPage from "@/pages/TeamsPage";
import CreateTeamPage from "@/pages/CreateTeamPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import InvitationsPage from "@/pages/InvitationsPage";

// Main App component with routing setup
// Uses AuthProvider for global auth state
// Defines public, protected, and special routes
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      element: <PublicLayout />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path: "/signup",
          element: <SignupPage />,
        },
        {
          path: "/verify",
          element: <DataVerificationPage />,
        },
      ],
    },
    {
      element: <AppLayout />,
      children: [
        {
          path: "/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/profile",
          element: <ProfilePage />,
        },
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
          path: "/leaderboard",
          element: <LeaderboardPage />,
        },
        {
          path: "/invitations",
          element: <InvitationsPage />,
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
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;

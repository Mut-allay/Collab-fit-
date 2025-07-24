import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import DashboardPage from "@/pages/DashboardPage";
import { DataVerificationPage } from "@/pages/DataVerificationPage";
import PlanSelectionPage from "@/pages/PlanSelectionPage";
import ViewPlanPage from "@/pages/ViewPlanPage";
import ProfilePage from "@/pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Landing Page Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Auth Routes with minimal layout */}
            <Route
              path="/login"
              element={
                <div className="min-h-screen flex flex-col">
                  <Navbar variant="landing" />
                  <div className="flex-1">
                    <LoginPage />
                  </div>
                  <Footer variant="landing" />
                </div>
              }
            />

            <Route
              path="/signup"
              element={
                <div className="min-h-screen flex flex-col">
                  <Navbar variant="landing" />
                  <div className="flex-1">
                    <SignupPage />
                  </div>
                  <Footer variant="landing" />
                </div>
              }
            />

            {/* Public verification route */}
            <Route
              path="/verify"
              element={
                <div className="min-h-screen flex flex-col">
                  <Navbar variant="landing" />
                  <div className="flex-1">
                    <DataVerificationPage />
                  </div>
                  <Footer variant="landing" />
                </div>
              }
            />

            {/* Protected App Routes with app layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Navbar variant="app" />
                    <div className="flex-1">
                      <DashboardPage />
                    </div>
                    <Footer variant="app" />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Navbar variant="app" />
                    <div className="flex-1">
                      <ProfilePage />
                    </div>
                    <Footer variant="app" />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/plans"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Navbar variant="app" />
                    <div className="flex-1">
                      <PlanSelectionPage />
                    </div>
                    <Footer variant="app" />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/plans/:planId"
              element={
                <ProtectedRoute>
                  <div className="min-h-screen flex flex-col">
                    <Navbar variant="app" />
                    <div className="flex-1">
                      <ViewPlanPage />
                    </div>
                    <Footer variant="app" />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

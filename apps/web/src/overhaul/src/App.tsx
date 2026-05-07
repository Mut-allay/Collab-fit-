import { AnimatePresence } from "framer-motion";
import AppLayout from "@/overhaul/src/components/AppLayout";
import OnboardingStep1 from "@/overhaul/src/components/OnboardingStep1";
import OnboardingStep2 from "@/overhaul/src/components/OnboardingStep2";
import OnboardingStep4 from "@/overhaul/src/components/OnboardingStep4";
import OnboardingSuccess from "@/overhaul/src/components/OnboardingSuccess";
import AuthLanding from "@/overhaul/src/components/AuthLanding";
import Login from "@/overhaul/src/components/Login";
import SignUp from "@/overhaul/src/components/SignUp";
import Workouts from "@/overhaul/src/components/Workouts";
import Clubs from "@/overhaul/src/components/Clubs";
import Leaderboard from "@/overhaul/src/components/Leaderboard";
import RunClubMap from "@/overhaul/src/components/RunClubMap";
import CorporateHub from "@/overhaul/src/components/CorporateHub";
import TeamChallenges from "@/overhaul/src/components/TeamChallenges";
import SocialFeed from "@/overhaul/src/components/SocialFeed";
import ActiveWorkout from "@/overhaul/src/components/ActiveWorkout";
import { DashboardShell } from "@/overhaul/src/components/DashboardShell";
import { GoogleFitOAuthStandalone } from "@/overhaul/src/components/GoogleFitOAuthStandalone";
import { useOnboarding } from "@/overhaul/src/hooks/useOnboarding";
import type { ScreenState } from "@/overhaul/src/types";

export default function App() {
  const {
    screen,
    setScreen,
    step,
    isLoading,
    metrics,
    updateMetrics,
    handleBack,
    handleContinue,
    handleComplete,
    handleAuthSuccess,
    connectGoogleFit,
  } = useOnboarding();

  const onNavigate = (next: ScreenState) => setScreen(next);

  return (
    <AnimatePresence mode="wait">
      {screen === "landing" && (
        <AuthLanding
          key="landing"
          onNavigate={setScreen}
          onSuccess={handleAuthSuccess}
        />
      )}

      {screen === "login" && (
        <Login
          key="login"
          onNavigate={setScreen}
          onSuccess={handleAuthSuccess}
        />
      )}

      {screen === "signup" && (
        <SignUp
          key="signup"
          onNavigate={setScreen}
          onSuccess={() => setScreen("onboarding")}
        />
      )}

      {screen === "onboarding" && (
        <AppLayout key="onboarding">
          {step === 1 && (
            <OnboardingStep1
              metrics={metrics}
              onUpdateMetrics={updateMetrics}
              onContinue={handleContinue}
              isLoading={isLoading}
            />
          )}
          {step === 2 && (
            <OnboardingStep2
              metrics={metrics}
              onUpdateMetrics={updateMetrics}
              onBack={handleBack}
              onContinue={handleContinue}
              isLoading={isLoading}
            />
          )}
          {step === 3 && (
            <OnboardingStep4
              metrics={metrics}
              onUpdateMetrics={updateMetrics}
              onBack={handleBack}
              onComplete={handleComplete}
              onConnectGoogleFit={connectGoogleFit}
              isLoading={isLoading}
            />
          )}
          {step === 4 && (
            <OnboardingSuccess
              metrics={metrics}
              onComplete={() => setScreen("dashboard")}
            />
          )}
        </AppLayout>
      )}

      {screen === "dashboard" && (
        <div key="dashboard-standalone">
          <GoogleFitOAuthStandalone />
          <DashboardShell onNavigate={onNavigate} />
        </div>
      )}

      {screen === "workouts" && (
        <Workouts key="workouts" onNavigate={setScreen} />
      )}

      {screen === "clubs" && (
        <Clubs key="clubs" onNavigate={setScreen} />
      )}

      {screen === "leaderboard" && (
        <Leaderboard key="leaderboard" onNavigate={setScreen} />
      )}

      {screen === "map" && (
        <RunClubMap key="map" onNavigate={setScreen} />
      )}

      {screen === "corporate" && (
        <CorporateHub key="corporate" onNavigate={setScreen} />
      )}

      {screen === "challenges" && (
        <TeamChallenges key="challenges" onNavigate={setScreen} />
      )}

      {screen === "social" && (
        <SocialFeed key="social" onNavigate={setScreen} />
      )}

      {screen === "active-workout" && (
        <ActiveWorkout key="active-workout" onNavigate={setScreen} />
      )}
    </AnimatePresence>
  );
}

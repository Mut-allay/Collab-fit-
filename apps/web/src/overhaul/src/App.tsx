import { AnimatePresence } from "framer-motion";
import AppLayout from "@/src/components/AppLayout";
import OnboardingStep2 from "@/src/components/OnboardingStep2";
import AuthLanding from "@/src/components/AuthLanding";
import Login from "@/src/components/Login";
import SignUp from "@/src/components/SignUp";
import Dashboard from "@/src/components/Dashboard";
import Workouts from "@/src/components/Workouts";
import Clubs from "@/src/components/Clubs";
import Leaderboard from "@/src/components/Leaderboard";
import RunClubMap from "@/src/components/RunClubMap";
import CorporateHub from "@/src/components/CorporateHub";
import TeamChallenges from "@/src/components/TeamChallenges";
import SocialFeed from "@/src/components/SocialFeed";
import ActiveWorkout from "@/src/components/ActiveWorkout";
import { useOnboarding } from "@/src/hooks/useOnboarding";

export default function App() {
  const { 
    screen,
    setScreen,
    metrics, 
    updateMetrics, 
    handleBack, 
    handleContinue, 
    handleAuthSuccess,
    connectGoogleFit 
  } = useOnboarding();

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
          <OnboardingStep2 
            metrics={metrics}
            onUpdateMetrics={updateMetrics}
            onBack={handleBack}
            onContinue={handleContinue}
            onConnectGoogleFit={connectGoogleFit}
          />
        </AppLayout>
      )}

      {screen === "dashboard" && (
        <Dashboard key="dashboard" onNavigate={setScreen} />
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

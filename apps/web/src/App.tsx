import { Button } from "@/components/ui/button";
import { AuthProvider } from "@/contexts/AuthContext";

function AppContent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-spark-500 mb-2">
            FitSpark ⚡
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered fitness tracking and coaching platform
          </p>
        </header>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-2xl font-semibold mb-4">
              🎉 Foundation Complete!
            </h2>
            <p className="text-muted-foreground mb-4">
              FitSpark foundation is ready with Firebase client SDK:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                PNPM Monorepo with Turborepo
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                React + Vite + TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                Tailwind CSS + shadcn/ui
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                Firebase Client SDK (Auth, Firestore, Storage)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                Shared Zod Schemas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                Firebase Auth Context & Hooks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                Firestore Hooks & Security Rules
              </li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <Button variant="spark" size="lg">
              Get Started with FitSpark
            </Button>
            <Button variant="fitness" size="lg">
              View Progress Analytics
            </Button>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              🚀 Simplified Architecture: Firebase Client SDK Only - No Backend
              API Layer!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

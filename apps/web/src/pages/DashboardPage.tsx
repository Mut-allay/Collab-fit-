import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { currentUser, userProfile, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-spark-500">FitSpark ⚡</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {userProfile?.displayName || currentUser?.email}!
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {userProfile?.displayName || "Not set"}
                </p>
                <p>
                  <strong>Email:</strong> {currentUser?.email}
                </p>
                <p>
                  <strong>Role:</strong> {userProfile?.role || "User"}
                </p>
                <p>
                  <strong>Member since:</strong>{" "}
                  {currentUser?.metadata.creationTime
                    ? new Date(
                        currentUser.metadata.creationTime
                      ).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start your fitness journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="spark">
                Start Workout
              </Button>
              <Button className="w-full" variant="fitness">
                View Progress
              </Button>
              <Button className="w-full" variant="outline">
                Browse Programs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest workouts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No recent activity. Start your first workout!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>🎉 Welcome to FitSpark!</CardTitle>
              <CardDescription>
                You've successfully implemented Milestone 2: Core User & Auth
                Flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">✅ Firebase Authentication</p>
                <p className="text-sm">✅ User Registration & Login</p>
                <p className="text-sm">✅ Protected Routes</p>
                <p className="text-sm">✅ Form Validation with Zod</p>
                <p className="text-sm">✅ shadcn/ui Components</p>
                <p className="text-sm">✅ Toast Notifications</p>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">
                  Next up: Milestone 3 - Fitness Plan Generation & Onboarding
                  Flow
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

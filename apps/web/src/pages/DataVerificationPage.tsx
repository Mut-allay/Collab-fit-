import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Target, Calendar } from "lucide-react";
import { useDataVerification } from "@/hooks/useDataVerification";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { VerificationHeader } from "@/components/verification/VerificationHeader";
import { VerificationResultCard } from "@/components/verification/VerificationResultCard";
import { VerificationDetailsCard } from "@/components/verification/VerificationDetailsCard";

export function DataVerificationPage() {
  const { result, loading, error, runVerification } = useDataVerification();

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/hero-2.png"
          alt="Fitness background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/80 to-black/70" />
      </div>

      <div className="relative z-10 container mx-auto p-6 max-w-4xl">
      <VerificationHeader />

      <div className="mb-6 text-center">
        <Button onClick={runVerification} disabled={loading} size="lg" className="font-manrope">
          {loading ? "Verifying..." : "Run Verification"}
        </Button>
      </div>

      {loading && <LoadingSpinner message="Checking Firestore data..." />}

      {error && (
        <Card className="mb-6 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2 font-manrope">
              <XCircle className="h-5 w-5" />
              Verification Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 font-manrope">{error}</p>
            <p className="text-sm text-gray-400 mt-2 font-manrope">
              This could be due to Firestore permissions. Ensure you are logged in and your security rules allow reads to these public collections.
            </p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          <VerificationResultCard result={result} />
          <VerificationDetailsCard
            title="Exercises"
            Icon={Target}
            count={result.exercises.count}
            success={result.exercises.success}
            expected="(Expected: 10+)"
            samples={result.exercises.samples}
          />
          <VerificationDetailsCard
            title="Workout Programs"
            Icon={Calendar}
            count={result.workoutPrograms.count}
            success={result.workoutPrograms.success}
            expected="(Expected: 3+)"
            samples={result.workoutPrograms.samples}
          />
        </div>
      )}
      </div>
    </div>
  );
}

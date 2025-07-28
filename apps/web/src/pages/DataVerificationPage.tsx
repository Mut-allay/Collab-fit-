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
    <div className="container mx-auto p-6 max-w-4xl">
      <VerificationHeader />

      <div className="mb-6 text-center">
        <Button onClick={runVerification} disabled={loading} size="lg">
          {loading ? "Verifying..." : "Run Verification"}
        </Button>
      </div>

      {loading && <LoadingSpinner message="Checking Firestore data..." />}

      {error && (
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Verification Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
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
  );
}

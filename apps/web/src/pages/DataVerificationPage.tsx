import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VerificationResult {
  exercises: {
    count: number;
    samples: any[];
    success: boolean;
  };
  workoutPrograms: {
    count: number;
    samples: any[];
    success: boolean;
  };
  overall: boolean;
}

export function DataVerificationPage() {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      // Verify exercises
      const exercisesRef = collection(db, "exercises");
      const exercisesSnapshot = await getDocs(exercisesRef);
      const exercisesSamples: any[] = [];

      // Show sample exercises
      console.log("\n📋 Sample exercises:");
      let count = 0;
      exercisesSnapshot.forEach((doc) => {
        if (count < 3) {
          // Show first 3
          const data = doc.data();
          exercisesSamples.push({ id: doc.id, ...data });
          count++;
        }
      });

      // Verify workout programs
      const programsRef = collection(db, "workoutPrograms");
      const programsSnapshot = await getDocs(programsRef);
      const programsSamples: any[] = [];

      programsSnapshot.forEach((doc) => {
        programsSamples.push({ id: doc.id, ...doc.data() });
      });

      const verificationResult: VerificationResult = {
        exercises: {
          count: exercisesSnapshot.size,
          samples: exercisesSamples,
          success: exercisesSnapshot.size >= 10,
        },
        workoutPrograms: {
          count: programsSnapshot.size,
          samples: programsSamples,
          success: programsSnapshot.size >= 3,
        },
        overall: exercisesSnapshot.size >= 10 && programsSnapshot.size >= 3,
      };

      setResult(verificationResult);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          🔍 Firestore Data Verification
        </h1>
        <p className="text-muted-foreground">
          Verify that the Firestore seeding was successful
        </p>
      </div>

      <div className="mb-6">
        <Button
          onClick={runVerification}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Verifying..." : "Run Verification"}
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              ❌ Verification Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              This might be normal if you're not authenticated. Try logging in
              first.
            </p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6">
          {/* Overall Status */}
          <Card
            className={result.overall ? "border-green-500" : "border-red-500"}
          >
            <CardHeader>
              <CardTitle>
                {result.overall
                  ? "🎉 Verification Successful!"
                  : "❌ Verification Failed"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {result.overall
                  ? "All data has been seeded correctly to Firestore!"
                  : "Some data is missing or incomplete. Consider re-running the seeding script."}
              </p>
            </CardContent>
          </Card>

          {/* Exercises Verification */}
          <Card>
            <CardHeader>
              <CardTitle>🏋️ Exercises Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p>
                  <strong>Count:</strong> {result.exercises.count} exercises
                  {result.exercises.success ? " ✅" : " ❌ (Expected: 10+)"}
                </p>

                {result.exercises.samples.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Sample exercises:</p>
                    <div className="space-y-2">
                      {result.exercises.samples.map((exercise) => (
                        <div key={exercise.id} className="p-2 bg-muted rounded">
                          <p>
                            <strong>{exercise.name}</strong> (
                            {exercise.category})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {exercise.muscleGroups?.join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Workout Programs Verification */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Workout Programs Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p>
                  <strong>Count:</strong> {result.workoutPrograms.count}{" "}
                  programs
                  {result.workoutPrograms.success
                    ? " ✅"
                    : " ❌ (Expected: 3+)"}
                </p>

                {result.workoutPrograms.samples.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Available workout plans:</p>
                    <div className="space-y-3">
                      {result.workoutPrograms.samples.map((program) => (
                        <div key={program.id} className="p-3 bg-muted rounded">
                          <p>
                            <strong>{program.title}</strong> (
                            {program.difficulty})
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            {program.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            📅 {program.durationWeeks} weeks •
                            {program.sessionsPerWeek} sessions/week • 🎯{" "}
                            {program.goal}
                          </p>
                          {program.phases && (
                            <p className="text-xs text-muted-foreground">
                              🏋️ {program.phases.length} workout phases
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>🚀 Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              {result.overall ? (
                <div className="space-y-2">
                  <p>✅ Firestore is ready for development!</p>
                  <p>
                    ✅ You can now proceed with building the Plan Selection UI
                  </p>
                  <p className="text-sm text-muted-foreground">
                    🌐 You can also view the data directly in the{" "}
                    <a
                      href="https://console.firebase.google.com/project/fitspark-staging/firestore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Firebase Console
                    </a>
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>❌ Some data is missing</p>
                  <p>Consider running the seeding script again:</p>
                  <code className="block p-2 bg-muted rounded text-sm">
                    pnpm run seed
                  </code>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

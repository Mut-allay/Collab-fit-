import { useState, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Exercise, WorkoutProgram } from "@fitspark/shared";

// Define the shape of the verification result
export interface VerificationResult {
  exercises: {
    count: number;
    samples: Exercise[];
    success: boolean;
  };
  workoutPrograms: {
    count: number;
    samples: WorkoutProgram[];
    success: boolean;
  };
  overall: boolean;
}

export function useDataVerification() {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runVerification = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Verify exercises
      const exercisesRef = collection(db, "exercises");
      const exercisesSnapshot = await getDocs(exercisesRef);
      const exercisesSamples = exercisesSnapshot.docs
        .slice(0, 3)
        .map((doc) => ({ id: doc.id, ...doc.data() })) as Exercise[];

      // Verify workout programs
      const programsRef = collection(db, "workoutPrograms");
      const programsSnapshot = await getDocs(programsRef);
      const programsSamples = programsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WorkoutProgram[];

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
      setError(err.message || "An unknown error occurred during verification.");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { result, loading, error, runVerification };
}

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, Check, ArrowLeft } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  instructions: string[];
  sets: number;
  reps: number;
  restSeconds: number;
}

interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime: number;
  duration?: number;
}

interface WorkoutPhase {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  estimatedDuration: number;
}

interface WorkoutPlan {
  id: string;
  title: string;
  phases: WorkoutPhase[];
}

interface SetLog {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

interface WorkoutSession {
  workoutPlanId: string;
  phaseId: string;
  phaseName: string;
  startTime: Date;
  endTime?: Date;
  sets: SetLog[];
  totalVolume: number;
  duration: number;
}

export default function WorkoutSessionPage() {
  const { planId, phaseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // State management
  const [currentPhase, setCurrentPhase] = useState<WorkoutPhase | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exerciseDetails, setExerciseDetails] = useState<Map<string, Exercise>>(
    new Map()
  );

  // Set logging state
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentReps, setCurrentReps] = useState("");
  const [setLogs, setSetLogs] = useState<SetLog[]>([]);

  // Get current exercise and set info
  const currentWorkoutExercise = currentPhase?.exercises[currentExerciseIndex];
  const currentExercise = currentWorkoutExercise
    ? exerciseDetails.get(currentWorkoutExercise.exerciseId)
    : null;
  const totalSets = currentWorkoutExercise?.sets || 0;
  const totalExercises = currentPhase?.exercises.length || 0;
  const isLastSet = currentSetIndex >= totalSets - 1;
  const isLastExercise = currentExerciseIndex >= totalExercises - 1;

  // Load workout data
  useEffect(() => {
    if (planId) {
      loadWorkoutPlan();
    }
  }, [planId]);

  const loadWorkoutPlan = async () => {
    try {
      const planRef = doc(db, "workoutPrograms", planId!);
      const planSnap = await getDoc(planRef);

      if (planSnap.exists()) {
        const planData = { id: planSnap.id, ...planSnap.data() } as WorkoutPlan;

        // Find the specific phase or use the first one
        const targetPhase = phaseId
          ? planData.phases.find((p) => p.id === phaseId)
          : planData.phases[0];

        if (targetPhase) {
          setCurrentPhase(targetPhase);
          initializeSession(planData, targetPhase);

          // Fetch exercise details for all exercises in this phase
          await loadExerciseDetails(targetPhase.exercises);
        }
      }
    } catch (error) {
      console.error("Error loading workout plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadExerciseDetails = async (workoutExercises: WorkoutExercise[]) => {
    try {
      const exerciseIds = workoutExercises.map((ex) => ex.exerciseId);
      const detailsMap = new Map<string, Exercise>();

      // Fetch each exercise detail
      for (const exerciseId of exerciseIds) {
        const exerciseRef = doc(db, "exercises", exerciseId);
        const exerciseSnap = await getDoc(exerciseRef);

        if (exerciseSnap.exists()) {
          const exerciseData = {
            id: exerciseSnap.id,
            ...exerciseSnap.data(),
          } as Exercise;
          detailsMap.set(exerciseId, exerciseData);
        }
      }

      setExerciseDetails(detailsMap);
    } catch (error) {
      console.error("Error loading exercise details:", error);
    }
  };

  const initializeSession = (plan: WorkoutPlan, phase: WorkoutPhase) => {
    const newSession: WorkoutSession = {
      workoutPlanId: plan.id,
      phaseId: phase.id,
      phaseName: phase.name,
      startTime: new Date(),
      sets: [],
      totalVolume: 0,
      duration: 0,
    };
    setSession(newSession);
  };

  // Rest timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isResting && restTimeLeft > 0 && !isPaused) {
      interval = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isResting, restTimeLeft, isPaused]);

  const startRestTimer = useCallback((seconds: number) => {
    setRestTimeLeft(seconds);
    setIsResting(true);
  }, []);

  const pauseRestTimer = () => {
    setIsPaused(!isPaused);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
    setIsPaused(false);
  };

  // Set logging functionality
  const logSet = () => {
    if (!currentExercise || !currentWeight || !currentReps) return;

    const weight = parseFloat(currentWeight);
    const reps = parseInt(currentReps);

    if (isNaN(weight) || isNaN(reps)) return;

    const newSetLog: SetLog = {
      exerciseId: currentExercise.id,
      exerciseName: currentExercise.name,
      setNumber: currentSetIndex + 1,
      weight,
      reps,
      completed: true,
    };

    setSetLogs((prev) => [...prev, newSetLog]);

    // Clear current inputs
    setCurrentWeight("");
    setCurrentReps("");

    // Move to next set or exercise
    if (isLastSet) {
      if (isLastExercise) {
        // Workout complete
        completeWorkout();
      } else {
        // Move to next exercise
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSetIndex(0);
        startRestTimer(currentWorkoutExercise?.restTime || 60);
      }
    } else {
      // Move to next set
      setCurrentSetIndex((prev) => prev + 1);
      startRestTimer(currentWorkoutExercise?.restTime || 60);
    }
  };

  const completeWorkout = async () => {
    if (!session || !currentUser) return;

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - session.startTime.getTime()) / 1000 / 60
    ); // minutes
    const totalVolume = setLogs.reduce(
      (sum, set) => sum + set.weight * set.reps,
      0
    );

    const completedSession: WorkoutSession = {
      ...session,
      endTime,
      sets: setLogs,
      totalVolume,
      duration,
    };

    try {
      // Save to Firestore
      await addDoc(collection(db, "workoutLogs"), {
        userId: currentUser.uid,
        ...completedSession,
        createdAt: new Date(),
      });

      // Navigate to summary
      navigate(
        `/workout-summary/${completedSession.workoutPlanId}/${completedSession.phaseId}`,
        {
          state: { session: completedSession },
        }
      );
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">🏋️</div>
          <p className="text-muted-foreground">Loading your workout...</p>
        </div>
      </div>
    );
  }

  if (!currentPhase || !currentExercise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-muted-foreground">Workout not found</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">{currentPhase.name}</h1>
                <p className="text-sm text-muted-foreground">
                  Exercise {currentExerciseIndex + 1} of {totalExercises}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Set {currentSetIndex + 1} of {totalSets}
              </Badge>
              {isPaused && <Badge variant="secondary">PAUSED</Badge>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {isResting ? (
            // Rest Timer View
            <motion.div
              key="rest"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4">⏰</div>
                  <CardTitle className="text-2xl">Rest Time</CardTitle>
                  <CardDescription>
                    Take a breather and prepare for your next set
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-6xl font-bold text-spark-600 mb-6">
                    {formatTime(restTimeLeft)}
                  </div>

                  <div className="flex justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={pauseRestTimer}
                      className="flex-1"
                    >
                      {isPaused ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        <Pause className="h-4 w-4" />
                      )}
                      {isPaused ? "Resume" : "Pause"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={skipRest}
                      className="flex-1"
                    >
                      <SkipForward className="h-4 w-4" />
                      Skip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            // Exercise View
            <motion.div
              key="exercise"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Current Exercise */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <span className="text-4xl">💪</span>
                    {currentExercise.name}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {currentExercise.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Exercise Instructions */}
                  <div>
                    <h3 className="font-semibold mb-3">Instructions:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      {currentExercise.instructions?.map(
                        (instruction, index) => (
                          <li key={index} className="text-muted-foreground">
                            {instruction}
                          </li>
                        )
                      ) || (
                        <li className="text-muted-foreground">
                          No specific instructions available for this exercise.
                        </li>
                      )}
                    </ol>
                  </div>

                  {/* Set Logging Form */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">
                      Log Set {currentSetIndex + 1} of {totalSets}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="weight">Weight (lbs)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={currentWeight}
                          onChange={(e) => setCurrentWeight(e.target.value)}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reps">Reps</Label>
                        <Input
                          id="reps"
                          type="number"
                          value={currentReps}
                          onChange={(e) => setCurrentReps(e.target.value)}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={logSet}
                      disabled={!currentWeight || !currentReps}
                      className="w-full"
                      size="lg"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Complete Set
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-spark-600">
                        {setLogs.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Sets Completed
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-spark-600">
                        {setLogs.reduce((sum, set) => sum + set.reps, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Reps
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-spark-600">
                        {setLogs.reduce(
                          (sum, set) => sum + set.weight * set.reps,
                          0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Volume (lbs)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

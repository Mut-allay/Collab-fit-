import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  WorkoutPlan,
  WorkoutPhase,
  WorkoutSession,
  WorkoutExercise,
  SetLog,
  Exercise,
  workoutLoggingSchema,
} from "@/types/workout";

export function useWorkoutSession() {
  const { planId, phaseId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

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

  // Timer state
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [currentWorkoutTime, setCurrentWorkoutTime] = useState(0);
  const [laps, setLaps] = useState<{ exercise: string; time: number }[]>([]);
  const [lastLapTime, setLastLapTime] = useState<Date | null>(null);

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


  const loadExerciseDetails = useCallback(async (workoutExercises: WorkoutExercise[]) => {
    const exerciseDetailsMap = new Map<string, Exercise>();

    for (const workoutExercise of workoutExercises) {
      try {
        const exerciseRef = doc(db, "exercises", workoutExercise.exerciseId);
        const exerciseSnap = await getDoc(exerciseRef);
        if (exerciseSnap.exists()) {
          exerciseDetailsMap.set(workoutExercise.exerciseId, {
            id: exerciseSnap.id,
            ...exerciseSnap.data(),
          } as Exercise);
        }
      } catch (error) {
        console.error("Error loading exercise details:", error);
      }
    }

    setExerciseDetails(exerciseDetailsMap);
  }, []);

  const initializeSession = useCallback((plan: WorkoutPlan, phase: WorkoutPhase) => {
    const now = new Date();
    const newSession: WorkoutSession = {
      workoutPlanId: plan.id,
      phaseId: phase.id,
      phaseName: phase.name,
      startTime: now,
      sets: [],
      totalVolume: 0,
      duration: 0,
    };

    setSession(newSession);
    setWorkoutStartTime(now);
    setLastLapTime(now);
  }, []);

  const loadWorkoutPlan = useCallback(async () => {
    if (!planId || !phaseId) return;

    try {
      setLoading(true);
      const planRef = doc(db, "workoutPrograms", planId);
      const planSnap = await getDoc(planRef);

      if (!planSnap.exists()) {
        toast({
          title: "Plan not found",
          description: "The requested workout plan could not be found.",
          variant: "destructive",
        });
        navigate("/plans");
        return;
      }

      const planData = { id: planSnap.id, ...planSnap.data() } as WorkoutPlan;
      const phase = planData.phases.find((p) => p.id === phaseId);

      if (!phase) {
        toast({
          title: "Workout not found",
          description: "The requested workout could not be found.",
          variant: "destructive",
        });
        navigate("/plans");
        return;
      }

      setCurrentPhase(phase);
      await loadExerciseDetails(phase.exercises);
      initializeSession(planData, phase);
    } catch (error) {
      console.error("Error loading workout plan:", error);
      toast({
        title: "Error",
        description: "Failed to load workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [planId, phaseId, toast, navigate, loadExerciseDetails, initializeSession]);

  useEffect(() => {
    if (planId) {
      loadWorkoutPlan();
    }
  }, [planId, loadWorkoutPlan]);

  const pauseRestTimer = () => {
    setIsPaused(!isPaused);
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
    setIsPaused(false);
  };

  const logSet = () => {
    if (!currentWorkoutExercise || !currentExercise) return;

    const weight = parseFloat(currentWeight);
    const reps = parseInt(currentReps);

    // Validate input using Zod schema
    const validationResult = workoutLoggingSchema.safeParse({ weight, reps });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const errorMessage = errors.map((err) => err.message).join(", ");
      toast({
        title: "Invalid Input",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    const { weight: validWeight, reps: validReps } = validationResult.data;

    const newSetLog: SetLog = {
      exerciseId: currentWorkoutExercise.exerciseId,
      exerciseName: currentExercise.name,
      setNumber: currentSetIndex + 1,
      weight: validWeight,
      reps: validReps,
      completed: true,
    };

    setSetLogs((prev) => [...prev, newSetLog]);

    // Update session
    if (session) {
      const updatedSession = {
        ...session,
        sets: [...session.sets, newSetLog],
        totalVolume: session.totalVolume + validWeight * validReps,
      };
      setSession(updatedSession);
    }

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
        setLaps((prev) => [
          ...prev,
          {
            exercise: currentExercise.name,
            time: Math.floor(
              (Date.now() - (lastLapTime?.getTime() || Date.now())) / 1000
            ),
          },
        ]);
        setLastLapTime(new Date());
      }
    } else {
      // Move to next set
      setCurrentSetIndex((prev) => prev + 1);

      // Start rest timer
      const restTime = currentWorkoutExercise.restTime || 60;
      setIsResting(true);
      setRestTimeLeft(restTime);
      setIsPaused(false);
    }
  };

  const completeWorkout = async () => {
    if (!session || !currentUser) return;

    try {
      const endTime = new Date();
      const duration = Math.floor(
        (endTime.getTime() - session.startTime.getTime()) / 1000 / 60
      );

      const completedSession = {
        ...session,
        endTime,
        duration,
      };

      // Save to Firestore
      await addDoc(collection(db, "workoutLogs"), {
        ...completedSession,
        userId: currentUser.uid,
        startTime: session.startTime,
        endTime,
      });

      toast({
        title: "Workout Complete!",
        description: "Great job! Your workout has been saved.",
      });

      // Navigate to summary
      navigate(`/workout-summary/${planId}/${phaseId}`);
    } catch (error) {
      console.error("Error completing workout:", error);
      toast({
        title: "Error",
        description: "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isResting && !isPaused && restTimeLeft > 0) {
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

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, isPaused, restTimeLeft]);

  // Workout timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (workoutStartTime && !isPaused) {
      interval = setInterval(() => {
        setCurrentWorkoutTime(
          Math.floor((Date.now() - workoutStartTime.getTime()) / 1000)
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [workoutStartTime, isPaused]);

  return {
    // State
    currentPhase,
    currentExerciseIndex,
    currentSetIndex,
    session,
    isResting,
    restTimeLeft,
    isPaused,
    loading,
    exerciseDetails,
    workoutStartTime,
    currentWorkoutTime,
    laps,
    currentWeight,
    currentReps,
    setLogs,

    // Computed
    currentWorkoutExercise,
    currentExercise,
    totalSets,
    totalExercises,
    isLastSet,
    isLastExercise,

    // Actions
    setCurrentWeight,
    setCurrentReps,

    // Handlers
    pauseRestTimer,
    skipRest,
    logSet,
    formatTime,
  };
}

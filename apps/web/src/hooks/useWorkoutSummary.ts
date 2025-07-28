import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { WorkoutSession } from "@/types/workout";

interface ExerciseStats {
  name: string;
  sets: number;
  totalReps: number;
  totalVolume: number;
  maxWeight: number;
  avgWeight: number;
}

export function useWorkoutSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session data from navigation state or params
    if (location.state?.session) {
      setSession(location.state.session);
      processSessionData(location.state.session);
    } else {
      // Fallback: try to load from localStorage or redirect
      navigate("/dashboard");
    }
    setLoading(false);
  }, [location.state, navigate]);

  const processSessionData = (sessionData: WorkoutSession) => {
    // Group sets by exercise and calculate stats
    const exerciseMap = new Map<string, ExerciseStats>();

    sessionData.sets.forEach((set) => {
      if (!exerciseMap.has(set.exerciseId)) {
        exerciseMap.set(set.exerciseId, {
          name: set.exerciseName,
          sets: 0,
          totalReps: 0,
          totalVolume: 0,
          maxWeight: 0,
          avgWeight: 0,
        });
      }

      const exercise = exerciseMap.get(set.exerciseId)!;
      exercise.sets += 1;
      exercise.totalReps += set.reps;
      exercise.totalVolume += set.weight * set.reps;
      exercise.maxWeight = Math.max(exercise.maxWeight, set.weight);
    });

    // Calculate averages
    exerciseMap.forEach((exercise) => {
      exercise.avgWeight = exercise.totalVolume / exercise.totalReps;
    });

    setExerciseStats(Array.from(exerciseMap.values()));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getPerformanceMessage = (volume: number, duration: number) => {
    const volumePerMinute = volume / duration;

    if (volumePerMinute > 50) {
      return "🔥 Exceptional performance! You're on fire!";
    } else if (volumePerMinute > 30) {
      return "💪 Great work! You're building serious strength!";
    } else if (volumePerMinute > 15) {
      return "👍 Solid workout! Keep up the consistency!";
    } else {
      return "🌟 Good start! Every workout counts!";
    }
  };

  const shareWorkout = () => {
    if (!session) return;

    const message =
      `Just completed ${session.phaseName} workout! 💪\n\n` +
      `Duration: ${formatDuration(session.duration)}\n` +
      `Total Volume: ${session.totalVolume}kg\n` +
      `Sets: ${session.sets.length}\n\n` +
      `#FitSpark #Fitness #Workout`;

    if (navigator.share) {
      navigator
        .share({
          title: "Workout Complete!",
          text: message,
          url: window.location.href,
        })
        .catch((error) => {
          console.log("Error sharing:", error);
          // Fallback to copying to clipboard
          copyToClipboard(message);
        });
    } else {
      // Fallback to copying to clipboard
      copyToClipboard(message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "Your workout summary has been copied.",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Please copy the text manually.",
          variant: "destructive",
        });
      });
  };

  const getChartData = () => {
    return exerciseStats.map((exercise) => ({
      name: exercise.name,
      volume: exercise.totalVolume,
      sets: exercise.sets,
      reps: exercise.totalReps,
    }));
  };

  const getVolumeData = () => {
    return exerciseStats.map((exercise) => ({
      name: exercise.name,
      volume: exercise.totalVolume,
    }));
  };

  return {
    // State
    session,
    exerciseStats,
    loading,

    // Computed
    formatDuration,
    formatTime,
    getPerformanceMessage,
    getChartData,
    getVolumeData,

    // Actions
    shareWorkout,
  };
}

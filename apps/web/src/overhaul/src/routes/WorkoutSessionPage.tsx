import { motion, AnimatePresence } from "framer-motion";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Play,
  Pause,
  SkipForward,
  Check,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";
import { useState } from "react";

export default function WorkoutSessionPage() {
  const [showExitDialog, setShowExitDialog] = useState(false);

  const {
    // State
    currentPhase,
    currentExerciseIndex,
    currentSetIndex,
    session,
    isResting,
    restTimeLeft,
    isPaused,
    loading,
    currentWeight,
    currentReps,
    setLogs,

    // Computed
    currentExercise,
    totalSets,
    totalExercises,

    // Actions
    setCurrentWeight,
    setCurrentReps,

    // Handlers
    pauseRestTimer,
    skipRest,
    logSet,
    formatTime,
  } = useWorkoutSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">
            <Zap className="h-12 w-12 mx-auto text-spark-600 animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading your workout...</p>
        </div>
      </div>
    );
  }

  if (!currentPhase || !currentExercise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-2xl font-semibold mb-2">Workout not found</h2>
          <p className="text-muted-foreground mb-4">
            The workout you're looking for doesn't exist.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

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
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/40 backdrop-blur-sm border-b border-cyan-500/30 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Exit Workout?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to exit this workout? Your progress will be lost and you'll need to start over.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue Workout</AlertDialogCancel>
                  <AlertDialogAction onClick={() => window.history.back()}>
                    Exit Workout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className="text-center">
              <h1 className="text-lg font-semibold">{currentPhase.name}</h1>
              <p className="text-sm text-muted-foreground">
                Exercise {currentExerciseIndex + 1} of {totalExercises}
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm font-mono">
                {formatTime(0)} {/* or use session?.duration || 0 */}
              </div>
              <div className="text-xs text-muted-foreground">Workout Time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Current Exercise */}
        <motion.div
          key={currentExerciseIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {currentExercise.name}
                  </CardTitle>
                  <CardDescription>
                    Set {currentSetIndex + 1} of {totalSets}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {currentExercise.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {currentExercise.description}
              </p>

              {/* Set Input */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0.5"
                    max="1000"
                    step="0.5"
                    value={currentWeight}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = parseFloat(value);
                      if (value === "" || (numValue >= 0.5 && numValue <= 1000)) {
                        setCurrentWeight(value);
                      }
                    }}
                    placeholder="0"
                    className="text-center text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="reps">Reps</Label>
                  <Input
                    id="reps"
                    type="number"
                    min="1"
                    max="200"
                    step="1"
                    value={currentReps}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = parseInt(value);
                      if (value === "" || (numValue >= 1 && numValue <= 200)) {
                        setCurrentReps(value);
                      }
                    }}
                    placeholder="0"
                    className="text-center text-lg"
                  />
                </div>
              </div>

              <Button
                onClick={logSet}
                disabled={!currentWeight || !currentReps}
                className="w-full bg-spark-600 hover:bg-spark-700"
                size="lg"
              >
                <Check className="h-5 w-5 mr-2" />
                Log Set
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rest Timer */}
        <AnimatePresence>
          {isResting && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="border-0 shadow-lg bg-spark-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Rest Time</span>
                    <div className="text-3xl font-mono text-spark-600">
                      {formatTime(restTimeLeft)}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={pauseRestTimer}
                      variant="outline"
                      className="flex-1"
                    >
                      {isPaused ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={skipRest}
                      variant="outline"
                      className="flex-1"
                    >
                      <SkipForward className="h-4 w-4 mr-2" />
                      Skip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Set Logs */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Today's Sets</CardTitle>
              <CardDescription>
                {setLogs.length} sets completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {setLogs.map((set, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <div className="font-medium">{set.exerciseName}</div>
                      <div className="text-sm text-muted-foreground">
                        Set {set.setNumber}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {set.weight}kg × {set.reps}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {set.weight * set.reps}kg total
                      </div>
                    </div>
                  </div>
                ))}
                {setLogs.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No sets logged yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Session Stats</CardTitle>
              <CardDescription>Your workout progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Volume:</span>
                  <span className="font-medium">
                    {session?.totalVolume || 0}kg
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sets Completed:</span>
                  <span className="font-medium">{setLogs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Workout Time:</span>
                  <span className="font-medium">
                    {formatTime(0)} {/* or use session?.duration || 0 */}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Exercises Left:</span>
                  <span className="font-medium">
                    {totalExercises - currentExerciseIndex - 1}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {Math.round(
                      ((currentExerciseIndex * totalSets + currentSetIndex) /
                        (totalExercises * totalSets)) *
                      100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-spark-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentExerciseIndex * totalSets + currentSetIndex) /
                        (totalExercises * totalSets)) *
                        100
                        }%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Dumbbell } from "lucide-react";
import type { WorkoutProgram, WorkoutPhase } from "@fitspark/shared";

interface TodaysWorkoutProps {
    plan: WorkoutProgram;
    workout: WorkoutPhase;
}

export function TodaysWorkout({ plan, workout }: TodaysWorkoutProps) {
    const navigate = useNavigate();

    return (
        <Card className="relative overflow-hidden border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-cyan-400/5 to-blue-500/10" />
            <CardHeader className="relative pb-4">
                <CardTitle className="text-xl flex items-center gap-2 mb-1 font-manrope text-white">
                    <Dumbbell className="h-5 w-5 text-cyan-400" />
                    Today's Workout
                </CardTitle>
                <CardDescription className="text-gray-300 font-manrope">{workout.estimatedDuration} minutes • {workout.exercises.length} exercises</CardDescription>
            </CardHeader>
            <CardContent className="relative pt-0">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-white font-manrope">{workout.name}</h3>
                    <p className="text-gray-300 leading-relaxed font-manrope">{workout.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" className="flex-1 h-12 text-base" variant="spark" onClick={() => navigate(`/workout/${plan.id}/${workout.id}`)}>
                        <Play className="h-5 w-5 mr-2" /> Start Workout
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1 h-12 text-base" onClick={() => navigate(`/plans/${plan.id}`)}>
                        View Plan
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

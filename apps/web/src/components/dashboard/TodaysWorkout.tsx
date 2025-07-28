import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Dumbbell } from "lucide-react";
import type { WorkoutProgram } from "@fitspark/shared";

interface TodaysWorkoutProps {
    plan: WorkoutProgram;
    workout: any; // Replace 'any' with Phase type
}

export function TodaysWorkout({ plan, workout }: TodaysWorkoutProps) {
    const navigate = useNavigate();

    return (
        <Card className="relative overflow-hidden border-0 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-spark-500/10 via-spark-400/5 to-fitness-500/10" />
            <CardHeader className="relative pb-4">
                <CardTitle className="text-xl flex items-center gap-2 mb-1">
                    <Dumbbell className="h-5 w-5 text-spark-600" />
                    Today's Workout
                </CardTitle>
                <CardDescription>{workout.estimatedDuration} minutes • {workout.exercises.length} exercises</CardDescription>
            </CardHeader>
            <CardContent className="relative pt-0">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{workout.name}</h3>
                    <p className="text-muted-foreground leading-relaxed">{workout.description}</p>
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

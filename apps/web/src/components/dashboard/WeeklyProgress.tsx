import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayProgress {
    day: string;
    date: Date;
    completed: boolean;
    workoutCount: number;
}

interface WeeklyProgressProps {
    progress: DayProgress[];
}

export function WeeklyProgress({ progress }: WeeklyProgressProps) {
    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="h-5 w-5 text-spark-600" />
                    This Week's Progress
                </CardTitle>
                <CardDescription>Track your weekly workout consistency.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-7 gap-3">
                    {progress.map((dayProgress) => {
                        const isToday = new Date().toDateString() === dayProgress.date.toDateString();
                        return (
                            <div key={dayProgress.day} className="text-center">
                                <p className="text-xs text-muted-foreground mb-3">{dayProgress.day}</p>
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mx-auto border-2",
                                        isToday && "bg-spark-500 text-white ring-2 ring-spark-200 shadow-lg border-transparent",
                                        !isToday && dayProgress.completed && "bg-green-100 text-green-800 border-green-200",
                                        !isToday && !dayProgress.completed && "bg-gray-100 text-gray-500 border-gray-200"
                                    )}
                                >
                                    {dayProgress.completed ? "✓" : dayProgress.date.getDate()}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

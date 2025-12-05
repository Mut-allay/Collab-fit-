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
                <CardTitle className="flex items-center gap-2 text-xl font-manrope text-white">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                    This Week's Progress
                </CardTitle>
                <CardDescription className="text-gray-300 font-manrope">Track your weekly workout consistency.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="grid grid-cols-7 gap-3">
                    {progress.map((dayProgress) => {
                        const isToday = new Date().toDateString() === dayProgress.date.toDateString();
                        return (
                            <div key={dayProgress.day} className="text-center">
                                <p className="text-xs text-gray-300 mb-3 font-manrope">{dayProgress.day}</p>
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium mx-auto border-2 font-manrope",
                                        isToday && "bg-gradient-to-r from-cyan-600 to-blue-600 text-white ring-2 ring-cyan-200 shadow-lg shadow-cyan-500/30 border-transparent",
                                        !isToday && dayProgress.completed && "bg-green-500/20 text-green-300 border-green-500/30",
                                        !isToday && !dayProgress.completed && "bg-gray-800/50 text-gray-500 border-gray-700/50"
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

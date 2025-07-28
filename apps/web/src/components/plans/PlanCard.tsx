import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, Target, Calendar, Users, Zap } from "lucide-react";
import { DIFFICULTY_COLORS, GOAL_ICONS } from "@/data/appData";
import type { WorkoutProgram } from "@fitspark/shared";

interface PlanCardProps {
    plan: WorkoutProgram;
    isCurrentPlan: boolean;
    isSelecting: boolean;
    onSelectPlan: (planId: string) => void;
}

export function PlanCard({ plan, isCurrentPlan, isSelecting, onSelectPlan }: PlanCardProps) {
    const navigate = useNavigate();
    const GoalIcon = GOAL_ICONS[plan.goal] || Zap;

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                        <CardTitle className="text-xl mb-2 flex items-center gap-2">
                            <GoalIcon className="h-5 w-5" /> {plan.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={DIFFICULTY_COLORS[plan.difficulty]}>
                        {plan.difficulty}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> <span>{plan.durationWeeks} weeks</span></div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /> <span>{plan.sessionsPerWeek}x/week</span></div>
                    <div className="flex items-center gap-2"><Target className="h-4 w-4 text-muted-foreground" /> <span>{plan.goal.replace(/_/g, " ")}</span></div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> <span>{plan.phases?.length || 0} workouts</span></div>
                </div>
                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/plans/${plan.id}`)} className="flex-1">
                        View Details
                    </Button>
                    <Button
                        variant={isCurrentPlan ? "default" : "spark"}
                        size="sm"
                        onClick={() => onSelectPlan(plan.id)}
                        disabled={isSelecting}
                        className="flex-1"
                    >
                        {isSelecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : isCurrentPlan ? "Current Plan" : "Select Plan"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

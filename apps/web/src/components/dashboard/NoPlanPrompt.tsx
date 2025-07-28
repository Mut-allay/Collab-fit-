import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Plus } from "lucide-react";

export function NoPlanPrompt() {
    const navigate = useNavigate();
    return (
        <Card className="border-0 shadow-lg text-center">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    <Target className="h-5 w-5 text-spark-600" />
                    Choose Your Workout Plan
                </CardTitle>
                <CardDescription>Select a plan to start your fitness journey.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <p className="text-muted-foreground my-6 max-w-md mx-auto">
                    Choose from our curated workout plans designed for your goals and experience level.
                </p>
                <Button onClick={() => navigate("/plans")} variant="spark" size="lg" className="h-12 px-8 text-base">
                    <Plus className="h-5 w-5 mr-2" /> Browse Workout Plans
                </Button>
            </CardContent>
        </Card>
    );
}

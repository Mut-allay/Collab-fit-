import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Play,
    Calendar,
    Target,
    TrendingUp,
    Zap,
    Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
    const navigate = useNavigate();

    const quickActions = [
        {
            title: "Start Workout",
            description: "Begin your daily training session",
            icon: Play,
            action: () => navigate("/dashboard"),
            variant: "spark" as const,
            badge: "Now",
            gradient: "from-spark-500 to-spark-600"
        },
        {
            title: "View Progress",
            description: "Track your fitness journey",
            icon: TrendingUp,
            action: () => navigate("/progress"),
            variant: "outline" as const,
            badge: "Hot",
            gradient: "from-green-500 to-emerald-600"
        },
        {
            title: "Browse Plans",
            description: "Discover new workout programs",
            icon: Target,
            action: () => navigate("/plans"),
            variant: "outline" as const,
            badge: "New",
            gradient: "from-blue-500 to-cyan-600"
        },
        {
            title: "Workout History",
            description: "Review past sessions",
            icon: Calendar,
            action: () => navigate("/workout-history"),
            variant: "outline" as const,
            badge: "Popular",
            gradient: "from-purple-500 to-pink-600"
        }
    ];

    return (
        <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="h-5 w-5 text-spark-600" />
                        Quick Actions
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Smart
                    </Badge>
                </div>
                <CardDescription>
                    Jump into your fitness routine with one tap
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                    <motion.div
                        key={action.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Button
                            variant={action.variant}
                            className="w-full justify-start h-auto p-4 relative overflow-hidden group"
                            onClick={action.action}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                                style={{ background: `linear-gradient(to right, var(--${action.gradient.split('-')[1]}-500), var(--${action.gradient.split('-')[3]}-600))` }}>
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} text-white`}>
                                    <action.icon className="h-4 w-4" />
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{action.title}</span>
                                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                            {action.badge}
                                        </Badge>
                                    </div>
                                    <p className="text-xs opacity-80">{action.description}</p>
                                </div>
                            </div>
                        </Button>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
} 
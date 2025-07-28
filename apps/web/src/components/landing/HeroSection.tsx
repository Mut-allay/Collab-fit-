import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, CheckCircle, Target } from "lucide-react";

export function HeroSection() {
    const navigate = useNavigate();

    const handleGetStarted = () => navigate("/signup");
    const handleWatchDemo = () => console.log("Demo video would open here");

    return (
        <section className="py-20 bg-gradient-to-br from-spark-50 via-fitness-50 to-background">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        <Badge variant="outline" className="mb-4">Now in Beta - Join Early Access</Badge>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-spark-600 to-fitness-600 bg-clip-text text-transparent leading-tight">
                            Your AI Fitness Coach
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Transform your fitness journey with personalized workout plans, real-time tracking, and AI-powered insights.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
                            <Button size="lg" variant="spark" onClick={handleGetStarted} className="h-14 text-lg px-8">
                                Start Free Today <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" onClick={handleWatchDemo} className="h-14 text-lg px-8 border-2 hover:bg-spark-50">
                                <Play className="mr-2 h-5 w-5" /> Watch Demo
                            </Button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> Free 30-day trial</div>
                            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" /> No credit card required</div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative order-first lg:order-last"
                    >
                        <div className="relative bg-white rounded-2xl shadow-2xl p-8 border">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-2 bg-spark-100 px-4 py-2 rounded-full mb-4">
                                    <Target className="h-5 w-5 text-spark-600" />
                                    <span className="font-medium text-spark-600">Today's Workout</span>
                                </div>
                                <h3 className="text-xl font-semibold">Upper Body Strength</h3>
                                <p className="text-muted-foreground">25 minutes • 6 exercises</p>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: "Push-ups", sets: "3 sets × 12 reps" },
                                    { name: "Bench Press", sets: "3 sets × 8 reps" },
                                    { name: "Pull-ups", sets: "3 sets × 6 reps" },
                                ].map((exercise) => (
                                    <div key={exercise.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                        <span className="font-medium">{exercise.name}</span>
                                        <span className="text-sm text-muted-foreground">{exercise.sets}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Apple,
    Brain,
    Sparkles,
    Star,
    Zap,
    Bell
} from "lucide-react";

export function ComingSoon() {
    const upcomingFeatures = [
        {
            title: "AI Nutrition Coach",
            description: "Personalized meal plans and macro tracking powered by AI",
            icon: Apple,
            category: "Nutrition",
            badge: "Q1 2024",
            gradient: "from-green-500 to-emerald-600",
            benefits: ["Smart meal suggestions", "Macro tracking", "Recipe database"]
        },
        {
            title: "Mindful Meditation",
            description: "Guided sessions for mental wellness and recovery",
            icon: Brain,
            category: "Wellness",
            badge: "Q2 2024",
            gradient: "from-purple-500 to-pink-600",
            benefits: ["Stress reduction", "Better sleep", "Mental clarity"]
        }
    ];

    return (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-spark-600" />
                        Coming Soon
                    </CardTitle>
                    <Badge variant="outline" className="text-xs border-spark-200 text-spark-600">
                        <Bell className="h-3 w-3 mr-1" />
                        Early Access
                    </Badge>
                </div>
                <CardDescription>
                    Complete your wellness journey with these exciting new features
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {upcomingFeatures.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r opacity-5 rounded-lg"
                            style={{ background: `linear-gradient(to right, var(--${feature.gradient.split('-')[1]}-500), var(--${feature.gradient.split('-')[3]}-600))` }}>
                        </div>
                        <div className="relative p-4 border border-gray-100 rounded-lg bg-white/50 backdrop-blur-sm">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${feature.gradient} text-white`}>
                                        <feature.icon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{feature.title}</h3>
                                        <p className="text-xs text-muted-foreground">{feature.category}</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {feature.badge}
                                </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground mb-3">
                                {feature.description}
                            </p>

                            <div className="space-y-1 mb-3">
                                {feature.benefits.map((benefit, benefitIndex) => (
                                    <div key={benefitIndex} className="flex items-center gap-2 text-xs">
                                        <Star className="h-3 w-3 text-spark-500" />
                                        <span className="text-muted-foreground">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-xs h-8 border-spark-200 text-spark-600 hover:bg-spark-50"
                            >
                                <Zap className="h-3 w-3 mr-1" />
                                Get Notified
                            </Button>
                        </div>
                    </motion.div>
                ))}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="text-center pt-2"
                >
                    <p className="text-xs text-muted-foreground">
                        Be the first to know when these features launch! 🚀
                    </p>
                </motion.div>
            </CardContent>
        </Card>
    );
} 
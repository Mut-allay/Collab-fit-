import { motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FEATURES } from "@/data/landingPageData"; // <-- IMPORT DATA

export function FeaturesSection() {
    return (
        <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-6">Everything You Need to Succeed</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        FitSpark combines cutting-edge AI with proven fitness science to deliver personalized workouts that evolve with your progress.
                    </p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-lg">
                                <CardHeader>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-3 rounded-lg bg-spark-100">
                                            <feature.icon className="h-6 w-6 text-spark-600" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </div>
                                    <CardDescription className="text-base">{feature.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/landingPageData"; // <-- IMPORT DATA

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-20 bg-gradient-to-b from-muted/20 to-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-6">Loved by Fitness Enthusiasts</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Join thousands of users who've transformed their fitness journey with FitSpark.
                    </p>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

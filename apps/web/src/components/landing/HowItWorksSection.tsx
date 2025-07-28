import { motion } from "framer-motion";
import { HOW_IT_WORKS_STEPS } from "@/data/landingPageData";

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-6">Get Started in 3 Simple Steps</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Our streamlined onboarding gets you from zero to your first workout in minutes.
                    </p>
                </motion.div>
                <div className="grid lg:grid-cols-3 gap-12">
                    {HOW_IT_WORKS_STEPS.map((step, index) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-spark-100 text-spark-600 font-bold text-xl mb-6">
                                {step.step}
                            </div>
                            <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

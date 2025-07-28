import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
    const navigate = useNavigate();
    const handleGetStarted = () => navigate("/signup");

    return (
        <section className="py-20 bg-gradient-to-r from-spark-500 to-fitness-500 text-white">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl font-bold mb-6">Ready to Transform Your Fitness?</h2>
                    <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
                        Join FitSpark today and discover what your body is truly capable of achieving.
                    </p>
                    <Button size="lg" variant="secondary" onClick={handleGetStarted} className="h-14 text-lg px-8">
                        Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}

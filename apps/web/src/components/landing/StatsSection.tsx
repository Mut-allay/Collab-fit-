import { motion } from "framer-motion";
import { STATS } from "@/data/landingPageData";

export function StatsSection() {
    return (
        <section className="py-16 bg-white border-y">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {STATS.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-4xl font-bold text-spark-600 mb-2">{stat.number}</div>
                            <div className="text-muted-foreground font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

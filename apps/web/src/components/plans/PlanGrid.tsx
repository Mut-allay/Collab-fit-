import { motion } from "framer-motion";
import { PlanCard } from "./PlanCard";
import { Dumbbell } from "lucide-react";
import type { WorkoutProgram } from "@fitspark/shared";

interface PlanGridProps {
    plans: WorkoutProgram[];
    currentPlanId?: string | null;
    selectingPlanId?: string | null;
    onSelectPlan: (planId: string) => void;
}

export function PlanGrid({ plans, currentPlanId, selectingPlanId, onSelectPlan }: PlanGridProps) {
    if (plans.length === 0) {
        return (
            <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <Dumbbell className="h-16 w-16 mx-auto text-spark-600 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No Matching Plans Found</h2>
                <p className="text-muted-foreground">Try adjusting your filters to find the perfect workout plan.</p>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
                <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                    <PlanCard
                        plan={plan}
                        isCurrentPlan={currentPlanId === plan.id}
                        isSelecting={selectingPlanId === plan.id}
                        onSelectPlan={onSelectPlan}
                    />
                </motion.div>
            ))}
        </div>
    );
}

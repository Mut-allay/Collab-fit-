import { Button } from "@/components/ui/button";
import { planCategories, planDifficulties } from "@/data/appData";

interface PlanFiltersProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedDifficulty: string;
    setSelectedDifficulty: (difficulty: string) => void;
}

export function PlanFilters({
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
}: PlanFiltersProps) {
    return (
        <div className="mb-8 space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-3 font-manrope text-white">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {planCategories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
                            className="flex items-center gap-2 font-manrope"
                        >
                            <category.icon className="h-4 w-4" />
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-3 font-manrope text-white">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                    {planDifficulties.map((difficulty) => (
                        <Button
                            key={difficulty.id}
                            variant={selectedDifficulty === difficulty.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedDifficulty(difficulty.id)}
                            className="font-manrope"
                        >
                            {difficulty.name}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

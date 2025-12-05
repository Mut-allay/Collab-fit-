import { useAuth } from "@/contexts/AuthContext";

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const getDayName = () => {
    return new Date().toLocaleDateString("en-US", { weekday: "long" });
};

export function DashboardHeader() {
    const { currentUser } = useAuth();
    const firstName = currentUser?.displayName?.split(" ")[0] || "Fitness Warrior";

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold leading-tight font-pacifico text-white">
                {getGreeting()}, <span className="bg-gradient-to-r from-cyan-500 to-cyan-300 bg-clip-text text-transparent">{firstName}</span>! 👋
            </h1>
            <p className="text-lg text-gray-300 font-manrope">
                Ready to crush your {getDayName()} workout?
            </p>
        </div>
    );
}

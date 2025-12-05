import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { landingNavItems, appNavItems } from "@/data/appData"; 

export function LandingNavLinks() {
    return (
        <>
            {landingNavItems.map((item) => (
                <a
                    key={item.href}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium font-manrope"
                >
                    {item.label}
                </a>
            ))}
        </>
    );
}

export function AppNavLinks() {
    const navigate = useNavigate();
    const location = useLocation();
    const isActivePath = (path: string) => location.pathname.startsWith(path);

    return (
        <div className="flex items-center gap-1">
            {appNavItems.map((item) => (
                <Button
                    key={item.path}
                    variant={isActivePath(item.path) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2 font-medium font-manrope"
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Button>
            ))}
        </div>
    );
}

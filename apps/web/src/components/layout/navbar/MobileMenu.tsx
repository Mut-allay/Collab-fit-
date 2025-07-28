import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, LogOut } from "lucide-react";
import { landingNavItems, appNavItems, userNavItems } from "@/data/appData";

// --- Sub-Components for Clarity ---
const LandingMenuContent = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    return (
        <>
            {landingNavItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                    <a href={item.href}>{item.label}</a>
                </DropdownMenuItem>
            ))}
            {!currentUser && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/login")}>Sign In</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/signup")}>Get Started</DropdownMenuItem>
                </>
            )}
        </>
    );
};

const AppMenuContent = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <>
            {appNavItems.map((item) => (
                <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {userNavItems.map((item) => (
                <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
        </>
    );
};

// --- Main Component ---
interface MobileMenuProps {
    variant?: "landing" | "app";
}

export function MobileMenu({ variant }: MobileMenuProps) {
    const { currentUser } = useAuth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {variant === "landing" && <LandingMenuContent />}
                {variant === "app" && currentUser && <AppMenuContent />}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

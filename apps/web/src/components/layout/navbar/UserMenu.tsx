import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface UserMenuProps {
    variant?: "landing" | "app";
}

export function UserMenu({ variant }: UserMenuProps) {
    const { currentUser, userProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (!currentUser) {
        // Only show auth buttons on landing page navbar
        if (variant === 'landing') {
            return (
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                        Sign In
                    </Button>
                    <Button variant="spark" size="sm" onClick={() => navigate("/signup")}>
                        Get Started
                    </Button>
                </div>
            );
        }
        return null;
    }

    // This menu is only for the 'app' variant
    if (variant === "app") {
        return (
            <>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2 h-10 px-3">
                            <div className="w-8 h-8 rounded-full bg-spark-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-spark-600" />
                            </div>
                            <span className="font-medium">
                                {userProfile?.displayName?.split(" ")[0] || "User"}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <div className="px-2 py-1.5">
                            <p className="text-sm font-medium">{userProfile?.displayName || "User"}</p>
                            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                            <User className="mr-2 h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/settings")}>
                            <Settings className="mr-2 h-4 w-4" /> Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setShowLogoutDialog(true)}>
                            <LogOut className="mr-2 h-4 w-4" /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to log out? Any unsaved progress will be lost.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout}>
                                Log Out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        );
    }

    return null;
}

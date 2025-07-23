import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  User,
  Settings,
  LogOut,
  Home,
  Target,
  TrendingUp,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  variant?: "landing" | "app";
}

export default function Navbar({ variant = "app" }: NavbarProps) {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLogoClick = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  if (variant === "landing") {
    return (
      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleLogoClick}
            >
              <Dumbbell className="h-7 w-7 sm:h-8 sm:w-8 text-spark-500" />
              <span className="text-xl sm:text-2xl font-bold text-spark-500">
                FitSpark
              </span>
              <Badge variant="outline" className="ml-2 text-xs">
                Beta
              </Badge>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                Reviews
              </a>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <a href="#features">Features</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="#how-it-works">How It Works</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="#testimonials">Reviews</a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/login")}>
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/signup")}>
                    Get Started
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="font-medium"
              >
                Sign In
              </Button>
              <Button
                variant="spark"
                onClick={() => navigate("/signup")}
                className="font-medium"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // App navigation for authenticated users
  return (
    <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <Dumbbell className="h-6 w-6 text-spark-500" />
            <span className="text-lg sm:text-xl font-bold text-spark-500">
              FitSpark
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Button
              variant={isActivePath("/dashboard") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 font-medium"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>

            <Button
              variant={isActivePath("/plans") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/plans")}
              className="flex items-center gap-2 font-medium"
            >
              <Target className="h-4 w-4" />
              Plans
            </Button>

            <Button
              variant={isActivePath("/progress") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/progress")}
              className="flex items-center gap-2 font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              Progress
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/plans")}>
                  <Target className="mr-2 h-4 w-4" />
                  Plans
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/progress")}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Progress
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 h-10 px-3"
                  >
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
                    <p className="text-sm font-medium">
                      {userProfile?.displayName ||
                        currentUser.displayName ||
                        "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="font-medium"
                >
                  Sign In
                </Button>
                <Button
                  variant="spark"
                  size="sm"
                  onClick={() => navigate("/signup")}
                  className="font-medium"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

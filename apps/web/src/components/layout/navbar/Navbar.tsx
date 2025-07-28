import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LandingNavLinks, AppNavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";

interface NavbarProps {
  variant?: "landing" | "app";
}

export default function Navbar({ variant = "app" }: NavbarProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate(currentUser ? "/dashboard" : "/");
  };

  return (
    <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleLogoClick}
          >
            <Dumbbell className="h-7 w-7 text-spark-500" />
            <span className="text-xl font-bold text-spark-500">
              FitSpark
            </span>
            {variant === "landing" && (
              <Badge variant="outline" className="ml-2 text-xs">
                Beta
              </Badge>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {variant === "landing" ? <LandingNavLinks /> : <AppNavLinks />}
          </div>

          {/* User/Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            <UserMenu variant={variant} />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <MobileMenu variant={variant} />
          </div>
        </div>
      </div>
    </nav>
  );
}

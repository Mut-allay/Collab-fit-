import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
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
    <motion.nav 
      className={`${variant === "landing" ? "relative" : "sticky top-0"} z-50 border-b border-cyan-500/30 bg-black/40 backdrop-blur-sm`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={handleLogoClick}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30 backdrop-blur-sm"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white font-bold text-lg font-pacifico">FS</span>
            </motion.div>
            <h1 className="text-2xl font-bold font-pacifico text-white">
              FitSpark
            </h1>
            {variant === "landing" && (
              <Badge variant="outline" className="ml-2 text-xs border-cyan-500/30 text-cyan-300 bg-black/40">
                Beta
              </Badge>
            )}
          </motion.div>

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
    </motion.nav>
  );
}

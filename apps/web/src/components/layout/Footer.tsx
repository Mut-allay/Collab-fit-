import { useNavigate } from "react-router-dom";
import { Dumbbell, Github, Twitter, Instagram, Mail } from "lucide-react";

interface FooterProps {
  variant?: "landing" | "app";
}

export default function Footer({ variant = "app" }: FooterProps) {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  if (variant === "landing") {
    return (
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="h-8 w-8 text-spark-400" />
                <span className="text-2xl font-bold">FitSpark</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your AI-powered fitness companion, helping you achieve your
                health and wellness goals with personalized workout plans and
                expert guidance.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Download App
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {currentYear} FitSpark. All rights reserved. Built with ❤️
              for fitness enthusiasts.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // App footer for authenticated users
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo and copyright */}
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-spark-500" />
            <span className="font-semibold text-spark-500">FitSpark</span>
            <span className="text-sm text-muted-foreground">
              &copy; {currentYear}
            </span>
          </div>

          {/* Navigation links - responsive grid */}
          <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-6 text-sm text-muted-foreground">
            <button
              onClick={() => navigate("/help")}
              className="hover:text-foreground transition-colors px-2 py-1"
            >
              Help
            </button>
            <button
              onClick={() => navigate("/privacy")}
              className="hover:text-foreground transition-colors px-2 py-1"
            >
              Privacy
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="hover:text-foreground transition-colors px-2 py-1"
            >
              Terms
            </button>
            <a
              href="mailto:support@fitspark.com"
              className="hover:text-foreground transition-colors px-2 py-1"
            >
              Contact
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com/fitspark"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://github.com/fitspark"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-2"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

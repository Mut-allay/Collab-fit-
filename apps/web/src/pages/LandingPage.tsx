import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Target,
  TrendingUp,
  Users,
  Smartphone,
  Brain,
  Clock,
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Plans",
    description:
      "Get personalized workout plans tailored to your goals, experience, and equipment.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Track workouts seamlessly on any device with our responsive, intuitive interface.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Visualize your fitness journey with detailed analytics and progress charts.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Connect with trainers and fellow fitness enthusiasts for motivation and tips.",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description:
      "Workouts that adapt to your busy lifestyle with customizable durations.",
  },
  {
    icon: Award,
    title: "Expert-Crafted",
    description:
      "Programs designed by certified trainers and fitness professionals.",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    role: "Busy Professional",
    rating: 5,
    text: "FitSpark transformed my fitness routine! The AI recommendations are spot-on and fit perfectly into my hectic schedule.",
  },
  {
    name: "Mike Chen",
    role: "Fitness Beginner",
    rating: 5,
    text: "As a complete beginner, FitSpark made fitness approachable. The guided workouts gave me confidence to start my journey.",
  },
  {
    name: "Emma Rodriguez",
    role: "Advanced Athlete",
    rating: 5,
    text: "Even as an experienced athlete, FitSpark challenged me with new routines and helped me break through plateaus.",
  },
];

const STATS = [
  { number: "10K+", label: "Active Users" },
  { number: "50+", label: "Workout Plans" },
  { number: "95%", label: "Success Rate" },
  { number: "24/7", label: "Support" },
];

export default function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  const handleGetStarted = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleWatchDemo = () => {
    // TODO: Add demo video modal
    console.log("Demo video would open here");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar - Mobile optimized */}
      <nav className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
                  <DropdownMenuItem onClick={handleSignIn}>
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGetStarted}>
                    Get Started
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleSignIn}
                className="font-medium"
              >
                Sign In
              </Button>
              <Button
                variant="spark"
                onClick={handleGetStarted}
                className="font-medium"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mobile optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-spark-50 via-fitness-50 to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <Badge variant="outline" className="mb-4 text-xs sm:text-sm">
                🚀 Now in Beta - Join Early Access
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-spark-600 to-fitness-600 bg-clip-text text-transparent leading-tight">
                Your AI Fitness Coach
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Transform your fitness journey with personalized workout plans,
                real-time tracking, and AI-powered insights designed just for
                you.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Button
                  size="lg"
                  variant="spark"
                  onClick={handleGetStarted}
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-12 sm:h-14 font-medium"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWatchDemo}
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-12 sm:h-14 font-medium"
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  Free 30-day trial
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  Cancel anytime
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative order-first lg:order-last"
            >
              <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 border">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center gap-2 bg-spark-100 px-3 sm:px-4 py-2 rounded-full mb-3 sm:mb-4">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-spark-600" />
                    <span className="font-medium text-spark-600 text-sm sm:text-base">
                      Today's Workout
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold">
                    Upper Body Strength
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    25 minutes • 6 exercises
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {[
                    { name: "Push-ups", sets: "3 sets × 12 reps" },
                    { name: "Bench Press", sets: "3 sets × 8 reps" },
                    { name: "Pull-ups", sets: "3 sets × 6 reps" },
                  ].map((exercise) => (
                    <div
                      key={exercise.name}
                      className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg"
                    >
                      <span className="font-medium text-sm sm:text-base">
                        {exercise.name}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {exercise.sets}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full mt-4 sm:mt-6 h-10 sm:h-11"
                  variant="spark"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Workout
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Mobile optimized */}
      <section className="py-12 sm:py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-spark-600 mb-1 sm:mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium text-sm sm:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Mobile optimized */}
      <section
        id="features"
        className="py-16 sm:py-20 bg-gradient-to-b from-background to-muted/20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              FitSpark combines cutting-edge AI with proven fitness science to
              deliver personalized workouts that evolve with your progress.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-spark-100">
                        <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-spark-600" />
                      </div>
                      <CardTitle className="text-lg sm:text-xl">
                        {feature.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm sm:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Mobile optimized */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined onboarding gets you from zero to your first
              workout in minutes.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
            {[
              {
                step: "01",
                title: "Tell Us About You",
                description:
                  "Share your fitness goals, experience level, and available equipment through our quick questionnaire.",
              },
              {
                step: "02",
                title: "Get Your Plan",
                description:
                  "Our AI analyzes your profile and creates a personalized workout plan optimized for your success.",
              },
              {
                step: "03",
                title: "Start Training",
                description:
                  "Follow your daily workouts, track progress, and watch as your plan adapts to your improvements.",
              },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-spark-100 text-spark-600 font-bold text-lg sm:text-xl mb-4 sm:mb-6">
                  {step.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Mobile optimized */}
      <section
        id="testimonials"
        className="py-16 sm:py-20 bg-gradient-to-b from-muted/20 to-background"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Loved by Fitness Enthusiasts
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of users who've transformed their fitness journey
              with FitSpark.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-1 mb-3 sm:mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-3 sm:mb-4 italic text-sm sm:text-base">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        {testimonial.name}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile optimized */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-spark-500 to-fitness-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Transform Your Fitness?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 max-w-3xl mx-auto">
              Join FitSpark today and discover what your body is truly capable
              of achieving.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleGetStarted}
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-12 sm:h-14 font-medium"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={handleWatchDemo}
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-12 sm:h-14 font-medium border-white text-white hover:bg-white hover:text-spark-600"
              >
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                See It in Action
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Mobile optimized */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-spark-400" />
                <span className="text-xl sm:text-2xl font-bold">FitSpark</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md text-sm sm:text-base">
                Your AI-powered fitness companion, helping you achieve your
                health and wellness goals with personalized workout plans and
                expert guidance.
              </p>
              <div className="flex gap-4">
                {/* Social media icons would go here */}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-sm sm:text-base">
                Product
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
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
              <h3 className="font-semibold mb-4 text-sm sm:text-base">
                Support
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
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

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
            <p>
              &copy; 2024 FitSpark. All rights reserved. Built with ❤️ for
              fitness enthusiasts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

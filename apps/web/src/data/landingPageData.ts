import {
  Brain,
  Smartphone,
  TrendingUp,
  Users,
  Clock,
  Award,
  type LucideIcon,
} from "lucide-react";

export const FEATURES: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
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

export const TESTIMONIALS = [
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

export const STATS = [
  { number: "10K+", label: "Active Users" },
  { number: "50+", label: "Workout Plans" },
  { number: "95%", label: "Success Rate" },
  { number: "24/7", label: "Support" },
];

export const HOW_IT_WORKS_STEPS = [
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
];

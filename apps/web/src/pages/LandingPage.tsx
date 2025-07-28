import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
// import { StatsSection } from "@/components/landing/StatsSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { CtaSection } from "@/components/landing/CtaSection";

// Temporary inline StatsSection component
function StatsSection() {
  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50+", label: "Workout Plans" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
  ];

  return (
    <section className="py-16 bg-white border-y">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, _) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-spark-600 mb-2">{stat.number}</div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, navigate]);

  if (currentUser) {
    return null; // Avoid flashing content for logged-in users
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="landing" />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer variant="landing" />
    </div>
  );
}

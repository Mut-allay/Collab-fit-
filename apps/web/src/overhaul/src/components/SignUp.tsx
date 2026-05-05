import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Lock, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import type { AuthProps } from "@/overhaul/src/types";

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-z]/.test(pw)) return "Include a lowercase letter.";
  if (!/[A-Z]/.test(pw)) return "Include an uppercase letter.";
  if (!/\d/.test(pw)) return "Include a number.";
  return null;
}

export default function SignUp({ onNavigate, onSuccess }: AuthProps) {
  const { signup } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pwErr = validatePassword(password);
    if (pwErr) {
      toast.error(pwErr);
      return;
    }
    setIsLoading(true);
    try {
      await signup(email.trim().toLowerCase(), password, displayName.trim());
      toast.success("Welcome! Your account is ready.");
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not create account."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-background text-on-surface font-body min-h-screen flex flex-col items-center">
      {/* Top AppBar */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-xl flex justify-between items-center px-6 h-16 shadow-2xl">
        <div className="text-2xl font-black italic text-primary tracking-widest font-headline uppercase hover:cursor-pointer" onClick={() => onNavigate("landing")}>
          KINETIC
        </div>
        <button
          type="button"
          onClick={() => onNavigate("landing")}
          className="text-on-surface hover:opacity-80 transition-opacity active:scale-95 duration-200"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mt-24 px-6 mb-12"
      >
        {/* Progress Indicator */}
        <div className="mb-10 flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <span className="font-headline font-black text-4xl text-primary tracking-tighter uppercase">Step 01</span>
            <span className="font-label text-on-surface-variant text-xs uppercase tracking-[0.2em]">Profile Setup</span>
          </div>
          <Progress value={33} className="h-1.5 bg-surface-container-highest" />
        </div>

        {/* Header */}
        <div className="relative mb-12">
          <div className="absolute -top-8 -left-4 text-[120px] font-headline font-black text-white/[0.03] leading-none select-none pointer-events-none">
            JOIN
          </div>
          <h1 className="font-headline text-5xl font-black text-on-surface tracking-tight relative z-10 leading-[1.1]">
            START YOUR <br />
            <span className="text-primary italic">EVOLUTION.</span>
          </h1>
        </div>

        {/* Signup Form */}
        <section className="bg-surface-container-low rounded-lg p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm border border-outline-variant/10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant block ml-1">Athlete Name</label>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-md px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30 font-body outline-none"
                  placeholder="e.g. Marcus Vane"
                  required
                  type="text"
                  value={displayName}
                  onChange={(ev) => setDisplayName(ev.target.value)}
                  disabled={isLoading}
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant block ml-1">Digital Address</label>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-md px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30 font-body outline-none"
                  placeholder="marcus@kinetic.com"
                  required
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  disabled={isLoading}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant block ml-1">Secure Vault</label>
              <div className="relative group">
                <input
                  className="w-full bg-surface-container-lowest border-none rounded-md px-5 py-4 text-on-surface focus:ring-2 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30 font-body outline-none"
                  placeholder="••••••••••••"
                  required
                  type="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  disabled={isLoading}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-5 h-5" />
              </div>
            </div>

            <div className="flex items-start gap-4 py-2">
              <div className="relative flex items-center justify-center mt-1">
                <input
                  className="peer h-6 w-6 rounded-md bg-surface-container-lowest border-none checked:bg-primary-container focus:ring-0 transition-colors appearance-none cursor-pointer"
                  id="terms"
                  required
                  type="checkbox"
                />
                <Check className="absolute text-on-primary-fixed pointer-events-none opacity-0 peer-checked:opacity-100 w-4 h-4" />
              </div>
              <label className="font-label text-xs text-on-surface-variant leading-relaxed cursor-pointer" htmlFor="terms">
                I AGREE TO THE <span className="text-on-surface font-bold underline underline-offset-4">KINETIC PERFORMANCE TERMS</span> AND RECOGNIZE THAT INTENSE TRAINING REQUIRES PRECISION DATA TRACKING.
              </label>
            </div>

            <div className="pt-4">
              <button
                className="w-full bg-kinetic-gradient text-on-primary-fixed font-headline font-black py-5 rounded-full text-lg uppercase tracking-widest shadow-[0_0_30px_rgba(202,253,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Creating…" : "CREATE ACCOUNT"}
                {!isLoading && <ArrowRight className="w-6 h-6" />}
              </button>
            </div>
          </form>
        </section>

        {/* Secondary Nav */}
        <div className="mt-8 text-center">
          <p className="font-label text-xs text-on-surface-variant tracking-wider uppercase">
            Already Part of the Elite?
            <button type="button" onClick={() => onNavigate("login")} className="text-primary font-bold hover:underline underline-offset-4 ml-1">
              Sign In
            </button>
          </p>
        </div>

        {/* Visual Anchor */}
        <div className="mt-16 relative h-48 w-full rounded-lg overflow-hidden group">
          <img
            alt="Performance athlete"
            className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="text-primary-container font-headline font-black text-xl italic tracking-tighter">UNLEASH THE DATA.</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

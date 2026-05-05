import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Apple } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import type { AuthProps } from "@/overhaul/src/types";

export default function Login({ onNavigate, onSuccess }: AuthProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Sign in failed. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row relative bg-background">
      {/* Visual Side */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-surface-container-low relative overflow-hidden items-end p-16">
        <div className="absolute inset-0 z-0">
          <img
            alt="High Performance Training"
            className="w-full h-full object-cover opacity-30 grayscale"
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
          />
        </div>
        <div className="relative z-10">
          <h1 className="font-headline text-[8rem] leading-[0.8] font-black italic tracking-tighter text-primary/10 select-none absolute -top-40 -left-10">
            PRECISION
          </h1>
          <div className="space-y-4 max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-primary text-on-primary-fixed font-label font-bold text-[10px] uppercase tracking-widest">
              High Intensity
            </span>
            <h2 className="font-headline text-7xl font-black uppercase tracking-tight leading-none text-on-surface">
              THE PULSE <br />OF <span className="text-primary-container">POWER.</span>
            </h2>
            <p className="text-on-surface-variant font-body text-lg max-w-sm">
              Experience data-driven training that evolves with your movement. Welcome to the lab.
            </p>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 py-12 z-10 bg-background min-h-screen">
        <div className="absolute top-8 left-6 md:left-12 flex items-center justify-between w-[calc(100%-3rem)] md:w-[calc(100%-6rem)]">
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-label font-semibold text-xs uppercase tracking-widest">Back to landing</span>
          </button>
          <span className="font-headline font-black italic text-2xl tracking-widest text-primary">KINETIC</span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md mx-auto space-y-10"
        >
          <div className="space-y-2">
            <h3 className="font-headline text-4xl font-extrabold tracking-tight">ACCESS LAB</h3>
            <p className="text-on-surface-variant font-body">Sign in to resume your high-performance cycle.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block font-label text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant ml-1">
                Identification / Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="name@kinetic-performance.com"
                  className="w-full bg-surface-container border-none rounded-lg px-5 py-4 text-on-surface placeholder-on-surface-variant/30 focus:ring-2 focus:ring-primary-container transition-all outline-none"
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end ml-1">
                <label className="block font-label text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">
                  Security / Password
                </label>
                <button type="button" className="font-label text-[10px] font-bold text-primary hover:text-primary-container transition-colors uppercase tracking-widest">
                  Forgot Access?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-surface-container border-none rounded-lg px-5 py-4 text-on-surface placeholder-on-surface-variant/30 focus:ring-2 focus:ring-primary-container transition-all outline-none"
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-kinetic-gradient w-full py-5 rounded-xl text-on-primary-fixed font-headline font-black text-sm uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all disabled:opacity-60"
              >
                {isLoading ? "Signing in…" : "LOGIN TO SYSTEM"}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-outline-variant/20" />
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50">External Verification</span>
              <div className="h-[1px] flex-1 bg-outline-variant/20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-3 bg-surface-container-highest py-4 rounded-lg hover:bg-surface-bright transition-colors opacity-50 cursor-not-allowed"
                title="Coming soon"
              >
                <img
                  alt="Google"
                  className="w-5 h-5 grayscale"
                  src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                />
                <span className="font-label text-xs font-bold uppercase tracking-widest">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-3 bg-surface-container-highest py-4 rounded-lg hover:bg-surface-bright transition-colors opacity-50 cursor-not-allowed"
                title="Coming soon"
              >
                <Apple className="w-5 h-5" />
                <span className="font-label text-xs font-bold uppercase tracking-widest">Apple</span>
              </button>
            </div>
          </div>

          <p className="text-center text-on-surface-variant font-label text-xs">
            Not part of the elite?
            <button type="button" onClick={() => onNavigate("signup")} className="text-primary font-bold hover:underline ml-1">
              ENROLL NOW
            </button>
          </p>
        </motion.div>
      </div>

      <div className="fixed bottom-10 right-10 hidden lg:block opacity-20 select-none pointer-events-none">
        <span className="font-headline font-black text-9xl text-outline-variant">01</span>
      </div>
    </main>
  );
}

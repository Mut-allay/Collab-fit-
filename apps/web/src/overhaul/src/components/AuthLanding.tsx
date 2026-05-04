import { motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { AuthProps } from "@/src/types";

export default function AuthLanding({ onNavigate }: AuthProps) {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-end overflow-hidden bg-background text-on-surface">
      {/* Background Image & Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Runner in neon city"
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Header Overlay */}
      <header className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-center">
        <div className="font-headline text-3xl font-black italic tracking-widest text-primary [text-shadow:_0_0_30px_rgba(202,253,0,0.3)]">
          FIT&LIT
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <span className="text-on-surface-variant font-label text-sm uppercase tracking-widest">
            Performance Protocol v2.0
          </span>
        </div>
      </header>

      {/* Content */}
      <section className="relative z-10 w-full max-w-xl px-6 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <div className="inline-block px-3 py-1 mb-4 bg-primary-container/20 rounded-full">
              <span className="text-primary font-label text-[10px] font-bold uppercase tracking-[0.2em]">
                Live Training Active
              </span>
            </div>
            <h1 className="font-headline text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase mb-6 drop-shadow-xl text-on-surface">
              Break <br />
              <span className="text-primary">Limits</span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-sm leading-relaxed">
              Precision data meets high-intensity energy. Elevate your performance with the pulse of the city.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => onNavigate("signup")}
              className="group relative w-full bg-kinetic-gradient p-[2px] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(202,253,0,0.2)] active:scale-[0.98] transition-transform duration-200"
            >
              <div className="bg-primary-container text-on-primary-container py-5 px-8 rounded-xl flex items-center justify-center gap-3 font-headline font-extrabold text-lg uppercase tracking-widest">
                GET STARTED
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onNavigate("login")}
              className="w-full bg-surface-container-highest/60 backdrop-blur-md border border-outline-variant/20 text-on-surface py-5 px-8 rounded-xl font-headline font-bold text-sm uppercase tracking-widest hover:bg-surface-container-highest transition-colors active:scale-[0.98]"
            >
              I ALREADY HAVE AN ACCOUNT
            </button>

            <div className="flex items-center gap-4 my-4">
              <div className="h-[1px] flex-1 bg-outline-variant/30" />
              <span className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">
                Authorized Access
              </span>
              <div className="h-[1px] flex-1 bg-outline-variant/30" />
            </div>

            <button className="w-full flex items-center justify-center gap-4 bg-surface-container-lowest border border-outline-variant/10 text-on-surface py-4 px-8 rounded-xl hover:bg-surface-container-low transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-label font-bold text-sm uppercase tracking-wider">
                Continue with Google
              </span>
            </button>
          </div>

          <footer className="mt-12 flex justify-between items-center opacity-40">
            <div className="text-[10px] font-label uppercase tracking-tighter">
              © 2024 Kinetic Labs Inc.
            </div>
            <div className="flex gap-4">
              <Globe className="w-4 h-4" />
            </div>
          </footer>
        </motion.div>
      </section>

      {/* Decorative Text */}
      <div className="absolute -left-20 top-1/4 -z-1 opacity-10 pointer-events-none select-none">
        <span className="font-headline text-[20rem] font-black italic tracking-tighter text-outline-variant">
          KNTK
        </span>
      </div>

      {/* Progress Bar Indicator at Top */}
      <div className="fixed top-0 left-0 w-full h-1 bg-surface-container-highest z-[60]">
        <div className="h-full bg-primary w-1/3 shadow-[0_0_15px_rgba(202,253,0,0.8)]" />
      </div>
    </main>
  );
}

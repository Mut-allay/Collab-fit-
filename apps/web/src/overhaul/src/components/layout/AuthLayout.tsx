import { Outlet } from "react-router-dom";
import { Zap } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(202,253,0,0.08),transparent_24%)] pointer-events-none" />
      <header className="sticky top-0 z-50 border-b border-outline-variant/10 bg-background/95 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary-fixed" />
            <span className="font-headline text-lg uppercase tracking-[0.35em] font-black text-primary-fixed">
              FIT&LIT
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-on-surface-variant text-[11px] uppercase tracking-[0.3em] font-label">
            Premium Performance
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

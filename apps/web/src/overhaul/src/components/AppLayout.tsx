import React from "react";
import { Zap } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  key?: string;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary">
      {/* Top Navigation Anchor */}
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl flex justify-between items-center px-6 h-20 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <Zap className="text-primary-fixed w-6 h-6 fill-primary-fixed" />
          <h1 className="font-headline font-black tracking-tighter uppercase text-2xl italic text-primary-fixed">
            FIT&LIT
          </h1>
        </div>
        <button className="text-on-surface-variant font-label text-sm uppercase tracking-widest hover:text-primary transition-colors">
          Help
        </button>
      </header>

      <main className="pt-28 pb-12 px-6 max-w-2xl mx-auto relative z-10">
        {children}
      </main>

      {/* Visual Texture Elements */}
      <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none -z-10" />
      <div className="fixed top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none -z-10" />
    </div>
  );
}

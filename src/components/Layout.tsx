import { NavLink, useLocation } from "react-router-dom";
import { Home, Compass, Camera, BarChart3, Volume2, VolumeX } from "lucide-react";
import { useAmbientSound } from "@/hooks/use-ambient-sound";
import SoundPlayer from "./SoundPlayer";
import { useState } from "react";

const navItems = [
  { to: "/", icon: Home, label: "Today" },
  { to: "/exercises", icon: Compass, label: "Journeys" },
  { to: "/spaces", icon: Camera, label: "Spaces" },
  { to: "/stats", icon: BarChart3, label: "Practice" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const ambient = useAmbientSound();
  const [showSound, setShowSound] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center justify-between h-14 max-w-lg mx-auto px-5">
          <h1 className="text-xl font-serif font-semibold tracking-tight text-foreground italic">
            ink
          </h1>
          <button
            onClick={() => setShowSound(!showSound)}
            className="p-2.5 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
            aria-label="Toggle sound player"
          >
            {ambient.playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
        {showSound && (
          <div className="border-t border-border/50">
            <div className="container max-w-lg mx-auto px-5 py-3">
              <SoundPlayer ambient={ambient} />
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-lg mx-auto px-5 py-6 pb-24">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/40">
        <div className="container max-w-lg mx-auto flex items-center justify-around h-[72px] px-4">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors duration-200 ${isActive ? "bg-primary/10" : ""}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.5} />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

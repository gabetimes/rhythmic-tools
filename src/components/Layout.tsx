import { NavLink, useLocation } from "react-router-dom";
import { Home, Compass, Camera, BarChart3, Volume2, VolumeX, Moon, Sun } from "lucide-react";
import { useAmbientSound } from "@/hooks/use-ambient-sound";
import { useTheme } from "next-themes";
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
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container flex items-center justify-between h-14 max-w-lg mx-auto px-4">
          <h1 className="text-xl font-serif font-semibold tracking-tight text-foreground">
            ink
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setShowSound(!showSound)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle sound player"
            >
              {ambient.playing ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </div>
        {showSound && (
          <div className="border-t border-border">
            <div className="container max-w-lg mx-auto px-4 py-3">
              <SoundPlayer ambient={ambient} />
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-lg mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-t border-border">
        <div className="container max-w-lg mx-auto flex items-center justify-around h-16 px-4">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className="text-[11px] font-medium">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

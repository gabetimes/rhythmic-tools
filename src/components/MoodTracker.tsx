import { useState, useEffect } from "react";
import { trackMoodCheckin } from "@/lib/analytics/web";

const moods = [
  { symbol: "〰", label: "Calm", color: "bg-sage-light" },
  { symbol: "✦", label: "Happy", color: "bg-terracotta-light" },
  { symbol: "◌", label: "Neutral", color: "bg-secondary" },
  { symbol: "↓", label: "Low", color: "bg-muted" },
  { symbol: "⟡", label: "Tense", color: "bg-terracotta-light" },
];

export function getTodayMood(): { symbol: string; label: string } | null {
  const todayKey = new Date().toISOString().split("T")[0];
  const saved = localStorage.getItem(`ink-mood-${todayKey}`);
  if (saved === null) return null;
  const idx = Number(saved);
  return moods[idx] ? { symbol: moods[idx].symbol, label: moods[idx].label } : null;
}

export default function MoodTracker() {
  const todayKey = new Date().toISOString().split("T")[0];
  const [selected, setSelected] = useState<number | null>(() => {
    const saved = localStorage.getItem(`ink-mood-${todayKey}`);
    return saved !== null ? Number(saved) : null;
  });
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (selected !== null) {
      localStorage.setItem(`ink-mood-${todayKey}`, String(selected));
    }
  }, [selected, todayKey]);

  const handleSelect = (i: number) => {
    setSelected(i);
    trackMoodCheckin(moods[i].label.toLowerCase());
    setFading(true);
    setTimeout(() => setHidden(true), 500);
  };

  if (selected !== null && !fading) return null;
  if (hidden) return null;

  return (
    <div
      className="space-y-3 transition-all duration-500 ease-out"
      style={{
        opacity: fading ? 0 : 1,
        transform: fading ? "translateY(-8px) scale(0.98)" : "translateY(0) scale(1)",
        maxHeight: fading ? "0px" : "120px",
        overflow: "hidden",
      }}
    >
      <p className="text-sm text-muted-foreground font-sans">How are you feeling?</p>
      <div className="flex gap-2">
        {moods.map((mood, i) => (
          <button
            key={mood.label}
            onClick={() => handleSelect(i)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all hover:bg-secondary/50"
          >
            <span className="text-xl font-serif">{mood.symbol}</span>
            <span className="text-[10px] text-muted-foreground font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

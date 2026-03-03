import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (selected !== null) {
      localStorage.setItem(`ink-mood-${todayKey}`, String(selected));
    }
  }, [selected, todayKey]);

  // Hide once a mood is selected
  if (selected !== null) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground font-sans">How are you feeling?</p>
      <div className="flex gap-2">
        {moods.map((mood, i) => (
          <button
            key={mood.label}
            onClick={() => setSelected(i)}
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

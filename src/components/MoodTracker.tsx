import { useState, useEffect } from "react";

const moods = [
  { symbol: "〰", label: "Calm", color: "bg-sage-light" },
  { symbol: "✦", label: "Happy", color: "bg-terracotta-light" },
  { symbol: "◌", label: "Neutral", color: "bg-secondary" },
  { symbol: "↓", label: "Low", color: "bg-muted" },
  { symbol: "⟡", label: "Tense", color: "bg-terracotta-light" },
];

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

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground font-sans">How are you feeling?</p>
      <div className="flex gap-2">
        {moods.map((mood, i) => (
          <button
            key={mood.label}
            onClick={() => setSelected(i)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              selected === i
                ? `${mood.color} ring-2 ring-primary/30 scale-105`
                : "hover:bg-secondary/50"
            }`}
          >
            <span className="text-xl font-serif">{mood.symbol}</span>
            <span className="text-[10px] text-muted-foreground font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

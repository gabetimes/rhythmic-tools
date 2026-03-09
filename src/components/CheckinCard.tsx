import { useState } from "react";
import { hasCheckedInToday, logCheckin } from "@/lib/session-store";
import { trackNewEntry } from "@/lib/analytics/web";
import { PenLine, Check } from "lucide-react";

export default function CheckinCard() {
  const [checked, setChecked] = useState(hasCheckedInToday);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleCheckin = () => {
    if (checked) return;
    logCheckin();
    trackNewEntry();
    setChecked(true);
    setTimeout(() => setFading(true), 1200);
    setTimeout(() => setHidden(true), 1700);
  };

  if (checked && !fading && hasCheckedInToday() && hidden) return null;
  if (hidden) return null;

  return (
    <div
      className="transition-all duration-500 ease-out"
      style={{
        opacity: fading ? 0 : 1,
        transform: fading ? "translateY(-8px) scale(0.98)" : "translateY(0) scale(1)",
        maxHeight: fading ? "0px" : "200px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={handleCheckin}
        className="w-full bg-card border border-border rounded-2xl p-5 flex items-center gap-4 text-left hover:bg-secondary/30 transition-colors group"
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
            checked
              ? "bg-primary text-primary-foreground"
              : "border-2 border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
          }`}
        >
          {checked ? <Check size={20} /> : <PenLine size={18} />}
        </div>
        <div>
          <p className="font-serif text-foreground font-medium">
            {checked ? "Checked in for today" : "Did you write today?"}
          </p>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            {checked ? "Your streak is growing ✨" : "Tap to mark today as a writing day"}
          </p>
        </div>
      </button>
    </div>
  );
}

import { getStreak, getTotalMinutes, getTotalSessions, getUniqueDays } from "@/lib/session-store";
import { Flame, Clock, BookOpen, Calendar } from "lucide-react";

export default function Stats() {
  const streak = getStreak();
  const totalMin = getTotalMinutes();
  const totalSessions = getTotalSessions();
  const uniqueDays = getUniqueDays();

  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h2 className="text-2xl font-serif font-semibold text-foreground">Your Practice</h2>
        <p className="text-sm text-muted-foreground mt-1 font-sans">
          Celebrating your time with the pen
        </p>
      </div>

      {/* Streak hero */}
      <div className="animate-fade-up-delay">
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-3">
            <Flame size={28} className="text-accent" />
          </div>
          <p className="text-5xl font-serif font-semibold text-foreground">{streak}</p>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            {streak === 1 ? "day streak" : "day streak"}
          </p>
          {streak === 0 && (
            <p className="text-xs text-muted-foreground font-sans mt-3">
              Start a writing session today to begin your streak
            </p>
          )}
          {streak >= 7 && (
            <p className="text-xs text-accent font-sans mt-3 font-medium">
              ✨ A whole week of showing up — beautiful
            </p>
          )}
          {streak >= 3 && streak < 7 && (
            <p className="text-xs text-accent font-sans mt-3 font-medium">
              🌱 Growing strong — keep going
            </p>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up-delay-2">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Clock size={18} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-lg font-serif font-semibold text-foreground">{timeStr}</p>
          <p className="text-[10px] text-muted-foreground font-sans mt-0.5">time writing</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <BookOpen size={18} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-lg font-serif font-semibold text-foreground">{totalSessions}</p>
          <p className="text-[10px] text-muted-foreground font-sans mt-0.5">sessions</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <Calendar size={18} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-lg font-serif font-semibold text-foreground">{uniqueDays}</p>
          <p className="text-[10px] text-muted-foreground font-sans mt-0.5">days active</p>
        </div>
      </div>

      {/* Gentle encouragement */}
      <div className="animate-fade-up-delay-2">
        <div className="bg-secondary/30 rounded-2xl p-5 text-center">
          <p className="font-serif text-foreground text-sm leading-relaxed italic">
            {totalSessions === 0
              ? "Every great journal starts with a single page. Begin today."
              : totalSessions < 5
                ? "You've started something meaningful. Each session is a gift to yourself."
                : totalSessions < 20
                  ? "A beautiful habit is forming. Your future self will thank you."
                  : "You've made journaling a part of who you are. That's remarkable."}
          </p>
        </div>
      </div>
    </div>
  );
}

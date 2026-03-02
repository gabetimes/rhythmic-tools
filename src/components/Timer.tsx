import { useState, useEffect, useCallback } from "react";

interface TimerProps {
  durationMinutes: number;
  onComplete: () => void;
  isActive: boolean;
}

export default function Timer({ durationMinutes, onComplete, isActive }: TimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setRunning(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (!running || !isActive) return;
    if (secondsLeft <= 0) {
      setRunning(false);
      onComplete();
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft, isActive, onComplete]);

  const progress = 1 - secondsLeft / totalSeconds;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="4"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-serif font-light text-foreground tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {running ? "writing..." : secondsLeft < totalSeconds ? "paused" : "ready"}
          </span>
        </div>
      </div>

      <button
        onClick={() => setRunning(!running)}
        className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm tracking-wide hover:opacity-90 transition-opacity"
      >
        {running ? "Pause" : secondsLeft < totalSeconds ? "Resume" : "Begin"}
      </button>
    </div>
  );
}

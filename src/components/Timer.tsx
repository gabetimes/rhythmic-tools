import { useState, useEffect, useCallback, useRef } from "react";

interface TimerProps {
  durationMinutes: number;
  onComplete: () => void;
  isActive: boolean;
  noTimer?: boolean;
  noTimerLabel?: string;
  onStart?: () => void;
}

export default function Timer({
  durationMinutes,
  onComplete,
  isActive,
  noTimer,
  noTimerLabel,
  onStart,
}: TimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Reset when duration changes
  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setRunning(false);
    endTimeRef.current = null;
  }, [totalSeconds]);

  // Start/stop: track wall-clock end time
  useEffect(() => {
    if (running && !endTimeRef.current) {
      endTimeRef.current = Date.now() + secondsLeft * 1000;
    }
    if (!running) {
      // When paused, clear end time (secondsLeft already holds remaining)
      endTimeRef.current = null;
    }
  }, [running]);

  // Wall-clock based tick — survives screen lock
  useEffect(() => {
    if (!running || !isActive) return;

    const tick = () => {
      if (!endTimeRef.current) return;
      const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        setRunning(false);
        endTimeRef.current = null;
        playSingingBowl();
        onCompleteRef.current();
      }
    };

    tick(); // immediate sync on resume / visibility change
    const id = setInterval(tick, 1000);

    // Re-sync when tab/screen becomes visible again
    const handleVisibility = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [running, isActive]);

  // Request notification permission early
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const progress = 1 - secondsLeft / totalSeconds;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);
  const handleToggle = () => {
    const isFirstStart = !running && secondsLeft === totalSeconds;
    if (isFirstStart) {
      onStart?.();
    }
    setRunning(!running);
  };

  if (noTimer) {
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
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground">no time limit</span>
          </div>
        </div>
        <button
          onClick={() => onCompleteRef.current()}
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm tracking-wide hover:opacity-90 transition-opacity"
        >
          {noTimerLabel || "Done"}
        </button>
      </div>
    );
  }

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
        onClick={handleToggle}
        className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm tracking-wide hover:opacity-90 transition-opacity"
      >
        {running ? "Pause" : secondsLeft < totalSeconds ? "Resume" : "Begin"}
      </button>
    </div>
  );
}

/** Tibetan singing bowl sound using Web Audio API */
function playSingingBowl() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Fundamental + harmonics of a singing bowl
    const frequencies = [262, 524, 786, 1048];
    const gains = [0.2, 0.12, 0.06, 0.03];
    const decays = [4, 3, 2.5, 2];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      // Slight detuning for warmth
      osc.detune.setValueAtTime(Math.random() * 6 - 3, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gains[i], now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[i]);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + decays[i]);
    });

    // Second strike slightly delayed for resonance
    setTimeout(() => {
      const now2 = ctx.currentTime;
      frequencies.slice(0, 2).forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now2);
        osc.detune.setValueAtTime(Math.random() * 4 - 2, now2);
        gain.gain.setValueAtTime(0, now2);
        gain.gain.linearRampToValueAtTime(gains[i] * 0.5, now2 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now2 + 3);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now2);
        osc.stop(now2 + 3);
      });
    }, 1500);

    // Send notification if screen is locked / tab hidden
    if (document.visibilityState === "hidden" && "Notification" in window && Notification.permission === "granted") {
      new Notification("Timer Complete 🔔", {
        body: "Your writing session is done. Take a breath.",
        icon: "/favicon.ico",
      });
    }
  } catch (e) {
    console.log("Audio not available");
  }
}

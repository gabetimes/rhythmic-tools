import { dailyPrompts, getTodayPrompt } from "@/data/prompts";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Feather, RefreshCw, Timer, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import MoodTracker from "@/components/MoodTracker";
import { logSession } from "@/lib/session-store";
import heroImage from "@/assets/hero-journal.jpg";

function getRefreshState() {
  const todayKey = new Date().toISOString().split("T")[0];
  try {
    const saved = JSON.parse(localStorage.getItem("ink-prompt-refresh") || "{}");
    if (saved.date === todayKey) return { count: saved.count as number, index: saved.index as number };
  } catch { /* ignore */ }
  return { count: 0, index: -1 };
}

function saveRefreshState(count: number, index: number) {
  const todayKey = new Date().toISOString().split("T")[0];
  localStorage.setItem("ink-prompt-refresh", JSON.stringify({ date: todayKey, count, index }));
}

export default function Index() {
  const navigate = useNavigate();
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Prompt refresh logic
  const [refreshState, setRefreshState] = useState(getRefreshState);
  const basePrompt = getTodayPrompt();
  const prompt = refreshState.index >= 0 ? dailyPrompts[refreshState.index % dailyPrompts.length] : basePrompt;
  const refreshesLeft = 3 - refreshState.count;

  const handleRefresh = () => {
    if (refreshesLeft <= 0) return;
    const newIndex = (refreshState.index >= 0 ? refreshState.index : Math.floor(Math.random() * dailyPrompts.length)) + 1 + Math.floor(Math.random() * (dailyPrompts.length - 1));
    const newCount = refreshState.count + 1;
    setRefreshState({ count: newCount, index: newIndex });
    saveRefreshState(newCount, newIndex);
  };

  // Inline timer
  const [showTimer, setShowTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  const startTimer = () => {
    setSecondsLeft(timerMinutes * 60);
    setTimerRunning(true);
  };

  const stopTimer = useCallback(() => {
    if (secondsLeft !== null) {
      const elapsed = timerMinutes * 60 - secondsLeft;
      if (elapsed >= 30) logSession(Math.round(elapsed / 60));
    }
    setSecondsLeft(null);
    setTimerRunning(false);
  }, [secondsLeft, timerMinutes]);

  useEffect(() => {
    if (!timerRunning || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      logSession(timerMinutes);
      setTimerRunning(false);
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => (s !== null ? s - 1 : null)), 1000);
    return () => clearInterval(id);
  }, [timerRunning, secondsLeft, timerMinutes]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="animate-fade-up">
        <div className="relative rounded-2xl overflow-hidden h-40">
          <img
            src={heroImage}
            alt="A cozy journaling scene"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-primary-foreground/70 text-sm font-sans">{dateStr}</p>
            <h2 className="text-primary-foreground text-lg font-serif font-semibold mt-0.5">
              Good morning
            </h2>
          </div>
        </div>
      </div>

      {/* Daily Prompt */}
      <div className="animate-fade-up-delay">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Feather size={16} className="text-accent" />
              <span className="text-xs font-medium text-accent uppercase tracking-wider">
                Today's Prompt
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowTimer(!showTimer)}
                className={`p-1.5 rounded-lg transition-colors ${showTimer ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                aria-label="Toggle timer"
              >
                <Timer size={15} />
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshesLeft <= 0}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label={`Refresh prompt (${refreshesLeft} left)`}
                title={`${refreshesLeft} refreshes left today`}
              >
                <RefreshCw size={15} />
              </button>
              {refreshesLeft < 3 && (
                <span className="text-[10px] text-muted-foreground font-sans ml-0.5">{refreshesLeft}</span>
              )}
            </div>
          </div>
          <p className="font-serif text-lg leading-relaxed text-foreground">
            {prompt}
          </p>
          <p className="text-xs text-muted-foreground mt-4 font-sans">
            Open your notebook and write for as long as this speaks to you.
          </p>

          {/* Inline timer */}
          {showTimer && (
            <div className="mt-4 pt-4 border-t border-border">
              {secondsLeft === null ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    {[5, 10, 20, 30].map((m) => (
                      <button
                        key={m}
                        onClick={() => setTimerMinutes(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          timerMinutes === m
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={startTimer}
                    className="px-4 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                  >
                    Start
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-serif font-light text-foreground tabular-nums">
                      {formatTime(secondsLeft)}
                    </span>
                    <span className="text-xs text-muted-foreground font-sans">
                      {timerRunning ? "writing..." : "done ✓"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {timerRunning && (
                      <button
                        onClick={() => setTimerRunning(false)}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium"
                      >
                        Pause
                      </button>
                    )}
                    {!timerRunning && secondsLeft > 0 && (
                      <button
                        onClick={() => setTimerRunning(true)}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
                      >
                        Resume
                      </button>
                    )}
                    <button
                      onClick={stopTimer}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      aria-label="Stop timer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mood */}
      <div className="animate-fade-up-delay-2">
        <MoodTracker />
      </div>

      {/* Start Session */}
      <div className="animate-fade-up-delay-2">
        <button
          onClick={() => navigate("/exercises")}
          className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-2xl p-5 hover:opacity-90 transition-opacity group"
        >
          <div className="text-left">
            <p className="font-serif text-lg font-semibold">Start a Journey</p>
            <p className="text-sm opacity-80 mt-0.5 font-sans">
              Guided writing exercises with timers
            </p>
          </div>
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      {/* Capture */}
      <div className="animate-fade-up-delay-2">
        <button
          onClick={() => navigate("/capture")}
          className="w-full flex items-center justify-between bg-card text-card-foreground border border-border rounded-2xl p-5 hover:bg-secondary/50 transition-colors group"
        >
          <div className="text-left">
            <p className="font-serif text-lg font-semibold">Capture the Moment</p>
            <p className="text-sm text-muted-foreground mt-0.5 font-sans">
              Photograph your writing space
            </p>
          </div>
          <ArrowRight
            size={20}
            className="text-muted-foreground group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}

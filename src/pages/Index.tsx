import { getTodayPrompts, getCurrentPrompt } from "@/data/prompts";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Feather, RefreshCw, Timer, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import MoodTracker from "@/components/MoodTracker";
import CheckinCard from "@/components/CheckinCard";
import heroImage from "@/assets/hero-journal.jpg";

function getPromptState(): { promptIndex: number } {
  const todayKey = new Date().toISOString().split("T")[0];
  try {
    const saved = JSON.parse(localStorage.getItem("ink-prompt-refresh") || "{}");
    if (saved.date === todayKey && typeof saved.promptIndex === "number") {
      return { promptIndex: saved.promptIndex };
    }
  } catch { /* ignore */ }
  return { promptIndex: 0 };
}

function savePromptState(promptIndex: number) {
  const todayKey = new Date().toISOString().split("T")[0];
  localStorage.setItem("ink-prompt-refresh", JSON.stringify({ date: todayKey, promptIndex }));
}

export default function Index() {
  const navigate = useNavigate();
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const todayPrompts = getTodayPrompts();
  const [promptIndex, setPromptIndex] = useState(() => getPromptState().promptIndex);
  const prompt = todayPrompts[promptIndex];

  const handleRefresh = () => {
    if (promptIndex >= 2) return;
    const next = promptIndex + 1;
    setPromptIndex(next);
    savePromptState(next);
  };

  const handleBack = () => {
    if (promptIndex <= 0) return;
    const prev = promptIndex - 1;
    setPromptIndex(prev);
    savePromptState(prev);
  };

  // Inline timer — wall-clock based so it survives screen lock
  const [showTimer, setShowTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [pausedRemaining, setPausedRemaining] = useState<number | null>(null);

  const startTimer = () => {
    const end = Date.now() + timerMinutes * 60 * 1000;
    setTimerEndTime(end);
    setPausedRemaining(null);
    setTimerRunning(true);
  };

  const stopTimer = useCallback(() => {
    setTimerEndTime(null);
    setTimerRunning(false);
    setSecondsLeft(null);
    setPausedRemaining(null);
  }, []);

  const pauseTimer = useCallback(() => {
    if (timerEndTime) {
      setPausedRemaining(Math.max(0, Math.round((timerEndTime - Date.now()) / 1000)));
    }
    setTimerRunning(false);
  }, [timerEndTime]);

  const resumeTimer = useCallback(() => {
    if (pausedRemaining !== null) {
      setTimerEndTime(Date.now() + pausedRemaining * 1000);
      setPausedRemaining(null);
      setTimerRunning(true);
    }
  }, [pausedRemaining]);

  useEffect(() => {
    if (!timerRunning || timerEndTime === null) return;
    const tick = () => {
      const remaining = Math.max(0, Math.round((timerEndTime - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        setTimerRunning(false);
      }
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [timerRunning, timerEndTime]);

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
              {greeting}
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
              {promptIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  aria-label="Previous prompt"
                >
                  <ChevronLeft size={15} />
                </button>
              )}
              <button
                onClick={handleRefresh}
                disabled={promptIndex >= 2}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next prompt"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
          <p className="font-serif text-lg leading-relaxed text-foreground">
            {prompt}
          </p>
          {/* Dot indicator */}
          <div className="flex items-center gap-1.5 mt-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === promptIndex ? "bg-accent" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-sans">
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
                        onClick={pauseTimer}
                        className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium"
                      >
                        Pause
                      </button>
                    )}
                    {!timerRunning && secondsLeft !== null && secondsLeft > 0 && (
                      <button
                        onClick={resumeTimer}
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

      {/* Check-in */}
      <div className="animate-fade-up-delay-2">
        <CheckinCard />
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

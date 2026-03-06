import { getTodayPrompts, getCurrentPrompt } from "@/data/prompts";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Feather, RefreshCw, Timer, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import MoodTracker from "@/components/MoodTracker";
import CheckinCard from "@/components/CheckinCard";

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
    <div className="space-y-6">
      {/* Hero — sunrise gradient inspired by reference */}
      <div className="animate-fade-up">
        <div className="relative rounded-3xl overflow-hidden bg-sunrise p-6 pb-8 shadow-soft">
          <p className="text-muted-foreground text-xs font-sans font-medium tracking-wider uppercase">{dateStr}</p>
          <h2 className="text-foreground text-2xl font-serif font-semibold mt-2 italic">
            {greeting}
          </h2>
          <p className="text-muted-foreground text-sm font-sans mt-2 leading-relaxed max-w-[260px]">
            Take it slow today. Your words are waiting for you.
          </p>
        </div>
      </div>

      {/* Daily Prompt */}
      <div className="animate-fade-up-delay">
        <div className="bg-card/70 backdrop-blur-sm rounded-3xl p-6 border border-border/50 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Feather size={14} className="text-primary" />
              </div>
              <span className="text-xs font-medium text-primary uppercase tracking-wider font-sans">
                Today's Prompt
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setShowTimer(!showTimer)}
                className={`p-2 rounded-xl transition-all ${showTimer ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}
                aria-label="Toggle timer"
              >
                <Timer size={15} />
              </button>
              {promptIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
                  aria-label="Previous prompt"
                >
                  <ChevronLeft size={15} />
                </button>
              )}
              <button
                onClick={handleRefresh}
                disabled={promptIndex >= 2}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next prompt"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
          <p className="font-serif text-lg leading-relaxed text-foreground italic">
            {prompt}
          </p>
          {/* Dot indicator */}
          <div className="flex items-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === promptIndex ? "bg-primary scale-110" : "bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-sans leading-relaxed">
            Open your notebook and write for as long as this speaks to you.
          </p>

          {/* Inline timer */}
          {showTimer && (
            <div className="mt-5 pt-5 border-t border-border/40">
              {secondsLeft === null ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    {[5, 10, 20, 30].map((m) => (
                      <button
                        key={m}
                        onClick={() => setTimerMinutes(m)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          timerMinutes === m
                            ? "bg-primary text-primary-foreground shadow-soft"
                            : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={startTimer}
                    className="px-5 py-1.5 rounded-xl bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity shadow-soft"
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
                        className="px-3 py-1.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium"
                      >
                        Pause
                      </button>
                    )}
                    {!timerRunning && secondsLeft !== null && secondsLeft > 0 && (
                      <button
                        onClick={resumeTimer}
                        className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium"
                      >
                        Resume
                      </button>
                    )}
                    <button
                      onClick={stopTimer}
                      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
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
          className="w-full flex items-center justify-between bg-primary text-primary-foreground rounded-3xl p-5 hover:opacity-90 transition-opacity group shadow-soft-lg"
        >
          <div className="text-left">
            <p className="font-serif text-lg font-semibold italic">Start a Journey</p>
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
          className="w-full flex items-center justify-between bg-card/70 text-card-foreground border border-border/50 rounded-3xl p-5 hover:bg-secondary/40 transition-all group shadow-soft"
        >
          <div className="text-left">
            <p className="font-serif text-lg font-semibold italic">Capture the Moment</p>
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

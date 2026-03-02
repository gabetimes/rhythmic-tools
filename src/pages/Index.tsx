import { getTodayPrompt } from "@/data/prompts";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Feather } from "lucide-react";
import MoodTracker from "@/components/MoodTracker";
import heroImage from "@/assets/hero-journal.jpg";

export default function Index() {
  const navigate = useNavigate();
  const prompt = getTodayPrompt();
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

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
          <div className="flex items-center gap-2 mb-3">
            <Feather size={16} className="text-accent" />
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              Today's Prompt
            </span>
          </div>
          <p className="font-serif text-lg leading-relaxed text-foreground">
            {prompt}
          </p>
          <p className="text-xs text-muted-foreground mt-4 font-sans">
            Open your notebook and write for as long as this speaks to you.
          </p>
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

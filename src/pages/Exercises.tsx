import { useNavigate } from "react-router-dom";
import { journeys } from "@/data/journeys";
import { CalendarDays, Wind, Sparkles, Heart, Sunrise, Clock, ArrowRight } from "lucide-react";

const iconMap: Record<string, typeof CalendarDays> = {
  "calendar-days": CalendarDays,
  wind: Wind,
  sparkles: Sparkles,
  heart: Heart,
  sunrise: Sunrise,
};

export default function Exercises() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h2 className="text-2xl font-serif font-semibold text-foreground">Journeys</h2>
        <p className="text-sm text-muted-foreground mt-1 font-sans">
          Guided writing exercises to take you deeper.
        </p>
      </div>

      <div className="space-y-3">
        {journeys.map((journey, i) => {
          const Icon = iconMap[journey.icon] || Sparkles;
          return (
            <button
              key={journey.id}
              onClick={() => navigate(`/ink/journey/${journey.id}`)}
              className="w-full text-left bg-card border border-border rounded-2xl p-5 hover:bg-secondary/40 transition-colors group animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mt-0.5">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-foreground">
                      {journey.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed font-sans">
                      {journey.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock size={12} />
                      <span>{journey.totalMinutes} min · {journey.steps.length} steps</span>
                    </div>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-foreground mt-3 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

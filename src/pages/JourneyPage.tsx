import { useParams, useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { journeys } from "@/data/journeys";
import { useChime } from "@/hooks/use-chime";
import { logCheckin, logSession } from "@/lib/session-store";
import Timer from "@/components/Timer";
import { ArrowLeft, Check } from "lucide-react";

export default function JourneyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const playChime = useChime();
  const journey = journeys.find((j) => j.id === id);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleTimerComplete = useCallback(() => {
    playChime();
  }, [playChime]);

  if (!journey) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Journey not found.</p>
        <button onClick={() => navigate("/exercises")} className="text-primary underline mt-2 text-sm">
          Back to Journeys
        </button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Check size={28} className="text-primary" />
        </div>
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Journey Complete
        </h2>
        <p className="text-muted-foreground mt-2 max-w-xs font-sans">
          You showed up for yourself today. That matters more than the words on the page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-sm"
        >
          Return Home
        </button>
      </div>
    );
  }

  const step = journey.steps[currentStep];
  const isLast = currentStep === journey.steps.length - 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-up">
        <button
          onClick={() => navigate("/exercises")}
          className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="font-serif font-semibold text-foreground">{journey.title}</h2>
          <p className="text-xs text-muted-foreground font-sans">
            Step {currentStep + 1} of {journey.steps.length}
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 animate-fade-up">
        {journey.steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full flex-1 transition-all ${
              i <= currentStep ? "bg-primary" : "bg-secondary"
            }`}
          />
        ))}
      </div>

      {/* Prompt */}
      <div className="bg-card border border-border rounded-2xl p-6 animate-fade-up-delay">
        <p className="font-serif text-lg leading-relaxed text-foreground">
          {step.prompt}
        </p>
        {step.instruction && (
          <p className="text-sm text-accent mt-4 font-sans italic">
            {step.instruction}
          </p>
        )}
      </div>

      {/* Timer */}
      <div className="animate-fade-up-delay-2">
        <Timer
          key={currentStep}
          durationMinutes={step.durationMinutes}
          onComplete={step.noTimer ? () => {
            if (isLast) {
              logCheckin();
              logSession(0, "journey");
              setCompleted(true);
            } else {
              setCurrentStep((s) => s + 1);
            }
          } : handleTimerComplete}
          isActive={true}
          noTimer={step.noTimer}
          noTimerLabel={step.noTimerLabel}
        />
      </div>

      {/* Next button */}
      <div className="flex justify-center pt-2 animate-fade-up-delay-2">
        <button
          onClick={() => {
            if (isLast) {
              logCheckin();
              logSession(0, "journey");
              setCompleted(true);
            } else {
              setCurrentStep((s) => s + 1);
            }
          }}
          className="px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          {isLast ? "Finish Journey" : "Next Step →"}
        </button>
      </div>
    </div>
  );
}

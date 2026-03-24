import { METHODS, type MethodId, type IntakeState } from "@/data/four-aces-constants";
import Btn from "./shared/Btn";
import FourAcesCard from "./shared/FourAcesCard";
import Wrap from "./shared/Wrap";

const DECISION_TYPE_LABELS: Record<string, string> = {
  "work-career": "a career decision",
  "relationships": "a relationship decision",
  "finances": "a financial decision",
  "daily-life": "an everyday choice",
  "big-life-change": "a big life decision",
  "other": "this kind of decision",
};

function getExplanation(methodId: MethodId, intake: IntakeState): string {
  const isFast = intake.slider < 33;
  const isHigh = intake.slider > 66;
  const typeLabel = DECISION_TYPE_LABELS[intake.decisionType ?? ""] ?? "this decision";

  const explanations: Record<MethodId, string> = {
    flip: isFast
      ? `You said speed matters — a coin flip cuts through overthinking for ${typeLabel}.`
      : `Sometimes a quick gut check is what you need for ${typeLabel}.`,
    proscons: isFast
      ? `A quick pros and cons list can bring fast clarity to ${typeLabel}.`
      : `Laying out the trade-offs is a solid fit for ${typeLabel}.`,
    reversible: isFast
      ? `Checking how reversible this is can speed up ${typeLabel}.`
      : `Understanding what's at stake helps with ${typeLabel}.`,
    criteria: isHigh
      ? `You want confidence, and scoring against criteria is thorough for ${typeLabel}.`
      : `A structured scoring approach can sharpen your thinking on ${typeLabel}.`,
    values: isHigh
      ? `You want confidence — aligning with your values is powerful for ${typeLabel}.`
      : `Checking what aligns with your values can clarify ${typeLabel}.`,
  };

  return explanations[methodId];
}

interface RecommendationsProps {
  recs: MethodId[];
  intake: IntakeState;
  onPick: (methodId: MethodId) => void;
  onBrowse: () => void;
}

export default function Recommendations({ recs, intake, onPick, onBrowse }: RecommendationsProps) {
  return (
    <div className="pt-[60px]">
      <Wrap>
        <div className="text-center mb-2">
          <span className="text-4xl">♣♠</span>
        </div>
        <h3 className="font-4a-serif text-[26px] font-semibold text-center mb-2">
          Try {recs.length === 1 ? "this" : "one of these"}
        </h3>
        <p className="text-center text-4a-text-sec text-sm mb-7">
          Based on your answers, {recs.length === 1 ? "this method fits" : "these methods fit"} best.
        </p>
        <div className="flex flex-col gap-3">
          {recs.map((mId, i) => {
            const m = METHODS[mId];
            return (
              <FourAcesCard
                key={mId}
                onClick={() => onPick(mId)}
                className="p-5"
                style={{
                  border: `2px solid ${i === 0 ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                  background: i === 0 ? "hsl(var(--4a-accent-faint))" : "hsl(var(--4a-card))",
                }}
              >
                <div className="flex items-center gap-3.5">
                  {m.icon && <span className="text-[28px]">{m.icon}</span>}
                  <div className="flex-1">
                    <div className="font-bold text-base mb-0.5">{m.name}</div>
                    <div className="text-[13px] text-4a-text-sec">{m.desc}</div>
                  </div>
                  <span className="text-4a-accent text-xl">→</span>
                </div>
                <div className="mt-2 text-[12px] text-4a-text-sec italic leading-snug">
                  {getExplanation(mId, intake)}
                </div>
                {i === 0 && (
                  <div className="mt-2 text-[11px] font-semibold text-4a-accent uppercase tracking-widest">
                    Best match
                  </div>
                )}
              </FourAcesCard>
            );
          })}
        </div>
        <div className="text-center mt-6">
          <Btn variant="ghost" onClick={onBrowse}>Browse all methods</Btn>
        </div>
      </Wrap>
    </div>
  );
}

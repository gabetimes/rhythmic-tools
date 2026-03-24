import { METHODS, type MethodId } from "@/data/four-aces-constants";
import Btn from "./shared/Btn";
import FourAcesCard from "./shared/FourAcesCard";
import Wrap from "./shared/Wrap";

interface RecommendationsProps {
  recs: MethodId[];
  onPick: (methodId: MethodId) => void;
  onBrowse: () => void;
}

export default function Recommendations({ recs, onPick, onBrowse }: RecommendationsProps) {
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
                {i === 0 && (
                  <div className="mt-2.5 text-[11px] font-semibold text-4a-accent uppercase tracking-widest">
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

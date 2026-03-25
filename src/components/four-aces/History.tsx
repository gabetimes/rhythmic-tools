import type { SavedDecision } from "@/data/four-aces-constants";
import Btn from "./shared/Btn";
import FourAcesCard from "./shared/FourAcesCard";
import PageHeader from "./shared/PageHeader";
import Wrap from "./shared/Wrap";

interface HistoryProps {
  decisions: SavedDecision[];
  onBack: () => void;
  onNew: () => void;
}

export default function History({ decisions, onBack, onNew }: HistoryProps) {
  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Past Decisions" onBack={onBack} />
        {decisions.length === 0 ? (
          <div className="text-center pt-10">
            <span className="text-5xl">📭</span>
            <p className="text-4a-text-sec text-[15px] mt-3 mb-6">No decisions saved yet.</p>
            <Btn onClick={onNew}>Make your first decision</Btn>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {decisions.map((d) => (
              <FourAcesCard key={d.id} className="py-4 px-[18px]">
                <div className="flex justify-between items-start mb-1.5">
                  <div className="font-bold text-[15px] flex-1">{d.title}</div>
                  <div className="flex flex-col items-end gap-0.5 shrink-0">
                    <span className="text-[10px] text-4a-text-sec font-medium font-4a-sans">Clarity rating</span>
                    <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className="text-xs"
                        style={{
                          color: n <= d.clarity
                            ? "hsl(var(--4a-accent))"
                            : "hsl(var(--4a-border))",
                        }}
                      >
                        ●
                      </span>
                    ))}
                    </div>
                  </div>
                </div>
                <div className="text-[13px] text-4a-text-sec">
                  {d.method} · {d.decisionType} · {new Date(d.date).toLocaleDateString()}
                </div>
                {d.chosen && (
                  <div className="text-[13px] font-semibold mt-1">→ {d.chosen}</div>
                )}
                {d.clarityAnswers && (
                  <div className="mt-2 pt-2 border-t border-4a-border">
                    <div className="text-[11px] text-4a-text-sec font-medium mb-0.5">Clarity deep-dive</div>
                    {d.options.map((opt, i) => {
                      const a = d.clarityAnswers?.[i];
                      if (!a) return null;
                      return (
                        <div key={i} className="text-[12px] text-4a-text-sec">
                          {opt}: gain {a.gain}, cost {a.cost}, self-respect {a.selfRespect}
                        </div>
                      );
                    })}
                  </div>
                )}
              </FourAcesCard>
            ))}
          </div>
        )}
      </Wrap>
    </div>
  );
}

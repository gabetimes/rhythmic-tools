import { useState } from "react";
import type { MethodResult } from "@/data/four-aces-constants";
import Btn from "../shared/Btn";
import FourAcesCard from "../shared/FourAcesCard";
import PageHeader from "../shared/PageHeader";
import Wrap from "../shared/Wrap";

interface CriteriaMapProps {
  options: string[];
  result: MethodResult;
  setResult: React.Dispatch<React.SetStateAction<MethodResult>>;
  onComplete: () => void;
  onBack: () => void;
}

export default function CriteriaMap({ options, result, setResult, onComplete, onBack }: CriteriaMapProps) {
  const [phase, setPhase] = useState<"criteria" | "weight" | "rate" | "results">("criteria");
  const [criteria, setCriteria] = useState(["", ""]);
  const [weights, setWeights] = useState<Record<number, number>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const validCriteria = criteria.filter((c) => c.trim());

  const calcScores = () => {
    const scores: Record<number, number> = {};
    options.forEach((_, oi) => {
      let total = 0;
      let maxPossible = 0;
      validCriteria.forEach((_, ci) => {
        const w = weights[ci] ?? 3;
        const r = ratings[`${oi}-${ci}`] ?? 0;
        total += w * r;
        maxPossible += w * 5;
      });
      scores[oi] = maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0;
    });
    return scores;
  };

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Criteria Map" onBack={onBack} />

        {phase === "criteria" && (
          <>
            <h4 className="font-4a-serif text-xl text-center mb-2">What matters most?</h4>
            <p className="text-center text-4a-text-sec text-sm mb-6">
              Define 2 to 5 criteria for your decision.
            </p>
            <div className="flex flex-col gap-2.5">
              {criteria.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={c}
                    onChange={(e) => {
                      const n = [...criteria];
                      n[i] = e.target.value;
                      setCriteria(n);
                    }}
                    placeholder={`Criterion ${i + 1} (e.g., cost, time, risk)`}
                    className="flex-1 py-3 px-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans bg-4a-card text-4a-text"
                  />
                  {criteria.length > 2 && (
                    <button
                      onClick={() => setCriteria((p) => p.filter((_, j) => j !== i))}
                      className="bg-none border-none text-4a-text-sec cursor-pointer text-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {criteria.length < 5 && (
              <button
                onClick={() => setCriteria((p) => [...p, ""])}
                className="mt-2.5 bg-none border-[1.5px] border-dashed border-4a-border rounded-[10px] p-2.5 w-full text-4a-text-sec text-[13px] cursor-pointer font-4a-sans"
              >
                + Add criterion
              </button>
            )}
            <div className="text-center mt-7">
              <Btn onClick={() => setPhase("weight")} disabled={validCriteria.length < 2}>
                Set weights
              </Btn>
            </div>
          </>
        )}

        {phase === "weight" && (
          <>
            <h4 className="font-4a-serif text-xl text-center mb-6">How important is each?</h4>
            <div className="flex flex-col gap-4">
              {validCriteria.map((c, i) => (
                <div key={i}>
                  <div className="text-sm font-semibold mb-1.5">{c}</div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setWeights((p) => ({ ...p, [i]: n }))}
                        className="w-10 h-9 rounded-lg text-sm font-semibold cursor-pointer font-4a-sans"
                        style={{
                          border: `1.5px solid ${(weights[i] ?? 3) === n ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                          background: (weights[i] ?? 3) === n ? "hsl(var(--4a-accent-light))" : "transparent",
                          color: (weights[i] ?? 3) === n ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))",
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-4a-text-sec mt-1">
              <span>Low importance</span>
              <span>High importance</span>
            </div>
            <div className="text-center mt-7">
              <Btn onClick={() => setPhase("rate")}>Rate options</Btn>
            </div>
          </>
        )}

        {phase === "rate" && (
          <>
            <h4 className="font-4a-serif text-xl text-center mb-2">Rate each option</h4>
            <div className="flex justify-between text-xs text-4a-text-sec mb-4 px-1">
              <span>1 = Worst fit</span>
              <span>5 = Best fit</span>
            </div>
            <div className="flex flex-col gap-4">
              {options.map((opt, oi) => (
                <FourAcesCard key={oi} className="py-4 px-[18px]">
                  <div className="font-bold text-[15px] mb-3">{opt}</div>
                  {validCriteria.map((c, ci) => (
                    <div key={ci} className="mb-2.5">
                      <div className="text-[13px] text-4a-text-sec mb-1">{c}</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => setRatings((p) => ({ ...p, [`${oi}-${ci}`]: n }))}
                            className="w-8 h-7 rounded-md text-xs font-semibold cursor-pointer font-4a-sans"
                            style={{
                              border: `1px solid ${(ratings[`${oi}-${ci}`] ?? 0) >= n ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                              background: (ratings[`${oi}-${ci}`] ?? 0) >= n ? "hsl(var(--4a-accent-light))" : "transparent",
                              color: (ratings[`${oi}-${ci}`] ?? 0) >= n ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))",
                            }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </FourAcesCard>
              ))}
            </div>
            <div className="text-center mt-6">
              <Btn onClick={() => setPhase("results")}>See results</Btn>
            </div>
          </>
        )}

        {phase === "results" && (() => {
          const scores = calcScores();
          const sorted = Object.entries(scores)
            .map(([oi, score]) => [Number(oi), score] as [number, number])
            .sort((a, b) => b[1] - a[1]);

          return (
            <>
              <div className="text-center mb-5">
                <span className="text-4xl">📊</span>
                <h4 className="font-4a-serif text-xl mt-2">Results</h4>
              </div>
              <div className="flex flex-col gap-2.5 mb-6">
                {sorted.map(([oi, score], rank) => (
                  <FourAcesCard
                    key={oi}
                    className="py-3.5 px-[18px] flex items-center justify-between"
                    style={{
                      border: `2px solid ${rank === 0 ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                      background: rank === 0 ? "hsl(var(--4a-accent-faint))" : "hsl(var(--4a-card))",
                    }}
                  >
                    <div className="font-bold text-[15px]">{options[oi]}</div>
                    <div
                      className="font-bold text-xl"
                      style={{ color: rank === 0 ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))" }}
                    >
                      {score}%
                    </div>
                  </FourAcesCard>
                ))}
              </div>
              <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">
                Does this feel right? Pick your choice:
              </p>
              <div className="flex flex-col gap-2 mb-5">
                {options.map((o) => (
                  <FourAcesCard
                    key={o}
                    onClick={() => setResult((p) => ({ ...p, chosen: o }))}
                    className="py-3 px-4 font-semibold text-sm"
                    style={{
                      border: `2px solid ${result.chosen === o ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                    }}
                  >
                    {o}
                  </FourAcesCard>
                ))}
              </div>
              <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">What did you realize about this decision?</p>
              <textarea
                value={result.takeaway}
                onChange={(e) => setResult((p) => ({ ...p, takeaway: e.target.value }))}
                placeholder="What did the numbers confirm or challenge?"
                className="w-full min-h-[80px] p-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans resize-y box-border bg-4a-card text-4a-text"
              />
              <div className="text-center mt-6">
                <Btn onClick={onComplete}>Continue</Btn>
              </div>
            </>
          );
        })()}
      </Wrap>
    </div>
  );
}

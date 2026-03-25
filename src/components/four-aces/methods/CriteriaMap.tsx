import { useState } from "react";
import type { MethodResult } from "@/data/four-aces-constants";
import { track4AMethodResultRevealed } from "@/lib/analytics/web";
import Btn from "../shared/Btn";
import FourAcesCard from "../shared/FourAcesCard";
import PageHeader from "../shared/PageHeader";
import ProgressDots from "../shared/ProgressDots";
import Wrap from "../shared/Wrap";

interface SuggestedCriterion {
  name: string;
  low: string;
  high: string;
  reversed: boolean;
}

const SUGGESTED_CRITERIA: SuggestedCriterion[] = [
  { name: "Effort/cost", low: "Very little", high: "Very high", reversed: true },
  { name: "Likelihood of working out", low: "Very low", high: "Very high", reversed: false },
  { name: "Personal preference/motivation", low: "Very low", high: "Very high", reversed: false },
  { name: "Time commitment", low: "Very small", high: "Very large", reversed: true },
  { name: "Recommendation from friend/family", low: "Don't do it!", high: "Go for it!", reversed: false },
];

interface CriteriaMapProps {
  options: string[];
  result: MethodResult;
  setResult: React.Dispatch<React.SetStateAction<MethodResult>>;
  onComplete: () => void;
  onWantMoreClarity: () => void;
  onBack: () => void;
}

export default function CriteriaMap({ options, result, setResult, onComplete, onWantMoreClarity, onBack }: CriteriaMapProps) {
  const [phase, setPhase] = useState<"criteria" | "weight" | "rate" | "results">("criteria");
  const [criteria, setCriteria] = useState(["", ""]);
  const [reversedSet, setReversedSet] = useState<Set<string>>(() => new Set());
  const [weights, setWeights] = useState<Record<number, number>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const validCriteria = criteria.filter((c) => c.trim());

  const getSuggestedConfig = (name: string) =>
    SUGGESTED_CRITERIA.find((s) => s.name === name);

  const calcScores = () => {
    const scores: Record<number, number> = {};
    options.forEach((_, oi) => {
      let total = 0;
      let maxPossible = 0;
      validCriteria.forEach((c, ci) => {
        const w = weights[ci] ?? 3;
        const raw = ratings[`${oi}-${ci}`] ?? 0;
        const r = reversedSet.has(c) ? (raw > 0 ? 6 - raw : 0) : raw;
        total += w * r;
        maxPossible += w * 5;
      });
      scores[oi] = maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0;
    });
    return scores;
  };

  const addSuggested = (sc: SuggestedCriterion) => {
    setCriteria((p) => {
      // Replace first empty slot, or append if under 5
      const emptyIdx = p.findIndex((c) => !c.trim());
      if (emptyIdx !== -1) {
        const next = [...p];
        next[emptyIdx] = sc.name;
        return next;
      }
      return p.length < 5 ? [...p, sc.name] : p;
    });
    if (sc.reversed) {
      setReversedSet((prev) => new Set(prev).add(sc.name));
    }
  };

  const availableSuggestions = SUGGESTED_CRITERIA.filter(
    (s) => !criteria.includes(s.name),
  );

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Criteria Map" onBack={
          phase === "criteria" ? onBack :
          phase === "weight" ? () => setPhase("criteria") :
          phase === "rate" ? () => setPhase("weight") :
          () => setPhase("rate")
        } />
        <ProgressDots current={phase === "criteria" ? 0 : phase === "weight" ? 1 : phase === "rate" ? 2 : 3} total={4} />

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
                      const old = criteria[i];
                      const n = [...criteria];
                      n[i] = e.target.value;
                      setCriteria(n);
                      // If clearing a reversed suggested criterion, remove from set
                      if (reversedSet.has(old) && !e.target.value.trim()) {
                        setReversedSet((prev) => {
                          const next = new Set(prev);
                          next.delete(old);
                          return next;
                        });
                      }
                    }}
                    placeholder={`Criterion ${i + 1} (e.g., cost, time, risk)`}
                    className="flex-1 py-3 px-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans bg-4a-card text-4a-text"
                  />
                  {criteria.length > 2 && (
                    <button
                      onClick={() => {
                        const removed = criteria[i];
                        setCriteria((p) => p.filter((_, j) => j !== i));
                        if (reversedSet.has(removed)) {
                          setReversedSet((prev) => {
                            const next = new Set(prev);
                            next.delete(removed);
                            return next;
                          });
                        }
                      }}
                      className="bg-none border-none text-4a-text-sec cursor-pointer text-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {availableSuggestions.length > 0 && criteria.length <= 5 && (
              <div className="mt-4">
                <div className="flex flex-col gap-1.5">
                  {availableSuggestions.map((sc) => (
                    <button
                      key={sc.name}
                      onClick={() => addSuggested(sc)}
                      className="flex items-center gap-2 bg-none border-none cursor-pointer text-left py-1 px-0 font-4a-sans"
                      disabled={criteria.length >= 5 && !criteria.some((c) => !c.trim())}
                    >
                      <span className="text-4a-accent text-base font-semibold leading-none shrink-0">+</span>
                      <span className="text-[13px] text-4a-text-sec italic">{sc.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {criteria.length < 5 && (
              <button
                onClick={() => setCriteria((p) => [...p, ""])}
                className="mt-2.5 bg-none border-[1.5px] border-dashed border-4a-border rounded-[10px] p-2.5 w-full text-4a-text-sec text-[13px] cursor-pointer font-4a-sans italic"
              >
                + Add your own 1-5 score criteria
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
            <h4 className="font-4a-serif text-xl text-center mb-6">How important should each criteria be weighted?</h4>
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
            <div className="flex justify-between text-[11px] text-4a-text-sec mt-1" style={{ width: "calc(5 * 2.5rem + 4 * 0.375rem)" }}>
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
                  {validCriteria.map((c, ci) => {
                    const config = getSuggestedConfig(c);
                    return (
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
                        {config && (
                          <div className="flex justify-between text-[11px] text-4a-text-sec mt-0.5" style={{ width: "calc(5 * 2rem + 4 * 0.25rem)" }}>
                            <span>{config.low}</span>
                            <span>{config.high}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </FourAcesCard>
              ))}
            </div>
            <div className="text-center mt-6">
              <Btn onClick={() => {
                track4AMethodResultRevealed("Criteria Map");
                // Store method scores (already 0-100)
                const ms = calcScores();
                setResult((p) => ({ ...p, methodScores: ms }));
                setPhase("results");
              }}>See results</Btn>
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
              <div className="text-center mt-6 flex flex-col items-center gap-3">
                <Btn onClick={onComplete}>Continue</Btn>
                <button
                  onClick={onWantMoreClarity}
                  className="bg-none border-none text-4a-text-sec text-sm cursor-pointer font-4a-sans underline decoration-4a-border underline-offset-[3px]"
                >
                  Want more clarity?
                </button>
              </div>
            </>
          );
        })()}
      </Wrap>
    </div>
  );
}

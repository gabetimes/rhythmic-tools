import { useState } from "react";
import type { ClarityAnswers, MethodId, MethodResult } from "@/data/four-aces-constants";
import { computeCumulativeScores } from "@/lib/four-aces-scoring";
import Btn from "./shared/Btn";
import FourAcesCard from "./shared/FourAcesCard";
import PageHeader from "./shared/PageHeader";
import Wrap from "./shared/Wrap";

interface ClarityQuestionsProps {
  options: string[];
  clarityAnswers: ClarityAnswers;
  setClarityAnswers: React.Dispatch<React.SetStateAction<ClarityAnswers>>;
  methodResult: MethodResult;
  setMethodResult: React.Dispatch<React.SetStateAction<MethodResult>>;
  currentMethod: MethodId;
  onComplete: () => void;
  onBack: () => void;
}

const QUESTIONS = [
  {
    key: "gain" as const,
    question: "How much do you stand to gain if this works out?",
    low: "Nothing at all",
    high: "A whole lot",
  },
  {
    key: "cost" as const,
    question: "What's the cost of trying?",
    low: "Nothing at all",
    high: "A whole lot",
  },
  {
    key: "selfRespect" as const,
    question: "How much would your respect for yourself change if you chose this?",
    low: "Lose self-respect",
    high: "Gain self-respect",
  },
];

export default function ClarityQuestions({
  options,
  clarityAnswers,
  setClarityAnswers,
  methodResult,
  setMethodResult,
  currentMethod,
  onComplete,
  onBack,
}: ClarityQuestionsProps) {
  const [phase, setPhase] = useState<"answer" | "results">("answer");

  const setAnswer = (optIdx: number, key: "gain" | "cost" | "selfRespect", value: number) => {
    setClarityAnswers((prev) => ({
      ...prev,
      [optIdx]: { ...prev[optIdx], [key]: value },
    }));
  };

  const allAnswered = options.every((_, i) => {
    const a = clarityAnswers[i];
    return a && a.gain > 0 && a.cost > 0 && a.selfRespect > 0;
  });

  const cumulativeScores = computeCumulativeScores(
    currentMethod,
    methodResult.methodScores,
    clarityAnswers,
    options.length,
  );

  const sorted = Object.entries(cumulativeScores)
    .map(([oi, score]) => [Number(oi), score] as [number, number])
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader
          title="Clarity Questions"
          onBack={phase === "answer" ? onBack : () => setPhase("answer")}
        />

        {phase === "answer" && (
          <>
            <p className="text-center text-4a-text-sec text-sm mb-6">
              Answer 3 quick questions for each option to sharpen your thinking.
            </p>
            <div className="flex flex-col gap-4">
              {options.map((opt, oi) => (
                <FourAcesCard key={oi} className="py-4 px-[18px]">
                  <div className="font-bold text-[15px] mb-3">{opt}</div>
                  {QUESTIONS.map((q) => (
                    <div key={q.key} className="mb-3">
                      <div className="text-[13px] text-4a-text-sec mb-1.5">{q.question}</div>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => setAnswer(oi, q.key, n)}
                            className="w-10 h-9 rounded-lg text-sm font-semibold cursor-pointer font-4a-sans"
                            style={{
                              border: `1.5px solid ${(clarityAnswers[oi]?.[q.key] ?? 0) === n ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                              background: (clarityAnswers[oi]?.[q.key] ?? 0) === n ? "hsl(var(--4a-accent-light))" : "transparent",
                              color: (clarityAnswers[oi]?.[q.key] ?? 0) === n ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))",
                            }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-[11px] text-4a-text-sec mt-1" style={{ width: "calc(5 * 2.5rem + 4 * 0.375rem)" }}>
                        <span>{q.low}</span>
                        <span>{q.high}</span>
                      </div>
                    </div>
                  ))}
                </FourAcesCard>
              ))}
            </div>
            <div className="text-center mt-7">
              <Btn onClick={() => setPhase("results")} disabled={!allAnswered}>
                See updated results
              </Btn>
            </div>
          </>
        )}

        {phase === "results" && (
          <>
            <div className="text-center mb-5">
              <span className="text-4xl">🔍</span>
              <h4 className="font-4a-serif text-xl mt-2">Updated Results</h4>
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
              Update your choice?
            </p>
            <div className="flex flex-col gap-2 mb-5">
              {options.map((o) => (
                <FourAcesCard
                  key={o}
                  onClick={() => setMethodResult((p) => ({ ...p, chosen: o }))}
                  className="py-3 px-4 font-semibold text-sm"
                  style={{
                    border: `2px solid ${methodResult.chosen === o ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                  }}
                >
                  {o}
                </FourAcesCard>
              ))}
            </div>
            <div className="text-center mt-6">
              <Btn onClick={onComplete}>Continue</Btn>
            </div>
          </>
        )}
      </Wrap>
    </div>
  );
}

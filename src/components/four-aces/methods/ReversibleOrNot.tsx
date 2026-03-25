import { useState } from "react";
import type { MethodResult } from "@/data/four-aces-constants";
import { track4AMethodResultRevealed } from "@/lib/analytics/web";
import Btn from "../shared/Btn";
import FourAcesCard from "../shared/FourAcesCard";
import PageHeader from "../shared/PageHeader";
import ProgressDots from "../shared/ProgressDots";
import Wrap from "../shared/Wrap";

interface ReversibleOrNotProps {
  options: string[];
  result: MethodResult;
  setResult: React.Dispatch<React.SetStateAction<MethodResult>>;
  onComplete: () => void;
  onBack: () => void;
}

function getLabel(value: number) {
  if (value < 40) return { emoji: "🟢", label: "Reversible", desc: "Easy to undo — act quickly, learn, adjust." };
  if (value <= 60) return { emoji: "🟡", label: "Gray zone", desc: "Could go either way — weigh the cost of delay vs. getting it wrong." };
  return { emoji: "🔴", label: "Hard to undo", desc: "High stakes — take your time and don't rush." };
}

export default function ReversibleOrNot({ options, result, setResult, onComplete, onBack }: ReversibleOrNotProps) {
  const [ratings, setRatings] = useState<number[]>(() => options.map(() => 50));
  const [phase, setPhase] = useState<"assess" | "guidance">("assess");

  const updateRating = (idx: number, value: number) => {
    setRatings((prev) => prev.map((r, i) => (i === idx ? value : r)));
  };

  const showGuidance = () => {
    track4AMethodResultRevealed("Reversible or Not");
    setPhase("guidance");
  };

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Reversible or Not" onBack={phase === "assess" ? onBack : () => setPhase("assess")} />
        <ProgressDots current={phase === "assess" ? 0 : 1} total={2} />

        {phase === "assess" && (
          <>
            <h4 className="font-4a-serif text-xl text-center mb-2">
              How easy is each option to undo?
            </h4>
            <p className="text-center text-4a-text-sec text-sm mb-6">
              Rate each option's reversibility separately.
            </p>
            <div className="flex flex-col gap-5">
              {options.map((opt, i) => (
                <FourAcesCard key={i} className="py-4 px-5">
                  <div className="font-bold text-[15px] mb-3">{opt}</div>
                  <div className="flex justify-between mb-2 text-[13px] font-semibold">
                    <span>Easy to reverse</span>
                    <span>Hard to undo</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={ratings[i]}
                    onChange={(e) => updateRating(i, +e.target.value)}
                    className="w-full"
                    style={{ accentColor: "hsl(var(--4a-accent))" }}
                  />
                  <div className="text-center mt-1.5 text-[13px] text-4a-text-sec font-medium">
                    {getLabel(ratings[i]).emoji} {getLabel(ratings[i]).label}
                  </div>
                </FourAcesCard>
              ))}
            </div>
            <div className="text-center mt-7">
              <Btn onClick={showGuidance}>See guidance</Btn>
            </div>
          </>
        )}

        {phase === "guidance" && (
          <>
            <h4 className="font-4a-serif text-xl text-center mb-5">
              Reversibility breakdown
            </h4>
            <div className="flex flex-col gap-3 mb-6">
              {options.map((opt, i) => {
                const info = getLabel(ratings[i]);
                return (
                  <FourAcesCard
                    key={i}
                    className="py-4 px-5"
                    style={{
                      background: "hsl(var(--4a-accent-faint))",
                      border: `2px solid hsl(var(--4a-border))`,
                    }}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-[22px]">{info.emoji}</span>
                      <div className="font-bold text-[15px]">{opt}</div>
                    </div>
                    <p className="text-sm text-4a-text-sec leading-relaxed">
                      {info.desc}
                    </p>
                  </FourAcesCard>
                );
              })}
            </div>

            {(() => {
              const allReversible = ratings.every((r) => r < 40);
              const allHard = ratings.every((r) => r > 60);
              const mixed = !allReversible && !allHard;
              return (
                <FourAcesCard
                  className="mb-6 py-4 px-5"
                  style={{
                    background: "hsl(var(--4a-accent-faint))",
                    border: "2px solid hsl(var(--4a-accent))",
                  }}
                >
                  <h4 className="font-4a-serif text-lg text-center mb-2">
                    {allReversible
                      ? "All options are reversible."
                      : allHard
                        ? "All options are hard to undo."
                        : "Your options have different stakes."}
                  </h4>
                  <p className="text-sm text-4a-text-sec text-center leading-relaxed">
                    {allReversible
                      ? "Since both paths are easy to reverse, speed matters more than perfection. Pick one, try it, and adjust."
                      : allHard
                        ? "Every option carries weight. Sleep on it. Talk to someone you trust. Don't rush any of these."
                        : "Some choices are easier to walk back than others. Consider whether the reversible option lets you learn something before committing to the harder-to-undo path."}
                  </p>
                </FourAcesCard>
              );
            })()}

            <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">
              Which option are you leaning toward?
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
              placeholder="What did this help you see?"
              className="w-full min-h-[80px] p-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans resize-y box-border bg-4a-card text-4a-text"
            />
            <div className="text-center mt-6">
              <Btn onClick={onComplete}>Continue</Btn>
            </div>
          </>
        )}
      </Wrap>
    </div>
  );
}

import { useState } from "react";
import type { MethodResult } from "@/data/four-aces-constants";
import { track4AMethodResultRevealed } from "@/lib/analytics/web";
import Btn from "./shared/Btn";
import FourAcesCard from "./shared/FourAcesCard";
import PageHeader from "./shared/PageHeader";
import Wrap from "./shared/Wrap";

interface QuickFlipProps {
  result: MethodResult;
  setResult: React.Dispatch<React.SetStateAction<MethodResult>>;
  onComplete: () => void;
  onBack: () => void;
  setOptions: (opts: string[]) => void;
}

export default function QuickFlip({ result, setResult, onComplete, onBack, setOptions }: QuickFlipProps) {
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [phase, setPhase] = useState<"input" | "flipping" | "result" | "reflect">("input");
  const [flipResult, setFlipResult] = useState("");
  const [hoped, setHoped] = useState("");

  const canFlip = optionA.trim() && optionB.trim();
  const top2 = [optionA.trim(), optionB.trim()];

  const doFlip = () => {
    if (!canFlip) return;
    track4AMethodResultRevealed("Flip a Coin");
    setOptions(top2);
    setPhase("flipping");
    setTimeout(() => {
      const pick = top2[Math.floor(Math.random() * top2.length)];
      setFlipResult(pick);
      setPhase("result");
    }, 1200);
  };

  const handleBack = () => {
    if (phase === "input") return onBack();
    if (phase === "reflect") return setPhase("result");
    setPhase("input");
  };

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Quick Decision" onBack={handleBack} />

        {phase === "input" && (
          <div className="text-center">
            <div className="text-[56px] mb-4">🪙</div>
            <h4 className="font-4a-serif text-xl mb-1">Two options. 30 seconds.</h4>
            <p className="text-4a-text-sec text-sm mb-7">
              Type your two options and flip.
            </p>
            <div className="flex flex-col gap-3 mb-8 text-left">
              <input
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder="Option A"
                className="w-full py-3 px-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans bg-4a-card text-4a-text box-border"
                autoFocus
              />
              <input
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder="Option B"
                onKeyDown={(e) => e.key === "Enter" && canFlip && doFlip()}
                className="w-full py-3 px-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans bg-4a-card text-4a-text box-border"
              />
            </div>
            <Btn onClick={doFlip} disabled={!canFlip}>
              Flip the coin
            </Btn>
          </div>
        )}

        {phase === "flipping" && (
          <div className="text-center pt-10">
            <div className="text-[72px] animate-[spin_0.3s_linear_infinite]">🪙</div>
            <style>{`@keyframes spin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }`}</style>
          </div>
        )}

        {phase === "result" && (
          <div className="text-center">
            <p className="text-4a-text-sec text-sm mb-2">The coin says:</p>
            <div className="text-[28px] font-bold font-4a-serif text-4a-accent mb-7">
              {flipResult}
            </div>
            <h4 className="font-4a-serif text-lg mb-4">
              Which result were you hoping for?
            </h4>
            <div className="flex flex-col gap-2.5">
              {top2.map((o) => (
                <FourAcesCard
                  key={o}
                  onClick={() => {
                    setHoped(o);
                    setResult((p) => ({ ...p, chosen: o }));
                    setPhase("reflect");
                  }}
                  className="py-3.5 px-[18px] text-center font-semibold"
                  style={{
                    border: `2px solid ${hoped === o ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                  }}
                >
                  {o}
                </FourAcesCard>
              ))}
            </div>
          </div>
        )}

        {phase === "reflect" && (
          <div className="text-center">
            <div className="text-4xl mb-3">💡</div>
            <p className="text-base font-semibold mb-1">
              {hoped === flipResult
                ? "The coin confirmed your instinct."
                : "Interesting. Your gut disagrees with the coin."}
            </p>
            <p className="text-4a-text-sec text-sm mb-6">
              {hoped === flipResult
                ? "Sounds like you already knew."
                : "That feeling of wanting the other option? That's your answer."}
            </p>
            <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">What did you realize about this decision?</p>
            <textarea
              value={result.takeaway}
              onChange={(e) => setResult((p) => ({ ...p, takeaway: e.target.value }))}
              placeholder="What did you learn from this?"
              className="w-full min-h-[80px] p-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans resize-y box-border bg-4a-card text-4a-text"
            />
            <div className="mt-6">
              <Btn onClick={onComplete}>Continue</Btn>
            </div>
          </div>
        )}
      </Wrap>
    </div>
  );
}

import { useState } from "react";
import type { MethodResult } from "@/data/four-aces-constants";
import { track4AMethodResultRevealed } from "@/lib/analytics/web";
import Btn from "../shared/Btn";
import FourAcesCard from "../shared/FourAcesCard";
import PageHeader from "../shared/PageHeader";
import ProgressDots from "../shared/ProgressDots";
import Wrap from "../shared/Wrap";

interface FlipACoinProps {
  options: string[];
  result: MethodResult;
  setResult: React.Dispatch<React.SetStateAction<MethodResult>>;
  onComplete: () => void;
  onWantMoreClarity: () => void;
  onBack: () => void;
}

export default function FlipACoin({ options, result, setResult, onComplete, onWantMoreClarity, onBack }: FlipACoinProps) {
  const [phase, setPhase] = useState<"ready" | "flipping" | "result" | "reflect">("ready");
  const [flipResult, setFlipResult] = useState("");
  const [hoped, setHoped] = useState("");
  const top2 = options.slice(0, 2);

  const doFlip = () => {
    track4AMethodResultRevealed("Flip a Coin");
    setPhase("flipping");
    setTimeout(() => {
      const pick = top2[Math.floor(Math.random() * top2.length)];
      setFlipResult(pick);
      setPhase("result");
    }, 1200);
  };

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Flip a Coin" onBack={phase === "ready" ? onBack : phase === "reflect" ? () => setPhase("result") : () => setPhase("ready")} />
        <ProgressDots current={phase === "ready" ? 0 : phase === "result" ? 1 : 2} total={3} />

        {phase === "ready" && (
          <div className="text-center">
            <div className="text-[64px] mb-5">🪙</div>
            <p className="text-4a-text-sec text-sm mb-2">Your two options:</p>
            <div className="flex gap-3 justify-center mb-8">
              {top2.map((o, i) => (
                <div key={i} className="py-2.5 px-[18px] rounded-[10px] bg-4a-accent-light font-semibold text-sm text-4a-text">
                  {o}
                </div>
              ))}
            </div>
            <Btn onClick={doFlip}>Flip the coin</Btn>
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
            <div className="mt-6 flex flex-col items-center gap-3">
              <Btn onClick={onComplete}>Continue</Btn>
              <button
                onClick={onWantMoreClarity}
                className="bg-none border-none text-4a-text-sec text-sm cursor-pointer font-4a-sans underline decoration-4a-border underline-offset-[3px]"
              >
                Want more clarity?
              </button>
            </div>
          </div>
        )}
      </Wrap>
    </div>
  );
}

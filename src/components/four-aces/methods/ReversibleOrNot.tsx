import { useState } from "react";
import type { MethodResult } from "@/data/four-aces-constants";
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

export default function ReversibleOrNot({ options, result, setResult, onComplete, onBack }: ReversibleOrNotProps) {
  const [reversibility, setReversibility] = useState(50);
  const [worstCase, setWorstCase] = useState("");
  const [phase, setPhase] = useState<"assess" | "guidance">("assess");

  const isReversible = reversibility < 40;
  const isMixed = reversibility >= 40 && reversibility <= 60;

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Reversible or Not" onBack={onBack} />
        <ProgressDots current={phase === "assess" ? 0 : 1} total={2} />

        {phase === "assess" && (
          <>
            <h4 className="font-4a-serif text-xl text-center mb-6">
              How easy is this to undo?
            </h4>
            <div className="px-2 mb-7">
              <div className="flex justify-between mb-2.5 text-[13px] font-semibold">
                <span>Easy to reverse</span>
                <span>Hard to undo</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={reversibility}
                onChange={(e) => setReversibility(+e.target.value)}
                className="w-full"
                style={{ accentColor: "hsl(var(--4a-accent))" }}
              />
            </div>
            <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">
              What's the worst case if you're wrong?
            </p>
            <textarea
              value={worstCase}
              onChange={(e) => setWorstCase(e.target.value)}
              placeholder="Describe the downside..."
              className="w-full min-h-[80px] p-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans resize-y box-border mb-6 bg-4a-card text-4a-text"
            />
            <div className="text-center">
              <Btn onClick={() => setPhase("guidance")}>See guidance</Btn>
            </div>
          </>
        )}

        {phase === "guidance" && (
          <>
            <FourAcesCard
              className="mb-6"
              style={{
                background: "hsl(var(--4a-accent-faint))",
                border: "2px solid hsl(var(--4a-accent))",
              }}
            >
              <div className="text-[28px] mb-2 text-center">
                {isReversible ? "🟢" : isMixed ? "🟡" : "🔴"}
              </div>
              <h4 className="font-4a-serif text-lg text-center mb-2">
                {isReversible
                  ? "This looks reversible."
                  : isMixed
                    ? "This is in the gray zone."
                    : "This is hard to undo."}
              </h4>
              <p className="text-sm text-4a-text-sec text-center leading-relaxed">
                {isReversible
                  ? "When a decision is easy to reverse, speed matters more than perfection. Act, learn, adjust."
                  : isMixed
                    ? "This could go either way. Consider: what's the cost of delay vs. the cost of getting it wrong?"
                    : "High-stakes, hard-to-undo decisions deserve more thought. Sleep on it. Talk to someone you trust. Don't rush this one."}
              </p>
            </FourAcesCard>

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

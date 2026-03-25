import { useState } from "react";
import type { MethodResult } from "@/data/four-aces-constants";
import Btn from "./shared/Btn";
import StarRating from "./shared/StarRating";
import Wrap from "./shared/Wrap";

interface ClarityRatingProps {
  clarity: number;
  setClarity: (value: number) => void;
  result: MethodResult;
  setResult: React.Dispatch<React.SetStateAction<MethodResult>>;
  onNext: () => void;
  onTryAnother: () => void;
  onWantMoreClarity: () => void;
}

const CLARITY_MESSAGES: Record<number, string> = {
  1: "Still stuck. That's okay.",
  2: "A bit clearer, but not there yet.",
  3: "Getting there. The direction is forming.",
  4: "Feeling good. Almost ready to act.",
  5: "You know what to do.",
};

export default function ClarityRating({ clarity, setClarity, result, setResult, onNext, onTryAnother, onWantMoreClarity }: ClarityRatingProps) {
  const [showTakeaway, setShowTakeaway] = useState(false);

  return (
    <div className="pt-20">
      <Wrap>
        <div className="text-center">
          <span className="text-5xl">🔮</span>
          <h3 className="font-4a-serif text-[26px] font-semibold mt-3 mb-2">
            How clear do you feel?
          </h3>
          <p className="text-4a-text-sec text-[15px] mb-8">
            Rate your clarity about this decision right now.
          </p>
          <StarRating value={clarity} onChange={setClarity} />
          <div className="flex justify-between text-xs text-4a-text-sec mt-2 px-0.5">
            <span>Still foggy</span>
            <span>Crystal clear</span>
          </div>
          {clarity > 0 && (
            <p className="mt-3.5 text-sm text-4a-accent font-medium text-center">
              {CLARITY_MESSAGES[clarity]}
            </p>
          )}
          {!showTakeaway ? (
            <button
              onClick={() => setShowTakeaway(true)}
              className="mt-4 bg-none border-none text-4a-text-sec text-sm cursor-pointer font-4a-sans underline decoration-4a-border underline-offset-[3px]"
            >
              Write a short decision takeaway note.
            </button>
          ) : (
            <div className="mt-4 text-left">
              <textarea
                value={result.takeaway}
                onChange={(e) => setResult((p) => ({ ...p, takeaway: e.target.value }))}
                placeholder="What did you learn from this decision?"
                className="w-full min-h-[80px] p-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans resize-y box-border bg-4a-card text-4a-text"
              />
            </div>
          )}
          <div className="mt-9 flex flex-col items-center gap-3">
            <Btn onClick={onNext} disabled={clarity === 0}>Continue</Btn>
            {clarity > 0 && clarity <= 3 && (
              <>
                <button
                  onClick={onTryAnother}
                  className="bg-none border-none text-4a-text-sec text-sm cursor-pointer font-4a-sans underline decoration-4a-border underline-offset-[3px]"
                >
                  Try a different method
                </button>
                <button
                  onClick={onWantMoreClarity}
                  className="bg-none border-none text-4a-text-sec text-sm cursor-pointer font-4a-sans underline decoration-4a-border underline-offset-[3px]"
                >
                  Want more clarity?
                </button>
              </>
            )}
          </div>
        </div>
      </Wrap>
    </div>
  );
}

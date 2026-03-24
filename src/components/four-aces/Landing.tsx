import Btn from "./shared/Btn";

interface LandingProps {
  onStart: () => void;
  onQuickDecision: () => void;
  onHistory: () => void;
  savedCount: number;
}

export default function Landing({ onStart, onQuickDecision, onHistory, savedCount }: LandingProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 text-center">
      <div className="mb-4">
        <span className="text-5xl">♠♥♦♣</span>
      </div>
      <h1 className="font-4a-serif text-[42px] font-bold text-4a-text m-0 mb-2 tracking-tight">
        4 Aces
      </h1>
      <p className="text-[17px] text-4a-text-sec max-w-[320px] leading-relaxed m-0 mb-10">
        Five ways to cut through the noise and make the call.
      </p>
      <div className="flex flex-col gap-3 items-center">
        <Btn onClick={onStart} className="text-[17px] px-10 py-4 rounded-[14px]">
          Make a Decision
        </Btn>
        <Btn variant="secondary" onClick={onQuickDecision} className="text-[15px] px-8 py-3 rounded-[12px]">
          Quick Decision
        </Btn>
      </div>
      {savedCount > 0 && (
        <button
          onClick={onHistory}
          className="mt-5 bg-none border-none text-4a-text-sec text-sm cursor-pointer font-4a-sans underline decoration-4a-border underline-offset-[3px]"
        >
          View past decisions ({savedCount})
        </button>
      )}
    </div>
  );
}

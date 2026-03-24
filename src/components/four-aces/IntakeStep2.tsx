import type { IntakeState } from "@/data/four-aces-constants";
import Btn from "./shared/Btn";
import PageHeader from "./shared/PageHeader";
import ProgressDots from "./shared/ProgressDots";
import Wrap from "./shared/Wrap";

interface IntakeStep2Props {
  intake: IntakeState;
  setIntake: React.Dispatch<React.SetStateAction<IntakeState>>;
  onNext: () => void;
  onBack: () => void;
}

export default function IntakeStep2({ intake, setIntake, onNext, onBack }: IntakeStep2Props) {
  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Getting started" onBack={onBack} />
        <ProgressDots current={1} total={3} />
        <h3 className="font-4a-serif text-2xl font-semibold text-center mb-3 leading-snug">
          What matters more right now?
        </h3>
        <p className="text-center text-4a-text-sec text-sm mb-10">
          Slide toward what you need most.
        </p>
        <div className="px-2">
          <div className="flex justify-between mb-3 text-sm font-semibold">
            <span style={{ color: intake.slider < 40 ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))" }}>
              Fast
            </span>
            <span style={{ color: intake.slider > 60 ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))" }}>
              Confident
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={intake.slider}
            onChange={(e) => setIntake((p) => ({ ...p, slider: +e.target.value }))}
            className="w-full h-1.5"
            style={{ accentColor: "hsl(var(--4a-accent))" }}
          />
          <div className="text-center mt-3 text-[13px] text-4a-text-sec">
            {intake.slider < 33
              ? "Let's keep this quick."
              : intake.slider > 66
                ? "Let's be thorough."
                : "A balanced approach."}
          </div>
        </div>
        <div className="text-center mt-10">
          <Btn onClick={onNext}>Continue</Btn>
        </div>
      </Wrap>
    </div>
  );
}

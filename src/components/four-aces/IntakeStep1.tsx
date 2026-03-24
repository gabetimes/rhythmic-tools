import type { IntakeState } from "@/data/four-aces-constants";
import Btn from "./shared/Btn";
import FourAcesCard from "./shared/FourAcesCard";
import PageHeader from "./shared/PageHeader";
import ProgressDots from "./shared/ProgressDots";
import Wrap from "./shared/Wrap";

interface IntakeStep1Props {
  intake: IntakeState;
  setIntake: React.Dispatch<React.SetStateAction<IntakeState>>;
  onNext: () => void;
  onBack: () => void;
}

const CHOICES = [
  { val: true, label: "I already have options", sub: "I know what I'm choosing between" },
  { val: false, label: "I need help with that", sub: "Help me think of possibilities" },
] as const;

export default function IntakeStep1({ intake, setIntake, onNext, onBack }: IntakeStep1Props) {
  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Getting started" onBack={onBack} />
        <ProgressDots current={0} total={3} />
        <h3 className="font-4a-serif text-2xl font-semibold text-center mb-8 leading-snug">
          Do you already have options in mind?
        </h3>
        <div className="flex flex-col gap-3">
          {CHOICES.map(({ val, label, sub }) => (
            <FourAcesCard
              key={String(val)}
              onClick={() => setIntake((p) => ({ ...p, hasOptions: val }))}
              className="py-[18px] px-5"
              style={{
                border: `2px solid ${intake.hasOptions === val ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                background: intake.hasOptions === val ? "hsl(var(--4a-accent-faint))" : "hsl(var(--4a-card))",
              }}
            >
              <div className="font-semibold text-[15px] mb-0.5">{label}</div>
              <div className="text-[13px] text-4a-text-sec">{sub}</div>
            </FourAcesCard>
          ))}
        </div>
        <div className="text-center mt-8">
          <Btn onClick={onNext} disabled={intake.hasOptions === null}>Continue</Btn>
        </div>
      </Wrap>
    </div>
  );
}

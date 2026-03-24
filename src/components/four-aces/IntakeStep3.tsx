import { DECISION_TYPES, type IntakeState } from "@/data/four-aces-constants";
import Btn from "./shared/Btn";
import FourAcesCard from "./shared/FourAcesCard";
import PageHeader from "./shared/PageHeader";
import ProgressDots from "./shared/ProgressDots";
import Wrap from "./shared/Wrap";

interface IntakeStep3Props {
  intake: IntakeState;
  setIntake: React.Dispatch<React.SetStateAction<IntakeState>>;
  onNext: () => void;
  onBack: () => void;
}

export default function IntakeStep3({ intake, setIntake, onNext, onBack }: IntakeStep3Props) {
  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Getting started" onBack={onBack} />
        <ProgressDots current={2} total={3} />
        <h3 className="font-4a-serif text-2xl font-semibold text-center mb-8 leading-snug">
          What kind of decision is this?
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {DECISION_TYPES.map((t) => (
            <FourAcesCard
              key={t.id}
              onClick={() => setIntake((p) => ({ ...p, decisionType: t.id }))}
              className="py-4 px-3.5 text-center"
              style={{
                border: `2px solid ${intake.decisionType === t.id ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                background: intake.decisionType === t.id ? "hsl(var(--4a-accent-faint))" : "hsl(var(--4a-card))",
              }}
            >
              <div className="text-2xl mb-1">{t.icon}</div>
              <div className="font-semibold text-[13px]">{t.label}</div>
            </FourAcesCard>
          ))}
        </div>
        <div className="text-center mt-8">
          <Btn onClick={onNext} disabled={!intake.decisionType}>Continue</Btn>
        </div>
      </Wrap>
    </div>
  );
}

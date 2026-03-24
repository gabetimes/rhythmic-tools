import { useEffect, useRef } from "react";
import { DECISION_TYPES, STARTER_OPTIONS, type IntakeState } from "@/data/four-aces-constants";
import Btn from "./shared/Btn";
import PageHeader from "./shared/PageHeader";
import Wrap from "./shared/Wrap";

interface OptionsEntryProps {
  intake: IntakeState;
  options: string[];
  setOptions: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onBack: () => void;
}

export default function OptionsEntry({ intake, options, setOptions, onNext, onBack }: OptionsEntryProps) {
  const seededType = useRef<string | null>(null);

  useEffect(() => {
    if (intake.hasOptions) {
      if (options.length === 0) setOptions(["", ""]);
    } else {
      const typeKey = intake.decisionType ?? "other";
      const starters = STARTER_OPTIONS[typeKey] ?? STARTER_OPTIONS.other;

      if (options.length === 0) {
        // First visit — seed with starters
        seededType.current = typeKey;
        setOptions([...starters]);
      } else if (seededType.current && seededType.current !== typeKey) {
        // User went back and picked a different category — re-seed
        // only if options still match the previously seeded starters
        const prevStarters = STARTER_OPTIONS[seededType.current] ?? STARTER_OPTIONS.other;
        const unchanged = options.length === prevStarters.length &&
          options.every((o, i) => o === prevStarters[i]);
        if (unchanged) {
          setOptions([...starters]);
        }
        seededType.current = typeKey;
      } else if (!seededType.current) {
        // Remount after first visit — just record what type we're on
        seededType.current = typeKey;
      }
    }
  }, [intake.decisionType]);

  const updateOpt = (i: number, val: string) =>
    setOptions((p) => p.map((o, j) => (j === i ? val : o)));
  const removeOpt = (i: number) =>
    setOptions((p) => p.filter((_, j) => j !== i));
  const addOpt = () => setOptions((p) => [...p, ""]);

  const validOpts = options.filter((o) => o.trim());

  const handleNext = () => {
    const kept = options.filter((o) => o.trim());
    setOptions(kept);
    onNext();
  };

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Your options" onBack={onBack} />
        <h3 className="font-4a-serif text-2xl font-semibold text-center mb-2 leading-snug">
          {intake.hasOptions
            ? intake.decisionType && intake.decisionType !== "other"
              ? `What are your options for your ${DECISION_TYPES.find((d) => d.id === intake.decisionType)?.label.toLowerCase()} decision?`
              : "What are your options?"
            : "Here are some starting points"}
        </h3>
        <p className="text-center text-4a-text-sec text-sm mb-7">
          {intake.hasOptions ? "Add the choices you're weighing." : "Edit, remove, or add your own."}
        </p>
        <div className="flex flex-col gap-2.5">
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2 items-center">
              <div className="w-7 h-7 rounded-lg bg-4a-accent-light text-4a-accent flex items-center justify-center text-[13px] font-bold shrink-0">
                {i + 1}
              </div>
              <input
                value={opt}
                onChange={(e) => updateOpt(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="flex-1 py-3 px-3.5 rounded-[10px] border-[1.5px] border-4a-border text-[15px] font-4a-sans bg-4a-card text-4a-text outline-none"
              />
              {options.length > 2 && (
                <button
                  onClick={() => removeOpt(i)}
                  className="bg-none border-none text-4a-text-sec cursor-pointer text-lg p-1 leading-none"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 6 && (
          <button
            onClick={addOpt}
            className="mt-3 bg-none border-[1.5px] border-dashed border-4a-border rounded-[10px] p-2.5 w-full text-4a-text-sec text-sm cursor-pointer font-4a-sans"
          >
            + Add option
          </button>
        )}
        <div className="text-center mt-8">
          <Btn onClick={handleNext} disabled={validOpts.length < 2}>
            Continue with {validOpts.length} options
          </Btn>
        </div>
      </Wrap>
    </div>
  );
}

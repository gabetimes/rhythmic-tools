import { METHODS, type MethodId, type MethodResult, type ClarityAnswers } from "@/data/four-aces-constants";
import Btn from "./shared/Btn";
import FourAcesCard from "./shared/FourAcesCard";
import Wrap from "./shared/Wrap";

interface SaveDecisionProps {
  title: string;
  setTitle: (title: string) => void;
  result: MethodResult;
  method: MethodId;
  clarityAnswers: ClarityAnswers;
  options: string[];
  onSave: () => void;
}

export default function SaveDecision({ title, setTitle, result, method, clarityAnswers, options, onSave }: SaveDecisionProps) {
  const hasClarityAnswers = Object.keys(clarityAnswers).length > 0;
  return (
    <div className="pt-[60px]">
      <Wrap>
        <div className="text-center mb-6">
          <span className="text-4xl">📝</span>
          <h3 className="font-4a-serif text-[22px] mt-2">Save your decision</h3>
        </div>
        <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">Give it a name</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Should I take the new job?"
          className="w-full p-3.5 rounded-[10px] border-[1.5px] border-4a-border text-[15px] font-4a-sans mb-5 box-border bg-4a-card text-4a-text"
        />
        <FourAcesCard
          className="mb-6"
          style={{
            background: "hsl(var(--4a-accent-faint))",
            border: "1.5px solid hsl(var(--4a-accent))",
          }}
        >
          <div className="text-[13px] text-4a-text-sec mb-1">
            Method: {METHODS[method]?.name}
          </div>
          {result.chosen && (
            <div className="text-sm font-semibold mb-1">Choice: {result.chosen}</div>
          )}
          {result.takeaway && (
            <div className="text-[13px] text-4a-text-sec">"{result.takeaway}"</div>
          )}
          {hasClarityAnswers && (
            <div className="mt-2 pt-2 border-t border-4a-border">
              <div className="text-[11px] text-4a-text-sec font-medium mb-1">Clarity questions completed</div>
              {options.map((opt, i) => {
                const a = clarityAnswers[i];
                if (!a) return null;
                return (
                  <div key={i} className="text-[12px] text-4a-text-sec">
                    {opt}: gain {a.gain}, cost {a.cost}, self-respect {a.selfRespect}
                  </div>
                );
              })}
            </div>
          )}
        </FourAcesCard>
        <div className="text-center">
          <Btn onClick={onSave}>Save Decision</Btn>
        </div>
      </Wrap>
    </div>
  );
}

import { useState } from "react";
import { PRESET_VALUES, type MethodResult } from "@/data/four-aces-constants";
import Btn from "../shared/Btn";
import FourAcesCard from "../shared/FourAcesCard";
import PageHeader from "../shared/PageHeader";
import Wrap from "../shared/Wrap";

interface ValuesLedProps {
  options: string[];
  result: MethodResult;
  setResult: React.Dispatch<React.SetStateAction<MethodResult>>;
  onComplete: () => void;
  onBack: () => void;
}

export default function ValuesLed({ options, result, setResult, onComplete, onBack }: ValuesLedProps) {
  const [phase, setPhase] = useState<"pick" | "align" | "reflect">("pick");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [customVal, setCustomVal] = useState("");
  const [alignments, setAlignments] = useState<Record<string, number>>({});

  const toggleValue = (v: string) => {
    setSelectedValues((p) =>
      p.includes(v) ? p.filter((x) => x !== v) : p.length < 5 ? [...p, v] : p,
    );
  };

  const addCustom = () => {
    if (customVal.trim() && selectedValues.length < 5) {
      setSelectedValues((p) => [...p, customVal.trim()]);
      setCustomVal("");
    }
  };

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Values-Led" onBack={onBack} />

        {phase === "pick" && (
          <>
            <h4 className="font-4a-serif text-xl text-center mb-2">
              What values matter most here?
            </h4>
            <p className="text-center text-4a-text-sec text-sm mb-5">
              Pick up to 5, or add your own.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESET_VALUES.map((v) => (
                <button
                  key={v}
                  onClick={() => toggleValue(v)}
                  className="py-2 px-3.5 rounded-full text-[13px] font-medium cursor-pointer font-4a-sans"
                  style={{
                    border: `1.5px solid ${selectedValues.includes(v) ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                    background: selectedValues.includes(v) ? "hsl(var(--4a-accent-light))" : "transparent",
                    color: selectedValues.includes(v) ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mb-6">
              <input
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustom()}
                placeholder="Add your own..."
                className="flex-1 py-2.5 px-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans"
              />
              <Btn variant="secondary" onClick={addCustom} className="py-2.5 px-4">
                Add
              </Btn>
            </div>
            {selectedValues.length > 0 && (
              <div className="mb-4">
                <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">
                  Your values ({selectedValues.length}/5)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedValues.map((v) => (
                    <span
                      key={v}
                      className="py-1.5 px-3 rounded-2xl bg-4a-accent text-white text-[13px] font-semibold inline-flex items-center gap-1.5"
                    >
                      {v}
                      <button
                        onClick={() => toggleValue(v)}
                        className="bg-none border-none text-white cursor-pointer text-sm leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="text-center">
              <Btn onClick={() => setPhase("align")} disabled={selectedValues.length < 1}>
                Reflect on alignment
              </Btn>
            </div>
          </>
        )}

        {phase === "align" && (
          <>
            <h4 className="font-4a-serif text-xl text-center mb-5">
              How well does each option align?
            </h4>
            {options.map((opt, oi) => (
              <FourAcesCard key={oi} className="mb-3 py-4 px-[18px]">
                <div className="font-bold text-[15px] mb-3">{opt}</div>
                {selectedValues.map((v, vi) => (
                  <div key={vi} className="mb-2">
                    <div className="text-[13px] text-4a-text-sec mb-1">{v}</div>
                    <div className="flex gap-1">
                      {[
                        { label: "N/A", val: -1 },
                        { label: "Low", val: 0 },
                        { label: "Mid", val: 1 },
                        { label: "High", val: 2 },
                      ].map(({ label, val }) => (
                        <button
                          key={val}
                          onClick={() => setAlignments((p) => ({ ...p, [`${oi}-${vi}`]: val }))}
                          className="py-1.5 px-3.5 rounded-md text-xs font-semibold cursor-pointer font-4a-sans"
                          style={{
                            border: `1.5px solid ${
                              alignments[`${oi}-${vi}`] === val
                                ? val === -1
                                  ? "hsl(var(--4a-text-sec))"
                                  : "hsl(var(--4a-accent))"
                                : "hsl(var(--4a-border))"
                            }`,
                            background:
                              alignments[`${oi}-${vi}`] === val
                                ? val === -1
                                  ? "#F0F0F0"
                                  : "hsl(var(--4a-accent-light))"
                                : "transparent",
                            color:
                              alignments[`${oi}-${vi}`] === val
                                ? val === -1
                                  ? "hsl(var(--4a-text-sec))"
                                  : "hsl(var(--4a-accent))"
                                : "hsl(var(--4a-text-sec))",
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </FourAcesCard>
            ))}
            <div className="text-center mt-4">
              <Btn onClick={() => setPhase("reflect")}>Reflect</Btn>
            </div>
          </>
        )}

        {phase === "reflect" && (() => {
          const scores = options.map((_, oi) => {
            let total = 0;
            let counted = 0;
            selectedValues.forEach((_, vi) => {
              const val = alignments[`${oi}-${vi}`];
              if (val !== undefined && val !== -1) {
                total += val;
                counted++;
              }
            });
            return counted > 0 ? total : 0;
          });
          const maxIdx = scores.indexOf(Math.max(...scores));

          return (
            <>
              <div className="text-center mb-5">
                <span className="text-4xl">🧭</span>
                <h4 className="font-4a-serif text-xl mt-2">Values alignment</h4>
              </div>
              <div className="flex flex-col gap-2.5 mb-6">
                {options.map((o, i) => (
                  <FourAcesCard
                    key={i}
                    className="py-3.5 px-[18px] flex items-center justify-between"
                    style={{
                      border: `2px solid ${i === maxIdx ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                      background: i === maxIdx ? "hsl(var(--4a-accent-faint))" : "hsl(var(--4a-card))",
                    }}
                  >
                    <span className="font-bold text-[15px]">{o}</span>
                    <span
                      className="font-bold"
                      style={{ color: i === maxIdx ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))" }}
                    >
                      {"●".repeat(scores[i] + 1)}
                      {"○".repeat(Math.max(0, selectedValues.length * 2 - scores[i] - 1))}
                    </span>
                  </FourAcesCard>
                ))}
              </div>
              <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">
                Which option feels most aligned?
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
                placeholder="What did your values tell you?"
                className="w-full min-h-[80px] p-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans resize-y box-border bg-4a-card text-4a-text"
              />
              <div className="text-center mt-6">
                <Btn onClick={onComplete}>Continue</Btn>
              </div>
            </>
          );
        })()}
      </Wrap>
    </div>
  );
}

import { useState } from "react";
import type { MethodResult } from "@/data/four-aces-constants";
import Btn from "../shared/Btn";
import FourAcesCard from "../shared/FourAcesCard";
import PageHeader from "../shared/PageHeader";
import Wrap from "../shared/Wrap";

interface ProsConsProps {
  options: string[];
  result: MethodResult;
  setResult: React.Dispatch<React.SetStateAction<MethodResult>>;
  onComplete: () => void;
  onBack: () => void;
}

interface ProsConsData {
  pros: string[];
  cons: string[];
}

export default function ProsCons({ options, result, setResult, onComplete, onBack }: ProsConsProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [data, setData] = useState<ProsConsData[]>(() => options.map(() => ({ pros: [""], cons: [""] })));
  const [phase, setPhase] = useState<"edit" | "reflect">("edit");

  const updateEntry = (side: "pros" | "cons", entryIdx: number, value: string) => {
    const d = [...data];
    const entries = [...d[activeIdx][side]];
    entries[entryIdx] = value;
    d[activeIdx] = { ...d[activeIdx], [side]: entries };
    setData(d);
  };

  const addEntry = (side: "pros" | "cons") => {
    const d = [...data];
    d[activeIdx] = { ...d[activeIdx], [side]: [...d[activeIdx][side], ""] };
    setData(d);
  };

  const removeEntry = (side: "pros" | "cons", entryIdx: number) => {
    const d = [...data];
    const entries = d[activeIdx][side].filter((_, i) => i !== entryIdx);
    d[activeIdx] = { ...d[activeIdx], [side]: entries.length > 0 ? entries : [""] };
    setData(d);
  };

  const formatEntries = (entries: string[]) =>
    entries.filter((e) => e.trim()).join(", ");

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="Pros & Cons" onBack={onBack} />

        {phase === "edit" && (
          <>
            <div className="flex gap-1.5 mb-5 flex-wrap">
              {options.map((o, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className="py-2 px-3.5 rounded-lg text-[13px] font-semibold cursor-pointer font-4a-sans"
                  style={{
                    border: `1.5px solid ${i === activeIdx ? "hsl(var(--4a-accent))" : "hsl(var(--4a-border))"}`,
                    background: i === activeIdx ? "hsl(var(--4a-accent-light))" : "transparent",
                    color: i === activeIdx ? "hsl(var(--4a-accent))" : "hsl(var(--4a-text-sec))",
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">Pros</p>
                <div className="flex flex-col gap-1.5">
                  {(data[activeIdx]?.pros ?? [""]).map((entry, ei) => (
                    <div key={ei} className="flex gap-1 items-center">
                      <input
                        value={entry}
                        onChange={(e) => updateEntry("pros", ei, e.target.value)}
                        placeholder={`Pro ${ei + 1}`}
                        className="flex-1 min-w-0 py-2.5 px-3 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans bg-4a-card text-4a-text box-border"
                      />
                      {data[activeIdx].pros.length > 1 && (
                        <button
                          onClick={() => removeEntry("pros", ei)}
                          className="bg-none border-none text-4a-text-sec cursor-pointer text-base leading-none shrink-0"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addEntry("pros")}
                    className="mt-0.5 bg-none border-[1.5px] border-dashed border-4a-border rounded-[10px] py-2 px-3 text-4a-text-sec text-[12px] cursor-pointer font-4a-sans"
                  >
                    + Add pro
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">Cons</p>
                <div className="flex flex-col gap-1.5">
                  {(data[activeIdx]?.cons ?? [""]).map((entry, ei) => (
                    <div key={ei} className="flex gap-1 items-center">
                      <input
                        value={entry}
                        onChange={(e) => updateEntry("cons", ei, e.target.value)}
                        placeholder={`Con ${ei + 1}`}
                        className="flex-1 min-w-0 py-2.5 px-3 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans bg-4a-card text-4a-text box-border"
                      />
                      {data[activeIdx].cons.length > 1 && (
                        <button
                          onClick={() => removeEntry("cons", ei)}
                          className="bg-none border-none text-4a-text-sec cursor-pointer text-base leading-none shrink-0"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addEntry("cons")}
                    className="mt-0.5 bg-none border-[1.5px] border-dashed border-4a-border rounded-[10px] py-2 px-3 text-4a-text-sec text-[12px] cursor-pointer font-4a-sans"
                  >
                    + Add con
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center mt-7">
              <Btn onClick={() => setPhase("reflect")}>Review & Reflect</Btn>
            </div>
          </>
        )}

        {phase === "reflect" && (
          <>
            <div className="flex flex-col gap-3 mb-6">
              {options.map((o, i) => (
                <FourAcesCard key={i} className="py-4 px-[18px]">
                  <div className="font-bold text-[15px] mb-2">{o}</div>
                  <div className="grid grid-cols-2 gap-2 text-[13px]">
                    <div>
                      <span className="text-4a-success font-semibold">Pros: </span>
                      {formatEntries(data[i]?.pros ?? []) || "—"}
                    </div>
                    <div>
                      <span className="text-4a-danger font-semibold">Cons: </span>
                      {formatEntries(data[i]?.cons ?? []) || "—"}
                    </div>
                  </div>
                </FourAcesCard>
              ))}
            </div>
            <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">Which option feels strongest?</p>
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
              placeholder="What became clearer?"
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

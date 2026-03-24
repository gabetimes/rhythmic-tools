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
  pros: string;
  cons: string;
}

export default function ProsCons({ options, result, setResult, onComplete, onBack }: ProsConsProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [data, setData] = useState<ProsConsData[]>(() => options.map(() => ({ pros: "", cons: "" })));
  const [phase, setPhase] = useState<"edit" | "reflect">("edit");

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
                <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">👍 Pros</p>
                <textarea
                  value={data[activeIdx]?.pros ?? ""}
                  onChange={(e) => {
                    const d = [...data];
                    d[activeIdx] = { ...d[activeIdx], pros: e.target.value };
                    setData(d);
                  }}
                  placeholder="What's good about this?"
                  className="w-full min-h-[120px] p-3 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans resize-y box-border"
                />
              </div>
              <div>
                <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">👎 Cons</p>
                <textarea
                  value={data[activeIdx]?.cons ?? ""}
                  onChange={(e) => {
                    const d = [...data];
                    d[activeIdx] = { ...d[activeIdx], cons: e.target.value };
                    setData(d);
                  }}
                  placeholder="What's not ideal?"
                  className="w-full min-h-[120px] p-3 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans resize-y box-border"
                />
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
                      {data[i]?.pros || "—"}
                    </div>
                    <div>
                      <span className="text-4a-danger font-semibold">Cons: </span>
                      {data[i]?.cons || "—"}
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
            <p className="text-[13px] text-4a-text-sec font-medium mb-1.5 font-4a-sans">Your takeaway</p>
            <textarea
              value={result.takeaway}
              onChange={(e) => setResult((p) => ({ ...p, takeaway: e.target.value }))}
              placeholder="What became clearer?"
              className="w-full min-h-[80px] p-3.5 rounded-[10px] border-[1.5px] border-4a-border text-sm font-4a-sans resize-y box-border"
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

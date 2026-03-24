import { useState } from "react";
import { METHODS, type MethodId } from "@/data/four-aces-constants";
import { track4ASeeMoreMethodsClicked } from "@/lib/analytics/web";
import FourAcesCard from "./shared/FourAcesCard";
import PageHeader from "./shared/PageHeader";
import Wrap from "./shared/Wrap";

interface BrowseAllProps {
  onPick: (methodId: MethodId) => void;
  onBack: () => void;
}

export default function BrowseAll({ onPick, onBack }: BrowseAllProps) {
  const [showToast, setShowToast] = useState(false);

  const handleSeeMore = () => {
    track4ASeeMoreMethodsClicked();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="pt-[60px]">
      <Wrap>
        <PageHeader title="All Methods" onBack={onBack} />
        <div className="flex flex-col gap-2.5">
          {Object.values(METHODS).map((m) => (
            <FourAcesCard
              key={m.id}
              onClick={() => onPick(m.id)}
              className="py-[18px] px-5"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-[26px]">{m.icon}</span>
                <div className="flex-1">
                  <div className="font-bold text-[15px]">{m.name}</div>
                  <div className="text-[13px] text-4a-text-sec">{m.desc}</div>
                </div>
                <span className="text-4a-accent text-lg">→</span>
              </div>
            </FourAcesCard>
          ))}
        </div>
        <div className="text-center mt-6">
          <button
            onClick={handleSeeMore}
            className="bg-none border-none text-4a-text-sec text-sm cursor-pointer font-4a-sans underline decoration-4a-border underline-offset-[3px]"
          >
            See more methods
          </button>
          {showToast && (
            <div className="mt-3 py-2.5 px-5 rounded-[10px] bg-4a-surface-dark text-white text-[13px] font-medium inline-block animate-fade-up">
              Stay tuned! There are more methods coming soon.
            </div>
          )}
        </div>
      </Wrap>
    </div>
  );
}

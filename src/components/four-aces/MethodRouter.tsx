import type { MethodId, MethodResult } from "@/data/four-aces-constants";
import FlipACoin from "./methods/FlipACoin";
import ProsCons from "./methods/ProsCons";
import ReversibleOrNot from "./methods/ReversibleOrNot";
import CriteriaMap from "./methods/CriteriaMap";
import ValuesLed from "./methods/ValuesLed";

interface MethodRouterProps {
  method: MethodId;
  options: string[];
  result: MethodResult;
  setResult: React.Dispatch<React.SetStateAction<MethodResult>>;
  onComplete: () => void;
  onBack: () => void;
}

export default function MethodRouter({ method, options, result, setResult, onComplete, onBack }: MethodRouterProps) {
  const props = { options, result, setResult, onComplete, onBack };

  switch (method) {
    case "flip":
      return <FlipACoin {...props} />;
    case "proscons":
      return <ProsCons {...props} />;
    case "reversible":
      return <ReversibleOrNot {...props} />;
    case "criteria":
      return <CriteriaMap {...props} />;
    case "values":
      return <ValuesLed {...props} />;
    default:
      return null;
  }
}

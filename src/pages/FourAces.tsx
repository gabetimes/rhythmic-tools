import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  METHODS,
  DECISION_TYPES,
  type MethodId,
  type IntakeState,
  type MethodResult,
  type SavedDecision,
} from "@/data/four-aces-constants";
import { loadDecisions, saveDecisions } from "@/lib/four-aces-storage";
import { getRecommendations } from "@/lib/four-aces-recommendations";
import {
  track4AIntakeStarted,
  track4AIntakeStep,
  track4AIntakeCompleted,
  track4AMethodStarted,
  track4AMethodCompleted,
  track4AOptionSaved,
  track4AClarityRatingSubmitted,
} from "@/lib/analytics/web";

import Landing from "@/components/four-aces/Landing";
import IntakeStep1 from "@/components/four-aces/IntakeStep1";
import IntakeStep2 from "@/components/four-aces/IntakeStep2";
import IntakeStep3 from "@/components/four-aces/IntakeStep3";
import OptionsEntry from "@/components/four-aces/OptionsEntry";
import Recommendations from "@/components/four-aces/Recommendations";
import BrowseAll from "@/components/four-aces/BrowseAll";
import MethodRouter from "@/components/four-aces/MethodRouter";
import ClarityRating from "@/components/four-aces/ClarityRating";
import SaveDecision from "@/components/four-aces/SaveDecision";
import SavedConfirm from "@/components/four-aces/SavedConfirm";
import History from "@/components/four-aces/History";
import QuickFlip from "@/components/four-aces/QuickFlip";

type Screen =
  | "landing"
  | "intake-1"
  | "intake-2"
  | "intake-3"
  | "options"
  | "recommendations"
  | "browse"
  | "method"
  | "clarity"
  | "save"
  | "saved-confirm"
  | "history"
  | "quick-flip";

function screenFromPath(pathname: string): Screen {
  if (pathname === "/4aces/history") return "history";
  if (pathname === "/4aces/methods") return "browse";
  return "landing";
}

export default function FourAces() {
  const navigate = useNavigate();
  const location = useLocation();

  const [screen, setScreen] = useState<Screen>(() => screenFromPath(location.pathname));
  const [intake, setIntake] = useState<IntakeState>({
    hasOptions: null,
    slider: 50,
    decisionType: null,
  });
  const [options, setOptions] = useState<string[]>([]);
  const [recs, setRecs] = useState<MethodId[]>([]);
  const [currentMethod, setCurrentMethod] = useState<MethodId>("flip");
  const [methodResult, setMethodResult] = useState<MethodResult>({ chosen: "", takeaway: "" });
  const [clarity, setClarity] = useState(0);
  const [decisionTitle, setDecisionTitle] = useState("");
  const [saved, setSaved] = useState<SavedDecision[]>([]);

  useEffect(() => {
    setSaved(loadDecisions());
  }, []);

  // Sync screen with route (only for direct navigation via header links)
  useEffect(() => {
    const state = location.state as { reset?: boolean } | null;
    if (state?.reset) {
      setScreen("landing");
      // Clear the state so browser back doesn't re-trigger
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }
    const target = screenFromPath(location.pathname);
    if (target !== "landing" && screen !== target) {
      setScreen(target);
    }
  }, [location.pathname, location.state]);

  const goTo = useCallback(
    (s: Screen) => {
      setScreen(s);
      // Keep URL in sync for history route
      if (s === "history") {
        navigate("/4aces/history", { replace: true });
      } else if (s === "browse") {
        navigate("/4aces/methods", { replace: true });
      } else if (location.pathname !== "/4aces") {
        navigate("/4aces", { replace: true });
      }
    },
    [navigate, location.pathname],
  );

  const startQuickFlip = () => {
    setOptions([]);
    setMethodResult({ chosen: "", takeaway: "" });
    setClarity(0);
    setDecisionTitle("");
    setCurrentMethod("flip");
    setIntake({ hasOptions: true, slider: 0, decisionType: null });
    goTo("quick-flip");
  };

  const startIntake = () => {
    track4AIntakeStarted();
    setIntake({ hasOptions: null, slider: 50, decisionType: null });
    setOptions([]);
    setMethodResult({ chosen: "", takeaway: "" });
    setClarity(0);
    setDecisionTitle("");
    goTo("intake-1");
  };

  const finishIntake = () => {
    const r = getRecommendations(intake.slider, intake.decisionType, intake.hasOptions);
    setRecs(r);
    track4AIntakeCompleted(r.map((m) => METHODS[m].name));
    goTo("recommendations");
  };

  const startMethod = (methodId: MethodId) => {
    setCurrentMethod(methodId);
    setMethodResult({ chosen: "", takeaway: "" });
    track4AMethodStarted(METHODS[methodId].name);
    goTo("method");
  };

  const completeMethod = () => {
    track4AMethodCompleted(METHODS[currentMethod].name);
    goTo("clarity");
  };

  const submitClarity = () => {
    track4AClarityRatingSubmitted(clarity, METHODS[currentMethod].name);
    goTo("save");
  };

  const saveDec = () => {
    const dec: SavedDecision = {
      id: Date.now(),
      title: decisionTitle || "Untitled Decision",
      date: new Date().toISOString(),
      method: METHODS[currentMethod].name,
      chosen: methodResult.chosen,
      takeaway: methodResult.takeaway,
      clarity,
      decisionType: DECISION_TYPES.find((d) => d.id === intake.decisionType)?.label ?? "",
      options: [...options],
    };
    const next = [dec, ...saved];
    setSaved(next);
    saveDecisions(next);
    goTo("saved-confirm");
  };

  const handleOptionsNext = () => {
    options.filter((o) => o.trim()).forEach((o) => track4AOptionSaved(o));
    finishIntake();
  };

  switch (screen) {
    case "landing":
      return <Landing onStart={startIntake} onQuickDecision={startQuickFlip} onHistory={() => goTo("history")} savedCount={saved.length} />;
    case "intake-1":
      return (
        <IntakeStep1
          intake={intake}
          setIntake={setIntake}
          onNext={() => {
            track4AIntakeStep(1, "has_options", "Do you have options?", intake.hasOptions ? "yes" : "no");
            goTo("intake-2");
          }}
          onBack={() => goTo("landing")}
        />
      );
    case "intake-2":
      return (
        <IntakeStep2
          intake={intake}
          setIntake={setIntake}
          onNext={() => {
            track4AIntakeStep(2, "speed_confidence", "Fast or confident?", intake.slider);
            goTo("intake-3");
          }}
          onBack={() => goTo("intake-1")}
        />
      );
    case "intake-3":
      return (
        <IntakeStep3
          intake={intake}
          setIntake={setIntake}
          onNext={() => {
            track4AIntakeStep(3, "decision_type", "What type?", intake.decisionType ?? "");
            goTo("options");
          }}
          onBack={() => goTo("intake-2")}
        />
      );
    case "options":
      return (
        <OptionsEntry
          intake={intake}
          options={options}
          setOptions={setOptions}
          onNext={handleOptionsNext}
          onBack={() => goTo("intake-3")}
        />
      );
    case "recommendations":
      return <Recommendations recs={recs} intake={intake} onPick={startMethod} onBrowse={() => goTo("browse")} />;
    case "browse":
      return <BrowseAll onPick={startMethod} onBack={() => goTo("recommendations")} />;
    case "method":
      return (
        <MethodRouter
          method={currentMethod}
          options={options}
          result={methodResult}
          setResult={setMethodResult}
          onComplete={completeMethod}
          onBack={() => goTo("recommendations")}
        />
      );
    case "clarity":
      return <ClarityRating clarity={clarity} setClarity={setClarity} onNext={submitClarity} onTryAnother={() => goTo("browse")} />;
    case "save":
      return (
        <SaveDecision
          title={decisionTitle}
          setTitle={setDecisionTitle}
          result={methodResult}
          method={currentMethod}
          onSave={saveDec}
        />
      );
    case "saved-confirm":
      return <SavedConfirm onNew={startIntake} onHistory={() => goTo("history")} />;
    case "quick-flip":
      return (
        <QuickFlip
          result={methodResult}
          setResult={setMethodResult}
          onComplete={completeMethod}
          onBack={() => goTo("landing")}
          setOptions={setOptions}
        />
      );
    case "history":
      return <History decisions={saved} onBack={() => goTo("landing")} onNew={startIntake} />;
    default:
      return null;
  }
}

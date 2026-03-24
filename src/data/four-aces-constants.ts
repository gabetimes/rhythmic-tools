export type MethodId = "flip" | "proscons" | "reversible" | "criteria" | "values";

export interface Method {
  id: MethodId;
  name: string;
  desc: string;
  icon: string;
}

export const METHODS: Record<MethodId, Method> = {
  flip: { id: "flip", name: "Flip a Coin", desc: "Let chance reveal your gut feeling", icon: "" },
  proscons: { id: "proscons", name: "Pros & Cons", desc: "Weigh the good against the bad", icon: "" },
  reversible: { id: "reversible", name: "Reversible or Not", desc: "How permanent is this really?", icon: "" },
  criteria: { id: "criteria", name: "Criteria Map", desc: "Score options against what matters", icon: "" },
  values: { id: "values", name: "Values-Led", desc: "Align your choice with your values", icon: "" },
};

export interface DecisionType {
  id: string;
  label: string;
  icon: string;
}

export const DECISION_TYPES: DecisionType[] = [
  { id: "work-career", label: "Work / Career", icon: "💼" },
  { id: "relationships", label: "Relationships", icon: "❤️" },
  { id: "finances", label: "Finances", icon: "💰" },
  { id: "daily-life", label: "Daily Life", icon: "☀️" },
  { id: "big-life-change", label: "Big Life Change", icon: "🌊" },
  { id: "other", label: "Other", icon: "✨" },
];

export const STARTER_OPTIONS: Record<string, string[]> = {
  "work-career": ["Stay where I am", "Take a new role", "Start looking for something else"],
  "relationships": ["Stay and work on it", "Take space and reflect", "Move on"],
  "finances": ["Spend now", "Wait and save", "Look for a lower-cost alternative"],
  "daily-life": ["Go with the easiest option", "Try something different", "Delay the decision"],
  "big-life-change": ["Stay where I am", "Make the change", "Explore the option further first"],
  "other": ["Keep current path", "Try a new option", "Get more information first"],
};

export const PRESET_VALUES = [
  "Integrity", "Family", "Growth", "Freedom", "Security",
  "Creativity", "Adventure", "Stability", "Health", "Purpose",
  "Connection", "Independence", "Fun", "Achievement", "Balance",
];

export interface IntakeState {
  hasOptions: boolean | null;
  slider: number;
  decisionType: string | null;
}

export interface MethodResult {
  chosen: string;
  takeaway: string;
}

export interface SavedDecision {
  id: number;
  title: string;
  date: string;
  method: string;
  chosen: string;
  takeaway: string;
  clarity: number;
  decisionType: string;
  options: string[];
}

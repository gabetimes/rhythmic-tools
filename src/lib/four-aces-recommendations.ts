import type { MethodId } from "@/data/four-aces-constants";

export function getRecommendations(
  slider: number,
  decisionType: string | null,
  hasOptions: boolean | null,
): MethodId[] {
  const scores: Record<MethodId, number> = {
    flip: 0,
    proscons: 0,
    reversible: 0,
    criteria: 0,
    values: 0,
  };

  const fast = 1 - slider / 100;
  const conf = slider / 100;

  scores.flip += fast * 5;
  scores.proscons += fast * 3 + conf * 2;
  scores.reversible += 2.5;
  scores.criteria += conf * 5;
  scores.values += conf * 4;

  const personal = ["relationships", "big-life-change"].includes(decisionType ?? "");
  const practical = ["work-career", "finances", "daily-life"].includes(decisionType ?? "");
  const big = decisionType === "big-life-change";

  if (personal) {
    scores.values += 3;
    scores.flip -= 1;
  }
  if (practical) {
    scores.criteria += 2;
    scores.proscons += 2;
  }
  if (big) {
    scores.reversible += 3;
    scores.flip -= 2;
  }
  if (!hasOptions) {
    scores.flip -= 1;
  }

  const sorted = (Object.entries(scores) as [MethodId, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const top = sorted[0][1];

  return sorted
    .filter(([, s]) => s >= top * 0.5)
    .slice(0, 3)
    .map(([m]) => m);
}

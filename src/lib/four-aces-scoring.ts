import type { ClarityAnswer, ClarityAnswers, MethodId, MethodScores } from "@/data/four-aces-constants";

export function computeClarityScore(answer: ClarityAnswer): number {
  const raw = answer.gain + (6 - answer.cost) + answer.selfRespect;
  return Math.round((raw / 15) * 100);
}

export function computeCumulativeScores(
  methodId: MethodId,
  methodScores: MethodScores | undefined,
  clarityAnswers: ClarityAnswers,
  optionsCount: number,
): Record<number, number> {
  const scores: Record<number, number> = {};

  for (let i = 0; i < optionsCount; i++) {
    const clarityAnswer = clarityAnswers[i];
    const clarityScore = clarityAnswer ? computeClarityScore(clarityAnswer) : 0;
    const methodScore = methodScores?.[i];

    if (methodId === "flip" || methodScore === undefined) {
      // FlipACoin has no numerical method score
      scores[i] = clarityScore;
    } else {
      scores[i] = Math.round(0.5 * methodScore + 0.5 * clarityScore);
    }
  }

  return scores;
}

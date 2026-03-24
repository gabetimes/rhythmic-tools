import type { SavedDecision } from "@/data/four-aces-constants";

const STORAGE_KEY = "four-aces-decisions";

export function loadDecisions(): SavedDecision[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDecisions(decisions: SavedDecision[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  } catch {
    // silently fail if storage is full
  }
}

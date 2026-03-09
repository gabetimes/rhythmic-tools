// Simple session tracking for streaks and stats

export interface SessionRecord {
  date: string; // YYYY-MM-DD
  minutes: number;
  type: "prompt" | "journey" | "checkin" | "capture";
}

export function hasCheckedInToday(): boolean {
  const today = new Date().toISOString().split("T")[0];
  return getSessions().some((s) => s.date === today && s.type === "checkin");
}

export function logCheckin(): void {
  if (hasCheckedInToday()) return;
  const sessions = getSessions();
  const today = new Date().toISOString().split("T")[0];
  sessions.push({ date: today, minutes: 0, type: "checkin" });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

const STORAGE_KEY = "ink-sessions";

export function getSessions(): SessionRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function logSession(minutes: number, type: "prompt" | "journey" | "capture" = "prompt") {
  const sessions = getSessions();
  const today = new Date().toISOString().split("T")[0];
  sessions.push({ date: today, minutes, type });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getStreak(): number {
  const sessions = getSessions();
  const dates = [...new Set(sessions.map((s) => s.date))].sort().reverse();
  if (dates.length === 0) return 0;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Streak must include today or yesterday
  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const curr = new Date(dates[i]).getTime();
    const prev = new Date(dates[i + 1]).getTime();
    if (curr - prev === 86400000) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getTotalMinutes(): number {
  return getSessions().reduce((sum, s) => sum + s.minutes, 0);
}

export function getJourneyCount(): number {
  return getSessions().filter((s) => s.type === "journey").length;
}

export function getTotalSessions(): number {
  return getSessions().length;
}

export function getUniqueDays(): number {
  return new Set(getSessions().map((s) => s.date)).size;
}



## Plan: Manual "I Wrote Today" Check-in

### Concept
Add a simple, prominent check-in card to the **Today** dashboard where users can mark that they journaled. This becomes the primary driver of streaks and stats — a conscious, intentional tap rather than passive tracking.

### Changes

**1. Update session store (`session-store.ts`)**
- Add a `logCheckin()` function that records a session of type `"checkin"` for today (idempotent — only one per day).
- Add `hasCheckedInToday()` helper to check if today is already marked.
- Streak and stats logic remains unchanged since it already counts any `SessionRecord`.

**2. Add check-in card to dashboard (`Index.tsx`)**
- Place a card between the daily prompt and the "Start a Journey" button.
- When unchecked: shows a gentle prompt like *"Did you write today?"* with a single tap target (a circle or checkbox with a pen/check icon).
- When checked: the card transforms to a soft confirmed state — *"Checked in ✓"* — with a fade transition, then collapses after a moment (similar to the mood tracker pattern).
- Tapping logs a `checkin` session via `logCheckin()`.

**3. Remove automatic session logging from timer**
- The inline timer and journey completion will **no longer** call `logSession()` automatically. The check-in is the single source of truth for "I journaled today."
- Timer remains purely as a focus tool.

**4. Stats dashboard (`Stats.tsx`)**
- No structural changes needed — `getSessions()` already aggregates all records, so check-ins will feed into streaks, unique days, and total sessions naturally.
- Optionally update the "sessions" label to "days" since check-in is once per day.

### UX Flow
```text
Dashboard
┌──────────────────────────┐
│  Daily Prompt            │
│  [timer] [refresh]       │
├──────────────────────────┤
│  ○  Did you write today? │  ← tap to check in
│     Tap to check in      │
├──────────────────────────┤
│  Mood check-in           │
│  Start a Journey →       │
└──────────────────────────┘
```

After tap:
```text
│  ● Checked in for today  │  ← fades/collapses
```


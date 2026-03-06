

## Plan: Replace "time writing" with "journeys completed"

### Changes

**1. Add `getJourneyCount()` to `src/lib/session-store.ts`**
- New function that filters sessions by `type === "journey"` and returns the count.

**2. Update `src/pages/Stats.tsx`**
- Import `getJourneyCount` instead of `getTotalMinutes`.
- Replace the first stat card: swap `Clock` icon for `Compass` (matching the Journeys nav icon), show journey count, label "journeys done".
- Remove unused `timeStr`/`totalMin` logic.


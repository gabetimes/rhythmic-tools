

## Plan: Prompt Navigation and No-Repeat Logic

### Changes

**1. Expand prompt pool to 100+ (`src/data/prompts.ts`)**
- Add ~70 more prompts to reach at least 100, ensuring no repeats within 100 days since `getTodayPrompt()` uses `dayOfYear % dailyPrompts.length`.

**2. Deterministic 3-prompt-per-day system (`src/data/prompts.ts`)**
- New `getTodayPrompts(): string[]` function that returns exactly 3 prompts for the day using the day-of-year seed — the base prompt plus 2 alternates, all guaranteed distinct.
- `getCurrentPrompt()` updated to read from the active index (0, 1, or 2).

**3. Rework refresh state and navigation (`src/pages/Index.tsx`)**
- Store `promptIndex` (0–2) instead of arbitrary random indices. Refresh increments from 0→1→2. Max 2 refreshes (3 prompts total).
- Save the full state as `{ date, promptIndex }` in localStorage.
- Add a left-arrow (ChevronLeft) button that appears when `promptIndex > 0` to go back to previous prompts. Sits to the left of the refresh button. Minimal design: same icon-button style as timer/refresh.
- Show a dot indicator (e.g., `● ○ ○`) below the prompt text showing which of the 3 prompts is active — small, unobtrusive, same muted-foreground style.

**4. Update `getCurrentPrompt()` in `prompts.ts`**
- Reads `promptIndex` from localStorage, calls `getTodayPrompts()[index]`.

### UX
- Prompt card header stays the same
- Icon row: `[Timer] [◀ back] [↻ refresh] [dot indicator 1/3]`
- Back button only visible when index > 0; refresh button disabled when index = 2
- Dot indicator: 3 tiny dots below prompt text showing position

### No-repeat guarantee
With 100+ prompts and day-of-year modulo, prompts won't repeat for 100+ days. The 3 daily picks use offsets (e.g., `dayOfYear`, `dayOfYear + 37`, `dayOfYear + 71`) mod pool size to stay deterministic and distinct.


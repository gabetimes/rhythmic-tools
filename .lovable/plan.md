

## Plan: Fix Prompt Capture and Allow Multiple Daily Images

### Problem
1. `Capture.tsx` calls `getTodayPrompt()` which always returns the base prompt for the day, ignoring any refreshes the user made on the Today tab.
2. The current prompt the user sees is determined by the refresh state stored in `localStorage` under `"ink-prompt-refresh"` — but the Capture page doesn't read this.

### Changes

**1. Add a `getCurrentPrompt()` helper (`src/data/prompts.ts`)**
- New exported function that reads `"ink-prompt-refresh"` from localStorage and returns the currently active prompt (accounting for refreshes), falling back to `getTodayPrompt()`.
- This centralizes the "what prompt is the user seeing right now?" logic.

**2. Update `Capture.tsx`**
- Import and use `getCurrentPrompt()` instead of `getTodayPrompt()` in both the preview display and the `handleSave` call.
- No changes needed for multiple images — `saveSpace()` already uses `Date.now()` as the ID and unshifts into the array, so multiple captures per day already work. The only implicit limit is the max-20 cap, which is fine.

**3. Update `Index.tsx`**
- Replace the inline prompt resolution logic with `getCurrentPrompt()` to keep it DRY (optional but clean).

Two files changed, one new function. No structural changes needed for multiple daily images — that already works.


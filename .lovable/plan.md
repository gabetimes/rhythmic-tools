

## Plan: Time-aware greeting

Update `src/pages/Index.tsx` to replace the hardcoded "Good morning" with a greeting based on the user's local hour:

- Before 12:00 → "Good morning"
- 12:00–16:59 → "Good afternoon"  
- 17:00+ → "Good evening"

Single change in `Index.tsx` — derive the greeting from `new Date().getHours()` and use it in the hero section.


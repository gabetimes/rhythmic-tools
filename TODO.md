# TODO

## High Priority

- [ ] **Complete or deprecate Shift tool** — `/src/pages/Shift.tsx` (764 lines) is not integrated into the layout system, uses inline styles instead of Tailwind, references fonts that aren't imported (JetBrains Mono), and has no header/footer. Decide whether to finish or remove it.
- [ ] **Move analytics API keys to environment variables** — Amplitude API key and Meta Pixel ID are hardcoded in `src/lib/analytics/web.ts`. Move to `.env` files.
- [ ] **Expand prompt pool to 100+** — Currently limited; the 3-prompt-per-day system needs enough prompts to avoid repeats over 100 days (noted in `.lovable/plan.md`).
- [ ] **Add test coverage** — Only a placeholder test exists (`src/test/example.test.ts`). Priority targets: recommendation scoring algorithm, session streak calculation, localStorage read/write, and the 4 Aces state machine transitions.
- [ ] **Accessibility audit** — Only 23 `aria-label` attributes across the entire codebase. Mood tracker buttons, icon-only buttons (timer, theme toggle, sound), and 4 Aces intake cards all need labels. Add `prefers-reduced-motion` support for fade-up animations.

## Medium Priority

- [ ] **Add error boundaries** — No React error boundaries exist; a rendering crash in any tool takes down the whole page.
- [ ] **Add `prefers-reduced-motion` media query** — Fade-up and stagger animations run unconditionally; users with vestibular disorders have no opt-out.
- [ ] **Tighten TypeScript config** — `strictNullChecks`, `noImplicitAny`, `noUnusedLocals`, and `noUnusedParameters` are all `false`. Turning these on incrementally would catch real bugs.
- [ ] **Lazy-load routes** — All tool code is bundled upfront. Use `React.lazy` + `Suspense` for `/ink`, `/4aces`, and `/shift` to reduce initial bundle size.
- [ ] **Add localStorage schema validation** — Data is parsed with bare `JSON.parse` and no shape checks. A schema change would silently corrupt saved decisions, sessions, and moods.
- [ ] **Sort/filter decision history** — 4 Aces history page lists all saved decisions with no way to search, sort by date, or filter by method.
- [ ] **Add keyboard focus indicators** — 4 Aces intake cards and option pills lack visible `:focus-visible` styles.

## Low Priority

- [ ] **Refactor FourAces.tsx state machine** — 270+ lines managing 9 `useState` hooks. A `useReducer` or state machine library would make transitions explicit and testable.
- [ ] **Split large page files** — `Shift.tsx` (764 lines), `Index.tsx` (~300 lines), and `FourAces.tsx` (270 lines) could be decomposed into smaller modules.
- [ ] **Consolidate animation patterns** — Fade-up animations, timer-pulse, and transition choreography (setTimeout chains in MoodTracker/CheckinCard) use different approaches. A shared motion utility would unify these.
- [ ] **Add error tracking** — No Sentry or equivalent. Analytics tracks usage but not crashes.
- [ ] **Remove unused dependencies** — TanStack Query, react-resizable-panels, and react-day-picker are installed but never imported.
- [ ] **Add cloud sync option** — All data lives in localStorage only. Users lose everything on a browser clear or device switch.

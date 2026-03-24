# Learnings

Patterns, decisions, and gotchas discovered while building Rhythmic Tools.

## Architecture

- **Tool-specific layouts work well for isolated brand experiences.** 4 Aces has its own fonts (Fraunces + Outfit), color palette, and forced light mode via a `.four-aces` CSS class wrapper — completely independent of the sitewide Ink/homepage theme. This keeps tools feeling distinct without polluting shared styles.

- **State-based screen routing inside a single route is fragile but necessary.** 4 Aces originally used three separate `/4aces/*` routes, which caused full component remounts on header nav clicks and lost in-progress state. Consolidating to a single route with an internal `screen` state variable fixed this, but requires manual URL sync for history/browse pages (`eb865a4`).

- **`useRef` for one-time initialization can backfire on navigation.** OptionsEntry used `initialized.current` to seed starter options only once. When users navigated back and forward, the ref prevented re-seeding even though the decision type had changed. Fix: track *which* input produced the seed and compare on re-entry (`228804f`).

## Navigation & UX

- **Internal phase navigation needs its own back handling.** Method screens (Pros & Cons, Criteria Map, etc.) each have multi-step internal phases. The original `onBack` prop went straight to the recommendations screen regardless of which phase the user was on. Each method now checks its current phase and steps backward internally before delegating to the parent (`b6a0c32`).

- **Auto-advance after selection feels faster than a Continue button.** IntakeStep1 auto-advances 300ms after the user taps an option. Removing the explicit "Continue" button made the flow feel snappier without being disorienting (`ac04d3d`).

- **`<div onClick>` has a ~300ms touch delay on mobile Safari.** FourAcesCard was a `div` with an `onClick` handler, which felt sluggish on iOS. Switching to a `<button>` element gave immediate touch response (`eb865a4`).

## 4 Aces Decision Tool

- **Auto-generated cons create a "mirror" effect that makes trade-offs visible.** When a user adds "Great salary" as a pro for Option A, all other options automatically get "Not Great salary" as a con. This surfaces implicit trade-offs the user might not have written down. Users can dismiss any auto-con they disagree with (`2361fa7`).

- **Recommendation explanations build trust.** Generic "we recommend X" felt arbitrary. Adding a sentence tied to the user's intake answers (e.g., "You said speed matters — a coin flip cuts through overthinking for a career decision") made recommendations feel personalized and justified (`13bf287`).

- **Low-clarity users need an escape hatch, not a dead end.** When a user rates their clarity at 3/5 or below after completing a method, showing a "Try a different method" link gives them a constructive next step instead of forcing them to save a decision they're not confident about (`13bf287`).

- **Quick Decision mode targets bounce-prone users.** ~70% of users who start intake don't finish it. A streamlined single-screen flow (two text inputs + coin flip) skips intake entirely and gets to a result in ~30 seconds (`b6a0c32`).

- **Pre-filled options must stay in sync with their source.** When the user picks "I need help" and gets category-specific starter options, those options need to update if the user goes back and changes the category — but only if they haven't manually edited them. Comparing current options against the previously seeded starters handles this cleanly (`228804f`).

## Design & Styling

- **CSS variables with HSL values enable flexible theming.** The design system uses `--background: 30 20% 98%` (HSL without the `hsl()` wrapper), which lets Tailwind compose opacity variants like `bg-background/50`. Each tool can override these variables in its own scope.

- **Forcing light mode per-tool is cleaner than conditional dark styles.** 4 Aces sets `color-scheme: light` on its wrapper rather than adding dark mode variants to every component. This avoids doubling the CSS for a tool that was designed light-only.

- **Max-width constraint (`max-w-lg` / 512px) keeps mobile-first layouts readable on desktop.** Every tool wraps content in a centered container. This is simple but effective — no breakpoint-heavy responsive code needed.

## Data & Storage

- **localStorage-only keeps the app fast but has real limits.** No server, no auth, no sync. Users lose everything on browser clear. The trade-off is acceptable for an MVP but cloud backup should be a future option.

- **Image capture needs aggressive size limits.** Capture resizes photos to 600px max dimension at 0.7 JPEG quality and caps storage at 20 images. Without these limits, a few photos would exhaust the ~5MB localStorage quota.

## Analytics

- **Triple-tracking (GA4 + Amplitude + Meta Pixel) adds overhead but serves different purposes.** GA4 for traffic, Amplitude for product analytics and session replay, Meta Pixel for ad attribution. Each loads its own script tag on init.

- **Granular intake tracking reveals drop-off points.** Each intake step fires a separate event with the step number, question, and answer. This makes it possible to see exactly where users abandon the flow and which decision types are most common.

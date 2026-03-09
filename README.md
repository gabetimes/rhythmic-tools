# Rhythmic Tools

A collection of web-based tools for solving everyday problems and supporting self-discovery, built by Rhythmic, Inc.

**Live site:** [rhythmic-tools.com](https://rhythmic-tools.com)

## Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS 3 with `tailwindcss-animate`
- **Components:** shadcn/ui (Radix UI primitives)
- **Routing:** React Router v6
- **State:** React Query for async state, localStorage for persistence
- **Package manager:** bun (preferred) or npm
- **Testing:** Vitest + Testing Library

## Getting Started

```bash
bun install
bun run dev      # starts on port 8080
bun run build    # production build
bun run test     # run tests
```

## Architecture

### Layouts

The site uses two layout systems:

- **`SiteLayout`** (`src/components/SiteLayout.tsx`) — Wraps the homepage and legal pages (terms, privacy). Includes `SiteHeader` and `SiteFooter`.
- **`InkLayout`** (`src/components/InkLayout.tsx`) — Wraps all `/ink/*` routes. Has its own sticky header (with dark mode toggle, ambient sound controls) and a fixed bottom tab nav. Also includes `SiteFooter` for legal link access.

### Sitewide Components

- **`SiteHeader`** (`src/components/SiteHeader.tsx`) — Top bar with "Rhythmic Tools" branding and a "View Our Tools" link to the homepage.
- **`SiteFooter`** (`src/components/SiteFooter.tsx`) — Footer with links to Privacy Policy, Terms of Service, and a "Do Not Sell or Share My Personal Information" mailto link. Appears on all pages (both `SiteLayout` and `InkLayout`).

### Routing (defined in `src/App.tsx`)

| Path | Layout | Page Component |
|------|--------|----------------|
| `/` | SiteLayout | `ComingSoon` |
| `/terms` | SiteLayout | `Terms` |
| `/privacy` | SiteLayout | `Privacy` |
| `/ink` | InkLayout | `Index` (daily prompts) |
| `/ink/exercises` | InkLayout | `Exercises` (guided journeys) |
| `/ink/journey/:id` | InkLayout | `JourneyPage` |
| `/ink/capture` | InkLayout | `Capture` |
| `/ink/spaces` | InkLayout | `Spaces` |
| `/ink/stats` | InkLayout | `Stats` (practice tracking) |
| `*` | none | `NotFound` |

### Tools

Each tool lives under its own route prefix with its own layout, data, and design.

**Ink** (`/ink`) — A minimalist digital companion for pen-and-paper journaling. Features:
- Daily writing prompts (110 prompts, 3 shown per day based on day-of-year)
- Guided journeys (5 multi-step timed exercises)
- Mood check-ins with tracking
- Writing space capture
- Ambient sounds (rain, lofi, forest) via Web Audio API
- Session/streak tracking persisted to localStorage
- Dark mode support

## Key Directories

```
src/
├── components/          # App components
│   ├── ui/              # shadcn/ui primitives (48 components)
│   ├── SiteLayout.tsx   # Homepage + legal page wrapper
│   ├── SiteHeader.tsx   # Sitewide top header
│   ├── SiteFooter.tsx   # Sitewide footer with legal links
│   ├── InkLayout.tsx    # Ink tool layout (header + bottom nav + footer)
│   ├── SoundPlayer.tsx  # Ambient sound UI
│   ├── MoodTracker.tsx  # Mood check-in component
│   ├── CheckinCard.tsx  # Check-in display card
│   └── Timer.tsx        # Countdown timer for journeys
├── pages/               # Route-level page components
│   ├── ComingSoon.tsx   # Homepage
│   ├── Terms.tsx        # Terms of Service
│   ├── Privacy.tsx      # Privacy Policy
│   ├── Index.tsx        # Ink daily view
│   ├── Exercises.tsx    # Ink guided journeys list
│   ├── JourneyPage.tsx  # Single journey view
│   ├── Capture.tsx      # Writing capture
│   ├── Spaces.tsx       # Spaces gallery
│   ├── Stats.tsx        # Practice stats dashboard
│   └── NotFound.tsx     # 404 page
├── data/
│   ├── prompts.ts       # 110 daily writing prompts + selection logic
│   └── journeys.ts      # 5 guided journey definitions
├── hooks/
│   ├── use-ambient-sound.ts  # Web Audio ambient sound engine
│   ├── use-chime.ts          # Three-note chime sound
│   ├── use-mobile.tsx         # Mobile breakpoint detection (768px)
│   └── use-toast.ts          # Toast notification state
├── lib/
│   ├── utils.ts              # cn() class name utility
│   └── session-store.ts      # localStorage session/streak persistence
└── test/
    ├── setup.ts
    └── example.test.ts
```

## Design System

Defined in `DESIGN.md`. Key points:

- **Typography:** Lora (serif, headings) + Source Sans 3 (sans, body)
- **Colors:** Warm earthy palette — sage green primary, terracotta accent, warm beige secondary
- **Dark mode:** Class-based, first-class support
- **Layout:** Mobile-first, max-w-lg (512px) for tool content, max-w-3xl for site pages
- **Motion:** Subtle fade-up animations at 0.15s stagger intervals

## Configuration Files

- `vite.config.ts` — Dev server on port 8080, `@` path alias to `src/`
- `tailwind.config.ts` — Custom fonts, CSS variable-based color tokens, class-based dark mode
- `components.json` — shadcn/ui configuration
- `tsconfig.json` — TypeScript config with path aliases

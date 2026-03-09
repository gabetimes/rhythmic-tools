# Rhythmic Tools

Rhythmic Tools is a website that hosts a collection of tools for solving everyday problems and supporting self-discovery.

## Project Overview

- **URL**: rhythmic-tools.com
- **Stack**: React + TypeScript + Vite, Tailwind CSS, shadcn/ui components
- **Package manager**: bun (preferred) or npm
- **Routing**: React Router v6 with each tool living under its own path prefix

## Architecture

Each tool lives in its own subdomain page (e.g., `/ink` for the journaling companion). Tools have their own:

- **PRD** — Product Requirements Document defining the tool's purpose, features, and scope
- **Design** — Unique UI/UX tailored to the tool's use case

All tools share common branding and design foundations defined in `DESIGN.md`, including typography (Lora serif + Source Sans 3), a warm earthy color palette, and consistent spacing and component patterns.

### Layouts

- **`SiteLayout`** — Wraps the homepage and legal pages (`/`, `/terms`, `/privacy`). Includes `SiteHeader` and `SiteFooter`.
- **`InkLayout`** — Wraps all `/ink/*` routes with its own header, bottom tab nav, and `SiteFooter`.

### Sitewide Components

- **`SiteHeader`** — Top bar with branding and "View Our Tools" link. Used by `SiteLayout`.
- **`SiteFooter`** — Footer with Privacy Policy, Terms of Service, and "Do Not Sell or Share My Personal Information" links. **Must appear on all pages**, including tool-specific layouts like `InkLayout`.

When adding a new tool with its own layout, always include `SiteFooter` so legal links remain accessible.

## Current Tools

### Ink (`/ink`)
A minimalist digital companion for pen-and-paper journaling. Features daily writing prompts, guided journeys, mood tracking, writing space capture, and ambient sounds.

## Development

```bash
bun install
bun run dev
```

## File Structure

- `src/App.tsx` — Route definitions
- `src/pages/ComingSoon.tsx` — The main homepage (coming soon landing)
- `src/pages/Terms.tsx` — Terms of Service page
- `src/pages/Privacy.tsx` — Privacy Policy page
- `src/components/SiteLayout.tsx` — Layout for homepage and legal pages (header + footer)
- `src/components/SiteHeader.tsx` — Sitewide header with "View Our Tools" link
- `src/components/SiteFooter.tsx` — Sitewide footer with legal links (used in both SiteLayout and InkLayout)
- `src/components/InkLayout.tsx` — Layout wrapper for the Ink tool
- `src/pages/` — Page components
- `src/components/` — Reusable components
- `src/components/ui/` — shadcn/ui primitives
- `src/data/` — Static data (prompts, journeys)
- `src/hooks/` — Custom React hooks
- `src/lib/` — Utilities and helpers

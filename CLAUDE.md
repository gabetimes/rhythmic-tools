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

## Current Tools

### Ink (`/ink`)
A minimalist digital companion for pen-and-paper journaling. Features daily writing prompts, guided journeys, mood tracking, writing space capture, and ambient sounds.

## Development

```bash
bun install
bun run dev
```

## File Structure

- `src/pages/ComingSoon.tsx` — The main homepage (coming soon landing)
- `src/components/InkLayout.tsx` — Layout wrapper for the Ink tool
- `src/pages/` — Page components (shared across tools for now)
- `src/components/` — Reusable components
- `src/data/` — Static data (prompts, journeys)
- `src/hooks/` — Custom React hooks
- `src/lib/` — Utilities and helpers

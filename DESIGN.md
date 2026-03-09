# Rhythmic Tools — Design & Style Guide

This guide codifies the branding and design patterns established by the Ink tool as the foundation for all Rhythmic Tools.

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Headings | **Lora** (serif) | 400–700 | All `h1`–`h6`, display text, prompts, and editorial content |
| Body | **Source Sans 3** (sans-serif) | 300–600 | UI labels, descriptions, metadata, and controls |

- Headings use `font-serif` (`'Lora', Georgia, serif`)
- Body text uses `font-sans` (`'Source Sans 3', system-ui, sans-serif`)
- Loaded via Google Fonts in `src/index.css`

## Color Palette

### Light Mode

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | `40 33% 96%` | Page background — warm off-white |
| `--foreground` | `28 22% 14%` | Primary text — deep warm brown |
| `--card` | `38 35% 93%` | Card surfaces — slightly darker than background |
| `--primary` | `152 22% 34%` | Primary actions — muted sage green |
| `--secondary` | `35 28% 87%` | Secondary surfaces — warm beige |
| `--accent` | `16 42% 52%` | Accent highlights — terracotta |
| `--muted-foreground` | `28 12% 48%` | Secondary text — muted warm gray |
| `--border` | `35 18% 84%` | Borders and dividers |

### Dark Mode

| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | `28 20% 8%` | Page background — deep warm black |
| `--foreground` | `40 20% 90%` | Primary text — warm off-white |
| `--card` | `28 18% 12%` | Card surfaces |
| `--primary` | `152 25% 45%` | Primary actions — brighter sage |
| `--accent` | `16 40% 55%` | Accent — brighter terracotta |

### Custom Tokens

| Token | HSL | Usage |
|-------|-----|-------|
| `--ink` | `28 30% 8%` | Deepest dark — text emphasis |
| `--paper` | `42 40% 94%` | Lightest surface — paper-like |
| `--sage-light` | `152 18% 88%` | Light sage tint |
| `--terracotta` | `16 42% 52%` | Warm accent color |
| `--terracotta-light` | `16 35% 85%` | Light terracotta tint |
| `--warm-glow` | `38 55% 70%` | Warm golden tone |

## Spacing & Layout

- **Max content width**: `max-w-lg` (32rem / 512px) — mobile-first, centered layout
- **Container padding**: `px-4` (1rem)
- **Section spacing**: `space-y-6` or `space-y-8` between major sections
- **Border radius**: `--radius: 0.75rem` (rounded-xl/2xl for cards)
- **Card padding**: `p-5` or `p-6`

## Component Patterns

### Cards
- Background: `bg-card` with `border border-border`
- Rounded corners: `rounded-2xl`
- Padding: `p-5` or `p-6`

### Buttons
- **Primary**: `bg-primary text-primary-foreground rounded-2xl` with `hover:opacity-90`
- **Secondary**: `bg-secondary text-secondary-foreground rounded-xl`
- **Ghost/icon**: `p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary`

### Animations
- Staggered fade-up entrance: `animate-fade-up`, `animate-fade-up-delay`, `animate-fade-up-delay-2`
- Duration: `0.6s ease-out` with `0.15s` stagger between elements
- Transitions: `transition-colors`, `transition-opacity`, `transition-transform`

## Navigation

- **Header**: Sticky top bar with app title (serif), utility icons on right
- **Bottom nav**: Fixed bottom tab bar with icon + label, active state uses `text-primary` with heavier stroke
- Both use `backdrop-blur` for translucency

## Design Principles

1. **Warm and calm** — Earthy tones, soft contrasts, nothing jarring
2. **Mobile-first** — Designed as a single-column, phone-width experience
3. **Serif for soul, sans for structure** — Headings and prompts use Lora for warmth; UI chrome uses Source Sans for clarity
4. **Gentle motion** — Subtle fade-up animations create a sense of arriving, not snapping
5. **Dark mode is a first-class citizen** — Colors are carefully mapped so dark mode feels equally intentional, not inverted

# Money Quest — Can You Survive 30 Days?

A mobile-first, cozy pixel-art financial literacy game built for EvoHacks 2.0. You start
independent life with a thin cushion and a small paycheck, then make 30 days of financial
decisions — rent, repairs, surprise bills, social life — to see how you come out the other side.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Zustand (with `localStorage` persistence)
- lucide-react for UI icons

No backend, database, auth, or game engine — everything runs client-side.

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run build       # typecheck + production build
npm run preview     # preview the production build
```

## Current skeleton

- **Welcome** — title screen with Start Game / Continue Game.
- **Character Setup** — pick a starting life situation (balance, income, rent).
- **Game Home** — apartment scene placeholder, stress/energy bars, finance panel, advance the day.
- **Event** — a decision card with 2–3 choices that affect balance/stress/energy.
- **Game Result** — ending (Financially Stable / Scraping By / Fell Into Debt), final stats, and
  the list of decisions made along the way.

Three sample events (`src/data/events.ts`) are wired in on day 3, 10, and 18 to prove out the
loop end-to-end. Progress is saved to `localStorage` under the `money-quest-save` key, so a page
refresh resumes exactly where you left off (use "Continue Game" from the title screen).

Game content (events, characters, endings) lives in `src/data/`, separate from the UI, so adding
more events or starting scenarios doesn't require touching any component code.

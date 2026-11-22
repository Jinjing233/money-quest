# Money Quest — Can You Survive 30 Days?

A mobile-first, cozy pixel-art financial literacy game built for EvoHacks 2.0. You start
independent life with a thin cushion and a small paycheck, then make 30 days of financial
decisions — rent, repairs, surprise bills, social life — to see how you come out the other side.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Zustand (with `localStorage` persistence)
- lucide-react for UI icons

No backend, database, auth, or game engine — everything runs client-side. The UI is bilingual
(English / Chinese), toggleable at any time from the language button.

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
- **Character Setup** — pick a starting life situation (balance, income, rent). Three characters
  are available from the start (Fresh Graduate, Working Student); a fourth, Trust Fund Kid, is a
  locked reward character that unlocks once a save has reached the *Scraping By* or *Fell Into
  Debt* ending, and comes with a one-time "Family Safety Net" passive that covers the first time
  its balance drops below $0.
- **Game Home** — apartment scene, stress/energy bars, finance panel, a Financial Timeline (known
  upcoming bills + full transaction history), and the control to advance the day.
- **Event** — a decision card with 2–3 choices that affect balance/stress/energy, followed by a
  short "Financial Lesson" card explaining the real-world concept behind the choice.
- **Game Result** — ending (Financially Stable / Scraping By / Fell Into Debt), final stats, an
  auto-generated breakdown of income/expenses with written insights, and the list of decisions
  made along the way. Reaching a new unlock also shows a one-time toast here.

24 events (`src/data/events.ts`) are spread across the 30-day run. Progress — including
cross-playthrough unlock history — is saved to `localStorage` under the `money-quest-save` key, so
a page refresh resumes exactly where you left off (use "Continue Game" from the title screen).

Game content (events, characters, endings, unlock rules) lives in `src/data/`, separate from the
UI, so adding more events or starting scenarios doesn't require touching any component code.
English content is canonical; Chinese strings live in `src/i18n/` as a translation overlay keyed
by the same stable ids, so the two stay in sync without duplicating game data.

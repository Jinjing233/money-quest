import type { CharacterVisualState } from "../types/game";

// Same four values as the Developer Agent's CharacterVisualState type
// (src/types/game.ts) -- aliased so sprite paths and this fallback
// stay interchangeable with the real `characterState` field once it's
// actually populated by the store.
export type Mood = CharacterVisualState;

/**
 * Presentational-only fallback. `GameState.characterState` exists in
 * the type now, but as of this writing the store's `initialState` /
 * `advanceDay` / `chooseOption` don't populate it yet (gameStore.ts is
 * mid-edit), so reading it live would show an undefined sprite. Until
 * that lands, derive the same four moods from the stress/energy
 * numbers the store already reliably provides. This stores nothing
 * and defines no new stress/energy rules -- once `characterState` is
 * wired up, replace calls to `deriveMood(stress, energy)` with the
 * store's `characterState` directly and delete this function.
 */
export function deriveMood(stress: number, energy: number): Mood {
  if (energy <= 25) return "exhausted";
  if (stress >= 65) return "stressed";
  if (stress <= 30 && energy >= 60) return "happy";
  return "normal";
}

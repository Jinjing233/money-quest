import type { CharacterVisualState } from "../types/game";

/**
 * Pure state-machine interface for the Pixel Artist Agent: given the current
 * Stress/Energy numbers (and the previously-shown state, for hysteresis so
 * the sprite doesn't flicker between two states on every single point of
 * drift), returns which of the four visual states to render.
 *
 * Priority when more than one condition is true: exhausted > stressed > happy
 * > normal. Each "stressed"/"exhausted"/"happy" state has a wider exit band
 * than its entry band, so a stat sitting right on a threshold doesn't cause
 * the state to flip back and forth day to day.
 */

const EXHAUSTED_ENTER = 25;
const EXHAUSTED_EXIT = 35;
const STRESSED_ENTER = 70;
const STRESSED_EXIT = 60;
const HAPPY_STRESS_ENTER = 30;
const HAPPY_STRESS_EXIT = 35;
const HAPPY_ENERGY_ENTER = 60;
const HAPPY_ENERGY_EXIT = 55;

export function computeCharacterState(
  stress: number,
  energy: number,
  previous: CharacterVisualState = "normal",
): CharacterVisualState {
  const wasExhausted = previous === "exhausted";
  const isExhausted = wasExhausted ? energy < EXHAUSTED_EXIT : energy <= EXHAUSTED_ENTER;
  if (isExhausted) return "exhausted";

  const wasStressed = previous === "stressed";
  const isStressed = wasStressed ? stress > STRESSED_EXIT : stress >= STRESSED_ENTER;
  if (isStressed) return "stressed";

  const wasHappy = previous === "happy";
  const isHappy = wasHappy
    ? stress < HAPPY_STRESS_EXIT && energy > HAPPY_ENERGY_EXIT
    : stress <= HAPPY_STRESS_ENTER && energy >= HAPPY_ENERGY_ENTER;
  if (isHappy) return "happy";

  return "normal";
}

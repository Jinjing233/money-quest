import type { EndingId } from "../types/game";

/** Reward character: unlocks once the player has reached at least one of these endings. */
export const TRUST_FUND_CHARACTER_ID = "trust_fund";
const UNLOCK_ENDINGS: EndingId[] = ["scraping", "debt"];

export function isCharacterUnlocked(characterId: string, achievedEndings: EndingId[]): boolean {
  if (characterId !== TRUST_FUND_CHARACTER_ID) return true;
  return UNLOCK_ENDINGS.some((id) => achievedEndings.includes(id));
}

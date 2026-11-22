import type { EndingId } from "../types/game";

/** Reward character: unlocks once the player has reached both of these endings at least once. */
export const TRUST_FUND_CHARACTER_ID = "trust_fund";
const REQUIRED_ENDINGS: EndingId[] = ["scraping", "debt"];

export function isCharacterUnlocked(characterId: string, achievedEndings: EndingId[]): boolean {
  if (characterId !== TRUST_FUND_CHARACTER_ID) return true;
  return REQUIRED_ENDINGS.every((id) => achievedEndings.includes(id));
}

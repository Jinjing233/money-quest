import type { Character, EndingId } from "../types/game";

export interface EndingInfo {
  id: EndingId;
  title: string;
  message: string;
}

const STABLE_BALANCE_MARGIN = 100;
const STABLE_STRESS_CEILING = 65;

export function resolveEnding(balance: number, stress: number, character: Character): EndingInfo {
  if (balance < 0) {
    return {
      id: "debt",
      title: "Fell Into Debt",
      message:
        "The bills outpaced the paychecks. Even some reasonable-looking choices weren't enough to outrun rent, emergencies, and a thin starting cushion — which is the point: financial stability depends on more than willpower in the moment.",
    };
  }

  if (balance >= character.startingBalance + STABLE_BALANCE_MARGIN && stress <= STABLE_STRESS_CEILING) {
    return {
      id: "stable",
      title: "Financially Stable",
      message:
        "You built a real cushion while keeping your stress in check. That took deliberate tradeoffs — some splurges skipped, some corners cut — not just luck.",
    };
  }

  return {
    id: "scraping",
    title: "Scraping By",
    message:
      "You made it to day 30 without going under, but there was no room for error. One more surprise bill could have changed everything — that fragility is the real story for a lot of people, no matter how carefully they plan.",
  };
}

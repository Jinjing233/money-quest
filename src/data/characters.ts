import type { Character } from "../types/game";

// Figures grounded in Columbus, OH (Franklin County) cost-of-living data.
// See DATA_SOURCES.md for the MIT Living Wage Calculator / BLS CES / rent
// figures these were scaled from, and why each income sits below the full
// living wage for that city.
export const CHARACTERS: Character[] = [
  {
    id: "graduate",
    name: "Fresh Graduate",
    tagline: "Diploma: framed. Bank account: not so much.",
    startingBalance: 600,
    startingEnergy: 70,
    startingStress: 30,
    income: { id: "paycheck", label: "Paycheck", amount: 420, everyDays: 7, nextDueDay: 7 },
    rent: { id: "rent", label: "Rent", amount: 1100, everyDays: 30, nextDueDay: 30 },
  },
  {
    id: "student",
    name: "Working Student",
    tagline: "Splitting rent, splitting attention, barely splitting the difference.",
    startingBalance: 400,
    startingEnergy: 75,
    startingStress: 20,
    income: { id: "parttime-pay", label: "Part-time pay", amount: 300, everyDays: 7, nextDueDay: 7 },
    rent: { id: "shared-rent", label: "Shared rent", amount: 680, everyDays: 30, nextDueDay: 30 },
  },
  {
    id: "gig",
    name: "Gig Worker",
    tagline: "Your schedule is yours. Your income has other plans.",
    startingBalance: 250,
    startingEnergy: 65,
    startingStress: 35,
    income: { id: "gig-earnings", label: "Gig earnings", amount: 350, everyDays: 7, nextDueDay: 7 },
    rent: { id: "rent", label: "Rent", amount: 900, everyDays: 30, nextDueDay: 30 },
  },
  // Unlockable bonus/relaxed-mode character -- see data/unlocks.ts. Still plays the
  // full 30-day event system; the cushion just comes from a bigger head start and
  // one free save, not from events being skipped or outcomes being guaranteed.
  {
    id: "trust_fund",
    name: "Trust Fund Kid",
    tagline: "Parents said take it easy — figure life out first.",
    startingBalance: 2200,
    startingEnergy: 80,
    startingStress: 15,
    income: { id: "family-allowance", label: "Family allowance", amount: 650, everyDays: 7, nextDueDay: 7 },
    rent: { id: "trust-fund-rent", label: "Rent", amount: 1200, everyDays: 30, nextDueDay: 30 },
    hasFamilySafetyNet: true,
  },
];

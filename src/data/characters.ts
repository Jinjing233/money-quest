import type { Character } from "../types/game";

export const CHARACTERS: Character[] = [
  {
    id: "graduate",
    name: "Fresh Graduate",
    tagline: "New job, new apartment, barely any savings.",
    startingBalance: 500,
    startingEnergy: 70,
    startingStress: 30,
    income: { id: "job", label: "Paycheck", amount: 280, everyDays: 7, nextDueDay: 7 },
    rent: { id: "rent", label: "Rent", amount: 800, everyDays: 30, nextDueDay: 30 },
  },
  {
    id: "student",
    name: "Working Student",
    tagline: "Part-time hours, full-time bills.",
    startingBalance: 350,
    startingEnergy: 75,
    startingStress: 20,
    income: { id: "job", label: "Part-time pay", amount: 220, everyDays: 7, nextDueDay: 7 },
    rent: { id: "rent", label: "Shared rent", amount: 650, everyDays: 30, nextDueDay: 30 },
  },
  {
    id: "gig",
    name: "Gig Worker",
    tagline: "Flexible schedule, unpredictable income.",
    startingBalance: 200,
    startingEnergy: 65,
    startingStress: 35,
    income: { id: "job", label: "Gig earnings", amount: 290, everyDays: 7, nextDueDay: 7 },
    rent: { id: "rent", label: "Rent", amount: 700, everyDays: 30, nextDueDay: 30 },
  },
];

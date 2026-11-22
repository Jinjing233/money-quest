import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Character, GamePhase, GameState } from "../types/game";
import { EVENTS } from "../data/events";
import { computeCharacterState } from "../data/characterState";

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const DAILY_STRESS_DRIFT = 1;
const DAILY_ENERGY_DRIFT = -1;
const BURNOUT_STRESS_PENALTY = 1;
const LAST_DAY = 30;
const EMERGENCY_FUND_CUSHION = 60;

interface GameActions {
  goTo: (phase: GamePhase) => void;
  startNewGame: (character: Character) => void;
  advanceDay: () => void;
  chooseOption: (choiceId: string) => void;
  acknowledgeLesson: () => void;
  resetGame: () => void;
  setLanguage: (language: GameState["language"]) => void;
}

const initialState: GameState = {
  phase: "welcome",
  language: "en",
  character: null,
  day: 1,
  balance: 0,
  stress: 0,
  energy: 100,
  characterState: "normal",
  income: null,
  rent: null,
  transactions: [],
  decisionHistory: [],
  activeEvent: null,
  showLesson: false,
  scheduledCharges: [],
  emergencyFundBuilt: false,
  dailyLog: [],
};

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set) => ({
      ...initialState,

      goTo: (phase) => set({ phase }),

      setLanguage: (language) => set({ language }),

      startNewGame: (character) =>
        set({
          phase: "home",
          character,
          day: 1,
          balance: character.startingBalance,
          stress: character.startingStress,
          energy: character.startingEnergy,
          characterState: computeCharacterState(character.startingStress, character.startingEnergy),
          income: { ...character.income },
          rent: { ...character.rent },
          transactions: [],
          decisionHistory: [],
          activeEvent: null,
          showLesson: false,
          scheduledCharges: [],
          emergencyFundBuilt: false,
          dailyLog: [],
        }),

      advanceDay: () =>
        set((state) => {
          if (state.phase !== "home") return state;

          if (state.day >= LAST_DAY) {
            // Sweep any charge that never got a chance to land so nothing silently vanishes.
            if (state.scheduledCharges.length === 0) {
              return { ...state, phase: "result" };
            }
            const sweptIncome = state.scheduledCharges
              .filter((c) => c.amount > 0)
              .reduce((sum, c) => sum + c.amount, 0);
            const sweptExpenses = state.scheduledCharges
              .filter((c) => c.amount < 0)
              .reduce((sum, c) => sum - c.amount, 0);
            const balance = state.scheduledCharges.reduce((sum, charge) => sum + charge.amount, state.balance);
            const dailyLog = [...state.dailyLog];
            const lastEntry = dailyLog[dailyLog.length - 1];
            if (lastEntry && lastEntry.day === state.day) {
              dailyLog[dailyLog.length - 1] = {
                ...lastEntry,
                income: lastEntry.income + sweptIncome,
                expenses: lastEntry.expenses + sweptExpenses,
                balanceAfter: balance,
              };
            }
            return { ...state, balance, scheduledCharges: [], dailyLog, phase: "result" };
          }

          const nextDay = state.day + 1;
          let balance = state.balance;
          const transactions = [...state.transactions];
          let income = state.income;
          let rent = state.rent;
          let dayIncome = 0;
          let dayExpenses = 0;

          if (income && nextDay >= income.nextDueDay) {
            balance += income.amount;
            dayIncome += income.amount;
            transactions.push({ day: nextDay, label: income.label, amount: income.amount, source: { kind: "income", id: income.id } });
            income = { ...income, nextDueDay: income.nextDueDay + income.everyDays };
          }

          if (rent && nextDay >= rent.nextDueDay) {
            balance -= rent.amount;
            dayExpenses += rent.amount;
            transactions.push({ day: nextDay, label: rent.label, amount: -rent.amount, source: { kind: "rent", id: rent.id } });
            rent = { ...rent, nextDueDay: rent.nextDueDay + rent.everyDays };
          }

          const dueCharges = state.scheduledCharges.filter((charge) => charge.day === nextDay);
          const scheduledCharges = state.scheduledCharges.filter((charge) => charge.day !== nextDay);
          for (const charge of dueCharges) {
            balance += charge.amount;
            if (charge.amount >= 0) dayIncome += charge.amount;
            else dayExpenses += -charge.amount;
            transactions.push({ day: nextDay, label: charge.label, amount: charge.amount, source: { kind: "scheduled", id: charge.key } });
          }

          const conditionCtx = {
            balance,
            stress: state.stress,
            energy: state.energy,
            decisionHistory: state.decisionHistory,
            emergencyFundBuilt: state.emergencyFundBuilt,
          };
          const activeEvent =
            EVENTS.find((event) => event.day === nextDay && (!event.condition || event.condition(conditionCtx))) ?? null;
          const burnoutPenalty = state.energy <= 0 ? BURNOUT_STRESS_PENALTY : 0;
          const stressDelta = DAILY_STRESS_DRIFT + burnoutPenalty;
          const stress = clamp(state.stress + stressDelta);
          const energy = clamp(state.energy + DAILY_ENERGY_DRIFT);

          const dailyLog = [
            ...state.dailyLog,
            {
              day: nextDay,
              income: dayIncome,
              expenses: dayExpenses,
              stressDelta,
              energyDelta: DAILY_ENERGY_DRIFT,
              balanceAfter: balance,
            },
          ];

          return {
            ...state,
            day: nextDay,
            balance,
            stress,
            energy,
            characterState: computeCharacterState(stress, energy, state.characterState),
            transactions,
            income,
            rent,
            scheduledCharges,
            activeEvent,
            dailyLog,
            phase: activeEvent ? "event" : "home",
          };
        }),

      chooseOption: (choiceId) =>
        set((state) => {
          const event = state.activeEvent;
          if (!event) return state;
          const choice = event.choices.find((c) => c.id === choiceId);
          if (!choice) return state;

          let balanceChange = choice.effects.balance ?? 0;
          // A self-funded emergency cushion softens the hit of this specific crisis event.
          if (event.id === "urgent-care-bill" && state.emergencyFundBuilt && balanceChange < 0) {
            balanceChange = Math.min(0, balanceChange + EMERGENCY_FUND_CUSHION);
          }

          const transactions = balanceChange
            ? [
                ...state.transactions,
                {
                  day: state.day,
                  label: `${event.title} — ${choice.label}`,
                  amount: balanceChange,
                  source: { kind: "event" as const, id: event.id, choiceId: choice.id },
                },
              ]
            : state.transactions;

          const income =
            state.income && choice.effects.incomeDelta
              ? { ...state.income, amount: state.income.amount + choice.effects.incomeDelta }
              : state.income;

          const rent =
            state.rent && choice.effects.rentDelta
              ? { ...state.rent, amount: Math.max(0, state.rent.amount + choice.effects.rentDelta) }
              : state.rent;

          const scheduledCharges = choice.schedule
            ? [
                ...state.scheduledCharges,
                {
                  day: state.day + choice.schedule.delayDays,
                  label: choice.schedule.label,
                  key: choice.schedule.key,
                  amount: choice.schedule.amount,
                },
              ]
            : state.scheduledCharges;

          const emergencyFundBuilt =
            event.id === "tax-refund" && choiceId === "save" ? true : state.emergencyFundBuilt;

          const balance = state.balance + balanceChange;
          const stress = clamp(state.stress + (choice.effects.stress ?? 0));
          const energy = clamp(state.energy + (choice.effects.energy ?? 0));

          const dailyLog = [...state.dailyLog];
          const lastEntry = dailyLog[dailyLog.length - 1];
          if (lastEntry && lastEntry.day === state.day) {
            dailyLog[dailyLog.length - 1] = {
              ...lastEntry,
              income: lastEntry.income + (balanceChange > 0 ? balanceChange : 0),
              expenses: lastEntry.expenses + (balanceChange < 0 ? -balanceChange : 0),
              stressDelta: lastEntry.stressDelta + (choice.effects.stress ?? 0),
              energyDelta: lastEntry.energyDelta + (choice.effects.energy ?? 0),
              balanceAfter: balance,
              decisionLabel: choice.label,
            };
          }

          return {
            ...state,
            balance,
            stress,
            energy,
            characterState: computeCharacterState(stress, energy, state.characterState),
            transactions,
            income,
            rent,
            scheduledCharges,
            emergencyFundBuilt,
            dailyLog,
            decisionHistory: [
              ...state.decisionHistory,
              {
                day: state.day,
                eventId: event.id,
                choiceId: choice.id,
                eventTitle: event.title,
                choiceLabel: choice.label,
                effects: choice.effects,
                deferred: !!choice.schedule,
              },
            ],
            showLesson: true,
          };
        }),

      acknowledgeLesson: () =>
        set((state) => ({ ...state, activeEvent: null, showLesson: false, phase: "home" })),

      resetGame: () => set((state) => ({ ...initialState, language: state.language })),
    }),
    {
      name: "money-quest-save",
      version: 2,
      // Any save written by an older schema version gets discarded in favor of a fresh
      // start rather than risk rendering with missing/mismatched fields.
      migrate: () => ({ ...initialState }),
    },
  ),
);

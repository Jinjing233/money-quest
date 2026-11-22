import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Character, GamePhase, GameState } from "../types/game";
import { EVENTS } from "../data/events";
import { computeCharacterState } from "../data/characterState";
import { resolveEnding } from "../data/ending";
import { isCharacterUnlocked, TRUST_FUND_CHARACTER_ID } from "../data/unlocks";
import { translateUI } from "../i18n/ui";

const clamp = (value: number) => Math.min(100, Math.max(0, value));

const DAILY_STRESS_DRIFT = 1;
const DAILY_ENERGY_DRIFT = -1;
const BURNOUT_STRESS_PENALTY = 1;
const LAST_DAY = 30;
const EMERGENCY_FUND_CUSHION = 60;
const FAMILY_SAFETY_NET_AMOUNT = 300;

/** Records this run's ending in the save's cross-playthrough history, and flags it when
 * that's the ending that just completes the Trust Fund Kid unlock (see data/unlocks.ts). */
function resolveEndingAndUnlock(state: GameState, balance: number) {
  if (!state.character) return {};
  const ending = resolveEnding(balance, state.stress, state.character);
  const wasUnlocked = isCharacterUnlocked(TRUST_FUND_CHARACTER_ID, state.achievedEndings);
  const achievedEndings = state.achievedEndings.includes(ending.id)
    ? state.achievedEndings
    : [...state.achievedEndings, ending.id];
  const isUnlockedNow = isCharacterUnlocked(TRUST_FUND_CHARACTER_ID, achievedEndings);
  return { achievedEndings, justUnlockedTrustFund: !wasUnlocked && isUnlockedNow };
}

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
  achievedEndings: [],
  familySafetyNetUsed: false,
  justUnlockedTrustFund: false,
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
          familySafetyNetUsed: false,
          justUnlockedTrustFund: false,
        }),

      advanceDay: () =>
        set((state) => {
          if (state.phase !== "home") return state;

          if (state.day >= LAST_DAY) {
            // Sweep any charge that never got a chance to land so nothing silently vanishes.
            if (state.scheduledCharges.length === 0) {
              return { ...state, phase: "result", ...resolveEndingAndUnlock(state, state.balance) };
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
            return {
              ...state,
              balance,
              scheduledCharges: [],
              dailyLog,
              phase: "result",
              ...resolveEndingAndUnlock(state, balance),
            };
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

          let familySafetyNetUsed = state.familySafetyNetUsed;
          let familySafetyNetNote: string | undefined;
          if (state.character?.hasFamilySafetyNet && !familySafetyNetUsed && state.balance >= 0 && balance < 0) {
            balance += FAMILY_SAFETY_NET_AMOUNT;
            dayIncome += FAMILY_SAFETY_NET_AMOUNT;
            familySafetyNetUsed = true;
            transactions.push({
              day: nextDay,
              label: "Family Safety Net",
              amount: FAMILY_SAFETY_NET_AMOUNT,
              source: { kind: "passive", id: "family-safety-net" },
            });
            familySafetyNetNote = translateUI("passive.familySafetyNet.notice", state.language);
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
              note: familySafetyNetNote,
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
            familySafetyNetUsed,
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

          let transactions = balanceChange
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

          let balance = state.balance + balanceChange;
          const stress = clamp(state.stress + (choice.effects.stress ?? 0));
          const energy = clamp(state.energy + (choice.effects.energy ?? 0));

          let familySafetyNetUsed = state.familySafetyNetUsed;
          let familySafetyNetBonus = 0;
          if (state.character?.hasFamilySafetyNet && !familySafetyNetUsed && state.balance >= 0 && balance < 0) {
            familySafetyNetBonus = FAMILY_SAFETY_NET_AMOUNT;
            balance += familySafetyNetBonus;
            familySafetyNetUsed = true;
            transactions = [
              ...transactions,
              {
                day: state.day,
                label: "Family Safety Net",
                amount: familySafetyNetBonus,
                source: { kind: "passive" as const, id: "family-safety-net" },
              },
            ];
          }

          const dailyLog = [...state.dailyLog];
          const lastEntry = dailyLog[dailyLog.length - 1];
          if (lastEntry && lastEntry.day === state.day) {
            dailyLog[dailyLog.length - 1] = {
              ...lastEntry,
              income: lastEntry.income + (balanceChange > 0 ? balanceChange : 0) + familySafetyNetBonus,
              expenses: lastEntry.expenses + (balanceChange < 0 ? -balanceChange : 0),
              stressDelta: lastEntry.stressDelta + (choice.effects.stress ?? 0),
              energyDelta: lastEntry.energyDelta + (choice.effects.energy ?? 0),
              balanceAfter: balance,
              decisionLabel: choice.label,
              note: familySafetyNetBonus ? translateUI("passive.familySafetyNet.notice", state.language) : lastEntry.note,
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
            familySafetyNetUsed,
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

      resetGame: () =>
        set((state) => ({ ...initialState, language: state.language, achievedEndings: state.achievedEndings })),
    }),
    {
      name: "money-quest-save",
      version: 3,
      // Any save written by an older schema version gets discarded in favor of a fresh
      // start rather than risk rendering with missing/mismatched fields.
      migrate: () => ({ ...initialState }),
    },
  ),
);

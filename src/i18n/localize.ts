import type { Character, EndingId, GameEvent, Language, ScheduledCharge, Transaction } from "../types/game";
import { ZH_CHARACTERS, ZH_ENDINGS, ZH_EVENTS, ZH_SCHEDULED_LABELS } from "./zhContent";
import { translateUI } from "./ui";

export function localizeCharacter(character: Character, language: Language): Character {
  if (language === "en") return character;
  const zh = ZH_CHARACTERS[character.id];
  if (!zh) return character;
  return {
    ...character,
    name: zh.name,
    tagline: zh.tagline,
    income: { ...character.income, label: zh.incomeLabel },
    rent: { ...character.rent, label: zh.rentLabel },
  };
}

export function localizeEvent(event: GameEvent, language: Language): GameEvent {
  if (language === "en") return event;
  const zh = ZH_EVENTS[event.id];
  if (!zh) return event;
  return {
    ...event,
    title: zh.title,
    description: zh.description,
    lesson: zh.lesson,
    choices: event.choices.map((choice) => {
      const zhChoice = zh.choices[choice.id];
      return zhChoice ? { ...choice, label: zhChoice.label, detail: zhChoice.detail } : choice;
    }),
  };
}

export function localizeEndingText(endingId: EndingId, title: string, message: string, language: Language) {
  if (language === "en") return { title, message };
  const zh = ZH_ENDINGS[endingId];
  return zh ?? { title, message };
}

/** Re-localizes a recurring-flow label (Paycheck/Rent/...) by its stable RecurringFlow id. */
export function localizeRecurringLabel(id: string, fallbackLabel: string, language: Language): string {
  if (language === "en") return fallbackLabel;
  const byId: Record<string, string> = {
    paycheck: ZH_CHARACTERS.graduate.incomeLabel,
    "parttime-pay": ZH_CHARACTERS.student.incomeLabel,
    "gig-earnings": ZH_CHARACTERS.gig.incomeLabel,
    rent: ZH_CHARACTERS.graduate.rentLabel,
    "shared-rent": ZH_CHARACTERS.student.rentLabel,
    "family-allowance": ZH_CHARACTERS.trust_fund.incomeLabel,
    "trust-fund-rent": ZH_CHARACTERS.trust_fund.rentLabel,
  };
  return byId[id] ?? fallbackLabel;
}

/** Re-localizes a single history/upcoming-bill line using its recorded source, if present. */
export function localizeTransactionLabel(t: Transaction, language: Language): string {
  if (language === "en" || !t.source) return t.label;
  if (t.source.kind === "income" || t.source.kind === "rent") {
    return localizeRecurringLabel(t.source.id, t.label, language);
  }
  if (t.source.kind === "scheduled") {
    return ZH_SCHEDULED_LABELS[t.source.id] ?? t.label;
  }
  if (t.source.kind === "passive") {
    return translateUI("passive.familySafetyNet.label", language);
  }
  if (t.source.kind === "event") {
    const zhEvent = ZH_EVENTS[t.source.id];
    const zhChoice = zhEvent?.choices[t.source.choiceId ?? ""];
    if (zhEvent && zhChoice) return `${zhEvent.title} — ${zhChoice.label}`;
  }
  return t.label;
}

export function localizeScheduledChargeLabel(charge: ScheduledCharge, language: Language): string {
  if (language === "en") return charge.label;
  return ZH_SCHEDULED_LABELS[charge.key] ?? charge.label;
}

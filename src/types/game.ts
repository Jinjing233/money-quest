export type GamePhase = "welcome" | "setup" | "home" | "event" | "result";
export type Language = "en" | "zh";
export type CharacterVisualState = "happy" | "normal" | "stressed" | "exhausted";

export interface StatEffects {
  balance?: number;
  stress?: number;
  energy?: number;
  /** Permanent change to the player's recurring income amount, applied going forward. */
  incomeDelta?: number;
  /** Permanent change to the player's recurring rent amount, applied going forward. */
  rentDelta?: number;
}

export interface ScheduledCharge {
  day: number;
  label: string;
  /** Stable translation key (not shown directly) so the Timeline can re-localize this charge. */
  key: string;
  amount: number;
}

export interface EventChoice {
  id: string;
  label: string;
  detail: string;
  effects: StatEffects;
  /** A one-time charge (or refund) that lands a few days after this choice is made. */
  schedule?: { delayDays: number; amount: number; label: string; key: string };
}

/** What an event's condition function is allowed to look at. */
export interface EventConditionContext {
  balance: number;
  stress: number;
  energy: number;
  decisionHistory: DecisionRecord[];
  emergencyFundBuilt: boolean;
}

export interface GameEvent {
  id: string;
  day: number;
  title: string;
  description: string;
  /** Short, non-preachy takeaway shown once the player has made their choice. */
  lesson: string;
  choices: EventChoice[];
  /**
   * Optional gate: if present and it returns false when `day` is reached, this
   * event is skipped entirely (the day plays out as an ordinary quiet day)
   * instead of always firing. Lets some events react to low balance, high
   * stress, low energy, or an earlier choice.
   */
  condition?: (ctx: EventConditionContext) => boolean;
}

export interface RecurringFlow {
  id: string;
  label: string;
  amount: number;
  everyDays: number;
  nextDueDay: number;
}

export interface Character {
  id: string;
  name: string;
  tagline: string;
  startingBalance: number;
  startingEnergy: number;
  startingStress: number;
  income: RecurringFlow;
  rent: RecurringFlow;
}

export interface TransactionSource {
  kind: "income" | "rent" | "event" | "scheduled";
  /** income/rent: the RecurringFlow id. event/scheduled: the event id or schedule key. */
  id: string;
  choiceId?: string;
}

export interface Transaction {
  day: number;
  label: string;
  amount: number;
  /** Lets views that want it (e.g. the Timeline) re-localize this line at render time. */
  source?: TransactionSource;
}

export interface DecisionRecord {
  day: number;
  eventId: string;
  choiceId: string;
  eventTitle: string;
  choiceLabel: string;
  effects: StatEffects;
  deferred: boolean;
}

export interface DailyLogEntry {
  day: number;
  income: number;
  expenses: number;
  stressDelta: number;
  energyDelta: number;
  balanceAfter: number;
  decisionLabel?: string;
}

export type EndingId = "stable" | "scraping" | "debt";

export interface GameState {
  phase: GamePhase;
  language: Language;
  character: Character | null;
  day: number;
  balance: number;
  stress: number;
  energy: number;
  characterState: CharacterVisualState;
  income: RecurringFlow | null;
  rent: RecurringFlow | null;
  transactions: Transaction[];
  decisionHistory: DecisionRecord[];
  activeEvent: GameEvent | null;
  /** True once the player has chosen for `activeEvent` and is viewing its Financial Lesson. */
  showLesson: boolean;
  scheduledCharges: ScheduledCharge[];
  emergencyFundBuilt: boolean;
  dailyLog: DailyLogEntry[];
}

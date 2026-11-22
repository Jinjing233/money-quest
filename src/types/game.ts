export type GamePhase = "welcome" | "setup" | "home" | "event" | "result";

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
  amount: number;
}

export interface EventChoice {
  id: string;
  label: string;
  detail: string;
  effects: StatEffects;
  /** A one-time charge (or refund) that lands a few days after this choice is made. */
  schedule?: { delayDays: number; amount: number; label: string };
}

export interface GameEvent {
  id: string;
  day: number;
  title: string;
  description: string;
  /** Short, non-preachy takeaway shown once the player has made their choice. */
  lesson: string;
  choices: EventChoice[];
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

export interface Transaction {
  day: number;
  label: string;
  amount: number;
}

export interface DecisionRecord {
  day: number;
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

export interface PendingLesson {
  eventTitle: string;
  lesson: string;
}

export interface GameState {
  phase: GamePhase;
  character: Character | null;
  day: number;
  balance: number;
  stress: number;
  energy: number;
  income: RecurringFlow | null;
  rent: RecurringFlow | null;
  transactions: Transaction[];
  decisionHistory: DecisionRecord[];
  activeEvent: GameEvent | null;
  pendingLesson: PendingLesson | null;
  scheduledCharges: ScheduledCharge[];
  emergencyFundBuilt: boolean;
  dailyLog: DailyLogEntry[];
}

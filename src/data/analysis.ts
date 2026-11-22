import type { DailyLogEntry, DecisionRecord, Transaction } from "../types/game";

export interface EndgameAnalysis {
  totalIncome: number;
  totalExpenses: number;
  netChange: number;
  biggestExpense: { label: string; amount: number; day: number } | null;
  deferredCount: number;
  insights: string[];
}

export function analyzeGame(
  decisionHistory: DecisionRecord[],
  dailyLog: DailyLogEntry[],
  transactions: Transaction[],
  emergencyFundBuilt: boolean,
  finalStress: number,
  finalEnergy: number,
): EndgameAnalysis {
  const totalIncome = dailyLog.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = dailyLog.reduce((sum, d) => sum + d.expenses, 0);
  const netChange = totalIncome - totalExpenses;

  const biggestExpenseTx = transactions.reduce<Transaction | null>(
    (worst, t) => (t.amount < 0 && (worst === null || t.amount < worst.amount) ? t : worst),
    null,
  );
  const biggestExpense = biggestExpenseTx
    ? { label: biggestExpenseTx.label, amount: Math.abs(biggestExpenseTx.amount), day: biggestExpenseTx.day }
    : null;

  const deferredCount = decisionHistory.filter((d) => d.deferred).length;

  const insights: string[] = [];

  insights.push(
    `Over 30 days you brought in $${totalIncome} and spent $${totalExpenses} — a net ${netChange >= 0 ? "gain" : "loss"} of $${Math.abs(netChange)}.`,
  );

  if (biggestExpense) {
    insights.push(
      `Your single biggest hit was "${biggestExpense.label}" on Day ${biggestExpense.day} at $${biggestExpense.amount}.`,
    );
  }

  if (deferredCount > 0) {
    insights.push(
      `You put off ${deferredCount} payment${deferredCount > 1 ? "s" : ""} instead of paying upfront — it came back with extra cost attached, the same way a real late fee or payment plan works.`,
    );
  } else {
    insights.push(
      "You never put off a bill this run — everything was settled as soon as it came due, which kept surprise costs off your plate.",
    );
  }

  if (emergencyFundBuilt) {
    insights.push("Building an emergency fund early paid off later: it directly softened the urgent care bill when it hit.");
  } else {
    insights.push("You didn't set aside an emergency fund this run — when an unplanned bill landed, there was nothing cushioning it.");
  }

  if (finalEnergy <= 20) {
    insights.push(
      `You finished running on empty (Energy ${finalEnergy}/100) — in this game, burnout isn't just a feeling, it quietly adds to stress too.`,
    );
  } else if (finalEnergy >= 60) {
    insights.push(`You kept a sustainable pace (Energy ${finalEnergy}/100) instead of constantly trading rest for money.`);
  }

  if (finalStress >= 80) {
    insights.push(`Stress ended high (${finalStress}/100) — even a decent balance doesn't erase the cost of constant pressure.`);
  }

  return { totalIncome, totalExpenses, netChange, biggestExpense, deferredCount, insights };
}

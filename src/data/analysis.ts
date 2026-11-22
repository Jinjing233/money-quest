import type { DailyLogEntry, DecisionRecord, Language, Transaction } from "../types/game";
import { localizeTransactionLabel } from "../i18n/localize";

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
  language: Language,
): EndgameAnalysis {
  const totalIncome = dailyLog.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = dailyLog.reduce((sum, d) => sum + d.expenses, 0);
  const netChange = totalIncome - totalExpenses;

  const biggestExpenseTx = transactions.reduce<Transaction | null>(
    (worst, t) => (t.amount < 0 && (worst === null || t.amount < worst.amount) ? t : worst),
    null,
  );
  const biggestExpense = biggestExpenseTx
    ? {
        label: localizeTransactionLabel(biggestExpenseTx, language),
        amount: Math.abs(biggestExpenseTx.amount),
        day: biggestExpenseTx.day,
      }
    : null;

  const deferredCount = decisionHistory.filter((d) => d.deferred).length;

  const insights: string[] =
    language === "zh"
      ? buildInsightsZh({ totalIncome, totalExpenses, netChange, biggestExpense, deferredCount, emergencyFundBuilt, finalStress, finalEnergy })
      : buildInsightsEn({ totalIncome, totalExpenses, netChange, biggestExpense, deferredCount, emergencyFundBuilt, finalStress, finalEnergy });

  return { totalIncome, totalExpenses, netChange, biggestExpense, deferredCount, insights };
}

interface InsightInputs {
  totalIncome: number;
  totalExpenses: number;
  netChange: number;
  biggestExpense: { label: string; amount: number; day: number } | null;
  deferredCount: number;
  emergencyFundBuilt: boolean;
  finalStress: number;
  finalEnergy: number;
}

function buildInsightsEn({
  totalIncome,
  totalExpenses,
  netChange,
  biggestExpense,
  deferredCount,
  emergencyFundBuilt,
  finalStress,
  finalEnergy,
}: InsightInputs): string[] {
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

  return insights;
}

function buildInsightsZh({
  totalIncome,
  totalExpenses,
  netChange,
  biggestExpense,
  deferredCount,
  emergencyFundBuilt,
  finalStress,
  finalEnergy,
}: InsightInputs): string[] {
  const insights: string[] = [];

  insights.push(
    `这30天里你总共收入了$${totalIncome}，支出了$${totalExpenses}——净${netChange >= 0 ? "结余" : "亏损"}$${Math.abs(netChange)}。`,
  );

  if (biggestExpense) {
    insights.push(`你最大的一笔支出是第${biggestExpense.day}天的"${biggestExpense.label}"，花了$${biggestExpense.amount}。`);
  }

  if (deferredCount > 0) {
    insights.push(
      `你有${deferredCount}笔账单选择了拖后付款——结果都额外多花了钱，和现实里的滞纳金、分期付款一个道理。`,
    );
  } else {
    insights.push("这一局你没有拖欠过任何账单——账单一到就处理掉了，没给自己留下意外惊吓。");
  }

  if (emergencyFundBuilt) {
    insights.push("提前建立的应急基金后来派上了用场：它直接缓解了那笔急诊账单的冲击。");
  } else {
    insights.push("这一局你没有攒应急基金——等意外账单真的到来时，没有任何缓冲。");
  }

  if (finalEnergy <= 20) {
    insights.push(`你最后几乎油尽灯枯（精力 ${finalEnergy}/100）——在这个游戏里，精力耗尽不只是感觉问题，它还会悄悄推高压力。`);
  } else if (finalEnergy >= 60) {
    insights.push(`你全程节奏把控得不错（精力 ${finalEnergy}/100），没有一直拿休息换钱。`);
  }

  if (finalStress >= 80) {
    insights.push(`压力值最终偏高（${finalStress}/100）——哪怕余额还不错，持续的压力带来的代价也无法抹去。`);
  }

  return insights;
}

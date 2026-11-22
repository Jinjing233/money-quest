import type { Language } from "../types/game";

/** Centralized UI-chrome strings. Nothing game-content-related lives here — see localize.ts for that. */
export const UI_STRINGS = {
  "welcome.title": { en: "Money Quest", zh: "金钱大冒险" },
  "welcome.subtitle": { en: "Can you survive 30 days?", zh: "你能撑过 30 天吗？" },
  "welcome.body": {
    en: "You're starting out on your own with a small paycheck and fewer savings than you'd like. Every choice has a cost. Make it to day 30.",
    zh: "你刚开始独立生活，工资不多，存款更少。每个决定都有代价。撑到第 30 天。",
  },
  "welcome.start": { en: "Start Game", zh: "开始游戏" },
  "welcome.continue": { en: "Continue Game", zh: "继续游戏" },

  "setup.heading": { en: "Choose Your Starting Life", zh: "选择你的起点人生" },
  "setup.startingBalance": { en: "Starting balance", zh: "起始余额" },
  "setup.income": { en: "Income", zh: "收入" },
  "setup.rent": { en: "Rent", zh: "房租" },
  "setup.choose": { en: "Choose", zh: "选择" },
  "setup.perWeek": { en: "/wk", zh: "/周" },
  "setup.perMonth": { en: "/mo", zh: "/月" },

  "home.stress": { en: "Stress", zh: "压力" },
  "home.energy": { en: "Energy", zh: "精力" },
  "home.nextDay": { en: "Next Day →", zh: "下一天 →" },
  "home.seeResults": { en: "See My Results", zh: "查看结果" },

  "lesson.title": { en: "Financial Lesson", zh: "理财小课堂" },
  "lesson.continue": { en: "Continue", zh: "继续" },

  "finance.balance": { en: "Balance", zh: "余额" },
  "finance.recentActivity": { en: "Recent activity", zh: "最近动态" },
  "finance.nothingYet": { en: "Nothing yet.", zh: "暂时还没有记录。" },

  "timeline.button": { en: "Timeline", zh: "时间线" },
  "timeline.title": { en: "Financial Timeline", zh: "财务时间线" },
  "timeline.upcoming": { en: "Known upcoming bills", zh: "已知的未来账单" },
  "timeline.noUpcoming": { en: "Nothing scheduled right now.", zh: "目前没有已排期的账单。" },
  "timeline.history": { en: "Full history", zh: "完整记录" },
  "timeline.noHistory": { en: "Nothing yet.", zh: "暂时还没有记录。" },
  "timeline.close": { en: "Close", zh: "关闭" },

  "result.gameOver": { en: "Day 30 — Game Over", zh: "第 30 天 — 游戏结束" },
  "result.balance": { en: "Balance", zh: "余额" },
  "result.stress": { en: "Stress", zh: "压力" },
  "result.energy": { en: "Energy", zh: "精力" },
  "result.financialStory": { en: "Your financial story", zh: "你的财务故事" },
  "result.totalIncome": { en: "Total income", zh: "总收入" },
  "result.totalExpenses": { en: "Total expenses", zh: "总支出" },
  "result.keyDecisions": { en: "Key decisions", zh: "关键决定" },
  "result.chose": { en: "chose", zh: "选择了" },
  "result.playAgain": { en: "Play Again", zh: "再玩一次" },

  "lang.toggle": { en: "中文", zh: "English" },
} as const;

export type UIStringKey = keyof typeof UI_STRINGS;

export function translateUI(key: UIStringKey, language: Language): string {
  return UI_STRINGS[key][language];
}

import { PixelCard } from "./PixelCard";
import type { Language, RecurringFlow, Transaction } from "../types/game";
import { translateUI, translateUITemplate, formatRecurringAmount } from "../i18n/ui";
import { localizeRecurringLabel, localizeTransactionLabel } from "../i18n/localize";

interface FinancePanelProps {
  balance: number;
  income: RecurringFlow | null;
  rent: RecurringFlow | null;
  transactions: Transaction[];
  language: Language;
}

export function FinancePanel({ balance, income, rent, transactions, language }: FinancePanelProps) {
  const t = (key: Parameters<typeof translateUI>[0]) => translateUI(key, language);
  const recent = [...transactions].reverse().slice(0, 5);

  return (
    <PixelCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/pixel/ui/coin.png" alt="" className="pixel-img h-5 w-5" />
          <span className="font-pixel text-[10px] text-brown">{t("finance.balance")}</span>
        </div>
        <span className="font-pixel text-sm text-brown">${balance}</span>
      </div>

      {income && (
        <p className="mt-2 flex items-center gap-1 text-sm text-brown-light">
          <img src="/assets/pixel/ui/income.png" alt="" className="pixel-img h-4 w-4" />
          {localizeRecurringLabel(income.id, income.label, language)}: {formatRecurringAmount(income.amount, income.everyDays, language)}
        </p>
      )}

      {rent && (
        <p className="mt-1 flex items-center gap-1 text-sm text-brown-light">
          <img src="/assets/pixel/ui/bill.png" alt="" className="pixel-img h-4 w-4" />
          {localizeRecurringLabel(rent.id, rent.label, language)}: {formatRecurringAmount(rent.amount, rent.everyDays, language)}
        </p>
      )}

      <div className="mt-3 border-t-2 border-dashed border-brown/40 pt-2">
        <p className="font-pixel text-[9px] text-brown/70">{t("finance.recentActivity")}</p>
        {recent.length === 0 ? (
          <p className="mt-1 text-sm text-brown-light">{t("finance.nothingYet")}</p>
        ) : (
          <ul className="mt-1 space-y-1 text-sm">
            {recent.map((tx, i) => (
              <li key={`${tx.day}-${i}`} className="flex justify-between text-brown-light">
                <span>
                  {translateUITemplate("common.day", language, { day: tx.day })} · {localizeTransactionLabel(tx, language)}
                </span>
                <span
                  className={`inline-flex items-center gap-1 ${tx.amount < 0 ? "text-stress" : "text-sage-dark"}`}
                >
                  <img
                    src={`/assets/pixel/ui/${tx.amount < 0 ? "expense" : "income"}.png`}
                    alt=""
                    className="pixel-img h-3 w-3"
                  />
                  {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PixelCard>
  );
}

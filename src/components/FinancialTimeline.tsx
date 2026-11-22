import { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { PixelCard } from "./PixelCard";
import { PixelButton } from "./PixelButton";
import { translateUI, translateUITemplate } from "../i18n/ui";
import { localizeRecurringLabel, localizeScheduledChargeLabel, localizeTransactionLabel } from "../i18n/localize";

export function FinancialTimeline() {
  const [isOpen, setIsOpen] = useState(false);
  const { day, income, rent, scheduledCharges, transactions, language } = useGameStore();
  const t = (key: Parameters<typeof translateUI>[0]) => translateUI(key, language);

  const upcoming = [
    income ? { day: income.nextDueDay, label: localizeRecurringLabel(income.id, income.label, language), amount: income.amount } : null,
    rent ? { day: rent.nextDueDay, label: localizeRecurringLabel(rent.id, rent.label, language), amount: -rent.amount } : null,
    ...scheduledCharges.map((charge) => ({
      day: charge.day,
      label: localizeScheduledChargeLabel(charge, language),
      amount: charge.amount,
    })),
  ]
    .filter((entry): entry is { day: number; label: string; amount: number } => entry !== null)
    .sort((a, b) => a.day - b.day);

  const history = [...transactions].reverse();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-pixel pixel-border fixed right-3 top-3 z-20 bg-cream-light px-2 py-2 text-[9px] text-brown shadow-sm"
      >
        {t("timeline.button")}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <PixelCard className="max-h-[80vh] w-full max-w-sm overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-pixel flex items-center gap-2 text-xs text-brown">
                <img src="/assets/pixel/ui/bill.png" alt="" className="pixel-img h-5 w-5" />
                {t("timeline.title")}
              </h2>
              <button onClick={() => setIsOpen(false)} className="font-pixel text-[10px] text-brown-light">
                ✕
              </button>
            </div>
            <p className="mt-1 text-xs text-brown-light">{translateUITemplate("common.dayOf30", language, { day })}</p>

            <div className="mt-3 border-t-2 border-dashed border-brown/40 pt-2">
              <p className="font-pixel text-[9px] text-brown/70">{t("timeline.upcoming")}</p>
              {upcoming.length === 0 ? (
                <p className="mt-1 text-sm text-brown-light">{t("timeline.noUpcoming")}</p>
              ) : (
                <ul className="mt-1 space-y-1 text-sm">
                  {upcoming.map((item, i) => (
                    <li key={i} className="flex justify-between text-brown-light">
                      <span>
                        {translateUITemplate("common.day", language, { day: item.day })} · {item.label}
                      </span>
                      <span className={item.amount < 0 ? "text-stress" : "text-sage-dark"}>
                        {item.amount < 0 ? "-" : "+"}${Math.abs(item.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-3 border-t-2 border-dashed border-brown/40 pt-2">
              <p className="font-pixel text-[9px] text-brown/70">{t("timeline.history")}</p>
              {history.length === 0 ? (
                <p className="mt-1 text-sm text-brown-light">{t("timeline.noHistory")}</p>
              ) : (
                <ul className="mt-1 space-y-1 text-sm">
                  {history.map((tx, i) => (
                    <li key={`${tx.day}-${i}`} className="flex justify-between text-brown-light">
                      <span>
                        {translateUITemplate("common.day", language, { day: tx.day })} · {localizeTransactionLabel(tx, language)}
                      </span>
                      <span className={tx.amount < 0 ? "text-stress" : "text-sage-dark"}>
                        {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <PixelButton className="mt-4 w-full" onClick={() => setIsOpen(false)}>
              {t("timeline.close")}
            </PixelButton>
          </PixelCard>
        </div>
      )}
    </>
  );
}

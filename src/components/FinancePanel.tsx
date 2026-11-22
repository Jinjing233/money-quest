import { PixelCard } from "./PixelCard";
import type { RecurringFlow, Transaction } from "../types/game";

interface FinancePanelProps {
  balance: number;
  income: RecurringFlow | null;
  rent: RecurringFlow | null;
  transactions: Transaction[];
}

export function FinancePanel({ balance, income, rent, transactions }: FinancePanelProps) {
  const recent = [...transactions].reverse().slice(0, 5);

  return (
    <PixelCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/assets/pixel/ui/coin.png" alt="" className="pixel-img h-5 w-5" />
          <span className="font-pixel text-[10px] text-brown">Balance</span>
        </div>
        <span className="font-pixel text-sm text-brown">${balance}</span>
      </div>

      {income && (
        <p className="mt-2 flex items-center gap-1 text-sm text-brown-light">
          <img src="/assets/pixel/ui/income.png" alt="" className="pixel-img h-4 w-4" />
          {income.label}: ${income.amount} every {income.everyDays} days
        </p>
      )}

      {rent && (
        <p className="mt-1 flex items-center gap-1 text-sm text-brown-light">
          <img src="/assets/pixel/ui/bill.png" alt="" className="pixel-img h-4 w-4" />
          {rent.label}: ${rent.amount} every {rent.everyDays} days
        </p>
      )}

      <div className="mt-3 border-t-2 border-dashed border-brown/40 pt-2">
        <p className="font-pixel text-[9px] text-brown/70">Recent activity</p>
        {recent.length === 0 ? (
          <p className="mt-1 text-sm text-brown-light">Nothing yet.</p>
        ) : (
          <ul className="mt-1 space-y-1 text-sm">
            {recent.map((t, i) => (
              <li key={`${t.day}-${i}`} className="flex justify-between text-brown-light">
                <span>
                  Day {t.day} · {t.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 ${t.amount < 0 ? "text-stress" : "text-sage-dark"}`}
                >
                  <img
                    src={`/assets/pixel/ui/${t.amount < 0 ? "expense" : "income"}.png`}
                    alt=""
                    className="pixel-img h-3 w-3"
                  />
                  {t.amount < 0 ? "-" : "+"}${Math.abs(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PixelCard>
  );
}

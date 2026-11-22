import type { DailyLogEntry } from "../types/game";

interface DailySummaryBannerProps {
  entry: DailyLogEntry | undefined;
}

export function DailySummaryBanner({ entry }: DailySummaryBannerProps) {
  if (!entry || entry.day <= 1) return null;

  const net = entry.income - entry.expenses;
  const netLabel = net === 0 ? "±$0" : net > 0 ? `+$${net}` : `-$${Math.abs(net)}`;

  const stressLabel =
    entry.stressDelta === 0 ? "" : entry.stressDelta > 0 ? ` · Stress +${entry.stressDelta}` : ` · Stress ${entry.stressDelta}`;
  const energyLabel =
    entry.energyDelta === 0 ? "" : entry.energyDelta > 0 ? ` · Energy +${entry.energyDelta}` : ` · Energy ${entry.energyDelta}`;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-10 flex justify-center px-4 pt-2">
      <div className="enter-up pixel-border pointer-events-auto flex items-center gap-1.5 bg-cream-light px-3 py-1.5 text-xs text-brown">
        <img src="/assets/pixel/ui/coin.png" alt="" className="pixel-img h-3.5 w-3.5 shrink-0" />
        Day {entry.day}: {netLabel}
        {stressLabel}
        {energyLabel}
      </div>
    </div>
  );
}

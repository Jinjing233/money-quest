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
      <div className="pointer-events-auto rounded-sm border-2 border-brown bg-cream-light/95 px-3 py-1 text-xs text-brown shadow-sm">
        Day {entry.day}: {netLabel}
        {stressLabel}
        {energyLabel}
      </div>
    </div>
  );
}

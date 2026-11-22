import type { DailyLogEntry } from "../types/game";
import { useGameStore } from "../store/gameStore";
import { translateUI, translateUITemplate } from "../i18n/ui";

interface DailySummaryBannerProps {
  entry: DailyLogEntry | undefined;
}

export function DailySummaryBanner({ entry }: DailySummaryBannerProps) {
  const language = useGameStore((s) => s.language);
  const t = (key: Parameters<typeof translateUI>[0]) => translateUI(key, language);

  if (!entry || entry.day <= 1) return null;

  const net = entry.income - entry.expenses;
  const netLabel = net === 0 ? "±$0" : net > 0 ? `+$${net}` : `-$${Math.abs(net)}`;

  const stressLabel =
    entry.stressDelta === 0 ? "" : entry.stressDelta > 0 ? ` · ${t("home.stress")} +${entry.stressDelta}` : ` · ${t("home.stress")} ${entry.stressDelta}`;
  const energyLabel =
    entry.energyDelta === 0 ? "" : entry.energyDelta > 0 ? ` · ${t("home.energy")} +${entry.energyDelta}` : ` · ${t("home.energy")} ${entry.energyDelta}`;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-10 flex flex-col items-center gap-1 px-4 pt-2">
      <div className="enter-up pixel-border pointer-events-auto flex items-center gap-1.5 bg-cream-light px-3 py-1.5 text-xs text-brown">
        <img src="/assets/pixel/ui/coin.png" alt="" className="pixel-img h-3.5 w-3.5 shrink-0" />
        {translateUITemplate("common.day", language, { day: entry.day })}: {netLabel}
        {stressLabel}
        {energyLabel}
      </div>
      {entry.note && (
        <div className="enter-up pixel-border pixel-border-sage pointer-events-auto bg-cream-light px-3 py-1.5 text-xs text-sage-dark">
          {entry.note}
        </div>
      )}
    </div>
  );
}

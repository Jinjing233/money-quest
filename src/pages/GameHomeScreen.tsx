import { useGameStore } from "../store/gameStore";
import { ApartmentScene } from "../components/ApartmentScene";
import { StatusBar } from "../components/StatusBar";
import { FinancePanel } from "../components/FinancePanel";
import { PixelButton } from "../components/PixelButton";
import { translateUI, translateUITemplate } from "../i18n/ui";

export function GameHomeScreen() {
  const { day, character, characterState, stress, energy, balance, income, rent, transactions, language, advanceDay } =
    useGameStore();
  const t = (key: Parameters<typeof translateUI>[0]) => translateUI(key, language);

  return (
    <div className="mx-auto flex min-h-full max-w-sm flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-xs text-brown">{translateUITemplate("common.dayOf30", language, { day })}</h1>
      </div>

      <ApartmentScene character={character} characterState={characterState} stress={stress} />

      <div className="flex flex-col gap-3">
        <StatusBar icon="/assets/pixel/ui/stress.png" label={t("home.stress")} value={stress} colorClassName="bg-stress" />
        <StatusBar icon="/assets/pixel/ui/energy.png" label={t("home.energy")} value={energy} colorClassName="bg-energy" />
      </div>

      <FinancePanel balance={balance} income={income} rent={rent} transactions={transactions} language={language} />

      <PixelButton className="mt-auto" onClick={advanceDay}>
        {day >= 30 ? t("home.seeResults") : t("home.nextDay")}
      </PixelButton>
    </div>
  );
}

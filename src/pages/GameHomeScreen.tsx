import { useGameStore } from "../store/gameStore";
import { ApartmentScene } from "../components/ApartmentScene";
import { StatusBar } from "../components/StatusBar";
import { FinancePanel } from "../components/FinancePanel";
import { PixelButton } from "../components/PixelButton";

export function GameHomeScreen() {
  const { day, character, stress, energy, balance, income, rent, transactions, advanceDay } = useGameStore();

  return (
    <div className="mx-auto flex min-h-full max-w-sm flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-xs text-brown">Day {day} / 30</h1>
      </div>

      <ApartmentScene character={character} stress={stress} energy={energy} />

      <div className="flex flex-col gap-3">
        <StatusBar icon="/assets/pixel/ui/stress.png" label="Stress" value={stress} colorClassName="bg-stress" />
        <StatusBar icon="/assets/pixel/ui/energy.png" label="Energy" value={energy} colorClassName="bg-energy" />
      </div>

      <FinancePanel balance={balance} income={income} rent={rent} transactions={transactions} />

      <PixelButton className="mt-auto" onClick={advanceDay}>
        {day >= 30 ? "See My Results" : "Next Day →"}
      </PixelButton>
    </div>
  );
}

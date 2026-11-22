import { useState } from "react";
import { useGameStore } from "./store/gameStore";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { CharacterSetupScreen } from "./pages/CharacterSetupScreen";
import { GameHomeScreen } from "./pages/GameHomeScreen";
import { EventScreen } from "./pages/EventScreen";
import { GameResultScreen } from "./pages/GameResultScreen";
import { FinancialTimeline } from "./components/FinancialTimeline";
import { DailySummaryBanner } from "./components/DailySummaryBanner";

export default function App() {
  const [atTitle, setAtTitle] = useState(true);
  const { phase, character, dailyLog, goTo, startNewGame, resetGame } = useGameStore();

  if (atTitle) {
    return (
      <WelcomeScreen
        hasSave={character !== null}
        onStart={() => {
          resetGame();
          goTo("setup");
          setAtTitle(false);
        }}
        onContinue={() => setAtTitle(false)}
      />
    );
  }

  switch (phase) {
    case "setup":
      return <CharacterSetupScreen onSelect={startNewGame} />;
    case "home":
      return (
        <>
          <DailySummaryBanner entry={dailyLog[dailyLog.length - 1]} />
          <FinancialTimeline />
          <GameHomeScreen />
        </>
      );
    case "event":
      return <EventScreen />;
    case "result":
      return <GameResultScreen onPlayAgain={() => setAtTitle(true)} />;
    default:
      return <CharacterSetupScreen onSelect={startNewGame} />;
  }
}

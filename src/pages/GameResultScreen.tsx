import { useGameStore } from "../store/gameStore";
import { resolveEnding } from "../data/ending";
import { analyzeGame } from "../data/analysis";
import { PixelCard } from "../components/PixelCard";
import { PixelButton } from "../components/PixelButton";

interface GameResultScreenProps {
  onPlayAgain: () => void;
}

export function GameResultScreen({ onPlayAgain }: GameResultScreenProps) {
  const { character, balance, stress, energy, decisionHistory, dailyLog, transactions, emergencyFundBuilt } =
    useGameStore();

  if (!character) return null;

  const ending = resolveEnding(balance, stress, character);
  const analysis = analyzeGame(decisionHistory, dailyLog, transactions, emergencyFundBuilt, stress, energy);

  return (
    <div className="mx-auto flex min-h-full max-w-sm flex-col gap-4 px-4 py-8">
      <PixelCard sage className="enter-up text-center">
        <p className="font-pixel text-[10px] text-sage-dark">Day 30 — Game Over</p>
        <img
          src={`/assets/pixel/scenes/ending_${ending.id}.png`}
          alt=""
          className="pixel-img mx-auto mt-2 h-32 w-32"
        />
        <h1 className="font-pixel mt-2 text-sm text-brown">{ending.title}</h1>
        <p className="mt-3 text-left text-sm leading-relaxed text-brown-light">{ending.message}</p>
      </PixelCard>

      <PixelCard className="enter-up enter-delay-1">
        <dl className="grid grid-cols-3 gap-2 text-center text-xs text-brown-light">
          <div>
            <img src="/assets/pixel/ui/coin.png" alt="" className="pixel-img mx-auto h-4 w-4" />
            <dt className="font-pixel mt-1 text-[9px]">Balance</dt>
            <dd className="mt-1">${balance}</dd>
          </div>
          <div>
            <img src="/assets/pixel/ui/stress.png" alt="" className="pixel-img mx-auto h-4 w-4" />
            <dt className="font-pixel mt-1 text-[9px]">Stress</dt>
            <dd className="mt-1">{stress}/100</dd>
          </div>
          <div>
            <img src="/assets/pixel/ui/energy.png" alt="" className="pixel-img mx-auto h-4 w-4" />
            <dt className="font-pixel mt-1 text-[9px]">Energy</dt>
            <dd className="mt-1">{energy}/100</dd>
          </div>
        </dl>
      </PixelCard>

      <PixelCard className="enter-up enter-delay-2">
        <p className="font-pixel text-[9px] text-brown/70">Your financial story</p>
        <dl className="mt-2 grid grid-cols-2 gap-1 text-xs text-brown-light">
          <dt className="flex items-center gap-1">
            <img src="/assets/pixel/ui/income.png" alt="" className="pixel-img h-3 w-3" />
            Total income
          </dt>
          <dd className="text-right text-sage-dark">+${analysis.totalIncome}</dd>
          <dt className="flex items-center gap-1">
            <img src="/assets/pixel/ui/expense.png" alt="" className="pixel-img h-3 w-3" />
            Total expenses
          </dt>
          <dd className="text-right text-stress">-${analysis.totalExpenses}</dd>
        </dl>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-brown-light">
          {analysis.insights.map((line, i) => (
            <li key={i} className="border-l-4 border-sage/60 pl-2">
              {line}
            </li>
          ))}
        </ul>
      </PixelCard>

      <PixelCard className="enter-up enter-delay-3">
        <p className="font-pixel text-[9px] text-brown/70">Key decisions</p>
        <ul className="mt-2 space-y-2 text-sm text-brown-light">
          {decisionHistory.map((record, i) => (
            <li key={i}>
              <span className="font-pixel text-[10px] text-brown">Day {record.day}</span> ·{" "}
              {record.eventTitle}: chose "{record.choiceLabel}"
            </li>
          ))}
        </ul>
      </PixelCard>

      <PixelButton onClick={onPlayAgain}>Play Again</PixelButton>
    </div>
  );
}

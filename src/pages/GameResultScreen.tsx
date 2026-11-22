import { useGameStore } from "../store/gameStore";
import { resolveEnding } from "../data/ending";
import { analyzeGame } from "../data/analysis";
import { EVENTS } from "../data/events";
import { PixelCard } from "../components/PixelCard";
import { PixelButton } from "../components/PixelButton";
import { CharacterSprite } from "../components/CharacterSprite";
import type { EndingId, CharacterVisualState } from "../types/game";
import { translateUI, translateUITemplate } from "../i18n/ui";
import { localizeEndingText, localizeEvent } from "../i18n/localize";

interface GameResultScreenProps {
  onPlayAgain: () => void;
}

// A gentle, non-shaming mood per ending -- "Fell Into Debt" gets a
// standing, concerned pose, never an exaggerated or mocking one.
const ENDING_MOOD: Record<EndingId, CharacterVisualState> = {
  stable: "happy",
  scraping: "normal",
  debt: "stressed",
};

export function GameResultScreen({ onPlayAgain }: GameResultScreenProps) {
  const { character, balance, stress, energy, decisionHistory, dailyLog, transactions, emergencyFundBuilt, language } =
    useGameStore();

  if (!character) return null;

  const t = (key: Parameters<typeof translateUI>[0]) => translateUI(key, language);
  const ending = resolveEnding(balance, stress, character);
  const endingText = localizeEndingText(ending.id, ending.title, ending.message, language);
  const analysis = analyzeGame(decisionHistory, dailyLog, transactions, emergencyFundBuilt, stress, energy, language);

  return (
    <div className="mx-auto flex min-h-full max-w-sm flex-col gap-4 px-4 py-8">
      <PixelCard sage className="enter-up text-center">
        <p className="font-pixel text-[10px] text-sage-dark">{t("result.gameOver")}</p>
        <div className="relative mx-auto mt-2 h-32 w-32">
          <img src={`/assets/pixel/scenes/ending_${ending.id}.png`} alt="" className="pixel-img h-32 w-32" />
          <CharacterSprite
            characterId={character.id}
            mood={ENDING_MOOD[ending.id]}
            className="absolute bottom-3 left-1/2 w-10 -translate-x-1/2"
          />
        </div>
        <h1 className="font-pixel mt-2 text-sm text-brown">{endingText.title}</h1>
        <p className="mt-3 text-left text-sm leading-relaxed text-brown-light">{endingText.message}</p>
      </PixelCard>

      <PixelCard className="enter-up enter-delay-1">
        <dl className="grid grid-cols-3 gap-2 text-center text-xs text-brown-light">
          <div>
            <img src="/assets/pixel/ui/coin.png" alt="" className="pixel-img mx-auto h-4 w-4" />
            <dt className="font-pixel mt-1 text-[9px]">{t("result.balance")}</dt>
            <dd className="mt-1">${balance}</dd>
          </div>
          <div>
            <img src="/assets/pixel/ui/stress.png" alt="" className="pixel-img mx-auto h-4 w-4" />
            <dt className="font-pixel mt-1 text-[9px]">{t("result.stress")}</dt>
            <dd className="mt-1">{stress}/100</dd>
          </div>
          <div>
            <img src="/assets/pixel/ui/energy.png" alt="" className="pixel-img mx-auto h-4 w-4" />
            <dt className="font-pixel mt-1 text-[9px]">{t("result.energy")}</dt>
            <dd className="mt-1">{energy}/100</dd>
          </div>
        </dl>
      </PixelCard>

      <PixelCard className="enter-up enter-delay-2">
        <p className="font-pixel text-[9px] text-brown/70">{t("result.financialStory")}</p>
        <dl className="mt-2 grid grid-cols-2 gap-1 text-xs text-brown-light">
          <dt className="flex items-center gap-1">
            <img src="/assets/pixel/ui/income.png" alt="" className="pixel-img h-3 w-3" />
            {t("result.totalIncome")}
          </dt>
          <dd className="text-right text-sage-dark">+${analysis.totalIncome}</dd>
          <dt className="flex items-center gap-1">
            <img src="/assets/pixel/ui/expense.png" alt="" className="pixel-img h-3 w-3" />
            {t("result.totalExpenses")}
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
        <p className="font-pixel text-[9px] text-brown/70">{t("result.keyDecisions")}</p>
        <ul className="mt-2 space-y-2 text-sm text-brown-light">
          {decisionHistory.map((record, i) => {
            const sourceEvent = EVENTS.find((e) => e.id === record.eventId);
            const localized = sourceEvent ? localizeEvent(sourceEvent, language) : null;
            const choice = localized?.choices.find((c) => c.id === record.choiceId);
            const eventTitle = localized?.title ?? record.eventTitle;
            const choiceLabel = choice?.label ?? record.choiceLabel;
            return (
              <li key={i}>
                <span className="font-pixel text-[10px] text-brown">
                  {translateUITemplate("common.day", language, { day: record.day })}
                </span>{" "}
                · {eventTitle}: {t("result.chose")} "{choiceLabel}"
              </li>
            );
          })}
        </ul>
      </PixelCard>

      <PixelButton onClick={onPlayAgain}>{t("result.playAgain")}</PixelButton>
    </div>
  );
}

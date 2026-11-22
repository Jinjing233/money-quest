import { CHARACTERS } from "../data/characters";
import { isCharacterUnlocked } from "../data/unlocks";
import type { Character } from "../types/game";
import { PixelButton } from "../components/PixelButton";
import { PixelCard } from "../components/PixelCard";
import { useGameStore } from "../store/gameStore";
import { localizeCharacter } from "../i18n/localize";
import { translateUI } from "../i18n/ui";

interface CharacterSetupScreenProps {
  onSelect: (character: Character) => void;
}

export function CharacterSetupScreen({ onSelect }: CharacterSetupScreenProps) {
  const language = useGameStore((s) => s.language);
  const achievedEndings = useGameStore((s) => s.achievedEndings);
  const t = (key: Parameters<typeof translateUI>[0]) => translateUI(key, language);

  return (
    <div className="flex min-h-full flex-col items-center gap-6 px-4 py-10">
      <h1 className="font-pixel text-base text-brown">{t("setup.heading")}</h1>

      <div className="flex w-full max-w-sm flex-col gap-4">
        {CHARACTERS.map((character) => {
          const shown = localizeCharacter(character, language);
          const unlocked = isCharacterUnlocked(character.id, achievedEndings);

          if (!unlocked) {
            return (
              <PixelCard key={character.id} className="opacity-60">
                <div className="flex items-center gap-3">
                  <img
                    src={`/assets/pixel/characters/character_${character.id}_portrait.png`}
                    alt={shown.name}
                    className="pixel-img h-16 w-16 shrink-0 object-contain grayscale"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                  <div>
                    <h2 className="font-pixel text-xs text-brown">
                      {shown.name} · <span className="text-brown-light">{t("setup.locked.badge")}</span>
                    </h2>
                    <p className="mt-1 text-sm text-brown-light">{t("setup.locked.hint")}</p>
                  </div>
                </div>
              </PixelCard>
            );
          }

          return (
            <PixelCard key={character.id}>
              <div className="flex items-center gap-3">
                <img
                  src={`/assets/pixel/characters/character_${character.id}_portrait.png`}
                  alt={shown.name}
                  className="pixel-img h-16 w-16 shrink-0 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/pixel/characters/character_graduate_portrait.png";
                  }}
                />
                <div>
                  <h2 className="font-pixel text-xs text-brown">{shown.name}</h2>
                  <p className="mt-1 text-sm text-brown-light">{shown.tagline}</p>
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-1 text-xs text-brown-light">
                <dt className="flex items-center gap-1">
                  <img src="/assets/pixel/ui/savings.png" alt="" className="pixel-img h-3 w-3" />
                  {t("setup.startingBalance")}
                </dt>
                <dd className="text-right">${character.startingBalance}</dd>
                <dt className="flex items-center gap-1">
                  <img src="/assets/pixel/ui/income.png" alt="" className="pixel-img h-3 w-3" />
                  {shown.income.label}
                </dt>
                <dd className="text-right">
                  ${character.income.amount} / {character.income.everyDays}{t("unit.days")}
                </dd>
                <dt className="flex items-center gap-1">
                  <img src="/assets/pixel/ui/bill.png" alt="" className="pixel-img h-3 w-3" />
                  {shown.rent.label}
                </dt>
                <dd className="text-right">
                  ${character.rent.amount} / {character.rent.everyDays}{t("unit.days")}
                </dd>
              </dl>
              <PixelButton className="mt-4 w-full" onClick={() => onSelect(character)}>
                {t("setup.choose")}
              </PixelButton>
            </PixelCard>
          );
        })}
      </div>
    </div>
  );
}

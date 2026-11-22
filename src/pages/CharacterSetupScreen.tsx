import { CHARACTERS } from "../data/characters";
import type { Character } from "../types/game";
import { PixelButton } from "../components/PixelButton";
import { PixelCard } from "../components/PixelCard";

interface CharacterSetupScreenProps {
  onSelect: (character: Character) => void;
}

export function CharacterSetupScreen({ onSelect }: CharacterSetupScreenProps) {
  return (
    <div className="flex min-h-full flex-col items-center gap-6 px-4 py-10">
      <h1 className="font-pixel text-base text-brown">Choose Your Starting Life</h1>

      <div className="flex w-full max-w-sm flex-col gap-4">
        {CHARACTERS.map((character) => (
          <PixelCard key={character.id}>
            <div className="flex items-center gap-3">
              <img
                src={`/assets/pixel/characters/character_${character.id}_portrait.png`}
                alt={character.name}
                className="pixel-img h-16 w-16 shrink-0"
              />
              <div>
                <h2 className="font-pixel text-xs text-brown">{character.name}</h2>
                <p className="mt-1 text-sm text-brown-light">{character.tagline}</p>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-1 text-xs text-brown-light">
              <dt className="flex items-center gap-1">
                <img src="/assets/pixel/ui/savings.png" alt="" className="pixel-img h-3 w-3" />
                Starting balance
              </dt>
              <dd className="text-right">${character.startingBalance}</dd>
              <dt className="flex items-center gap-1">
                <img src="/assets/pixel/ui/income.png" alt="" className="pixel-img h-3 w-3" />
                Income
              </dt>
              <dd className="text-right">
                ${character.income.amount} / {character.income.everyDays}d
              </dd>
              <dt className="flex items-center gap-1">
                <img src="/assets/pixel/ui/bill.png" alt="" className="pixel-img h-3 w-3" />
                Rent
              </dt>
              <dd className="text-right">
                ${character.rent.amount} / {character.rent.everyDays}d
              </dd>
            </dl>
            <PixelButton className="mt-4 w-full" onClick={() => onSelect(character)}>
              Choose
            </PixelButton>
          </PixelCard>
        ))}
      </div>
    </div>
  );
}

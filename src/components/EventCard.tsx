import { useState } from "react";
import type { GameEvent } from "../types/game";
import { useGameStore } from "../store/gameStore";
import { PixelCard } from "./PixelCard";
import { PixelButton } from "./PixelButton";
import { eventCategoryIconPath } from "./eventCategoryIcons";
import { translateUITemplate } from "../i18n/ui";

interface EventCardProps {
  event: GameEvent;
  onChoose: (choiceId: string) => void;
}

const SELECT_FEEDBACK_MS = 160;

export function EventCard({ event, onChoose }: EventCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const character = useGameStore((state) => state.character);
  const language = useGameStore((state) => state.language);

  const handleChoose = (choiceId: string) => {
    if (selectedId) return;
    setSelectedId(choiceId);
    window.setTimeout(() => onChoose(choiceId), SELECT_FEEDBACK_MS);
  };

  return (
    <PixelCard sage className="mx-auto w-full max-w-sm break-words">
      <div className="flex items-center gap-2">
        <img src={eventCategoryIconPath(event.id)} alt="" className="pixel-img h-6 w-6 shrink-0" />
        <p className="font-pixel text-[10px] text-sage-dark">{translateUITemplate("common.day", language, { day: event.day })}</p>
        {character && (
          <img
            src={`/assets/pixel/characters/character_${character.id}_portrait.png`}
            alt=""
            className="pixel-img ml-auto h-9 w-9 shrink-0 object-contain"
          />
        )}
      </div>
      <h2 className="font-pixel mt-2 text-sm leading-relaxed text-brown">{event.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-brown-light">{event.description}</p>

      <div className="mt-4 flex flex-col gap-2">
        {event.choices.map((choice) => (
          <PixelButton
            key={choice.id}
            variant="secondary"
            disabled={selectedId !== null && selectedId !== choice.id}
            selected={selectedId === choice.id}
            className="text-left normal-case"
            onClick={() => handleChoose(choice.id)}
          >
            <span className="block font-pixel text-[11px] leading-relaxed">{choice.label}</span>
            <span className="mt-1 block text-xs font-normal leading-snug text-brown-light">
              {choice.detail}
            </span>
          </PixelButton>
        ))}
      </div>
    </PixelCard>
  );
}

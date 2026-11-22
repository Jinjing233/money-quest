import { useEffect, useState } from "react";
import type { CharacterVisualState } from "../types/game";

interface CharacterSpriteProps {
  characterId: string;
  mood: CharacterVisualState;
  className?: string;
}

const FRAME_MS = 650;

/** A 2-frame idle loop over the mood sprite pair, paused when the
 * viewer asked for reduced motion (frame 0 is always a valid resting pose). */
export function CharacterSprite({ characterId, mood, className = "" }: CharacterSpriteProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setFrame(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), FRAME_MS);
    return () => window.clearInterval(id);
  }, [mood, characterId]);

  return (
    <img
      src={`/assets/pixel/characters/character_${characterId}_${mood}_${frame}.png`}
      alt=""
      className={`pixel-img ${className}`}
    />
  );
}

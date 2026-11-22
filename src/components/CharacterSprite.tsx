import { useEffect, useState, type CSSProperties } from "react";
import type { CharacterVisualState } from "../types/game";

interface CharacterSpriteProps {
  characterId: string;
  mood: CharacterVisualState;
  className?: string;
  style?: CSSProperties;
}

const FRAME_MS = 650;

/** A 2-frame idle loop over the mood sprite pair, paused when the
 * viewer asked for reduced motion (frame 0 is always a valid resting pose). */
export function CharacterSprite({ characterId, mood, className = "", style }: CharacterSpriteProps) {
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
      className={`pixel-img object-contain ${className}`}
      style={style}
      // Placeholder for characters without art yet (e.g. a newly-unlocked bonus
      // character) -- falls back to an existing sprite set rather than a broken image.
      onError={(e) => {
        if (characterId !== "graduate") {
          e.currentTarget.src = `/assets/pixel/characters/character_graduate_${mood}_${frame}.png`;
        }
      }}
    />
  );
}

import { useEffect, useState, type CSSProperties } from "react";
import type { CharacterVisualState } from "../types/game";
import { CharacterSprite } from "./CharacterSprite";

interface CharacterTurnaroundProps {
  characterId: string;
  fallbackMood: CharacterVisualState;
  className?: string;
  style?: CSSProperties;
}

const FRAME_MS = 220;
const FRAME_COUNT = 8;

// Characters with a real 8-direction turnaround set staged by
// integrate_character.py (public/assets/pixel/characters/{id}_directions/).
// Gig Worker still has only the old flat idle art, so it falls back to the
// regular mood-based idle loop instead of a fabricated turnaround.
const HAS_DIRECTIONS = new Set(["graduate", "student", "trust_fund"]);

/** Loops a character's 8-direction turnaround set as a continuous
 * "show every angle" animation -- used on the result screen in place of a
 * single static pose. Paused on frame 0 when the viewer asked for reduced
 * motion. Falls back to the normal 2-frame idle mood sprite for any
 * character without a direction set yet. */
export function CharacterTurnaround({ characterId, fallbackMood, className = "", style }: CharacterTurnaroundProps) {
  const [frame, setFrame] = useState(0);
  const hasDirections = HAS_DIRECTIONS.has(characterId);

  useEffect(() => {
    if (!hasDirections) return;
    setFrame(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % FRAME_COUNT), FRAME_MS);
    return () => window.clearInterval(id);
  }, [characterId, hasDirections]);

  if (!hasDirections) {
    return <CharacterSprite characterId={characterId} mood={fallbackMood} className={className} style={style} />;
  }

  return (
    <img
      src={`/assets/pixel/characters/${characterId}_directions/frame_${frame}.png`}
      alt=""
      className={`pixel-img object-contain ${className}`}
      style={style}
    />
  );
}

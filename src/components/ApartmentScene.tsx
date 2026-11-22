import type { Character, CharacterVisualState } from "../types/game";
import { CharacterSprite } from "./CharacterSprite";

interface ApartmentSceneProps {
  character: Character | null;
  characterState: CharacterVisualState;
  stress: number;
}

// V4: a single pre-made background image (public/assets/pixel/scenes/
// apartment_room_v4.webp, user-approved, composition locked -- not
// regenerated or redrawn here). ROOM_WIDTH/HEIGHT are that file's own
// native pixel dimensions, used only to (a) lock the container's aspect
// ratio so the image is never stretched/cropped, and (b) convert the
// character's stand spot -- picked by eye on the rug, see the report --
// from that same pixel coordinate space into a percentage position.
const ROOM_WIDTH = 1448;
const ROOM_HEIGHT = 1086;
// centerX/footY pin the sprite's horizontal center and ground-contact
// line -- not its top-left corner -- so a sprite's actual rendered
// height (which varies per character: 32x32 for the flat-style ones,
// 32x44 / 38x44 / 28x44 for the new taller PixelLab art) never changes
// where its feet land. The image is never forced to a square box (that
// would stretch a non-square source); width is set and height follows
// the source's own aspect ratio automatically. Same spot/scale for
// every character -- not tuned per-character -- so this is the one
// place to adjust if a given character ever looks off.
// w went 150 -> 195 (+30%, within the requested 20-35% range) to read
// better against the room's furniture; still well clear of the desk,
// sofa and armchair on either side of the rug at this width.
const CHARACTER_SPOT = { centerX: 725, footY: 780, w: 195 };

export function ApartmentScene({ character, characterState, stress }: ApartmentSceneProps) {
  const moody = stress >= 60;

  return (
    <div
      className="pixel-border relative w-full overflow-hidden"
      style={{ aspectRatio: `${ROOM_WIDTH} / ${ROOM_HEIGHT}` }}
      role="img"
      aria-label="Pixel art apartment room"
    >
      <img
        src="/assets/pixel/scenes/apartment_room_v4.webp"
        alt=""
        className="pixel-img absolute inset-0 h-full w-full"
        style={{ filter: moody ? "brightness(0.9) saturate(0.85)" : undefined }}
      />

      {character && (
        <CharacterSprite
          characterId={character.id}
          mood={characterState}
          className="absolute -translate-x-1/2 drop-shadow-sm"
          style={{
            left: `${(CHARACTER_SPOT.centerX / ROOM_WIDTH) * 100}%`,
            bottom: `${((ROOM_HEIGHT - CHARACTER_SPOT.footY) / ROOM_HEIGHT) * 100}%`,
            width: `${(CHARACTER_SPOT.w / ROOM_WIDTH) * 100}%`,
          }}
        />
      )}
    </div>
  );
}

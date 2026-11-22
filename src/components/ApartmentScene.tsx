import type { Character } from "../types/game";
import { CharacterSprite } from "./CharacterSprite";
import { deriveMood } from "./characterMood";

interface ApartmentSceneProps {
  character: Character | null;
  stress: number;
  energy: number;
}

const env = (name: string) => `/assets/pixel/environment/${name}.png`;
const pattern = (name: string) => `/assets/pixel/patterns/${name}.png`;

export function ApartmentScene({ character, stress, energy }: ApartmentSceneProps) {
  const moody = stress >= 60;
  const mood = deriveMood(stress, energy);

  return (
    <div
      className="pixel-border relative h-64 w-full overflow-hidden sm:h-72"
      role="img"
      aria-label="Pixel art apartment room"
    >
      {/* wallpaper */}
      <div
        className="pixel-img absolute inset-x-0 top-0 h-[70%]"
        style={{
          backgroundImage: `url(${pattern("wallpaper_tile.png")})`,
          backgroundSize: "32px 32px",
          imageRendering: "pixelated",
          filter: moody ? "brightness(0.9) saturate(0.85)" : undefined,
        }}
      />
      {/* floor */}
      <div
        className="pixel-img absolute inset-x-0 bottom-0 h-[30%]"
        style={{
          backgroundImage: `url(${pattern("floor_tile.png")})`,
          backgroundSize: "32px 32px",
          imageRendering: "pixelated",
        }}
      />
      <div className="absolute inset-x-0 top-[68%] h-[4%] bg-sage-dark/70" />

      <img src={env("window")} alt="" className="pixel-img absolute left-[5%] top-[5%] w-[18%]" />
      <img src={env("calendar")} alt="" className="pixel-img absolute left-[27%] top-[6%] w-[13%]" />
      <img src={env("wall_art")} alt="" className="pixel-img absolute left-[74%] top-[6%] w-[15%]" />

      <img src={env("rug")} alt="" className="pixel-img absolute bottom-[5%] left-[14%] w-[46%]" />
      <img src={env("cabinet")} alt="" className="pixel-img absolute bottom-[6%] left-[2%] w-[12%]" />
      <img src={env("mug")} alt="" className="pixel-img absolute bottom-[34%] left-[3.5%] w-[5%]" />
      <img src={env("bed")} alt="" className="pixel-img absolute bottom-[4%] right-[2%] w-[34%]" />
      <img src={env("book_stack")} alt="" className="pixel-img absolute bottom-[5%] right-[1%] w-[9%]" />
      <img src={env("desk")} alt="" className="pixel-img absolute bottom-[7%] left-[36%] w-[24%]" />
      <img src={env("laptop")} alt="" className="pixel-img absolute bottom-[22%] left-[41%] w-[10%]" />
      <img src={env("chair")} alt="" className="pixel-img absolute bottom-[5%] left-[48%] w-[11%]" />
      <img src={env("lamp")} alt="" className="pixel-img absolute bottom-[30%] left-[38%] w-[8%]" />
      <img src={env("plant")} alt="" className="pixel-img absolute bottom-[6%] right-[38%] w-[11%]" />

      {character && (
        <CharacterSprite
          characterId={character.id}
          mood={mood}
          className="absolute bottom-[6%] left-[20%] w-[12%] drop-shadow-sm"
        />
      )}
    </div>
  );
}

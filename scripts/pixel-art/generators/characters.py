"""Generate the three playable characters: a 32x32 front-standing
sprite plus a 64x64 select-screen portrait for each, all sharing one
draw routine so the three stay stylistically identical and only their
outfit/hair colors differ, per the brief:

    A (graduate): green top, brown pants
    B (student):  blue top, dark pants
    C (gig):      orange-red top, light pants

The portrait is literally a cropped, 2x nearest-neighbor upscale of the
head+shoulders of the same sprite (see canvas.make_portrait) -- so
there is no separate portrait drawing to keep in sync.

Run from the project root:
    python scripts/pixel-art/generators/characters.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from PIL import Image  # noqa: E402

from canvas import PixelCanvas, make_portrait  # noqa: E402
from palette import PALETTE as P  # noqa: E402

TOOLS_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = TOOLS_DIR.parents[1]
OUT_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "characters"
PREVIEW_DIR = TOOLS_DIR / "previews"

SIZE = 32
OUTLINE = P["brown_dark"]


def draw_character(hair: tuple, hair_highlight: tuple, outfit: tuple, outfit_shadow: tuple, pants: tuple) -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)

    # head: hair silhouette carved by a smaller face circle -> bowl-cut
    c.circle(16, 11, 9, hair)
    c.circle(16, 13, 7, P["skin"])
    c.recolor(7, 2, 15, 9, hair, hair_highlight)          # hair highlight, upper-left light
    c.recolor(9, 9, 22, 11, P["skin"], hair)               # bangs over the forehead
    c.recolor(10, 12, 13, 15, P["skin"], P["skin_light"])  # face highlight, upper-left

    # eyes + sparkle
    for ex in (12, 19):
        c.rect(ex, 14, ex + 1, 15, OUTLINE)
    c.set(12, 14, P["cream_light"])
    c.set(19, 14, P["cream_light"])

    # blush cheeks
    c.set(11, 16, P["coral"])
    c.set(20, 16, P["coral"])

    # mouth
    c.rect(15, 18, 16, 18, OUTLINE)

    # body: top, shadow, sleeves + hands
    c.rect(11, 21, 20, 27, outfit)
    c.rect(17, 24, 20, 27, outfit_shadow)
    c.rect(9, 22, 10, 26, outfit)
    c.rect(21, 22, 22, 26, outfit)
    c.rect(9, 26, 10, 27, P["skin"])
    c.rect(21, 26, 22, 27, P["skin"])

    # legs + shoes
    c.rect(12, 28, 14, 29, pants)
    c.rect(17, 28, 19, 29, pants)
    c.rect(11, 30, 14, 30, OUTLINE)
    c.rect(17, 30, 20, 30, OUTLINE)

    c.auto_outline(OUTLINE)
    return c


CHARACTERS = {
    # id matches src/data/characters.ts so these can be wired up by id.
    "graduate": dict(
        hair=P["brown"], hair_highlight=P["brown_light"],
        outfit=P["sage"], outfit_shadow=P["sage_dark"], pants=P["brown"],
    ),
    "student": dict(
        hair=P["brown_dark"], hair_highlight=P["brown"],
        outfit=P["sky"], outfit_shadow=P["sky_dark"], pants=P["brown_dark"],
    ),
    "gig": dict(
        hair=P["brown_light"], hair_highlight=P["cream_light"],
        outfit=P["coral"], outfit_shadow=P["coral_dark"], pants=P["cream_light"],
    ),
}


def main() -> None:
    for char_id, colors in CHARACTERS.items():
        sprite = draw_character(**colors)
        sprite_path = sprite.save(OUT_DIR / f"character_{char_id}.png")
        sprite.save_preview(PREVIEW_DIR / f"character_{char_id}_preview.png")

        portrait_img = make_portrait(sprite.to_image(), box=(0, 0, 32, 24), scale=2, canvas_size=(64, 64))
        portrait_path = OUT_DIR / f"character_{char_id}_portrait.png"
        portrait_path.parent.mkdir(parents=True, exist_ok=True)
        portrait_img.save(portrait_path, format="PNG")
        portrait_img.resize(
            (portrait_img.width * 4, portrait_img.height * 4), resample=Image.NEAREST
        ).save(PREVIEW_DIR / f"character_{char_id}_portrait_preview.png")

        print(f"{char_id}: {sprite_path.name}  {portrait_path.name}")


if __name__ == "__main__":
    main()

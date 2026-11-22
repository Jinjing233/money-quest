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

Also generates a 2-frame mood variant per character -- happy / normal
/ stressed / exhausted -- for the in-apartment character sprite. These
reuse the exact same base draw routine and color recipe; only a few
regions (eyes, mouth, one arm, head offset) change per mood, so the
four moods stay visibly the same character. Frame 0/1 is a tiny idle
loop (a 1-2px shift), not a full animation.

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

MOODS = ("happy", "normal", "stressed", "exhausted")
FRAMES = (0, 1)


def draw_character(
    hair: tuple, hair_highlight: tuple, outfit: tuple, outfit_shadow: tuple, pants: tuple,
    mood: str = "normal", frame: int = 0,
) -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE)

    # exhausted: the whole head slumps down a couple of pixels; frame 1 nods a bit further.
    head_drop = 0
    if mood == "exhausted":
        head_drop = 2 + frame
    hcy, fcy = 11 + head_drop, 13 + head_drop

    # head: hair silhouette carved by a smaller face circle -> bowl-cut
    c.circle(16, hcy, 9, hair)
    c.circle(16, fcy, 7, P["skin"])
    c.recolor(7, 2 + head_drop, 15, 9 + head_drop, hair, hair_highlight)
    c.recolor(9, fcy - 4, 22, fcy - 2, P["skin"], hair)               # bangs
    c.recolor(10, fcy - 1, 13, fcy + 2, P["skin"], P["skin_light"])   # face highlight

    eye_y = fcy + 1
    if mood == "exhausted":
        # thin half-closed lines instead of open eyes
        c.rect(12, eye_y, 13, eye_y, OUTLINE)
        c.rect(19, eye_y, 20, eye_y, OUTLINE)
    else:
        for ex in (12, 19):
            c.rect(ex, eye_y, ex + 1, eye_y + 1, OUTLINE)
        c.set(12, eye_y, P["cream_light"])
        c.set(19, eye_y, P["cream_light"])

    if mood == "stressed":
        c.set(12, eye_y - 2, OUTLINE)
        c.set(19, eye_y - 2, OUTLINE)

    # blush cheeks (skip on exhausted -- a tired face reads better without them)
    if mood != "exhausted":
        c.set(11, fcy + 3, P["coral"])
        c.set(20, fcy + 3, P["coral"])

    mouth_y = fcy + 5
    if mood == "happy":
        c.rect(14, mouth_y, 17, mouth_y, OUTLINE)
        c.set(14, mouth_y - 1, OUTLINE)
        c.set(17, mouth_y - 1, OUTLINE)
    elif mood == "stressed":
        c.rect(14, mouth_y, 15, mouth_y, OUTLINE)
        c.rect(16, mouth_y - 1, 17, mouth_y - 1, OUTLINE)
    elif mood == "exhausted":
        c.set(15, mouth_y, OUTLINE)
    else:
        c.rect(15, mouth_y, 16, mouth_y, OUTLINE)

    body_top = 21 + head_drop
    body_bot = 27 + head_drop

    # body: top, shadow
    c.rect(11, body_top, 20, body_bot, outfit)
    c.rect(17, body_top + 3, 20, body_bot, outfit_shadow)

    if mood == "stressed":
        # left arm stays put; right arm rises along the outside edge of
        # the head to a hand resting at the temple -- the universal
        # "overwhelmed" pose. frame 1 nudges the hand up a pixel.
        c.rect(9, body_top, 10, body_top + 4, outfit)
        c.rect(23, body_top - 9 - frame, 25, body_top + 1, outfit)
        c.rect(23, body_top - 13 - frame, 26, body_top - 9 - frame, P["skin"])
    else:
        # happy: both arms raised in a little cheer, higher still on frame 1.
        # exhausted: arms droop. normal: a tiny 1px idle breathing bob.
        if mood == "happy":
            lift = 3 + frame
        elif mood == "exhausted":
            lift = -1
        else:
            lift = -frame
        c.rect(9, body_top + 1 - lift, 10, body_top + 5 - lift, outfit)
        c.rect(21, body_top + 1 - lift, 22, body_top + 5 - lift, outfit)
        c.rect(9, body_top + 5 - lift, 10, body_top + 6 - lift, P["skin"])
        c.rect(21, body_top + 5 - lift, 22, body_top + 6 - lift, P["skin"])

    # legs + shoes (fixed to the floor regardless of mood/frame)
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

        for mood in MOODS:
            for frame in FRAMES:
                mood_sprite = draw_character(**colors, mood=mood, frame=frame)
                name = f"character_{char_id}_{mood}_{frame}"
                mood_sprite.save(OUT_DIR / f"{name}.png")
                mood_sprite.save_preview(PREVIEW_DIR / f"{name}_preview.png")
        print(f"{char_id}: + {len(MOODS)} moods x {len(FRAMES)} frames")


if __name__ == "__main__":
    main()

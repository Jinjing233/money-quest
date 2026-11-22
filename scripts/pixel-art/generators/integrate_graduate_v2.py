"""Final Art Integration -- Fresh Graduate only.

This does NOT draw anything. It only:
1. Crops the 8 PixelLab turnaround frames (already copied verbatim into
   scripts/pixel-art/pixellab_src/characters/graduate/) to one shared
   bounding box (the union of all 8 frames' own content -- i.e. only
   trims transparent padding, identical crop rect for every frame so
   they stay mutually aligned for any future use).
2. Stages that cropped 8-frame set at public/assets/pixel/characters/
   graduate_directions/ -- NOT wired into any component. Nothing in
   the game currently has an 8-direction movement system, and the
   brief is explicit: don't build one just to use these. They're saved
   for later.
3. Copies ONE frame (frame_1 -- the clean front-facing pose) over the
   graduate's existing portrait + all 8 mood/frame sprite slots. There
   is no per-mood art in this set (it's a rotation, not an expression
   sheet), so every mood/frame slot gets the same idle image, which is
   the documented safe fallback for "no dedicated art for this slot yet".

Run from the project root:
    python scripts/pixel-art/generators/integrate_graduate_v2.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parents[3]
SRC_DIR = PROJECT_ROOT / "scripts" / "pixel-art" / "pixellab_src" / "characters" / "graduate"
CHAR_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "characters"
DIRECTIONS_OUT = CHAR_DIR / "graduate_directions"

FRONT_FRAME_INDEX = 1
MOODS = ("happy", "normal", "stressed", "exhausted")
FRAMES = (0, 1)


def main() -> None:
    frames = [Image.open(SRC_DIR / f"frame_{i}.png").convert("RGBA") for i in range(8)]

    # union bbox across all 8 -- trims only transparent padding, same
    # rect for every frame so the set stays aligned with itself.
    x0s, y0s, x1s, y1s = [], [], [], []
    for f in frames:
        bbox = f.getbbox()
        x0s.append(bbox[0]); y0s.append(bbox[1]); x1s.append(bbox[2]); y1s.append(bbox[3])
    union_box = (min(x0s), min(y0s), max(x1s), max(y1s))
    print("union bbox (lossless crop rect):", union_box)

    DIRECTIONS_OUT.mkdir(parents=True, exist_ok=True)
    cropped = []
    for i, f in enumerate(frames):
        c = f.crop(union_box)
        c.save(DIRECTIONS_OUT / f"frame_{i}.png")
        cropped.append(c)
    print(f"staged 8 direction frames -> {DIRECTIONS_OUT} (not wired into any component)")

    idle = cropped[FRONT_FRAME_INDEX]
    idle.save(CHAR_DIR / "character_graduate_portrait.png")
    for mood in MOODS:
        for frame_n in FRAMES:
            idle.save(CHAR_DIR / f"character_graduate_{mood}_{frame_n}.png")
    print("replaced character_graduate_portrait.png and all 8 mood/frame sprites with the idle frame")


if __name__ == "__main__":
    main()

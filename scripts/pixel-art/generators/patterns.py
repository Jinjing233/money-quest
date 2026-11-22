"""Generate seamless, tileable background textures for the apartment:
a subtle wallpaper dot-grid and a wood-plank floor. 32x32 so they land
in the "environment" size family, but they're meant to be CSS
`background-repeat: repeat` tiles, not placed sprites -- they live in
their own public/assets/pixel/patterns/ folder.

Both are built so the pattern repeats exactly across the 32px edge
(every interval divides 32), so there's no visible seam when tiled.

Run from the project root:
    python scripts/pixel-art/generators/patterns.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from canvas import PixelCanvas  # noqa: E402
from palette import PALETTE as P  # noqa: E402

TOOLS_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = TOOLS_DIR.parents[1]
OUT_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "patterns"
PREVIEW_DIR = TOOLS_DIR / "previews"

SIZE = 32


def wallpaper_tile() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE, background=P["cream"])
    # a faint dot grid, 8px pitch -- divides 32 evenly, so it tiles cleanly
    for y in range(0, SIZE, 8):
        for x in range(0, SIZE, 8):
            c.set(x + 3, y + 3, P["cream_light"])
            c.set(x + 4, y + 3, P["cream_light"])
            c.set(x + 3, y + 4, P["cream_light"])
    return c


def floor_tile() -> PixelCanvas:
    c = PixelCanvas(SIZE, SIZE, background=P["brown_light"])
    # horizontal planks, 8px pitch; a seam line + a couple of grain flecks per plank
    for y in range(0, SIZE, 8):
        c.rect(0, y, SIZE - 1, y, P["brown"])
        c.set(6, y + 4, P["brown"])
        c.set(20, y + 3, P["brown"])
    return c


PATTERNS = {
    "wallpaper_tile": wallpaper_tile,
    "floor_tile": floor_tile,
}


def main() -> None:
    for name, builder in PATTERNS.items():
        canvas = builder()
        saved = canvas.save(OUT_DIR / f"{name}.png")
        canvas.save_preview(PREVIEW_DIR / f"{name}_preview.png")
        # also save a 3x3 tiled preview so seams are easy to eyeball
        tiled = PixelCanvas(SIZE * 3, SIZE * 3)
        img = canvas.to_image()
        tiled_img = tiled.to_image()
        for ty in range(3):
            for tx in range(3):
                tiled_img.paste(img, (tx * SIZE, ty * SIZE))
        tiled_img.save(PREVIEW_DIR / f"{name}_tiled_preview.png")
        print(f"{name}: {saved}  ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()

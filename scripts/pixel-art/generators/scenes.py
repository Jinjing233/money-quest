"""Generate the one-off hero/scene illustrations: the Welcome Screen
background and the three Game Result ending illustrations.

These are bespoke compositions (not a repeated small-icon family), so
they live in public/assets/pixel/scenes/ and aren't held to one fixed
size the way characters/items/environment/ui are -- validate.py still
checks they're valid transparent PNGs, just not a specific size.

Run from the project root:
    python scripts/pixel-art/generators/scenes.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from canvas import PixelCanvas  # noqa: E402
from palette import PALETTE as P  # noqa: E402

TOOLS_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = TOOLS_DIR.parents[1]
OUT_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "scenes"
PREVIEW_DIR = TOOLS_DIR / "previews"

OUTLINE = P["brown_dark"]


def triangle_roof(c: PixelCanvas, x0: int, x1: int, y0: int, height: int, color) -> None:
    """A simple symmetric pitched roof, narrowing to a point at the top."""
    for i in range(height):
        y = y0 + i
        inset = int((i / height) * ((x1 - x0) / 2))
        c.rect(x0 + inset, y, x1 - inset, y, color)


def house(c: PixelCanvas, x: int, base_y: int, width: int, wall_h: int, roof_h: int, wall, roof, lit: bool) -> None:
    c.rect(x, base_y - wall_h, x + width, base_y, wall)
    triangle_roof(c, x - 2, x + width + 2, base_y - wall_h - roof_h, roof_h, roof)
    door_w = max(3, width // 4)
    door_x = x + (width - door_w) // 2
    c.rect(door_x, base_y - door_w - 2, door_x + door_w, base_y, P["brown_dark"])
    win_color = P["gold"] if lit else P["brown_dark"]
    win_x = x + 2
    win_y = base_y - wall_h + 3
    c.rect(win_x, win_y, win_x + 3, win_y + 3, win_color)


def tree(c: PixelCanvas, cx: int, base_y: int, size: int = 1) -> None:
    r = 5 * size
    c.circle(cx, base_y - r - 2 * size, r, P["sage"])
    c.circle(cx - r // 2, base_y - r, r - 1, P["sage_dark"])
    c.rect(cx - size, base_y - 2 * size, cx + size, base_y, P["brown"])


def coin(c: PixelCanvas, cx: int, cy: int, r: int = 4) -> None:
    c.circle(cx, cy, r, P["gold_dark"])
    c.circle(cx, cy, r - 1, P["gold"])
    c.set(cx - 1, cy - 1, P["cream_light"])


def welcome_bg() -> PixelCanvas:
    c = PixelCanvas(160, 90)
    c.rect(0, 0, 159, 62, P["cream"])            # warm evening sky
    c.rect(0, 62, 159, 89, P["brown_light"])     # ground
    c.rect(0, 62, 159, 64, P["sage_dark"])       # thin grass line

    c.circle(140, 14, 7, P["gold"])              # sun
    coin(c, 20, 20, 4)
    coin(c, 46, 12, 3)

    tree(c, 12, 78, size=1)
    house(c, 22, 82, 26, 22, 12, P["brown_light"], P["brown"], lit=True)
    house(c, 58, 86, 34, 28, 16, P["cream_light"], P["brown_dark"], lit=True)
    house(c, 104, 84, 28, 24, 13, P["sage"], P["sage_dark"], lit=False)
    tree(c, 142, 82, size=1)

    c.auto_outline(OUTLINE, diagonal=False)
    return c


def ending_stable() -> PixelCanvas:
    c = PixelCanvas(128, 128)
    c.rect(0, 0, 127, 90, P["cream"])
    c.circle(100, 20, 14, P["gold"])
    c.rect(0, 90, 127, 127, P["sage"])
    c.rect(0, 90, 127, 94, P["sage_dark"])

    house(c, 36, 100, 56, 40, 16, P["cream_light"], P["brown"], lit=True)
    tree(c, 18, 112, size=2)
    coin(c, 90, 108, 6)
    coin(c, 100, 112, 5)
    coin(c, 95, 118, 5)

    c.auto_outline(OUTLINE)
    return c


def ending_scraping() -> PixelCanvas:
    c = PixelCanvas(128, 128)
    c.rect(0, 0, 127, 90, P["cream_light"])
    c.rect(0, 90, 127, 127, P["brown_light"])
    c.rect(0, 90, 127, 94, P["sage_dark"])

    house(c, 36, 100, 56, 40, 16, P["brown_light"], P["brown"], lit=True)
    tree(c, 18, 112, size=1)
    coin(c, 92, 114, 5)

    c.auto_outline(OUTLINE)
    return c


def ending_debt() -> PixelCanvas:
    c = PixelCanvas(128, 128)
    c.rect(0, 0, 127, 90, P["cream_light"])
    c.rect(0, 90, 127, 127, P["brown_light"])
    c.rect(0, 90, 127, 94, P["sage_dark"])

    # rain cloud, but the house still stands and a window is still lit --
    # a hard chapter, not a verdict on the person.
    c.circle(50, 20, 10, P["sage_dark"])
    c.circle(66, 20, 12, P["sage_dark"])
    c.circle(82, 22, 9, P["sage_dark"])
    c.rect(44, 20, 90, 28, P["sage_dark"])
    for rx in (48, 60, 74, 86):
        c.rect(rx, 32, rx + 1, 37, P["sky"])

    house(c, 36, 100, 56, 40, 16, P["brown_light"], P["brown_dark"], lit=True)
    # a couple of bills at the door, not a person struggling
    c.rect(20, 108, 30, 118, P["cream_light"])
    c.rect(22, 110, 28, 112, P["coral"])
    c.rect(14, 112, 24, 122, P["cream_light"])
    c.rect(16, 114, 22, 116, P["coral"])

    c.auto_outline(OUTLINE)
    return c


SCENES = {
    "welcome_bg": welcome_bg,
    "ending_stable": ending_stable,
    "ending_scraping": ending_scraping,
    "ending_debt": ending_debt,
}


def main() -> None:
    for name, builder in SCENES.items():
        canvas = builder()
        saved = canvas.save(OUT_DIR / f"{name}.png")
        canvas.save_preview(PREVIEW_DIR / f"{name}_preview.png", scale=4)
        print(f"{name}: {saved}  ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()

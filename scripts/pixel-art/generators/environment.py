"""Generate the apartment furniture/environment set used to replace
the placeholder inline-SVG room in ApartmentScene.tsx: bed, desk,
chair, lamp, window, potted plant, drawer cabinet, rug, wall art.

Each piece is a flat, icon-style furniture sprite (not a full-room
illustration) meant to be laid out together with CSS in the React
component -- same approach Stardew-style cozy games use for
placeable furniture art.

Run from the project root:
    python scripts/pixel-art/generators/environment.py
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from canvas import PixelCanvas  # noqa: E402
from palette import PALETTE as P  # noqa: E402

TOOLS_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = TOOLS_DIR.parents[1]
OUT_DIR = PROJECT_ROOT / "public" / "assets" / "pixel" / "environment"
PREVIEW_DIR = TOOLS_DIR / "previews"

OUTLINE = P["brown_dark"]


def ellipse(c: PixelCanvas, cx: float, cy: float, rx: float, ry: float, color) -> None:
    """Flat, non-antialiased filled ellipse -- used for the rug, where
    PixelCanvas.circle (radius-only) can't give the flattened shape."""
    x0, x1 = int(cx - rx - 1), int(cx + rx + 1)
    y0, y1 = int(cy - ry - 1), int(cy + ry + 1)
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            dx, dy = (x - cx + 0.5) / rx, (y - cy + 0.5) / ry
            if dx * dx + dy * dy <= 1:
                c.set(x, y, color)


def bed() -> PixelCanvas:
    c = PixelCanvas(64, 64)
    c.rect(4, 14, 60, 30, P["brown"])            # headboard
    c.rect(6, 30, 58, 40, P["cream_light"])      # mattress
    c.rect(10, 22, 28, 32, P["cream"])           # pillow
    c.rect(6, 40, 58, 58, P["sage"])             # blanket
    c.rect(40, 46, 58, 58, P["sage_dark"])       # blanket shadow (lower-right)
    c.rect(6, 58, 10, 62, OUTLINE)               # legs
    c.rect(54, 58, 58, 62, OUTLINE)
    c.auto_outline(OUTLINE)
    return c


def desk() -> PixelCanvas:
    c = PixelCanvas(64, 64)
    c.rect(4, 20, 60, 30, P["brown_light"])      # desktop surface
    c.rect(4, 30, 60, 50, P["brown"])            # front panel
    c.rect(26, 34, 38, 40, P["brown_dark"])      # drawer line
    c.rect(6, 50, 12, 60, OUTLINE)               # legs
    c.rect(52, 50, 58, 60, OUTLINE)
    c.auto_outline(OUTLINE)
    return c


def chair() -> PixelCanvas:
    c = PixelCanvas(32, 32)
    c.rect(8, 6, 24, 18, P["brown"])             # backrest
    c.rect(8, 18, 24, 24, P["brown_light"])      # seat
    c.rect(8, 24, 10, 30, OUTLINE)               # front legs
    c.rect(22, 24, 24, 30, OUTLINE)
    c.auto_outline(OUTLINE)
    return c


def lamp() -> PixelCanvas:
    c = PixelCanvas(32, 32)
    c.rect(10, 26, 22, 30, P["brown_dark"])      # base
    c.rect(14, 14, 18, 26, P["brown"])           # arm
    c.rect(8, 6, 24, 14, P["gold"])              # shade
    c.rect(18, 6, 24, 14, P["gold_dark"])        # shade shadow
    c.auto_outline(OUTLINE)
    return c


def window() -> PixelCanvas:
    c = PixelCanvas(32, 32)
    c.rect(2, 2, 30, 30, P["brown"])             # frame
    c.rect(6, 6, 26, 26, P["sky"])               # glass
    c.rect(8, 8, 14, 12, P["cream_light"])       # glint, upper-left
    c.rect(14, 6, 18, 26, P["brown"])            # vertical mullion
    c.rect(6, 14, 26, 18, P["brown"])            # horizontal mullion
    c.auto_outline(OUTLINE)
    return c


def plant() -> PixelCanvas:
    c = PixelCanvas(32, 32)
    c.circle(16, 15, 10, P["sage"])
    c.circle(10, 19, 6, P["sage_dark"])
    c.circle(22, 19, 6, P["sage_dark"])
    c.rect(10, 22, 22, 30, P["coral"])           # terracotta pot
    c.rect(16, 26, 22, 30, P["coral_dark"])      # pot shadow
    c.auto_outline(OUTLINE)
    return c


def cabinet() -> PixelCanvas:
    c = PixelCanvas(32, 64)
    c.rect(4, 8, 28, 58, P["brown_light"])       # body
    c.rect(4, 8, 28, 12, P["brown"])             # top edge
    c.rect(6, 16, 26, 28, P["brown"])            # drawer 1
    c.rect(6, 32, 26, 44, P["brown"])            # drawer 2
    c.rect(6, 48, 26, 56, P["brown"])            # drawer 3
    for y0 in (20, 36, 50):
        c.rect(14, y0, 18, y0 + 2, P["brown_dark"])  # handles
    c.rect(6, 58, 10, 62, OUTLINE)               # legs
    c.rect(22, 58, 26, 62, OUTLINE)
    c.auto_outline(OUTLINE)
    return c


def rug() -> PixelCanvas:
    c = PixelCanvas(64, 64)
    ellipse(c, 32, 40, 28, 16, P["sage_dark"])
    ellipse(c, 32, 40, 23, 12, P["cream_light"])
    c.auto_outline(OUTLINE)
    return c


def wall_art() -> PixelCanvas:
    c = PixelCanvas(32, 32)
    c.rect(4, 4, 28, 28, P["brown"])             # frame
    c.rect(7, 7, 25, 25, P["sky"])               # sky
    c.rect(7, 16, 25, 25, P["sage_dark"])        # hill
    c.circle(12, 11, 3, P["gold"])               # sun
    c.auto_outline(OUTLINE)
    return c


def laptop() -> PixelCanvas:
    c = PixelCanvas(32, 32)
    c.rect(4, 18, 28, 22, P["brown_light"])      # base/keyboard
    c.rect(6, 4, 26, 18, P["brown_dark"])        # screen bezel
    c.rect(8, 6, 24, 16, P["sky"])               # screen glow
    c.rect(9, 7, 17, 9, P["cream_light"])        # a little "document" on screen
    c.auto_outline(OUTLINE)
    return c


def book_stack() -> PixelCanvas:
    c = PixelCanvas(32, 32)
    c.rect(4, 22, 28, 27, P["coral"])
    c.rect(4, 22, 28, 23, P["coral_dark"])
    c.rect(6, 16, 26, 21, P["sage"])
    c.rect(6, 16, 26, 17, P["sage_dark"])
    c.rect(8, 10, 24, 15, P["sky"])
    c.rect(8, 10, 24, 11, P["sky_dark"])
    c.auto_outline(OUTLINE)
    return c


def calendar() -> PixelCanvas:
    c = PixelCanvas(32, 32)
    c.rect(4, 4, 28, 28, P["cream_light"])
    c.rect(4, 4, 28, 9, P["coral"])              # header band
    c.rect(8, 2, 10, 6, P["brown_dark"])          # hangers
    c.rect(22, 2, 24, 6, P["brown_dark"])
    for gy in range(12, 25, 5):
        for gx in range(7, 26, 6):
            c.rect(gx, gy, gx + 3, gy + 2, P["sage"])
    c.rect(13, 12, 16, 14, P["coral_dark"])       # one marked day
    c.auto_outline(OUTLINE)
    return c


def mug() -> PixelCanvas:
    c = PixelCanvas(32, 32)
    c.rect(11, 16, 21, 26, P["cream_light"])
    c.rect(11, 16, 21, 18, P["coral"])
    c.rect(21, 18, 25, 23, P["cream_light"])
    c.rect(22, 19, 24, 22, P["cream"])
    c.auto_outline(OUTLINE)
    return c


PIECES = {
    "bed": bed,
    "desk": desk,
    "chair": chair,
    "lamp": lamp,
    "window": window,
    "plant": plant,
    "cabinet": cabinet,
    "rug": rug,
    "wall_art": wall_art,
    "laptop": laptop,
    "book_stack": book_stack,
    "calendar": calendar,
    "mug": mug,
}


def main() -> None:
    for name, builder in PIECES.items():
        canvas = builder()
        saved = canvas.save(OUT_DIR / f"{name}.png")
        canvas.save_preview(PREVIEW_DIR / f"{name}_preview.png")
        print(f"{name}: {saved}  ({canvas.width}x{canvas.height})")


if __name__ == "__main__":
    main()
